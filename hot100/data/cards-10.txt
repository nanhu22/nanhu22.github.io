    def getMin(self):return self.s[-1][1]
```

### 394 | 字符串解码 | 栈 | 中等 | decode-string
**核心**：遇到 [ 时保存当前字符串和重复次数，遇到 ] 时弹栈合成。
**易错**：数字可能多位；嵌套括号要保持当前层状态。
**口述**：栈记录进入新括号层前的上下文，闭括号时恢复并拼接，整体 O(输出长度)。
**关联**：20 有效括号；32 最长有效括号。
**发散**：1190 反转每对括号间的子串；726 原子的数量。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def decodeString(s):
    st=[];cur='';num=0
    for c in s:
        if c.isdigit():num=num*10+int(c)
        elif c=='[':st.append((cur,num));cur='';num=0
        elif c==']':pre,k=st.pop();cur=pre+cur*k
        else:cur+=c
    return cur
```

### 739 | 每日温度 | 栈 | 中等 | daily-temperatures
**核心**：单调递减栈保存尚未找到更高温度的下标。
**易错**：答案是天数差，不是温度差。
**口述**：新温度到来时一次性解决所有更低的历史温度，每个下标最多进出栈一次，O(n)。
**关联**：84 柱状图最大矩形；239 滑动窗口最大值。
**发散**：496 下一个更大元素 I；503 下一个更大元素 II。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def dailyTemperatures(t):
    st=[];ans=[0]*len(t)
    for i,x in enumerate(t):
        while st and t[st[-1]]<x:j=st.pop();ans[j]=i-j
        st.append(i)
    return ans
```

### 84 | 柱状图中最大的矩形 | 栈 | 困难 | largest-rectangle-in-histogram
**核心**：单调递增栈；当前高度变小意味着栈顶柱子的右边界确定。
**易错**：加尾部 0 哨兵触发清栈；宽度是 i-st[-1]-1。
**口述**：栈保存高度递增的候选左边界，每个柱子仅进出栈一次，O(n)。
**关联**：42 接雨水；739 每日温度。
**发散**：85 最大矩形；907 子数组的最小值之和。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def largestRectangleArea(h):
    st=[];ans=0
    for i,x in enumerate(h+[0]):
        while st and h[st[-1]]>x:
            j=st.pop();left=st[-1] if st else -1;ans=max(ans,h[j]*(i-left-1))
        st.append(i)
    return ans
```

### 215 | 数组中的第 K 个最大元素 | 堆 | 中等 | kth-largest-element-in-an-array
**核心**：维护大小为 k 的最小堆，堆顶就是第 k 大。
**易错**：第 k 大对应小顶堆容量 k，不是第 k 个索引。
**口述**：只保留当前最大的 k 个元素，时间 O(n log k)、空间 O(k)。
**关联**：347 前 K 个高频元素；295 数据流中位数。
**发散**：703 数据流中的第 K 大元素；973 最接近原点的 K 个点。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
import heapq
def findKthLargest(a,k):
    h=[]
    for x in a:
        heapq.heappush(h,x)
        if len(h)>k:heapq.heappop(h)
    return h[0]
```

### 347 | 前 K 个高频元素 | 堆 | 中等 | top-k-frequent-elements
**核心**：计数后用大小 k 的最小堆按频次保留候选。
**易错**：堆里比较频次，不是元素值。
**口述**：先 O(n) 统计频次，再对不同元素做 O(log k) 堆维护。
**关联**：215 第 K 大元素；295 数据流中位数。
**发散**：692 前 K 个高频单词；451 根据字符出现频率排序。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
from collections import Counter
import heapq
def topKFrequent(a,k):
    return [x for _,x in heapq.nlargest(k,((c,x) for x,c in Counter(a).items()))]
```

### 295 | 数据流的中位数 | 堆 | 困难 | find-median-from-data-stream
**核心**：大顶堆保存较小一半，小顶堆保存较大一半，大小差不超过 1。
**易错**：Python 用负数模拟大顶堆；每次插入后要重新平衡。
**口述**：双堆维持有序分割，中位数只依赖两个堆顶，插入 O(log n)，查询 O(1)。
**关联**：215 第 K 大元素；347 前 K 高频元素。
**发散**：480 滑动窗口中位数；703 数据流中的第 K 大元素。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
import heapq
class MedianFinder:
    def __init__(self):self.lo=[];self.hi=[]
    def addNum(self,x):
        heapq.heappush(self.lo,-x);heapq.heappush(self.hi,-heapq.heappop(self.lo))
        if len(self.hi)>len(self.lo):heapq.heappush(self.lo,-heapq.heappop(self.hi))
    def findMedian(self):return -self.lo[0] if len(self.lo)>len(self.hi) else (-self.lo[0]+self.hi[0])/2
```

### 121 | 买卖股票的最佳时机 | 贪心算法 | 简单 | best-time-to-buy-and-sell-stock
**核心**：扫描时维护历史最低买入价和当前最大利润。
**易错**：只能先买后卖；利润最低可为 0。
**口述**：对每一天，只需要知道此前最低价格即可得到当天卖出的最优利润，O(n) O(1)。
**关联**：53 最大子数组和；152 乘积最大子数组。
**发散**：122 买卖股票 II；309 含冷冻期的股票问题。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def maxProfit(p):
    low=float('inf');ans=0
    for x in p:low=min(low,x);ans=max(ans,x-low)
    return ans
```

### 55 | 跳跃游戏 | 贪心算法 | 中等 | jump-game
**核心**：维护当前能到达的最远位置 reach。
**易错**：如果 i > reach，当前位置根本不可达，应直接失败。
**口述**：只关心可达区间最右端，不关心具体路径；每步更新最远覆盖范围即可。