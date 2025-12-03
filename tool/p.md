## Formal Summary of the Multi-View Consensus Clustering Methodology

The goal is to robustly identify sets of semantically equivalent strings (duplicates) within a specialized domain, overcoming the inherent instability of single-view similarity metrics in highly correlated embedding spaces.

### I. Foundational Assumptions & Principles

1.  **Non-Isotropic Space (The Mahalanobis Necessity):** Standard Euclidean or Cosine distance assumes that variance is uniform in all directions (isotropy). We reject this; in specialized language (like privacy policies), small variations in specific dimensions are semantically critical, while large variations in other dimensions are irrelevant noise. Therefore, **Mahalanobis Distance (MD)** is adopted, which accounts for the covariance of the embedding features, defining similarity relative to the local data distribution's "shape."
2.  **The Existence of $E_{true}$ (Platonic Ground Truth):** We assume a *true* underlying grouping of semantic duplicates exists, where members of a group produce the same logical output (answer) to external queries.
3.  **The Principle of Invariance (Consensus Implies Truth):** Because our various embedding models ($E_A, E_B, \dots$) are trained under different task objectives and utilize different input representations (e.g., question vs. declarative statement), they capture semantic reality from distinct perspectives. **If two or more independent views agree on a structural relationship (a duplicate pair), that relationship is assigned high confidence and is considered a proxy for the $E_{true}$ structure.**

### II. The three-Phase Inferential Process

We structure the problem as an unsupervised-to-supervised learning task, where the ensemble first generates its own ground truth before individual models are calibrated.

#### Phase 1: Consensus Generation (Inferring the Structure $\mathbf{P_{true}}$)

This phase aims to identify the "core" duplicate pairs that are invariant across models.

1.  **The $\tau$ Parameter:** We introduce the parameter $\tau_i$, the clustering threshold for Model $E_i$.
2.  **Operational statistics:** We are seeking the specific threshold configuration $(\tau_A^*, \tau_B^*, \dots)$ that maximizes the **Agreement** between the structural outputs of the models.
2.  **Optimization Goal:** We are seeking the specific threshold configuration $(\tau_A^*, \tau_B^*, \dots)$ that **maximizes** the **Set of Co-occurring Pairs ($P$)** and **minimises** the average number of clusters $C_i$ that contains these pairings. (We will call the full set of clusters that includes these $C_i^{'}$). Importantly this in general should say nothing about clusters produced that do not contain pairings $C_i^{'}/C_i$, we are aiming to optimise agreement here. If we agree on some cluster that contains multiple pairings, this is a lot more valuable than reducing it until we have only clusters of pairs. 
4.  **Inference:** The set of pairs ($P$) becomes our synthetic, high-precision Ground Truth. We will treat the full set $C_i^{'}$ as initial estimate of $E_{i}$ . 

#### Phase 2: Model Calibration (Inferring the Operational Threshold $\mathbf{t_i^*}$)

This phase aims to find the optimal operational filter $t_i$ for each model, enabling it to recover the full set of duplicates (including high-confidence ones it may have initially missed).

1.  **The $t$ Parameter:** We introduce the parameter $t_i$, the operational filtering threshold for Model $E_i$.
2.  **Optimization Goal:** We now want to minimise the total number of clusters, while retaining our initial estimate of $E_{i}$

### Phase 3: Inferring misses
We will assume that the proportion of our intersection pairs $P$ compared to average number $N_i$ in our "full set" of pairings is an estimate of the expectation of true duplicates given the extreme values of likely duplicate sets. From this we aim to resolve false positives and false negatives by inferring when we should treat some model's estimates as highly probable/improbable