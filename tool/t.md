Maybe, i think my argument is slightly different.

Let's start with the assumption that there is a true set of "semantically identical" questions. That produce the same answer to the same inputs, this is reasonable. Using this we would platonically produce a "true" set of groups.

We have our different estimators, the clusturing algorithm, given a "view" on the data, the embedding type, and our threshold. We aim to determine the threshold that maximises the similarity of our groups with our unknown "true" groups. 

This is the tricky assumption:

Lets say that given some platonic threshold t_i for embedding type e_i, we produce the same amount of groups as our platonically correct groups. It may be slightly unreasonable to say that these are our platonic groups (infact it is probably incorrect to say), however we could say that this is some reasobale estimate of our "true" set of groups.

Given we have a fixed set of embedding types {e_i}, we may be able to infer some estimate of e_true, and then using varying t_i to tune for t.

The one step, assuming our assumptions are true is the intermidaiary step, estimating e_i from our guesses, since it cant just be where they agree on the set of groups, since we can find the trivial case of t_i for all i = 0. I.e every sentence is in a 1 length group. If we solve this then our inferential tuning is pretty trivial baysian inference.

Perhaps our estimate for e_true could be simpily maximising the amount of "agreements", i.e the amount of **pairs** (not groups) that match between our clusters. Then take the average of how many groups that contain these pairs, per embedding type.

Then we're finding some t_i that produces around this many groups.

**Note: A clarification on our estimate, via averaging:**

Lets say we have Groupings 1, which has found clusters:
```
Cluster 1:
 - A,B,C
Cluster 2:
 - D,E,F
Cluster 3:
 - G,H
Cluster 4:
 - I,J
Cluster 5:
 - K,L
```
And Groupings 2
``
Cluster 1:
 - A,B,E
Cluster 2:
 - D,F,K,L
Cluster 3:
 - G,H,I
Cluster 4:
 - J
```
Matching pairings:
- A,B
- D,F
- K,L
- I,J
- G,H
In Groupings 1: 5 groups, Groupings 2: 4 groups, so average of 4.5 groups is our estimate of platonic true groups.
We may later choose to refine this even more, since our groups are contained by some threshold from a centroid, but actually say nothing about the radius of the cluster. We can perhaps even weight these later by how certain we are (the length of this radius)

No code for now, but does this make more sense.

**Note: A clarification on our estimate, via averaging:**

Lets say we have Groupings 1, which has found clusters:
```
Cluster 1:
 - A,B,C
Cluster 2:
 - D,E,F,X,Y
Cluster 3:
 - G,H
Cluster 4:
 - I,J
Cluster 5:
 - K,L
```
And Groupings 2
``
Cluster 1:
 - A,B
Cluster 2:
 - D,F,K,L
Cluster 3:
 - G,H,I
Cluster 4:
 - J
Cluster 5:
 - X,Y 
```
Matching pairings:
- A,B
- D,F
- K,L
- I,J
- X,Y

Which with adding X,Y it is now groupings 1: 4 groups, groupings 2, 4 groups. Im sure this is different to the intersection/union


```
Cluster 1:
 - A,B,C, G,H
Cluster 2:
 - D,E,F,X,Y
Cluster 3:
 - I,J
Cluster 4:
 - K,L

```
And Groupings 2
```
Cluster 1:
 - A,B,E, G,H,I
Cluster 2:
 - D,F,K,L
Cluster 3:
 - J
Cluster 4:
 - X,Y 
```
Matching pairings:
- A,B
- D,F
- K,L
- G,H
 - X,Y 

Shared clusters:
- (A,B),(G,H)
- D,F
- X,Y
- K,L

Intesection Groupings 1, groupings 2:

(A,B),
(D,F),
(E,I),
(X,Z),
(K,L)


<!-- 
```
Cluster 1:
 - A,B,G,H
Cluster 2:
 - D,E,F,X,Y
Cluster 3:
 - I,J
Cluster 4:
 - K,L

```
And Groupings 2
```
Cluster 1:
 - A,B,E, G,H,I
Cluster 2:
 - D,F,K,L
Cluster 3:
 - J
Cluster 4:
 - X,Y 
``` -->

<!-- Cluster 1:
 - A,B,G,H,N,M
Cluster 2:
 - D,E,F,X,Y
Cluster 3:
 - I,J
Cluster 4:
 - K,L -->

(A,B),
tau:
	a:
		merges with (G,H)
	b: 
		merges with (N,M)

(D,F),
tau:
	c:
		merges with (X,Y)
(X,Y),
(K,L)

cluster B pairs:
(A,B), 0
(D,F), never
(G,P), never
(X,Z), b
(N,M), c
(K,L), 0

only need to check b,c

therefore if we start at 0, and 

