**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def searchMatrix(a,target):
    i,j=0,len(a[0])-1
    while i<len(a) and j>=0:
        if a[i][j]==target:return True
        if a[i][j]>target:j-=1
        else:i+=1
    return False
```

### 160 | 相交链表 | 链表 | 简单 | intersection-of-two-linked-lists
**核心**：双指针走完 A+B 与 B+A 后会在交点同步。
**易错**：比较节点身份，不是节点值。
**口述**：通过交换链表头抵消长度差，无额外空间找到交点。
**关联**：141 环形链表；142 环形链表 II。
**发散**：1650 二叉树的最近公共祖先 III；206 反转链表。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def getIntersectionNode(a,b):
    p,q=a,b
    while p is not q: p=p.next if p else b; q=q.next if q else a
    return p
```

### 206 | 反转链表 | 链表 | 简单 | reverse-linked-list
**核心**：每一步只改当前节点 next 指向前驱。
**易错**：改 next 前先保存 nxt，否则丢失后半链表。
**口述**：维护 prev/cur/nxt 三个角色，一次扫描原地反转，O(n) O(1)。
**关联**：234 回文链表；25 K 个一组翻转链表。
**发散**：92 反转链表 II；24 两两交换链表中的节点。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def reverseList(head):
    pre=None; cur=head
    while cur:
        nxt=cur.next; cur.next=pre; pre=cur; cur=nxt
    return pre
```

### 234 | 回文链表 | 链表 | 简单 | palindrome-linked-list
**核心**：快慢指针找中点，反转后半段后逐个比较。
**易错**：奇数长度中点处理；若面试要求可恢复链表。
**口述**：中点 + 原地反转后半链表，把空间从 O(n) 降为 O(1)。
**关联**：206 反转链表；141 环形链表。
**发散**：143 重排链表；876 链表的中间结点。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def isPalindrome(head):
    s=f=head
    while f and f.next:s=s.next;f=f.next.next
    p=None
    while s:n=s.next;s.next=p;p=s;s=n
    while p:
        if head.val!=p.val:return False
        head=head.next;p=p.next
    return True
```

### 141 | 环形链表 | 链表 | 简单 | linked-list-cycle
**核心**：快慢指针若有环一定相遇。
**易错**：循环条件要先检查 fast 和 fast.next。
**口述**：快指针每次多走一步，有环时相对速度为 1，最终必追上慢指针。
**关联**：142 环形链表 II；160 相交链表。
**发散**：202 快乐数；287 寻找重复数。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def hasCycle(head):
    s=f=head
    while f and f.next:
        s=s.next;f=f.next.next
        if s is f:return True
    return False
```

### 142 | 环形链表 II | 链表 | 中等 | linked-list-cycle-ii
**核心**：相遇后一个指针回头，两者同速再走会在环入口相遇。
**易错**：第二阶段必须从 head 与 meeting 同速一步一步走。
**口述**：由路程关系可证头到入口距离等于相遇点到入口的补距，因此第二次相遇就是入口。
**关联**：141 环形链表；287 寻找重复数。
**发散**：202 快乐数；457 环形数组是否存在循环。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def detectCycle(head):
    s=f=head
    while f and f.next:
        s=s.next;f=f.next.next
        if s is f:
            p=head
            while p is not s:p=p.next;s=s.next
            return p
```

### 21 | 合并两个有序链表 | 链表 | 简单 | merge-two-sorted-lists
**核心**：dummy + 尾指针每次接较小节点。
**易错**：最后要接剩余链表。
**口述**：两条有序链表同步前进，每个节点只处理一次，O(m+n)。
**关联**：23 合并 K 个升序链表；148 排序链表。
**发散**：88 合并两个有序数组；1669 合并两个链表。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def mergeTwoLists(a,b):
    d=ListNode(); p=d
    while a and b:
        if a.val<b.val:p.next,a=a,a.next
        else:p.next,b=b,b.next
        p=p.next
    p.next=a or b
    return d.next
```

### 2 | 两数相加 | 链表 | 中等 | add-two-numbers
**核心**：逐位相加并维护 carry。
**易错**：最后仍有进位时要额外建节点。
**口述**：链表天然按低位到高位给出，模拟手算加法即可，O(max(m,n))。
**关联**：21 合并两个有序链表；445 两数相加 II。
**发散**：67 二进制求和；415 字符串相加。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def addTwoNumbers(a,b):
    d=ListNode();p=d;c=0
    while a or b or c:
        s=(a.val if a else 0)+(b.val if b else 0)+c;c,v=divmod(s,10);p.next=ListNode(v);p=p.next
        a=a.next if a else None;b=b.next if b else None
    return d.next
```

