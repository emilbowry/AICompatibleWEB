# %%
import os
import json

QUESTIONS_FILE = "./data/questions_filter_after.json"
POLICIES_FILE = "./data/policies_testing.json"
OUTPUT_Q_FILE = "./output_q.json"
OUTPUT_P_FILE = "./output_p.json"


def _loadJson(filepath):
	if not os.path.exists(filepath):
		print(f"Warning: File not found: {filepath}")
		return {}
	try:
		with open(filepath, "r", encoding="utf-8") as f:
			return json.load(f)
	except json.JSONDecodeError:
		print(f"Error decoding JSON: {filepath}")
		return {}


qdata = _loadJson(QUESTIONS_FILE)

# %%
import numpy as np


# %%
import concurrent.futures

# %%
import numpy as np
from scipy.spatial.distance import cdist
from sklearn.covariance import LedoitWolf
import concurrent.futures


# abstracted
def getMahalanobisDistances(vectors_a, vectors_b):
	# Mahalanobis helper kept in snake_case internally
	norms = np.linalg.norm(vectors_a, axis=1, keepdims=True)
	cleaned_vectors = vectors_a / (norms + 1e-10)

	lw = LedoitWolf()
	lw.fit(cleaned_vectors)	# assumption vectors_a=vectors_b
	precision_matrix = lw.precision_

	dist_matrix = cdist(
		cleaned_vectors, cleaned_vectors, metric="mahalanobis", VI=precision_matrix
	)
	return dist_matrix, precision_matrix


Distance_Processors = {
	"cosine": lambda emb_a, emb_b: 1.0
	- (emb_a @ emb_b.T)
	/ (
		np.linalg.norm(emb_a, axis=1, keepdims=True)
		@ np.linalg.norm(emb_b, axis=1, keepdims=True).T
		+ 1e-10
	),
	"l1": lambda emb_a, emb_b: np.sum(np.abs(emb_a[..., np.newaxis] - emb_b.T), axis=1),
	"l2": lambda emb_a, emb_b: np.linalg.norm(emb_a[..., np.newaxis] - emb_b.T, axis=1),
	"dot": lambda emb_a, emb_b: emb_a @ emb_b.T,
	"mahalanobis": lambda emb_a, emb_b: getMahalanobisDistances(emb_a, emb_b),
}


def _prepareModelArtifact(
	raw_vectors,
	semantic_data,
	truncation_dim=256,
	distance_metric="mahalanobis",
	debug=True,
):
	# 1. Truncation
	data_matrix = np.array(raw_vectors)
	input_dim = data_matrix.shape[1]

	if input_dim < truncation_dim and debug:
		print(
			f"Warning: Vector dimension ({input_dim}) is smaller than truncation limit ({truncation_dim}). Proceeding without truncation."
		)

	data_truncated = data_matrix[:, :truncation_dim]

	# 2. Distance Calculation
	dist_output = Distance_Processors[distance_metric](data_truncated, data_truncated)

	precision_matrix = None
	if distance_metric == "mahalanobis":
		dist_matrix, precision_matrix = dist_output
	else:
		dist_matrix = dist_output

	# 3. NN Indices (In-place modification to avoid copy overhead)
	np.fill_diagonal(dist_matrix, float("inf"))
	nn_indices = np.argmin(dist_matrix, axis=1)
	np.fill_diagonal(dist_matrix, 0.0)

	return {
		"dist_matrix": dist_matrix,
		"vectors": data_truncated,
		"precision": precision_matrix,
		"semantic_data": semantic_data,
		"metric": distance_metric,
		"nn_indices": nn_indices,
	}


