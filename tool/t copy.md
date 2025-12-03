Sort of, I mean what ive done is this:
First i intercept tau's here:
```

# Run grid search
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

```
Using my old script that we originally looked at since i didn't want to break anything here, i just iterated until our true groups were no longer valid as estimates for the size of the groups:
```

import pandas as pd
from scipy.spatial.distance import cdist
from sklearn.cluster import AgglomerativeClustering


DISTANCE_THRESHOLD = 9.223086354550212	# 14.873086	# 8.823086354550213

print(f"Computing pairwise Mahalanobis distances for {len(cleaned_vectors)} vectors...")
print(f"Using Threshold: {DISTANCE_THRESHOLD}")

dist_matrix = cdist(
	cleaned_vectors, cleaned_vectors, metric="mahalanobis", VI=precision_matrix
)
cluster_model = AgglomerativeClustering(
	n_clusters=None,
	distance_threshold=DISTANCE_THRESHOLD,
	metric="precomputed",
	linkage="complete",
)

labels = cluster_model.fit_predict(dist_matrix)


df = pd.DataFrame(
	{"string": strings, "label": labels, "vector_index": range(len(strings))}
)

all_clusters = [group for _, group in df.groupby("label")]

significant_clusters = [g for g in all_clusters if len(g) > 1]

significant_clusters.sort(key=lambda x: len(x), reverse=True)

total_groups = len(all_clusters)
trivial_count = total_groups - len(significant_clusters)

baseline_indices = {
	tuple(g["vector_index"].sort_values().tolist()) for g in significant_clusters
}

if not baseline_indices:
	print(
		"Baseline run resulted in no significant clusters (all size 1 or 0). Skipping stability check."
	)
else:
	print(
		f"\nStarting stability check against {len(baseline_indices)} baseline significant clusters."
	)

	STEP_SIZE = 0.05	# Define a reasonable step size
	MAX_ITERATIONS = 500

	t = DISTANCE_THRESHOLD
	final_stable_threshold = DISTANCE_THRESHOLD

	for i in range(MAX_ITERATIONS):
		t += STEP_SIZE

		cluster_model_t = AgglomerativeClustering(
			n_clusters=None,
			distance_threshold=t,
			metric="precomputed",
			linkage="complete",
		)

		labels_t = cluster_model_t.fit_predict(dist_matrix)

		df_t = pd.DataFrame(
			{"string": strings, "label": labels_t, "vector_index": range(len(strings))}
		)

		all_clusters_t = [group for _, group in df_t.groupby("label")]
		significant_clusters_t = [g for g in all_clusters_t if len(g) > 1]

		current_indices = {
			tuple(g["vector_index"].sort_values().tolist()) for g in significant_clusters_t
		}

		if not baseline_indices.issubset(current_indices):

			print("\n--- STABILITY BROKEN ---")
			print(f"First merge/change detected at proposed threshold t={t:.6f}")
			print(f"Maximum stable threshold found: {final_stable_threshold:.6f}")
			break

		else:
			final_stable_threshold = t
			if i % 20 == 0:
				print(
					f"Iteration {i}: Threshold {t:.6f} stable. Significant clusters found: {len(significant_clusters_t)}"
				)

	else:
		print(
			f"\nReached Max Iterations ({MAX_ITERATIONS}). Final stable threshold: {final_stable_threshold:.6f}"
		)
```
it gives me 99 and 105 groups respectively, then i just did 5/((99+105)/2) which gives:
```
0.049019607843137254
```
as our `PROB_THRESHOLD = 0.049019607843137254`

