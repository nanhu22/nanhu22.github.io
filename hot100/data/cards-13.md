**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def longestPalindrome(s):
    best=''
    def ex(l,r):
        while l>=0 and r<len(s) and s[l]==s[r]:l-=1;r+=1
        return s[l+1:r]
    for i in range(len(s)):
        best=max(best,ex(i,i),ex(i,i+1),key=len)
    return best
```

### 1143 | 最长公共子序列 | 多维动态规划 | 中等 | longest-common-subsequence
**核心**：相等则取左上 +1，否则取上/左最大值。
**易错**：子序列不要求连续；索引和 dp 维度错一位最常见。
**口述**：dp[i][j] 表示两个前缀的 LCS，按最后字符是否相等分情况转移。
**关联**：72 编辑距离；300 最长递增子序列。
**发散**：583 两个字符串的删除操作；1092 最短公共超序列。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def longestCommonSubsequence(a,b):
    dp=[0]*(len(b)+1)
    for x in a:
        pre=0
        for j,y in enumerate(b,1):
            old=dp[j];dp[j]=pre+1 if x==y else max(dp[j],dp[j-1]);pre=old
    return dp[-1]
```

### 72 | 编辑距离 | 多维动态规划 | 中等 | edit-distance
**核心**：dp[i][j] 表示 a 前 i 个字符变成 b 前 j 个字符的最少操作数。
**易错**：替换来自 dp[i-1][j-1]；插入/删除来自相邻状态。
**口述**：最后字符相等就继承左上，否则取插入、删除、替换三者最小值加 1。
**关联**：1143 最长公共子序列；139 单词拆分。
**发散**：712 两个字符串的最小 ASCII 删除和；583 两个字符串的删除操作。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def minDistance(a,b):
    dp=list(range(len(b)+1))
    for i,x in enumerate(a,1):
        nd=[i]+[0]*len(b)
        for j,y in enumerate(b,1):nd[j]=dp[j-1] if x==y else 1+min(dp[j],nd[j-1],dp[j-1])
        dp=nd
    return dp[-1]
```

### 136 | 只出现一次的数字 | 技巧 | 简单 | single-number
**核心**：x^x=0，x^0=x，异或满足交换律结合律。
**易错**：题目前提是其余元素恰好出现两次。
**口述**：所有成对元素异或后互相抵消，最终留下唯一元素，O(n) O(1)。
**关联**：169 多数元素；75 颜色分类。
**发散**：137 只出现一次的数字 II；260 只出现一次的数字 III。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def singleNumber(a):
    x=0
    for v in a:x^=v
    return x
```

### 169 | 多数元素 | 技巧 | 简单 | majority-element
**核心**：Boyer-Moore：不同元素互相抵消，最终候选就是多数元素。
**易错**：该题保证多数元素存在；若不保证需二次验证。
**口述**：多数元素数量超过一半，和其他元素一一抵消后仍会剩下，O(n) O(1)。
**关联**：75 颜色分类；136 只出现一次的数字。
**发散**：229 多数元素 II；1150 检查一个数是否在数组中占绝大多数。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def majorityElement(a):
    cand=None;c=0
    for x in a:
        if c==0:cand=x
        c+=1 if x==cand else -1
    return cand
```

### 75 | 颜色分类 | 技巧 | 中等 | sort-colors
**核心**：荷兰国旗：左边 0，中间 1，右边 2。
**易错**：交换 2 后当前位置还没检查，i 不能立即加 1。
**口述**：三个指针维护已分类区间不变量，一次扫描 O(n) 原地完成。
**关联**：41 缺失的第一个正数；169 多数元素。
**发散**：905 按奇偶排序数组；324 摆动排序 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def sortColors(a):
    l=i=0;r=len(a)-1
    while i<=r:
        if a[i]==0:a[l],a[i]=a[i],a[l];l+=1;i+=1
        elif a[i]==2:a[r],a[i]=a[i],a[r];r-=1
        else:i+=1
```

### 31 | 下一个排列 | 技巧 | 中等 | next-permutation
**核心**：从右找第一对上升位置 i，再找右侧最小的大于 a[i] 的数交换，最后反转后缀。
**易错**：后缀原本是非递增的；找不到 i 时整个数组反转。
**口述**：要得到字典序紧邻的更大排列，改动位置必须尽量靠右，增幅必须尽量小。
**关联**：189 轮转数组；46 全排列。
**发散**：556 下一个更大元素 III；60 排列序列。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def nextPermutation(a):
    i=len(a)-2
    while i>=0 and a[i]>=a[i+1]:i-=1
    if i>=0:
        j=len(a)-1
        while a[j]<=a[i]:j-=1
        a[i],a[j]=a[j],a[i]
    a[i+1:]=reversed(a[i+1:])
```

### 287 | 寻找重复数 | 技巧 | 中等 | find-the-duplicate-number
**核心**：把 nums[i] 看成 next 指针，重复值对应环入口。
**易错**：不能修改数组；快慢指针第二阶段与环形链表 II 相同。
**口述**：值域 1..n 让数组天然形成函数图，重复值造成入度冲突并形成环，Floyd 可 O(1) 空间找到入口。
**关联**：142 环形链表 II；41 缺失的第一个正数。
**发散**：202 快乐数；442 数组中重复的数据。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def findDuplicate(a):
    s=f=a[0]