def prepareModelArtifacts(
	data_set, vector_keys, truncation_dim=256, distance_metric="mahalanobis", debug=True
):
	semantic_data = list(data_set.keys())
	model_artifacts = {}
	raw_vectors = {}
	for key in vector_keys:
		raw_vectors[key] = [data_set[s][key] for s in semantic_data]
	executor = concurrent.futures.ThreadPoolExecutor(max_workers=len(vector_keys))

	futures = dict()
	for key in vector_keys:
		if debug:
			print(f"Processing {key}...")

		futures[key] = executor.submit(
			_prepareModelArtifact,
			raw_vectors[key],
			semantic_data,
			truncation_dim,
			distance_metric,
			debug,
		)
	executor.shutdown(wait=True)
	for key in vector_keys:
		model_artifacts[key] = futures[key].result()
	return model_artifacts


# %%
def calculateGroupDiameter(dist_matrix, indices):
	"""
	Calculates the diameter of a cluster based on the maximum pairwise distance
	between its members. This corresponds to 'complete' linkage logic.
	"""
	if len(indices) < 2:
		return 0.0

	sub_matrix = dist_matrix[np.ix_(indices, indices)]

	return np.max(sub_matrix)


def printClusterGroups(groups, model_artifact, title, sort_order="ascending"):
	print(f"\n{'='*80}")
	print(f"GROUPINGS: {title}")
	print(f"{'='*80}")

	if not groups:
		print("No groupings found.")
		return

	semantic_data = model_artifact["semantic_data"]
	dist_matrix = model_artifact["dist_matrix"]

	processed_groups = []

	for indices in groups:
		diameter = calculateGroupDiameter(dist_matrix, indices)

		members = [semantic_data[i] for i in indices]

		processed_groups.append(
			{"diameter": diameter, "members": members, "size": len(indices)}
		)

	processed_groups.sort(
		key=lambda x: x["diameter"], reverse=(sort_order == "descending")
	)

	print(f"Found {len(processed_groups)} significant groups.\n")

	for i, g in enumerate(processed_groups):
		print(f"GROUP {i+1} (Size: {g['size']}) [Diameter: {g['diameter']:.4f}]")
		for s in g["members"]:
			print(f" - {s}")
		print("-" * 80)


# %%
import numpy as np
from itertools import product
from sklearn.cluster import AgglomerativeClustering

# --- Clustering Utilities ---


def getGroupsFromLabels(labels):
	groups = {}
	for idx, label in enumerate(labels):
		groups.setdefault(label, []).append(idx)
	return [g for g in groups.values() if len(g) > 1]


def getNNPairsFromGroups(groups, nn_indices):
	pairs = set()
	for group in groups:
		if len(group) < 2:
			continue

		group_set = set(group)
		for idx in group:
			nn_idx = nn_indices[idx]
			if nn_idx in group_set:
				pairs.add(tuple(sorted((idx, nn_idx))))
	return pairs


def clusterAndGetArtifacts(dist_matrix, threshold):
	model = AgglomerativeClustering(
		n_clusters=None,
		distance_threshold=threshold,
		metric="precomputed",
		linkage="complete",
	)
	labels = model.fit_predict(dist_matrix)
	return getGroupsFromLabels(labels), labels


def calculateNTrue(labels_array, target_pairs):
	if not target_pairs or labels_array is None:
		return 0

	involved_indices = {idx for pair in target_pairs for idx in pair}

	if not involved_indices:
		return 0

	return len({labels_array[idx] for idx in involved_indices})


# --- Cache & Optimization ---


def createClusteringCache(
	model_artifacts, tau_range, optimization_mode="Jaccard", debug=True
):
	cache = {name: {} for name in model_artifacts.keys()}
	last_states = {name: {"groups": [], "pairs": set()} for name in model_artifacts.keys()}

	if debug:
		print(
			f"Building Clustering Cache ({len(tau_range)} steps) [Mode: {optimization_mode}]..."
		)

	for t in tau_range:
		for name, artifact in model_artifacts.items():

			groups, labels = clusterAndGetArtifacts(artifact["dist_matrix"], t)
			nn_pairs = getNNPairsFromGroups(groups, artifact["nn_indices"])

			prev_state = last_states[name]

			groups_changed = (len(groups) != len(prev_state["groups"])) or (
				groups != prev_state["groups"]
			)
			pairs_changed = (len(nn_pairs) != len(prev_state["pairs"])) or (
				nn_pairs != prev_state["pairs"]
			)

			# Jaccard only cares if pairs change. ACGC cares if groups OR pairs change.
			significant_change = pairs_changed
			if optimization_mode == "ACGC":
				significant_change = significant_change or groups_changed

			if significant_change:
				cache[name][t] = [groups, labels, nn_pairs]
				last_states[name]["groups"] = groups
				last_states[name]["pairs"] = nn_pairs

	if debug:
		for name, data in cache.items():
			print(f" - {name}: Pruned {len(tau_range)} -> {len(data)} significant states.")

	return cache


