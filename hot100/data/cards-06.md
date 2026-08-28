```python
def kthSmallest(root,k):
    st=[];cur=root
    while True:
        while cur:st.append(cur);cur=cur.left
        cur=st.pop();k-=1
        if k==0:return cur.val
        cur=cur.right
```

### 199 | 二叉树的右视图 | 二叉树 | 中等 | binary-tree-right-side-view
**核心**：层序遍历每层最后一个节点即右视图。
**易错**：如果 DFS 右优先，则只记录首次到达的新深度。
**口述**：BFS 分层后取每层最后一个节点，时间 O(n)。
**关联**：102 层序遍历；104 最大深度。
**发散**：513 找树左下角的值；116 填充每个节点的下一个右侧节点指针。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def rightSideView(root):
    if not root:return []
    q=[root];ans=[]
    while q:
        ans.append(q[-1].val);q=[c for n in q for c in (n.left,n.right) if c]
    return ans
```

### 114 | 二叉树展开为链表 | 二叉树 | 中等 | flatten-binary-tree-to-linked-list
**核心**：后序处理后，把左链插到根与右链之间。
**易错**：展开后所有 left 必须为 None；注意保存原右子树。
**口述**：递归先把左右子树展开，再做局部拼接，使结果符合前序顺序。
**关联**：226 翻转二叉树；105 前序与中序构造树。
**发散**：430 扁平化多级双向链表；897 递增顺序搜索树。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def flatten(root):
    if not root:return
    flatten(root.left);flatten(root.right)
    if root.left:
        p=root.left
        while p.right:p=p.right
        p.right=root.right;root.right=root.left;root.left=None
```

### 105 | 从前序与中序遍历序列构造二叉树 | 二叉树 | 中等 | construct-binary-tree-from-preorder-and-inorder-traversal
**核心**：前序首元素是根，中序索引切分左右子树。
**易错**：用哈希表记录中序位置，避免每次线性查找。
**口述**：根在中序中的位置唯一确定左右规模，递归按区间构造，O(n)。
**关联**：114 展开为链表；106 中序与后序构造树。
**发散**：889 前序和后序构造树；1008 前序遍历构造 BST。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def buildTree(pre,ino):
    pos={x:i for i,x in enumerate(ino)};pi=0
    def f(l,r):
        nonlocal pi
        if l>r:return None
        v=pre[pi];pi+=1;n=TreeNode(v);m=pos[v];n.left=f(l,m-1);n.right=f(m+1,r);return n
    return f(0,len(ino)-1)
```

### 437 | 路径总和 III | 二叉树 | 中等 | path-sum-iii
**核心**：树上前缀和 + 回溯哈希计数。
**易错**：离开节点时必须 freq[prefix]-=1，避免跨分支串线。
**口述**：把根到当前节点的前缀和放入路径级哈希表，查询 prefix-target 的历史频次，O(n)。
**关联**：560 和为 K 的子数组；124 最大路径和。
**发散**：112 路径总和；113 路径总和 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import defaultdict
def pathSum(root,target):
    f=defaultdict(int,{0:1});ans=0
    def dfs(n,s):
        nonlocal ans
        if not n:return
        s+=n.val;ans+=f[s-target];f[s]+=1;dfs(n.left,s);dfs(n.right,s);f[s]-=1
    dfs(root,0);return ans
```

### 236 | 二叉树的最近公共祖先 | 二叉树 | 中等 | lowest-common-ancestor-of-a-binary-tree
**核心**：左右子树各找到一个目标时，当前节点就是 LCA。
**易错**：遇到 p/q 直接返回；节点可能是另一个节点的祖先。
**口述**：后序汇总左右子树命中情况；若两侧都有结果则当前为最近公共祖先。
**关联**：124 最大路径和；437 路径总和 III。
**发散**：235 BST 的最近公共祖先；1644 二叉树的最近公共祖先 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def lowestCommonAncestor(root,p,q):
    if not root or root is p or root is q:return root
    l=lowestCommonAncestor(root.left,p,q);r=lowestCommonAncestor(root.right,p,q)
    return root if l and r else l or r
```

### 124 | 二叉树中的最大路径和 | 二叉树 | 困难 | binary-tree-maximum-path-sum
**核心**：向父节点只能贡献单边最大增益；全局答案可取左右两边都接。
**易错**：负增益要截断为 0；返回值和全局候选含义不同。
**口述**：后序递归计算每节点向上的最大贡献，同时用 left+node+right 更新全局路径和，O(n)。
**关联**：543 二叉树直径；53 最大子数组和。
**发散**：687 最长同值路径；1372 二叉树中的最长交错路径。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def maxPathSum(root):
    ans=float('-inf')
    def f(n):
        nonlocal ans
        if not n:return 0
        l=max(0,f(n.left));r=max(0,f(n.right));ans=max(ans,n.val+l+r);return n.val+max(l,r)
    f(root);return ans
```

### 200 | 岛屿数量 | 图论 | 中等 | number-of-islands
**核心**：遇到陆地就 DFS/BFS 淹掉整个连通块并计数。
**易错**：访问后立即标记，避免重复入栈。
**口述**：网格被拆成若干四联通分量，每启动一次搜索就是一个新岛屿，总 O(mn)。
**关联**：994 腐烂的橘子；79 单词搜索。
**发散**：695 岛屿的最大面积；130 被围绕的区域。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def numIslands(g):
    m,n=len(g),len(g[0]);ans=0
    def dfs(i,j):