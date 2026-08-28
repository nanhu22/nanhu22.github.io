    l,r=0,len(h)-1; lm=rm=ans=0
    while l<=r:
        if lm<=rm:
            lm=max(lm,h[l]); ans+=lm-h[l]; l+=1
        else:
            rm=max(rm,h[r]); ans+=rm-h[r]; r-=1
    return ans
```

### 3 | 无重复字符的最长子串 | 滑动窗口 | 中等 | longest-substring-without-repeating-characters
**核心**：右扩，重复时直接把左边界跳到上次位置之后。
**易错**：左边界只能右移，必须取 max(left,last[c]+1)。
**口述**：窗口保持字符唯一性，每个字符最多进入和离开一次，O(n)。
**关联**：438 找到字符串中所有字母异位词；76 最小覆盖子串。
**发散**：424 替换后的最长重复字符；904 水果成篮。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def lengthOfLongestSubstring(s):
    last={}; l=ans=0
    for r,c in enumerate(s):
        if c in last: l=max(l,last[c]+1)
        last[c]=r; ans=max(ans,r-l+1)
    return ans
```

### 438 | 找到字符串中所有字母异位词 | 滑动窗口 | 中等 | find-all-anagrams-in-a-string
**核心**：固定长度窗口维护字符频次。
**易错**：窗口长度超过 len(p) 时必须及时移出左端。
**口述**：维护长度固定为 m 的计数窗口，每次一进一出，频次相等即记录起点。
**关联**：3 无重复字符的最长子串；49 字母异位词分组。
**发散**：567 字符串的排列；30 串联所有单词的子串。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import Counter
def findAnagrams(s,p):
    need=Counter(p); win=Counter(); ans=[]; m=len(p)
    for r,c in enumerate(s):
        win[c]+=1
        if r>=m: win[s[r-m]]-=1
        if win==need: ans.append(r-m+1)
    return ans
```

### 560 | 和为 K 的子数组 | 子串 | 中等 | subarray-sum-equals-k
**核心**：当前前缀和 s 需要之前出现过 s-k。
**易错**：freq[0]=1 必须初始化；数组含负数不能用普通滑窗。
**口述**：把区间和转为两个前缀和之差，用哈希统计历史前缀频次，O(n)。
**关联**：239 滑动窗口最大值；76 最小覆盖子串。
**发散**：525 连续数组；974 和可被 K 整除的子数组。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import defaultdict
def subarraySum(nums,k):
    freq=defaultdict(int,{0:1}); s=ans=0
    for x in nums:
        s+=x; ans+=freq[s-k]; freq[s]+=1
    return ans
```

### 239 | 滑动窗口最大值 | 子串 | 困难 | sliding-window-maximum
**核心**：单调递减队列保存仍有可能成为最大值的下标。
**易错**：队列存下标不是值；先移除过期下标。
**口述**：每个下标最多入队出队一次，队首始终是窗口最大值，所以 O(n)。
**关联**：84 柱状图中最大的矩形；739 每日温度。
**发散**：862 和至少为 K 的最短子数组；1438 绝对差不超过限制的最长连续子数组。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import deque
def maxSlidingWindow(a,k):
    q=deque(); ans=[]
    for i,x in enumerate(a):
        while q and q[0]<=i-k: q.popleft()
        while q and a[q[-1]]<=x: q.pop()
        q.append(i)
        if i>=k-1: ans.append(a[q[0]])
    return ans
```

### 76 | 最小覆盖子串 | 子串 | 困难 | minimum-window-substring
**核心**：右扩到满足需求，再尽可能左缩。
**易错**：满足的是字符种类需求，不是窗口长度；缩窗前要先更新答案。
**口述**：用 need/window 计数和 valid 维护覆盖状态，每个字符最多进出一次，O(n+m)。
**关联**：3 无重复字符的最长子串；438 找到字符串中所有字母异位词。
**发散**：567 字符串的排列；209 长度最小的子数组。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import Counter,defaultdict
def minWindow(s,t):
    need=Counter(t); win=defaultdict(int); valid=0; l=0; best=(10**9,0)
    for r,c in enumerate(s):
        win[c]+=1
        if c in need and win[c]==need[c]: valid+=1
        while valid==len(need):
            if r-l+1<best[0]: best=(r-l+1,l)
            d=s[l]; l+=1
            if d in need and win[d]==need[d]: valid-=1
            win[d]-=1
    return '' if best[0]==10**9 else s[best[1]:best[1]+best[0]]
```

### 53 | 最大子数组和 | 普通数组 | 中等 | maximum-subarray
**核心**：以当前位置结尾的最优值只依赖前一个状态。
**易错**：全负数时不能把初值写成 0。
**口述**：Kadane：当前要么接前缀，要么从自己重启；O(n) 时间 O(1) 空间。
**关联**：152 乘积最大子数组；198 打家劫舍。
**发散**：918 环形子数组的最大和；1749 任意子数组和的绝对值的最大值。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def maxSubArray(a):
    cur=ans=a[0]
    for x in a[1:]: cur=max(x,cur+x); ans=max(ans,cur)
    return ans
```

### 56 | 合并区间 | 普通数组 | 中等 | merge-intervals
**核心**：按左端点排序，只和答案最后一个区间比较。
**易错**：重叠条件是 start <= last_end。
**口述**：排序后区间左端点单调，当前只可能与最后一个已合并区间冲突。
**关联**：763 划分字母区间；45 跳跃游戏 II。
**发散**：57 插入区间；435 无重叠区间。