### 19 | 删除链表的倒数第 N 个结点 | 链表 | 中等 | remove-nth-node-from-end-of-list
**核心**：dummy 下快指针先走 n 步，再同步移动。
**易错**：删除头节点必须有 dummy；注意 n 的步数偏移。
**口述**：保持快慢指针间距为 n，快指针到尾时慢指针正好位于待删节点前驱。
**关联**：160 相交链表；141 环形链表。
**发散**：876 链表的中间结点；2095 删除链表的中间节点。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def removeNthFromEnd(head,n):
    d=ListNode(0,head);f=s=d
    for _ in range(n):f=f.next
    while f.next:f=f.next;s=s.next
    s.next=s.next.next
    return d.next
```

### 24 | 两两交换链表中的节点 | 链表 | 中等 | swap-nodes-in-pairs
**核心**：用 dummy 操作每一对节点的前驱、first、second。
**易错**：先保存 second.next，避免断链。
**口述**：每次原地翻转相邻两个节点，dummy 统一处理头部，O(n) O(1)。
**关联**：206 反转链表；25 K 个一组翻转链表。
**发散**：92 反转链表 II；143 重排链表。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def swapPairs(head):
    d=ListNode(0,head);p=d
    while p.next and p.next.next:
        a,b=p.next,p.next.next;a.next=b.next;b.next=a;p.next=b;p=a
    return d.next
```

### 25 | K 个一组翻转链表 | 链表 | 困难 | reverse-nodes-in-k-group
**核心**：先确认够 k 个，再把 [group_prev.next, kth] 原地反转。
**易错**：不足 k 个必须原样保留；反转边界最容易出错。
**口述**：分组定位 kth，局部原地反转，再把各组重新接起来，总 O(n)。
**关联**：206 反转链表；24 两两交换链表中的节点。
**发散**：92 反转链表 II；2074 反转偶数长度组的节点。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def reverseKGroup(head,k):
    d=ListNode(0,head);gp=d
    while True:
        kth=gp
        for _ in range(k):
            kth=kth.next
            if not kth:return d.next
        nxt=kth.next;pre=nxt;cur=gp.next
        while cur!=nxt:tmp=cur.next;cur.next=pre;pre=cur;cur=tmp
        old=gp.next;gp.next=kth;gp=old
```

### 138 | 随机链表的复制 | 链表 | 中等 | copy-list-with-random-pointer
**核心**：哈希记录原节点到新节点映射，再连 next/random。
**易错**：random 可能为 None；不要按 val 映射。
**口述**：第一遍克隆节点，第二遍根据映射恢复两类边，O(n) 时间 O(n) 空间。
**关联**：146 LRU 缓存；133 克隆图。
**发散**：133 克隆图；1485 克隆含随机指针的二叉树。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def copyRandomList(head):
    mp={None:None};p=head
    while p:mp[p]=Node(p.val);p=p.next
    p=head
    while p:mp[p].next=mp[p.next];mp[p].random=mp[p.random];p=p.next
    return mp[head]
```

### 148 | 排序链表 | 链表 | 中等 | sort-list
**核心**：链表最适合归并排序：快慢指针切半 + 合并。
**易错**：切半时要断开 left/right，防止递归死循环。
**口述**：归并排序对链表合并无需随机访问，时间 O(n log n)，递归栈 O(log n)。
**关联**：21 合并两个有序链表；23 合并 K 个升序链表。
**发散**：147 对链表进行插入排序；912 排序数组。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def sortList(head):
    if not head or not head.next:return head
    s,f=head,head.next
    while f and f.next:s=s.next;f=f.next.next
    r=s.next;s.next=None
    return mergeTwoLists(sortList(head),sortList(r))
```

### 23 | 合并 K 个升序链表 | 链表 | 困难 | merge-k-sorted-lists
**核心**：最小堆保存每条链表当前最小头节点。
**易错**：Python heap 元组需要唯一 tie-breaker，避免节点不可比较。
**口述**：堆大小最多 k，每弹一个节点再压入其后继，总复杂度 O(N log k)。
**关联**：21 合并两个有序链表；148 排序链表。
**发散**：373 查找和最小的 K 对数字；378 有序矩阵中第 K 小的元素。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
import heapq
def mergeKLists(lists):
    h=[];d=ListNode();p=d
    for i,node in enumerate(lists):
        if node:heapq.heappush(h,(node.val,i,node))
    while h:
        _,i,node=heapq.heappop(h);p.next=node;p=node
        if node.next:heapq.heappush(h,(node.next.val,i,node.next))
    return d.next
```

### 94 | 二叉树的中序遍历 | 二叉树 | 简单 | binary-tree-inorder-traversal
**核心**：一路压左子树，弹栈访问，再转向右子树。
**易错**：循环条件是 cur or stack。
**口述**：显式栈模拟递归调用栈，每个节点进出栈一次，O(n)。
**关联**：230 二叉搜索树中第 K 小的元素；98 验证二叉搜索树。
**发散**：144 前序遍历；145 后序遍历。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
def inorderTraversal(root):
    st=[];ans=[];cur=root
    while cur or st: