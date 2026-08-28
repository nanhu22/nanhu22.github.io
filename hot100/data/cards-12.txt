
### 139 | 单词拆分 | 动态规划 | 中等 | word-break
**核心**：dp[i] 表示前 i 个字符是否可被字典拆分。
**易错**：dp[0]=True；切片区间 s[j:i]。
**口述**：枚举最后一个单词的起点 j，只要 dp[j] 为真且 s[j:i] 在字典中即可转移。
**关联**：208 Trie；322 零钱兑换。
**发散**：140 单词拆分 II；472 连接词。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def wordBreak(s,wordDict):
    st=set(wordDict);dp=[True]+[False]*len(s)
    for i in range(1,len(s)+1):
        dp[i]=any(dp[j] and s[j:i] in st for j in range(i))
    return dp[-1]
```

### 300 | 最长递增子序列 | 动态规划 | 中等 | longest-increasing-subsequence
**核心**：tails[k] 维护长度 k+1 的递增子序列最小结尾。
**易错**：tails 不是实际 LIS；用 lower_bound 替换第一个 >= x 的位置。
**口述**：更小的结尾给未来留下更大空间，二分维护 tails，O(n log n)。
**关联**：53 最大子数组和；152 乘积最大子数组。
**发散**：354 俄罗斯套娃信封；673 最长递增子序列的个数。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from bisect import bisect_left
def lengthOfLIS(a):
    t=[]
    for x in a:
        i=bisect_left(t,x)
        if i==len(t):t.append(x)
        else:t[i]=x
    return len(t)
```

### 152 | 乘积最大子数组 | 动态规划 | 中等 | maximum-product-subarray
**核心**：负数会交换最大最小角色，因此同时维护 max_end/min_end。
**易错**：不能只维护最大值；遇负数时两者交换。
**口述**：当前位置乘负数后最小可能变最大，所以保留两个极值状态，O(n) O(1)。
**关联**：53 最大子数组和；121 买卖股票。
**发散**：1567 乘积为正数的最长子数组长度；918 环形子数组最大和。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def maxProduct(a):
    hi=lo=ans=a[0]
    for x in a[1:]:
        if x<0:hi,lo=lo,hi
        hi=max(x,hi*x);lo=min(x,lo*x);ans=max(ans,hi)
    return ans
```

### 416 | 分割等和子集 | 动态规划 | 中等 | partition-equal-subset-sum
**核心**：转为 0/1 背包：是否能选若干数凑到 sum/2。
**易错**：容量必须从大到小更新，避免同一元素重复使用。
**口述**：若总和为奇数直接失败，否则做布尔 0/1 背包，复杂度 O(n·sum)。
**关联**：322 零钱兑换；198 打家劫舍。
**发散**：494 目标和；1049 最后一块石头的重量 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def canPartition(a):
    s=sum(a)
    if s%2:return False
    t=s//2;dp=[True]+[False]*t
    for x in a:
        for j in range(t,x-1,-1):dp[j]|=dp[j-x]
    return dp[t]
```

### 32 | 最长有效括号 | 多维动态规划 | 困难 | longest-valid-parentheses
**核心**：dp[i] 表示以 i 结尾的最长有效括号长度。
**易错**：只在 s[i]=')' 时转移；匹配位置要做越界检查。
**口述**：根据前一位是 '(' 还是 ')' 分两种转移，把前一段有效区间与新匹配括号拼接。
**关联**：20 有效括号；22 括号生成。
**发散**：678 有效括号字符串；1249 移除无效括号。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def longestValidParentheses(s):
    dp=[0]*len(s);ans=0
    for i in range(1,len(s)):
        if s[i]==')':
            j=i-dp[i-1]-1
            if j>=0 and s[j]=='(':dp[i]=dp[i-1]+2+(dp[j-1] if j else 0);ans=max(ans,dp[i])
    return ans
```

### 62 | 不同路径 | 多维动态规划 | 中等 | unique-paths
**核心**：dp[j] = 上方路径数 + 左方路径数。
**易错**：第一行第一列初始化为 1；可压缩成一维。
**口述**：每格只能从上或左到达，二维转移天然可滚动压缩，O(mn) 时间 O(n) 空间。
**关联**：64 最小路径和；118 杨辉三角。
**发散**：63 不同路径 II；980 不同路径 III。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def uniquePaths(m,n):
    dp=[1]*n
    for _ in range(1,m):
        for j in range(1,n):dp[j]+=dp[j-1]
    return dp[-1]
```

### 64 | 最小路径和 | 多维动态规划 | 中等 | minimum-path-sum
**核心**：当前最优 = 当前值 + min(上方, 左方)。
**易错**：首行首列只有唯一来源。
**口述**：与不同路径相同网格依赖，只是聚合操作从加法变成最小值。
**关联**：62 不同路径；118 杨辉三角。
**发散**：120 三角形最小路径和；931 下降路径最小和。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def minPathSum(g):
    m,n=len(g),len(g[0]);dp=[10**9]*n;dp[0]=0
    for i in range(m):
        for j in range(n):dp[j]=g[i][j]+min(dp[j],dp[j-1] if j else 10**9)
    return dp[-1]
```

### 5 | 最长回文子串 | 多维动态规划 | 中等 | longest-palindromic-substring
**核心**：中心扩展：每个中心向两边尽量扩。
**易错**：奇数中心和偶数中心都要考虑。
**口述**：任何回文串都围绕一个字符或两个字符中心展开，枚举 2n-1 个中心即可。
**关联**：131 分割回文串；32 最长有效括号。
**发散**：647 回文子串；516 最长回文子序列。