**关联**：45 跳跃游戏 II；763 划分字母区间。
**发散**：134 加油站；1024 视频拼接。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def canJump(a):
    r=0
    for i,x in enumerate(a):
        if i>r:return False
        r=max(r,i+x)
    return True
```

### 45 | 跳跃游戏 II | 贪心算法 | 中等 | jump-game-ii
**核心**：把可达范围看成 BFS 层，每到当前层末尾就增加一步并扩展下一层边界。
**易错**：循环到 n-2 即可，避免最后多加一步。
**口述**：在当前步数能覆盖的区间内，贪心收集下一步最远边界，相当于隐式 BFS。
**关联**：55 跳跃游戏；56 合并区间。
**发散**：1024 视频拼接；1326 灌溉花园的最少水龙头数目。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def jump(a):
    ans=end=far=0
    for i in range(len(a)-1):
        far=max(far,i+a[i])
        if i==end:ans+=1;end=far
    return ans
```

### 763 | 划分字母区间 | 贪心算法 | 中等 | partition-labels
**核心**：预处理每个字符最后位置，扫描时维护当前片段最远右边界。
**易错**：只有 i == end 时才能切分。
**口述**：只要片段内任一字符未来还会出现，就不能提前切；最远最后位置决定片段终点。
**关联**：56 合并区间；55 跳跃游戏。
**发散**：435 无重叠区间；763 同类区间贪心变体。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def partitionLabels(s):
    last={c:i for i,c in enumerate(s)};ans=[];st=end=0
    for i,c in enumerate(s):
        end=max(end,last[c])
        if i==end:ans.append(end-st+1);st=i+1
    return ans
```

### 70 | 爬楼梯 | 动态规划 | 简单 | climbing-stairs
**核心**：dp[i] = dp[i-1] + dp[i-2]。
**易错**：n=1 的初始化；可滚动压缩空间。
**口述**：到第 i 阶只能从 i-1 或 i-2 来，因此是 Fibonacci 型一维 DP。
**关联**：198 打家劫舍；322 零钱兑换。
**发散**：746 使用最小花费爬楼梯；509 斐波那契数。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def climbStairs(n):
    a,b=1,1
    for _ in range(n):a,b=b,a+b
    return a
```

### 118 | 杨辉三角 | 动态规划 | 简单 | pascals-triangle
**核心**：每个内部元素来自上一行左上 + 右上。
**易错**：每行首尾固定为 1。
**口述**：逐行构造，状态只依赖上一行，时间与输出规模一致 O(n²)。
**关联**：62 不同路径；64 最小路径和。
**发散**：119 杨辉三角 II；120 三角形最小路径和。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def generate(n):
    ans=[]
    for i in range(n):
        row=[1]*(i+1)
        for j in range(1,i):row[j]=ans[-1][j-1]+ans[-1][j]
        ans.append(row)
    return ans
```

### 198 | 打家劫舍 | 动态规划 | 中等 | house-robber
**核心**：当前房屋只有“抢”或“不抢”，dp[i]=max(dp[i-1],dp[i-2]+x)。
**易错**：状态含义是前 i 个房屋的最大金额，不是必须抢第 i 个。
**口述**：相邻互斥约束只依赖前两步，可滚动到 O(1) 空间。
**关联**：70 爬楼梯；416 分割等和子集。
**发散**：213 打家劫舍 II；337 打家劫舍 III。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def rob(a):
    p2=p1=0
    for x in a:p2,p1=p1,max(p1,p2+x)
    return p1
```

### 279 | 完全平方数 | 动态规划 | 中等 | perfect-squares
**核心**：完全背包：dp[x] = min(dp[x-j²]+1)。
**易错**：dp[0]=0；初值要设无穷大。
**口述**：每个平方数可重复使用，求凑出 n 的最少物品数，是完全背包最短型 DP。
**关联**：322 零钱兑换；416 分割等和子集。
**发散**：377 组合总和 IV；518 零钱兑换 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def numSquares(n):
    dp=[0]+[10**9]*n
    for x in range(1,n+1):
        j=1
        while j*j<=x:dp[x]=min(dp[x],dp[x-j*j]+1);j+=1
    return dp[n]
```

### 322 | 零钱兑换 | 动态规划 | 中等 | coin-change
**核心**：完全背包求最少硬币数。
**易错**：不可达状态保持 inf；返回时转成 -1。
**口述**：dp[x] 表示组成金额 x 的最少硬币数，对每个金额尝试最后一枚硬币。
**关联**：279 完全平方数；416 分割等和子集。
**发散**：518 零钱兑换 II；377 组合总和 IV。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def coinChange(coins,amount):
    dp=[0]+[10**9]*amount
    for x in range(1,amount+1):
        for c in coins:
            if c<=x:dp[x]=min(dp[x],dp[x-c]+1)
    return -1 if dp[amount]==10**9 else dp[amount]
```