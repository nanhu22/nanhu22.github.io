        while cur:st.append(cur);cur=cur.left
        cur=st.pop();ans.append(cur.val);cur=cur.right
    return ans
```

### 104 | 二叉树的最大深度 | 二叉树 | 简单 | maximum-depth-of-binary-tree
**核心**：深度 = 1 + max(左深度, 右深度)。
**易错**：空树深度为 0。
**口述**：典型后序递归，先得到左右子问题结果再合并，O(n)。
**关联**：543 二叉树的直径；124 二叉树中的最大路径和。
**发散**：111 二叉树的最小深度；110 平衡二叉树。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def maxDepth(root):
    return 0 if not root else 1+max(maxDepth(root.left),maxDepth(root.right))
```

### 226 | 翻转二叉树 | 二叉树 | 简单 | invert-binary-tree
**核心**：每个节点交换左右子树。
**易错**：递归返回值要重新接回节点左右指针。
**口述**：对每个节点做一次局部交换，递归覆盖整棵树，O(n)。
**关联**：101 对称二叉树；114 二叉树展开为链表。
**发散**：100 相同的树；617 合并二叉树。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def invertTree(root):
    if root:root.left,root.right=invertTree(root.right),invertTree(root.left)
    return root
```

### 101 | 对称二叉树 | 二叉树 | 简单 | symmetric-tree
**核心**：比较 left.left 对 right.right、left.right 对 right.left。
**易错**：镜像不是同位置比较。
**口述**：把问题转成两棵树是否互为镜像，递归检查外侧和内侧节点。
**关联**：226 翻转二叉树；100 相同的树。
**发散**：951 翻转等价二叉树；572 另一棵树的子树。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def isSymmetric(root):
    def f(a,b):
        if not a or not b:return a is b
        return a.val==b.val and f(a.left,b.right) and f(a.right,b.left)
    return f(root.left,root.right)
```

### 543 | 二叉树的直径 | 二叉树 | 简单 | diameter-of-binary-tree
**核心**：每个节点的候选直径 = 左深度 + 右深度。
**易错**：返回给父节点的是深度，不是直径。
**口述**：后序递归时顺便更新全局最长路径，避免重复计算，O(n)。
**关联**：104 最大深度；124 最大路径和。
**发散**：687 最长同值路径；1245 树的直径。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def diameterOfBinaryTree(root):
    ans=0
    def dep(n):
        nonlocal ans
        if not n:return 0
        l,r=dep(n.left),dep(n.right);ans=max(ans,l+r);return 1+max(l,r)
    dep(root);return ans
```

### 102 | 二叉树的层序遍历 | 二叉树 | 中等 | binary-tree-level-order-traversal
**核心**：BFS 每轮固定处理当前队列长度。
**易错**：层边界必须先记录 size。
**口述**：队列天然按距离分层，逐层弹出并压入下一层，O(n)。
**关联**：199 二叉树的右视图；994 腐烂的橘子。
**发散**：107 层序遍历 II；103 锯齿形层序遍历。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import deque
def levelOrder(root):
    if not root:return []
    q=deque([root]);ans=[]
    while q:
        row=[]
        for _ in range(len(q)):
            n=q.popleft();row.append(n.val)
            if n.left:q.append(n.left)
            if n.right:q.append(n.right)
        ans.append(row)
    return ans
```

### 108 | 将有序数组转换为二叉搜索树 | 二叉树 | 简单 | convert-sorted-array-to-binary-search-tree
**核心**：每次取中点做根，递归构造左右半区。
**易错**：边界建议用闭区间或半开区间统一到底。
**口述**：中点天然保证左右规模接近，因此同时满足 BST 和高度平衡。
**关联**：98 验证二叉搜索树；230 第 K 小元素。
**发散**：109 有序链表转换 BST；1382 将 BST 变平衡。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def sortedArrayToBST(a):
    def f(l,r):
        if l>r:return None
        m=(l+r)//2;n=TreeNode(a[m]);n.left=f(l,m-1);n.right=f(m+1,r);return n
    return f(0,len(a)-1)
```

### 98 | 验证二叉搜索树 | 二叉树 | 中等 | validate-binary-search-tree
**核心**：每个节点必须落在祖先传下来的开区间 (lo, hi)。
**易错**：不能只比较父子节点；重复值不允许。
**口述**：递归传播有效上下界，任何节点越界即可提前失败，O(n)。
**关联**：94 中序遍历；230 第 K 小元素。
**发散**：530 BST 的最小绝对差；700 BST 中的搜索。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def isValidBST(root):
    def f(n,lo,hi):
        return not n or (lo<n.val<hi and f(n.left,lo,n.val) and f(n.right,n.val,hi))
    return f(root,float('-inf'),float('inf'))
```

### 230 | 二叉搜索树中第 K 小的元素 | 二叉树 | 中等 | kth-smallest-element-in-a-bst
**核心**：BST 中序遍历是升序，第 k 个访问节点就是答案。
**易错**：k 是 1-based。
**口述**：利用 BST 中序有序性，不需要完整排序，最坏 O(n)，可在找到第 k 个时提前结束。
**关联**：94 中序遍历；98 验证 BST。
**发散**：173 BST 迭代器；703 数据流中的第 K 大元素。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