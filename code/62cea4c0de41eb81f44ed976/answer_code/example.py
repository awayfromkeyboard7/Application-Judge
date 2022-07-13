import sys
from heapq import *
from collections import defaultdict

V, E = map(int, sys.stdin.readline().split())
K = int(sys.stdin.readline())
graph = defaultdict(list)
edge = dict()
for i in range(V+1):
    edge[(i, i)]= 0
for _ in range(E):
    u, v, w = map(int, sys.stdin.readline().split())
    if (u, v) not in edge:
        graph[u].append(v)
        edge[(u, v)] = w
    else:
        if edge[(u, v)] > w:
            edge[(u, v)] = w

d = [1e9]*(V+1)
d[K] = 0
heap = [(0, K)]
while heap:
    cost, v = heappop(heap)
    if d[v] < cost:
        continue
    for w in graph[v]:
        if d[w] <= d[v] + edge[(v, w)]:
            continue
        d[w] = d[v] + edge[(v, w)]
        heappush(heap, (d[w], w))

for c in d[1:]:
    if c == 1e9:
        print('INF')
    else:
        print(c)
