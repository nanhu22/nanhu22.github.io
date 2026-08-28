**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def merge(intervals):
    intervals.sort(); ans=[]
    for s,e in intervals:
        if ans and s<=ans[-1][1]: ans[-1][1]=max(ans[-1][1],e)
        else: ans.append([s,e])
    return ans
```

### 189 | 轮转数组 | 普通数组 | 中等 | rotate-array
**核心**：右移 k 可由三次翻转完成。
**易错**：先做 k %= n；空数组边界。
**口述**：整体翻转后目标两段顺序反了，再分别翻转恢复内部顺序，O(n) 原地。
**关联**：31 下一个排列；48 旋转图像。
**发散**：186 翻转字符串里的单词 II；61 旋转链表。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def rotate(a,k):
    n=len(a); k%=n
    a.reverse(); a[:k]=reversed(a[:k]); a[k:]=reversed(a[k:])
```

### 238 | 除了自身以外数组的乘积 | 普通数组 | 中等 | product-of-array-except-self
**核心**：答案 = 左侧乘积 × 右侧乘积。
**易错**：不能用除法；右侧乘积可用一个变量滚动。
**口述**：先把前缀乘积写进答案，再从右向左乘后缀，O(n) 且额外空间 O(1)。
**关联**：53 最大子数组和；152 乘积最大子数组。
**发散**：724 寻找数组的中心下标；42 接雨水。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def productExceptSelf(a):
    ans=[1]*len(a); p=1
    for i,x in enumerate(a): ans[i]=p; p*=x
    p=1
    for i in range(len(a)-1,-1,-1): ans[i]*=p; p*=a[i]
    return ans
```

### 41 | 缺失的第一个正数 | 普通数组 | 困难 | first-missing-positive
**核心**：把值 x 原地放到索引 x-1。
**易错**：交换前要判断目标值不等于当前，避免死循环。
**口述**：把数组自身当哈希表，只关心 1..n；每个数最多被交换常数次，O(n) O(1)。
**关联**：287 寻找重复数；75 颜色分类。
**发散**：268 丢失的数字；448 找到所有数组中消失的数字。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def firstMissingPositive(a):
    n=len(a)
    for i in range(n):
        while 1<=a[i]<=n and a[a[i]-1]!=a[i]:
            j=a[i]-1; a[i],a[j]=a[j],a[i]
    for i,x in enumerate(a):
        if x!=i+1:return i+1
    return n+1
```

### 73 | 矩阵置零 | 矩阵 | 中等 | set-matrix-zeroes
**核心**：用第一行和第一列充当标记数组。
**易错**：第一行/列自身是否置零要单独保存。
**口述**：复用矩阵边界存标记，把额外空间降为 O(1)，再根据标记二次清零。
**关联**：48 旋转图像；54 螺旋矩阵。
**发散**：289 生命游戏；36 有效的数独。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def setZeroes(a):
    m,n=len(a),len(a[0]); row=any(x==0 for x in a[0]); col=any(a[i][0]==0 for i in range(m))
    for i in range(1,m):
        for j in range(1,n):
            if a[i][j]==0:a[i][0]=a[0][j]=0
    for i in range(1,m):
        for j in range(1,n):
            if a[i][0]==0 or a[0][j]==0:a[i][j]=0
    if row:a[0]=[0]*n
    if col:
        for i in range(m):a[i][0]=0
```

### 54 | 螺旋矩阵 | 矩阵 | 中等 | spiral-matrix
**核心**：维护上、下、左、右四条边界逐层收缩。
**易错**：剩余单行/单列时避免重复访问。
**口述**：每轮走四条边并收缩边界，每个元素恰访问一次，O(mn)。
**关联**：48 旋转图像；73 矩阵置零。
**发散**：59 螺旋矩阵 II；885 螺旋矩阵 III。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def spiralOrder(a):
    ans=[]; t,b,l,r=0,len(a)-1,0,len(a[0])-1
    while t<=b and l<=r:
        ans+=a[t][l:r+1]; t+=1
        for i in range(t,b+1): ans.append(a[i][r])
        r-=1
        if t<=b: ans+=a[b][l:r+1][::-1]; b-=1
        if l<=r:
            for i in range(b,t-1,-1): ans.append(a[i][l])
            l+=1
    return ans
```

### 48 | 旋转图像 | 矩阵 | 中等 | rotate-image
**核心**：转置后每行反转即可顺时针 90°。
**易错**：要求原地；转置只交换上三角或下三角一次。
**口述**：矩阵旋转可分解为主对角线转置 + 行反转，两步都原地。
**关联**：189 轮转数组；73 矩阵置零。
**发散**：867 转置矩阵；54 螺旋矩阵。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def rotate(a):
    n=len(a)
    for i in range(n):
        for j in range(i+1,n): a[i][j],a[j][i]=a[j][i],a[i][j]
    for row in a: row.reverse()
```

### 240 | 搜索二维矩阵 II | 矩阵 | 中等 | search-a-2d-matrix-ii
**核心**：从右上角出发，一次排除一行或一列。
**易错**：不能普通二分整个矩阵，因为行间不保证整体有序。
**口述**：右上角左边更小、下边更大，比较一次就能确定一个方向，O(m+n)。
**关联**：74 搜索二维矩阵；35 搜索插入位置。
**发散**：378 有序矩阵中第 K 小的元素；1351 统计有序矩阵中的负数。