Which without manipulation gives a really good deduplication threshold:
```

================================================================================
STAGE 2 OUTPUT: Probabilistic Outlier Model (P < 0.049020)
================================================================================
Found 15 significant groups.

GROUP 1 (Size: 2) [Radius: 4.8633]
 [CENTROID]  Does the privacy policy affirm that the company does not knowingly disclose information from children under the age of 18?
             Does the privacy policy affirm that the company does not knowingly share information from children under the age of 18?
--------------------------------------------------------------------------------
GROUP 2 (Size: 2) [Radius: 4.8566]
 [CENTROID]  Does the privacy policy affirm that Inputs and Outputs disassociated via Feedback are used for training models?
             Does the privacy policy affirm that Inputs and Outputs disassociated via Feedback are used for improving models?
--------------------------------------------------------------------------------
GROUP 3 (Size: 2) [Radius: 4.7381]
 [CENTROID]  Does the privacy policy affirm that the company collects the user's time zone?
             Does the privacy policy affirm that the company collects time zone settings?
--------------------------------------------------------------------------------
GROUP 4 (Size: 2) [Radius: 4.6968]
 [CENTROID]  Does the privacy policy affirm that Personal Data is retained to comply with legal obligations?
             Does the privacy policy affirm that Personal Data is used to comply with legal obligations?
--------------------------------------------------------------------------------
GROUP 5 (Size: 2) [Radius: 4.7142]
             Does the privacy policy affirm that processing contact information to send technical announcements is based on the necessity to perform a contract?
 [CENTROID]  Does the privacy policy affirm that the company processes contact information to send technical announcements based on the necessity to perform a contract?
--------------------------------------------------------------------------------
GROUP 6 (Size: 2) [Radius: 5.2123]
 [CENTROID]  Does the privacy policy affirm that Personal Data is used to improve the company's services?
             Does the privacy policy affirm that Personal Data is used to develop the company's services?
--------------------------------------------------------------------------------
GROUP 7 (Size: 2) [Radius: 4.8486]
 [CENTROID]  Does the privacy policy affirm that users have the statutory right to access their Personal Data?
             Does the privacy policy affirm that users have the statutory right to access information relating to how their Personal Data is processed?
--------------------------------------------------------------------------------
GROUP 8 (Size: 2) [Radius: 4.3913]
 [CENTROID]  Does the privacy policy affirm that providing personal data constitutes agreement to the transfer of data outside of Canada?
             Does the privacy policy affirm that providing personal data constitutes agreement to the disclosure of data outside of Canada?
--------------------------------------------------------------------------------
GROUP 9 (Size: 2) [Radius: 4.5656]
 [CENTROID]  Does the privacy policy affirm that Personal Data is used to protect the rights, privacy, safety, or property of users?
             Does the privacy policy affirm that Personal Data is used to protect the rights, privacy, safety, or property of the company?
--------------------------------------------------------------------------------
GROUP 10 (Size: 2) [Radius: 4.6063]
 [CENTROID]  Does the privacy policy affirm that the company may disclose personal data to governmental regulatory authorities as required by law?
             Does the privacy policy affirm that the company may disclose personal data in response to requests from governmental regulatory authorities?
--------------------------------------------------------------------------------
GROUP 11 (Size: 2) [Radius: 4.3318]
 [CENTROID]  Does the privacy policy affirm that the company relies on Standard Contractual Clauses (SCCs) for transfers to countries without an adequacy decision?
             Does the privacy policy affirm that the company relies on Standard Contractual Clauses (SCCs) for transfers to jurisdictions without adequacy decisions?
--------------------------------------------------------------------------------
GROUP 12 (Size: 2) [Radius: 5.1673]
 [CENTROID]  Does the privacy policy affirm that personal data may be shared with service providers for data processing purposes?
             Does the privacy policy affirm that personal data may be shared with service providers for the purpose of providing services to the user?
--------------------------------------------------------------------------------
GROUP 13 (Size: 2) [Radius: 4.2495]
 [CENTROID]  Does the privacy policy affirm that the company relies on user consent to process contact information for specific marketing communications?
             Does the privacy policy affirm that the company processes contact information for marketing communications based on user consent?
--------------------------------------------------------------------------------
GROUP 14 (Size: 2) [Radius: 2.8865]
 [CENTROID]  Does the privacy policy affirm that users have the right to request the correction of inaccurate personal data?
             Does the privacy policy affirm that users have the right to request the correction of inaccurate data?
--------------------------------------------------------------------------------
GROUP 15 (Size: 2) [Radius: 4.0055]
 [CENTROID]  Does the privacy policy affirm that the company collects the dates and times of access?
             Does the privacy policy affirm that the company collects the dates and times of access to the services?
--------------------------------------------------------------------------------
```