def findConsensusStructure(clustering_cache, model_keys, metric="Jaccard"):
	threshold_axes = [list(clustering_cache[m].keys()) for m in model_keys]

	best_score = -1
	best_state = {
		"score": -1,
		"P_true": set(),
		"optimal_taus": {},
		"N_target": 0,
		"AVG_groups": 0,	# New field
	}

	for thresholds in product(*threshold_axes):

		current_config = dict(zip(model_keys, thresholds))

		pair_sets = []
		# Calculate average total groups found in this config
		total_groups_found = 0

		for m, t in current_config.items():
			pair_sets.append(clustering_cache[m][t][2])
			total_groups_found += len(clustering_cache[m][t][0])	# Index 0 is 'groups'

		current_avg_groups = total_groups_found / len(model_keys)

		p_true = set.intersection(*pair_sets)

		if not p_true:
			continue

		current_score = 0

		if metric == "Jaccard":
			p_union = set.union(*pair_sets)
			if len(p_union) > 0:
				current_score = len(p_true) / len(p_union)

		elif metric == "ACGC":
			n_true_sum = 0
			for m, t in current_config.items():
				labels = clustering_cache[m][t][1]
				n_true_sum += calculateNTrue(labels, p_true)
			current_score = n_true_sum / len(model_keys)

		if current_score > best_score:
			best_score = current_score

			best_state["score"] = best_score
			best_state["P_true"] = p_true
			best_state["optimal_taus"] = current_config
			best_state["AVG_groups"] = current_avg_groups

			if metric == "ACGC":
				best_state["N_target"] = best_score
			else:
				# For Jaccard, calculate N_target post-hoc for reference
				n_sum_ref = 0
				for m, t in current_config.items():
					labels = clustering_cache[m][t][1]
					n_sum_ref += calculateNTrue(labels, p_true)
				best_state["N_target"] = n_sum_ref / len(model_keys)

	return best_state


# %%
# Keys corresponding to data dictionary
model_keys = ["embedding_vector", "retrieval_embedding_vector"]
metric = "Jaccard"
artifacts = prepareModelArtifacts(qdata, model_keys)

max_dist = max(np.max(a["dist_matrix"]) for a in artifacts.values())
tau_range = np.arange(0.1, max_dist, 0.02)

cache = createClusteringCache(artifacts, tau_range, optimization_mode="ACGC")

# %%
consensus_JAC = findConsensusStructure(cache, model_keys, metric="Jaccard")


print(f"\n--- Optimization Results (Jaccard) ---")
print(f"Best Score: {consensus_JAC['score']:.5f}")
print(f"Platinum Pairs Identified: {len(consensus_JAC['P_true'])}")
print(f"Target Group Count (Inferred): {consensus_JAC['N_target']:.1f}")

# 5. Visualize Results
optimal_taus = consensus_JAC["optimal_taus"]

for key in model_keys:
	best_t = optimal_taus[key]

	# Retrieve cached state: [groups, labels, pairs]
	best_groups = cache[key][best_t][0]

	printClusterGroups(
		best_groups, artifacts[key], f"{key} (Optimal t={best_t:.2f})", sort_order="ascending"
	)

# %%
consensus_ACGC = findConsensusStructure(cache, model_keys, metric="ACGC")

