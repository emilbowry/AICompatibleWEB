import os
import json

import numpy as np
import pandas as pd
from sklearn.covariance import LedoitWolf
from scipy.spatial.distance import cdist, mahalanobis
from sklearn.cluster import AgglomerativeClustering
from itertools import combinations
from collections import defaultdict

import numpy as np
import pandas as pd
from scipy.spatial.distance import squareform
from scipy.stats import rankdata
from sklearn.cluster import AgglomerativeClustering

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


def get_pairs_from_labels(labels):
	"""Converts cluster labels into a Set of unique pairs (indices)."""
	df = pd.DataFrame({"label": labels, "id": range(len(labels))})
	pairs = set()
	for label, group in df.groupby("label"):
		indices = group["id"].tolist()
		if len(indices) > 1:
			for p in combinations(sorted(indices), 2):
				pairs.add(p)
	return pairs


def get_clustering_pairs_and_labels(dist_matrix, threshold):
	"""Runs clustering and returns both the pair set and the labels array."""
	model = AgglomerativeClustering(
		n_clusters=None,
		distance_threshold=threshold,
		metric="precomputed",
		linkage="complete",
	)
	labels = model.fit_predict(dist_matrix)
	return get_pairs_from_labels(labels), labels


def calculate_n_true(labels_array, target_pairs):
	"""Calculates the number of unique clusters containing the elements of target_pairs."""
	if not target_pairs or labels_array is None:
		return 0

	involved_indices = set(idx for pair in target_pairs for idx in pair)

	labels_of_interest = set(
		labels_array[idx] for idx in involved_indices if idx < len(labels_array)
	)

	if not involved_indices:
		return 0

	return len(labels_of_interest)


print("\n--- Phase 1: Grid Search for Consensus (Tau) ---")


dist_A_off = Model_A["dist_matrix"][np.triu_indices_from(Model_A["dist_matrix"], k=1)]
dist_B_off = Model_B["dist_matrix"][np.triu_indices_from(Model_B["dist_matrix"], k=1)]
all_dists = np.concatenate([dist_A_off, dist_B_off])


D_min_min = np.min(all_dists)
D_max_max = np.max(all_dists)


SEARCH_STEP = 0.05


TAU_SEARCH_START = max(D_min_min, 0.0)
TAU_SEARCH_END = D_max_max

tau_range = np.arange(TAU_SEARCH_START, TAU_SEARCH_END, SEARCH_STEP)
t_range = np.arange(TAU_SEARCH_START, TAU_SEARCH_END, SEARCH_STEP)

print(
	f"Search Range Defined: [{TAU_SEARCH_START:.2f} to {TAU_SEARCH_END:.2f}] (Step: {SEARCH_STEP})"
)
best_jaccard = -1
P_true = set()
labels_A_star = None
labels_B_star = None


cache_A = {}
cache_B = {}

print(f"Pre-computing clusters for {len(tau_range)} thresholds...")
for t in tau_range:
	cache_A[t] = get_clustering_pairs_and_labels(Model_A["dist_matrix"], t)
	cache_B[t] = get_clustering_pairs_and_labels(Model_B["dist_matrix"], t)
TAU_A = 0
TAU_B = 0


for t_A in tau_range:
	pairs_A, labels_A = cache_A[t_A]
	for t_B in tau_range:
		pairs_B, labels_B = cache_B[t_B]

		intersection = pairs_A.intersection(pairs_B)
		union = pairs_A.union(pairs_B)

		if len(union) > 0:
			jaccard = len(intersection) / len(union)
			if jaccard > best_jaccard:

				best_jaccard = jaccard
				P_true = intersection
				labels_A_star = labels_A
				labels_B_star = labels_B
				TAU_A = t_A
				TAU_B = t_B

print(f"tau a:{TAU_A}, tau b:{TAU_B}")


N_A_true = calculate_n_true(labels_A_star, P_true)
N_B_true = calculate_n_true(labels_B_star, P_true)
N_target = (N_A_true + N_B_true) / 2

print(f"\nConsensus Structure Found:")
print(f"Platinum Pairs Identified: {len(P_true)}")
print(f"N_target: {N_target:.1f} (Avg of A={N_A_true}, B={N_B_true})")


print("\n--- Phase 2: Tuning Thresholds to Target N_target ---")


def tune_threshold_by_group_count(model_data, N_target, model_name):
	best_t = 0
	min_error = float("inf")
	best_f1 = -1

	for t in t_range:
		current_pairs, current_labels = get_clustering_pairs_and_labels(
			model_data["dist_matrix"], t
		)

		N_predicted = calculate_n_true(current_labels, P_true)
		group_error = abs(N_predicted - N_target)

		tp = len(current_pairs.intersection(P_true))
		fp = len(current_pairs - P_true)
		fn = len(P_true - current_pairs)

		if tp > 0:
			precision = tp / (tp + fp)
			recall = tp / (tp + fn)
			f1 = 2 * (precision * recall) / (precision + recall)
		else:
			f1 = 0

		if group_error < min_error:
			min_error = group_error
			best_f1 = f1
			best_t = t
		elif group_error == min_error and f1 > best_f1:
			best_f1 = f1
			best_t = t

	print(
		f"[{model_name}] Optimal t: {best_t:.1f} | Group Error: {min_error:.1f} | F1: {best_f1:.4f}"
	)
	return best_t


optimal_t_A = tune_threshold_by_group_count(Model_A, N_target, "Model A")
optimal_t_B = tune_threshold_by_group_count(Model_B, N_target, "Model B")

