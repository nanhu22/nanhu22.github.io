        if not(0<=i<m and 0<=j<n) or g[i][j]!='1':return
        g[i][j]='0'
        for di,dj in ((1,0),(-1,0),(0,1),(0,-1)):dfs(i+di,j+dj)
    for i in range(m):
        for j in range(n):
            if g[i][j]=='1':ans+=1;dfs(i,j)
    return ans
```

### 994 | 腐烂的橘子 | 图论 | 中等 | rotting-oranges
**核心**：多源 BFS，初始所有腐烂橘子同时入队。
**易错**：分钟数按层推进；最后检查是否还有新鲜橘子。
**口述**：所有腐烂源同时扩散，BFS 层数就是最短传播时间，O(mn)。
**关联**：102 层序遍历；200 岛屿数量。
**发散**：542 01 矩阵；1162 地图分析。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import deque
def orangesRotting(g):
    q=deque();fresh=0;m,n=len(g),len(g[0])
    for i in range(m):
        for j in range(n):
            if g[i][j]==2:q.append((i,j))
            elif g[i][j]==1:fresh+=1
    t=0
    while q and fresh:
        for _ in range(len(q)):
            i,j=q.popleft()
            for di,dj in ((1,0),(-1,0),(0,1),(0,-1)):
                x,y=i+di,j+dj
                if 0<=x<m and 0<=y<n and g[x][y]==1:g[x][y]=2;fresh-=1;q.append((x,y))
        t+=1
    return t if fresh==0 else -1
```

### 207 | 课程表 | 图论 | 中等 | course-schedule
**核心**：拓扑排序判断有向图是否存在环。
**易错**：边方向 prereq -> course；处理节点数必须等于 numCourses。
**口述**：统计入度，从所有 0 入度节点开始剥离；若最终不能处理全部节点说明存在环。
**关联**：994 腐烂的橘子；208 实现 Trie。
**发散**：210 课程表 II；802 找到最终的安全状态。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import deque
def canFinish(n,pre):
    g=[[] for _ in range(n)];deg=[0]*n
    for a,b in pre:g[b].append(a);deg[a]+=1
    q=deque(i for i,d in enumerate(deg) if d==0);seen=0
    while q:
        u=q.popleft();seen+=1
        for v in g[u]:deg[v]-=1;q.append(v) if deg[v]==0 else None
    return seen==n
```

### 208 | 实现 Trie | 图论 | 中等 | implement-trie-prefix-tree
**核心**：每个节点保存 children 与 end 标记。
**易错**：search 需要检查 end，startsWith 不需要。
**口述**：Trie 把公共前缀共享成树路径，单次操作复杂度 O(字符串长度)。
**关联**：79 单词搜索；139 单词拆分。
**发散**：211 添加与搜索单词；212 单词搜索 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
class Trie:
    def __init__(self): self.ch={}; self.end=False
    def insert(self,w):
        p=self
        for c in w:p=p.ch.setdefault(c,Trie())
        p.end=True
    def _walk(self,w):
        p=self
        for c in w:
            if c not in p.ch:return None
            p=p.ch[c]
        return p
    def search(self,w): p=self._walk(w); return bool(p and p.end)
    def startsWith(self,p): return self._walk(p) is not None
```

### 46 | 全排列 | 回溯 | 中等 | permutations
**核心**：path 表示当前选择，used 保证一个元素只使用一次。
**易错**：加入答案时要 copy path。
**口述**：每层枚举一个未使用元素，做选择、递归、撤销选择，输出规模决定 O(n·n!)。
**关联**：78 子集；39 组合总和。
**发散**：47 全排列 II；784 字母大小写全排列。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def permute(nums):
    ans=[];used=[0]*len(nums);path=[]
    def bt():
        if len(path)==len(nums):ans.append(path[:]);return
        for i,x in enumerate(nums):
            if not used[i]:used[i]=1;path.append(x);bt();path.pop();used[i]=0
    bt();return ans
```

### 78 | 子集 | 回溯 | 中等 | subsets
**核心**：每个递归节点本身就是一个合法子集。
**易错**：递归从 start 开始，避免排列式重复。
**口述**：每个元素只有选或不选两种状态，因此共有 2^n 个子集。
**关联**：46 全排列；39 组合总和。
**发散**：90 子集 II；77 组合。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def subsets(nums):
    ans=[];path=[]
    def bt(s):
        ans.append(path[:])
        for i in range(s,len(nums)):path.append(nums[i]);bt(i+1);path.pop()
    bt(0);return ans
```

### 17 | 电话号码的字母组合 | 回溯 | 中等 | letter-combinations-of-a-phone-number
**核心**：每一位数字对应一组分支，按位置递归。
**易错**：空字符串输入应返回 []。
**口述**：深度固定为 digits 长度，每层分支数 3 或 4，是典型固定层数回溯。
**关联**：22 括号生成；46 全排列。
**发散**：784 字母大小写全排列；93 复原 IP 地址。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def letterCombinations(d):