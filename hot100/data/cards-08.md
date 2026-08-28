    if not d:return []
    mp=['','','abc','def','ghi','jkl','mno','pqrs','tuv','wxyz'];ans=[]
    def bt(i,s):
        if i==len(d):ans.append(s);return
        for c in mp[int(d[i])]:bt(i+1,s+c)
    bt(0,'');return ans
```

### 39 | 组合总和 | 回溯 | 中等 | combination-sum
**核心**：同一个候选数可重复使用，因此递归仍从 i 开始。
**易错**：与子集题区别是下一层传 i 不是 i+1。
**口述**：排序后做剪枝，枚举当前层选择并允许复用，回溯搜索所有可行组合。
**关联**：78 子集；46 全排列。
**发散**：40 组合总和 II；216 组合总和 III。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def combinationSum(a,target):
    a.sort();ans=[];path=[]
    def bt(s,rem):
        if rem==0:ans.append(path[:]);return
        for i in range(s,len(a)):
            if a[i]>rem:break
            path.append(a[i]);bt(i,rem-a[i]);path.pop()
    bt(0,target);return ans
```

### 22 | 括号生成 | 回溯 | 中等 | generate-parentheses
**核心**：任意前缀都必须满足 right_used <= left_used。
**易错**：右括号只有在 left > right 时才能放。
**口述**：回溯只生成合法前缀，左括号最多 n 个，右括号不能超前，避免无效搜索。
**关联**：32 最长有效括号；17 电话号码组合。
**发散**：301 删除无效括号；678 有效的括号字符串。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def generateParenthesis(n):
    ans=[]
    def bt(s,l,r):
        if len(s)==2*n:ans.append(s);return
        if l<n:bt(s+'(',l+1,r)
        if r<l:bt(s+')',l,r+1)
    bt('',0,0);return ans
```

### 79 | 单词搜索 | 回溯 | 中等 | word-search
**核心**：从每个格子尝试 DFS，路径内不能重复使用格子。
**易错**：回溯后要恢复字符；命中最后字符的终止条件。
**口述**：状态是坐标和匹配到的字符位置，四方向搜索并原地标记访问，空间 O(L)。
**关联**：200 岛屿数量；208 Trie。
**发散**：212 单词搜索 II；130 被围绕的区域。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def exist(b,w):
    m,n=len(b),len(b[0])
    def dfs(i,j,k):
        if k==len(w):return True
        if not(0<=i<m and 0<=j<n) or b[i][j]!=w[k]:return False
        c=b[i][j];b[i][j]='#';ok=any(dfs(i+di,j+dj,k+1) for di,dj in ((1,0),(-1,0),(0,1),(0,-1)));b[i][j]=c;return ok
    return any(dfs(i,j,0) for i in range(m) for j in range(n))
```

### 131 | 分割回文串 | 回溯 | 中等 | palindrome-partitioning
**核心**：枚举下一段结束位置，只递归回文段。
**易错**：path 存的是切分片段，不是字符；可用 DP 预处理回文提高效率。
**口述**：把切分点作为决策，每层只选择合法回文片段，回溯枚举所有分割方案。
**关联**：5 最长回文子串；78 子集。
**发散**：132 分割回文串 II；93 复原 IP 地址。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def partition(s):
    ans=[];path=[]
    def bt(i):
        if i==len(s):ans.append(path[:]);return
        for j in range(i,len(s)):
            t=s[i:j+1]
            if t==t[::-1]:path.append(t);bt(j+1);path.pop()
    bt(0);return ans
```

### 51 | N 皇后 | 回溯 | 困难 | n-queens
**核心**：按行放皇后，用列、主对角线、副对角线集合剪枝。
**易错**：对角线键分别是 r-c 与 r+c。
**口述**：每行只放一个皇后，冲突检测 O(1)，回溯搜索合法列选择。
**关联**：46 全排列；79 单词搜索。
**发散**：52 N 皇后 II；37 解数独。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def solveNQueens(n):
    ans=[];col=set();d1=set();d2=set();b=[['.']*n for _ in range(n)]
    def bt(r):
        if r==n:ans.append([''.join(x) for x in b]);return
        for c in range(n):
            if c in col or r-c in d1 or r+c in d2:continue
            col.add(c);d1.add(r-c);d2.add(r+c);b[r][c]='Q';bt(r+1);b[r][c]='.';col.remove(c);d1.remove(r-c);d2.remove(r+c)
    bt(0);return ans
```

### 35 | 搜索插入位置 | 二分查找 | 简单 | search-insert-position
**核心**：找第一个 >= target 的位置。
**易错**：明确二分的边界语义，推荐半开区间 [l,r)。
**口述**：这是 lower_bound 模板，循环保持答案始终落在 [l,r] 范围。
**关联**：34 在排序数组中查找元素首末位置；74 搜索二维矩阵。
**发散**：69 x 的平方根；278 第一个错误的版本。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def searchInsert(a,t):
    l,r=0,len(a)
    while l<r:
        m=(l+r)//2
        if a[m]<t:l=m+1
        else:r=m
    return l
```

### 74 | 搜索二维矩阵 | 二分查找 | 中等 | search-a-2d-matrix
**核心**：把 m×n 矩阵视为长度 m*n 的一维有序数组。
**易错**：索引映射 row=mid//n, col=mid%n。
**口述**：由于每行首元素大于前一行末元素，矩阵全局有序，可直接二分，O(log mn)。
**关联**：240 搜索二维矩阵 II；35 搜索插入位置。
**发散**：378 有序矩阵中第 K 小的元素；668 乘法表中第 K 小的数。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