print(f"\nFinal Calibrated Thresholds:")
print(f"Model A (Statement): {optimal_t_A:.2f}")
print(f"Model B (Question):  {optimal_t_B:.2f}")


def print_final_clusters(model_data, threshold, string_list, title):
	print(f"\n{'='*80}")
	print(f"FINAL OUTPUT: {title} (Threshold: {threshold:.2f})")
	print(f"{'='*80}")

	cluster_model = AgglomerativeClustering(
		n_clusters=None,
		distance_threshold=threshold,
		metric="precomputed",
		linkage="complete",
	)
	labels = cluster_model.fit_predict(model_data["dist_matrix"])

	df = pd.DataFrame(
		{"string": string_list, "label": labels, "idx": range(len(string_list))}
	)
	groups = [g for _, g in df.groupby("label") if len(g) > 1]
	groups.sort(key=lambda x: len(x), reverse=True)

	final_pairs, _ = get_clustering_pairs_and_labels(model_data["dist_matrix"], threshold)
	tp = len(final_pairs.intersection(P_true))
	fp = len(final_pairs - P_true)

	print(f"Found {len(groups)} total significant groups.")
	print(f"P_true pairs captured: {tp} (False Positives: {fp})\n")

	for i, group in enumerate(groups):
		indices = group["idx"].tolist()
		cluster_strs = group["string"].tolist()

		vecs = model_data["vectors"][indices]
		prec = model_data["precision"]
		local_mean = np.mean(vecs, axis=0)

		distances = []
		min_dist = float("inf")
		rep_idx = -1

		for local_i, global_i in enumerate(indices):
			d = mahalanobis(model_data["vectors"][global_i], local_mean, prec)
			distances.append(d)
			if d < min_dist:
				min_dist = d
				rep_idx = local_i

		group_radius = max(distances)

		print(f"GROUP {i+1} (Size: {len(indices)}) [Radius: {group_radius:.4f}]")

		for idx, s in enumerate(cluster_strs):
			prefix = " [CENTROID] " if idx == rep_idx else "            "
			print(f"{prefix} {s}")
		print("-" * 80)


print_final_clusters(Model_A, optimal_t_A, strings, "Model A (Statement Embeddings)")
print_final_clusters(Model_B, optimal_t_B, strings, "Model B (Question Embeddings)")


def get_nearest_neighbor_distances(dist_matrix):
	"""
	Extracts the distance to the nearest neighbor for every point.
	Ignores the diagonal (0).
	"""
	np.fill_diagonal(dist_matrix, float("inf"))
	min_dists = np.min(dist_matrix, axis=1)
	np.fill_diagonal(dist_matrix, 0.0)
	return min_dists


def convert_dist_to_prob(dist_matrix, reference_dist_array):
	"""
	Converts raw distances into Probabilities (P-values) based on the
	Empirical CDF of the provided reference distribution (Nearest Neighbors).

	P(d) = (Rank of d) / (Total Count + 1)
	"""

	sorted_refs = np.sort(reference_dist_array)
	n = len(sorted_refs)

	ranks = np.searchsorted(sorted_refs, dist_matrix)

	probs = (ranks + 1) / (n + 1)

	return probs


print("--- Calculating Empirical Probabilities (EVT Logic) ---")


nn_dists_A = get_nearest_neighbor_distances(Model_A["dist_matrix"])
nn_dists_B = get_nearest_neighbor_distances(Model_B["dist_matrix"])


Prob_A = convert_dist_to_prob(Model_A["dist_matrix"], nn_dists_A)
Prob_B = convert_dist_to_prob(Model_B["dist_matrix"], nn_dists_B)

print(f"Probabilities Calculated.")
print(
	f"Example (Model A): Dist=8.8 -> P={np.interp(8.8, np.sort(nn_dists_A), np.linspace(0,1,len(nn_dists_A))):.5f}"
)
print(
	f"Example (Model B): Dist=8.8 -> P={np.interp(8.8, np.sort(nn_dists_B), np.linspace(0,1,len(nn_dists_B))):.5f}"
)


print("\n--- Fusing Probabilities (Min Rule) ---")


Prob_Fused = np.minimum(Prob_A, Prob_B)


print("\n--- Inferring Threshold from Platinum Pairs ---")

platinum_probs = []
for idx1, idx2 in P_true:
	p_val = Prob_Fused[idx1, idx2]
	platinum_probs.append(p_val)

PROB_THRESHOLD = 0.049019607843137254

print(f"Inferred Probability Threshold: {PROB_THRESHOLD:.6f}")


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


df = pd.DataFrame({"string": strings, "label": labels, "idx": range(len(strings))})
groups = [g for _, g in df.groupby("label") if len(g) > 1]
groups.sort(key=lambda x: len(x), reverse=True)

print(f"Found {len(groups)} significant groups.\n")

for i, group in enumerate(groups):
	indices = group["idx"].tolist()
	cluster_strs = group["string"].tolist()

	ref_vectors = Model_B["vectors"][indices]
	ref_prec = Model_B["precision"]
	local_mean = np.mean(ref_vectors, axis=0)

	dists = []
	min_d = float("inf")
	rep_i = -1

	for loc_i, glob_i in enumerate(indices):
		d = mahalanobis(Model_B["vectors"][glob_i], local_mean, ref_prec)
		dists.append(d)
		if d < min_d:
			min_d = d
			rep_i = loc_i

	print(f"GROUP {i+1} (Size: {len(indices)}) [Radius: {max(dists):.4f}]")

	for idx, s in enumerate(cluster_strs):
		prefix = " [CENTROID] " if idx == rep_i else "            "
		print(f"{prefix} {s}")
	print("-" * 80)