print(f"\n--- Optimization Results (ACGC) ---")
print(f"Best Score: {consensus_ACGC['score']:.5f}")
print(f"Platinum Pairs Identified: {len(consensus_ACGC['P_true'])}")
print(f"Target Group Count (Inferred): {consensus_ACGC['N_target']:.1f}")

# 5. Visualize Results
optimal_taus = consensus_ACGC["optimal_taus"]

for key in model_keys:
	best_t = optimal_taus[key]

	# Retrieve cached state: [groups, labels, pairs]
	best_groups = cache[key][best_t][0]

	printClusterGroups(
		best_groups, artifacts[key], f"{key} (Optimal t={best_t:.2f})", sort_order="ascending"
	)


# %%
target_jac = consensus_JAC["N_target"]
target_acgc = consensus_ACGC["N_target"]
average_jac = consensus_JAC["AVG_groups"]
average_acgc = consensus_ACGC["AVG_groups"]

p_duplicates = target_jac / (target_acgc)


# %%
import numpy as np
from sklearn.cluster import AgglomerativeClustering


def getNearestNeighborDistances(dist_matrix):
	d = dist_matrix.copy()
	np.fill_diagonal(d, float("inf"))
	min_dists = np.min(d, axis=1)
	return min_dists


def convertDistToProb(dist_matrix, reference_dist_array):
	sorted_refs = np.sort(reference_dist_array)
	n = len(sorted_refs)
	ranks = np.searchsorted(sorted_refs, dist_matrix)
	probs = (ranks + 1) / (n + 1)
	return probs


def getMaxPairwiseScore(matrix, indices):
	if len(indices) < 2:
		return 0.0
	sub = matrix[np.ix_(indices, indices)]
	return np.max(sub)


print("--- Calculating Empirical Probabilities (N-Model Logic) ---")

prob_matrices = []

for key in model_keys:
	dist_mat = artifacts[key]["dist_matrix"]

	nn_dists = getNearestNeighborDistances(dist_mat)

	prob_mat = convertDistToProb(dist_mat, nn_dists)
	prob_matrices.append(prob_mat)

	print(f"[{key}] Processed. (Example: Dist={nn_dists[0]:.4f} -> P={prob_mat[0,1]:.5f})")

Prob_Fused = np.minimum.reduce(prob_matrices)

PROB_THRESHOLD = p_duplicates	# ratio used here

print(f"\n{'='*80}")
print(f"STAGE 2 OUTPUT: Probabilistic Outlier Model (P < {PROB_THRESHOLD:.6f})")
print(f"{'='*80}")

cluster_model = AgglomerativeClustering(
	n_clusters=None,
	distance_threshold=PROB_THRESHOLD,
	metric="precomputed",
	linkage="complete",
)

labels = cluster_model.fit_predict(Prob_Fused)

groups = {}
for idx, label in enumerate(labels):
	groups.setdefault(label, []).append(idx)

raw_groups = [g for g in groups.values() if len(g) > 1]

# --- Sorting Logic ---
sorted_groups = []
for indices in raw_groups:
	# Calculate score first to allow sorting
	score = getMaxPairwiseScore(Prob_Fused, indices)
	sorted_groups.append({"indices": indices, "score": score})

# Sort Ascending: Lower score = Lower Rank = Tighter Probability
sorted_groups.sort(key=lambda x: x["score"])

print(f"Found {len(sorted_groups)} significant groups.\n")

semantic_data = artifacts[model_keys[0]]["semantic_data"]

for i, g in enumerate(sorted_groups):
	indices = g["indices"]
	likelihood_diameter = g["score"]

	print(
		f"GROUP {i+1} (Size: {len(indices)}) [Likelihood Diameter: {likelihood_diameter:.6f}]"
	)

	cluster_strs = [semantic_data[idx] for idx in indices]
	for s in cluster_strs:
		print(f" - {s}")
	print("-" * 80)
