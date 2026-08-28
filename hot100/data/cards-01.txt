# Hot 100 · v2 卡片数据

> 格式：题号 | 题名 | 专题 | 难度 | slug。每题都包含 Python 最小模板、易错点、面试口述和复习标签。

### 1 | 两数之和 | 哈希 | 简单 | two-sum
**核心**：遍历时只查补数，查完再入表。
**易错**：先入表可能误用当前元素两次；返回的是下标不是值。
**口述**：用哈希把“找另一个数”从 O(n) 降到 O(1) 查询，整体 O(n) 时间、O(n) 空间。
**关联**：49 字母异位词分组；128 最长连续序列。
**发散**：217 存在重复元素；167 两数之和 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def twoSum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen: return [seen[target-x], i]
        seen[x] = i
```

### 49 | 字母异位词分组 | 哈希 | 中等 | group-anagrams
**核心**：把字符串映射到稳定签名，签名相同即同组。
**易错**：计数数组要转 tuple 才能做 dict key；排序法复杂度更高。
**口述**：每个词转 26 维频次签名，哈希分桶；总时间与总字符数线性相关。
**关联**：1 两数之和；128 最长连续序列。
**发散**：242 有效的字母异位词；36 有效的数独。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import defaultdict
def groupAnagrams(strs):
    g = defaultdict(list)
    for s in strs:
        cnt = [0]*26
        for c in s: cnt[ord(c)-97] += 1
        g[tuple(cnt)].append(s)
    return list(g.values())
```

### 128 | 最长连续序列 | 哈希 | 中等 | longest-consecutive-sequence
**核心**：只从没有前驱 x-1 的数开始向右扩。
**易错**：每个数都向右扫会退化到 O(n²)。
**口述**：集合提供 O(1) 存在性判断，只从序列起点扩展，因此每个元素最多被访问常数次。
**关联**：1 两数之和；49 字母异位词分组。
**发散**：217 存在重复元素；674 最长连续递增序列。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def longestConsecutive(nums):
    s, ans = set(nums), 0
    for x in s:
        if x-1 not in s:
            y = x
            while y in s: y += 1
            ans = max(ans, y-x)
    return ans
```

### 283 | 移动零 | 双指针 | 简单 | move-zeroes
**核心**：慢指针维护下一个非零数应写入的位置。
**易错**：要求原地；注意保持非零元素相对顺序。
**口述**：一次扫描把非零稳定压缩到前面，再补零，O(n) 时间 O(1) 空间。
**关联**：11 盛最多水的容器；15 三数之和。
**发散**：26 删除有序数组中的重复项；27 移除元素。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def moveZeroes(nums):
    w = 0
    for x in nums:
        if x: nums[w], w = x, w+1
    nums[w:] = [0]*(len(nums)-w)
```

### 11 | 盛最多水的容器 | 双指针 | 中等 | container-with-most-water
**核心**：面积受短板限制，每次移动短板。
**易错**：不能移动长板期待更优；面积要先算再移动。
**口述**：左右夹逼，较短边是当前瓶颈；移动长边不会提升上界，所以只移动短边。
**关联**：42 接雨水；15 三数之和。
**发散**：167 两数之和 II；977 有序数组的平方。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def maxArea(h):
    l, r, ans = 0, len(h)-1, 0
    while l < r:
        ans = max(ans, min(h[l], h[r])*(r-l))
        if h[l] < h[r]: l += 1
        else: r -= 1
    return ans
```

### 15 | 三数之和 | 双指针 | 中等 | 3sum
**核心**：排序后枚举第一个数，剩余区间用双指针找两数和。
**易错**：三层都要正确去重；首元素大于 0 可提前结束。
**口述**：排序带来单调性，把三重枚举降为枚举一层加双指针，O(n²)。
**关联**：11 盛最多水的容器；1 两数之和。
**发散**：18 四数之和；16 最接近的三数之和。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def threeSum(a):
    a.sort(); ans=[]
    for i in range(len(a)-2):
        if i and a[i]==a[i-1]: continue
        l,r=i+1,len(a)-1
        while l<r:
            s=a[i]+a[l]+a[r]
            if s<0:l+=1
            elif s>0:r-=1
            else:
                ans.append([a[i],a[l],a[r]]); l+=1; r-=1
                while l<r and a[l]==a[l-1]: l+=1
                while l<r and a[r]==a[r+1]: r-=1
    return ans
```

### 42 | 接雨水 | 双指针 | 困难 | trapping-rain-water
**核心**：较低一侧的最大边界已经足够决定当前格雨水量。
**易错**：比较的是 left_max/right_max，不是只比较当前高度。
**口述**：两端向内推进，较小最大边界是当前可确定的水位，故可 O(n) 时间 O(1) 空间完成。
**关联**：11 盛最多水的容器；84 柱状图中最大的矩形。
**发散**：407 接雨水 II；845 数组中的最长山脉。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def trap(h):