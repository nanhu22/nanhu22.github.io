# Hot 100 · v2 补充卡片

### 146 | LRU 缓存 | 链表 | 中等 | lru-cache
**核心**：哈希表 O(1) 定位节点 + 双向链表 O(1) 移动/删除，链表头是最近使用，尾是最久未使用。
**易错**：get 命中后也必须移动到头部；put 已存在 key 要更新并移动；超容量删除尾部前驱并同步删除哈希映射。
**口述**：LRU 同时要求按 key O(1) 查找和按时间 O(1) 淘汰，单独哈希或链表都不够，因此组合哈希表与双向链表，使 get/put 都为 O(1)。
**关联**：138 随机链表的复制；155 最小栈。
**发散**：460 LFU 缓存；432 全 O(1) 的数据结构。
**复习标签**：未刷 / 首刷 / 二刷 / 三刷
```python
class Node:
    def __init__(self,k=0,v=0): self.k,self.v,self.prev,self.next=k,v,None,None
class LRUCache:
    def __init__(self,cap):
        self.cap=cap; self.mp={}; self.h,self.t=Node(),Node(); self.h.next=self.t; self.t.prev=self.h
    def _rm(self,n): n.prev.next=n.next; n.next.prev=n.prev
    def _add(self,n): n.next=self.h.next; n.prev=self.h; self.h.next.prev=n; self.h.next=n
    def get(self,k):
        if k not in self.mp:return -1
        n=self.mp[k]; self._rm(n); self._add(n); return n.v
    def put(self,k,v):
        if k in self.mp:
            n=self.mp[k]; n.v=v; self._rm(n); self._add(n); return
        n=Node(k,v); self.mp[k]=n; self._add(n)
        if len(self.mp)>self.cap:
            old=self.t.prev; self._rm(old); del self.mp[old.k]
```
