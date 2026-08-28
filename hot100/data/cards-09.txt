```python
def searchMatrix(a,t):
    m,n=len(a),len(a[0]);l,r=0,m*n-1
    while l<=r:
        mid=(l+r)//2;x=a[mid//n][mid%n]
        if x==t:return True
        if x<t:l=mid+1
        else:r=mid-1
    return False
```

### 34 | 在排序数组中查找元素的第一个和最后一个位置 | 二分查找 | 中等 | find-first-and-last-position-of-element-in-sorted-array
**核心**：分别求 lower_bound(target) 与 lower_bound(target+1)-1。
**易错**：找右边界时不要在命中后线性扩展。
**口述**：把首尾位置统一转成两个边界二分，因此时间仍是 O(log n)。
**关联**：35 搜索插入位置；33 搜索旋转排序数组。
**发散**：278 第一个错误版本；744 寻找比目标字母大的最小字母。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def searchRange(a,t):
    def lb(x):
        l,r=0,len(a)
        while l<r:
            m=(l+r)//2
            if a[m]<x:l=m+1
            else:r=m
        return l
    l=lb(t);r=lb(t+1)-1
    return [l,r] if l<len(a) and a[l]==t else [-1,-1]
```

### 33 | 搜索旋转排序数组 | 二分查找 | 中等 | search-in-rotated-sorted-array
**核心**：每次至少有一半区间是有序的，据此判断 target 落哪半边。
**易错**：有序半边判断与 target 区间必须都含边界。
**口述**：虽然整体被旋转，但任意中点两侧至少一侧有序，因此每轮仍可排除一半。
**关联**：153 寻找旋转数组最小值；34 查找首末位置。
**发散**：81 搜索旋转排序数组 II；154 寻找旋转数组最小值 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def search(a,t):
    l,r=0,len(a)-1
    while l<=r:
        m=(l+r)//2
        if a[m]==t:return m
        if a[l]<=a[m]:
            if a[l]<=t<a[m]:r=m-1
            else:l=m+1
        else:
            if a[m]<t<=a[r]:l=m+1
            else:r=m-1
    return -1
```

### 153 | 寻找旋转排序数组中的最小值 | 二分查找 | 中等 | find-minimum-in-rotated-sorted-array
**核心**：比较 mid 与 right；mid > right 说明最小值在右侧。
**易错**：无重复元素时不需要 r-=1 的退化处理。
**口述**：以右端点为参照判断中点位于哪一段有序区，逐步收缩到最小元素。
**关联**：33 搜索旋转排序数组；4 两个正序数组中位数。
**发散**：154 寻找旋转数组最小值 II；852 山脉数组峰顶索引。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def findMin(a):
    l,r=0,len(a)-1
    while l<r:
        m=(l+r)//2
        if a[m]>a[r]:l=m+1
        else:r=m
    return a[l]
```

### 4 | 寻找两个正序数组的中位数 | 二分查找 | 困难 | median-of-two-sorted-arrays
**核心**：二分较短数组的切分位置，使左半最大值 <= 右半最小值。
**易错**：哨兵 ±inf；总长度奇偶两种返回方式。
**口述**：不是合并数组，而是在较短数组上二分 partition，使两边元素数量相等且有序，O(log min(m,n))。
**关联**：35 搜索插入位置；153 旋转数组最小值。
**发散**：719 找出第 K 小的数对距离；668 乘法表中第 K 小的数。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def findMedianSortedArrays(A,B):
    if len(A)>len(B):A,B=B,A
    m,n=len(A),len(B);l,r=0,m
    while l<=r:
        i=(l+r)//2;j=(m+n+1)//2-i
        al=A[i-1] if i else float('-inf'); ar=A[i] if i<m else float('inf')
        bl=B[j-1] if j else float('-inf'); br=B[j] if j<n else float('inf')
        if al<=br and bl<=ar:return max(al,bl) if (m+n)%2 else (max(al,bl)+min(ar,br))/2
        if al>br:r=i-1
        else:l=i+1
```

### 20 | 有效的括号 | 栈 | 简单 | valid-parentheses
**核心**：左括号入栈，右括号必须匹配栈顶。
**易错**：右括号到来时栈可能为空；最后栈必须为空。
**口述**：栈保存尚未匹配的左括号，LIFO 正好对应嵌套结构，O(n)。
**关联**：155 最小栈；32 最长有效括号。
**发散**：678 有效的括号字符串；921 使括号有效的最少添加。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def isValid(s):
    mp={')':'(',']':'[','}':'{'};st=[]
    for c in s:
        if c in mp:
            if not st or st.pop()!=mp[c]:return False
        else:st.append(c)
    return not st
```

### 155 | 最小栈 | 栈 | 中等 | min-stack
**核心**：每层同时保存当前值和到此为止的最小值。
**易错**：重复最小值必须被正确保留。
**口述**：把历史最小值随栈节点一起存储，因此 push/pop/top/getMin 都是 O(1)。
**关联**：20 有效括号；739 每日温度。
**发散**：716 最大栈；901 股票价格跨度。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
class MinStack:
    def __init__(self):self.s=[]
    def push(self,x):self.s.append((x,min(x,self.s[-1][1] if self.s else x)))
    def pop(self):self.s.pop()
    def top(self):return self.s[-1][0]