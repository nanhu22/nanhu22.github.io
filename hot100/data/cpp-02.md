# Hot100 C++ 最小模板 · 02

### 240
```cpp
bool searchMatrix(vector<vector<int>>& a, int target) {
    int i=0,j=a[0].size()-1;
    while (i<a.size()&&j>=0) {
        if (a[i][j]==target) return true;
        if (a[i][j]>target) --j; else ++i;
    }
    return false;
}
```

### 160
```cpp
ListNode* getIntersectionNode(ListNode* a, ListNode* b) {
    ListNode *p=a,*q=b;
    while (p!=q) { p=p?p->next:b; q=q?q->next:a; }
    return p;
}
```

### 206
```cpp
ListNode* reverseList(ListNode* head) {
    ListNode *pre=nullptr,*cur=head;
    while (cur) { auto nxt=cur->next; cur->next=pre; pre=cur; cur=nxt; }
    return pre;
}
```

### 234
```cpp
bool isPalindrome(ListNode* head) {
    ListNode *s=head,*f=head;
    while (f&&f->next) s=s->next,f=f->next->next;
    ListNode *pre=nullptr;
    while (s) { auto n=s->next; s->next=pre; pre=s; s=n; }
    while (pre) { if (head->val!=pre->val) return false; head=head->next; pre=pre->next; }
    return true;
}
```

### 141
```cpp
bool hasCycle(ListNode* head) {
    ListNode *s=head,*f=head;
    while (f&&f->next) { s=s->next; f=f->next->next; if (s==f) return true; }
    return false;
}
```

### 142
```cpp
ListNode* detectCycle(ListNode* head) {
    ListNode *s=head,*f=head;
    while (f&&f->next) {
        s=s->next; f=f->next->next;
        if (s==f) { for (s=head;s!=f;s=s->next,f=f->next); return s; }
    }
    return nullptr;
}
```

### 21
```cpp
ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy,*p=&dummy;
    while (a&&b) {
        if (a->val<b->val) p->next=a,a=a->next;
        else p->next=b,b=b->next;
        p=p->next;
    }
    p->next=a?a:b; return dummy.next;
}
```

### 2
```cpp
ListNode* addTwoNumbers(ListNode* a, ListNode* b) {
    ListNode dummy,*p=&dummy; int carry=0;
    while (a||b||carry) {
        int s=carry+(a?a->val:0)+(b?b->val:0); carry=s/10;
        p=p->next=new ListNode(s%10);
        if (a) a=a->next; if (b) b=b->next;
    }
    return dummy.next;
}
```

### 19
```cpp
ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0,head),*f=&dummy,*s=&dummy;
    while (n--) f=f->next;
    while (f->next) f=f->next,s=s->next;
    s->next=s->next->next; return dummy.next;
}
```

### 24
```cpp
ListNode* swapPairs(ListNode* head) {
    ListNode dummy(0,head),*p=&dummy;
    while (p->next&&p->next->next) {
        auto a=p->next,b=a->next;
        a->next=b->next; b->next=a; p->next=b; p=a;
    }
    return dummy.next;
}
```

### 25
```cpp
ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0,head),*gp=&dummy;
    while (true) {
        auto kth=gp;
        for (int i=0;i<k&&kth;++i) kth=kth->next;
        if (!kth) break;
        auto nxt=kth->next,*pre=nxt,*cur=gp->next;
        while (cur!=nxt) { auto tmp=cur->next; cur->next=pre; pre=cur; cur=tmp; }
        auto old=gp->next; gp->next=kth; gp=old;
    }
    return dummy.next;
}
```

### 138
```cpp
Node* copyRandomList(Node* head) {
    unordered_map<Node*,Node*> mp{{nullptr,nullptr}};
    for (Node* p=head;p;p=p->next) mp[p]=new Node(p->val);
    for (Node* p=head;p;p=p->next) mp[p]->next=mp[p->next],mp[p]->random=mp[p->random];
    return mp[head];
}
```

### 148
```cpp
ListNode* sortList(ListNode* head) {
    if (!head||!head->next) return head;
    ListNode *s=head,*f=head->next;
    while (f&&f->next) s=s->next,f=f->next->next;
    auto r=s->next; s->next=nullptr;
    return mergeTwoLists(sortList(head),sortList(r));
}
```

### 23
```cpp
ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp=[](ListNode* a,ListNode* b){return a->val>b->val;};
    priority_queue<ListNode*,vector<ListNode*>,decltype(cmp)> pq(cmp);
    for (auto p:lists) if (p) pq.push(p);
    ListNode dummy,*tail=&dummy;
    while (!pq.empty()) {
        auto p=pq.top(); pq.pop(); tail=tail->next=p;
        if (p->next) pq.push(p->next);
    }
    return dummy.next;
}
```

### 146
```cpp
class LRUCache {
    int cap; list<pair<int,int>> q;
    unordered_map<int,list<pair<int,int>>::iterator> mp;
public:
    LRUCache(int capacity):cap(capacity){}
    int get(int k) {
        if (!mp.count(k)) return -1;
        q.splice(q.begin(),q,mp[k]); return mp[k]->second;
    }
    void put(int k,int v) {
        if (mp.count(k)) q.erase(mp[k]);
        q.push_front({k,v}); mp[k]=q.begin();
        if (q.size()>cap) { mp.erase(q.back().first); q.pop_back(); }
    }
};
```

### 94
```cpp
vector<int> inorderTraversal(TreeNode* root) {
    vector<int> ans; stack<TreeNode*> st;
    while (root||!st.empty()) {
        while (root) st.push(root),root=root->left;
        root=st.top(); st.pop(); ans.push_back(root->val); root=root->right;
    }
    return ans;
}
```

### 104
```cpp
int maxDepth(TreeNode* root) {
    return root?1+max(maxDepth(root->left),maxDepth(root->right)):0;
}
```

### 226
```cpp
TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left,root->right);
    invertTree(root->left); invertTree(root->right);
    return root;
}
```

### 101
```cpp
bool mirror(TreeNode* a,TreeNode* b) {
    if (!a||!b) return a==b;
    return a->val==b->val&&mirror(a->left,b->right)&&mirror(a->right,b->left);
}
bool isSymmetric(TreeNode* root) { return !root||mirror(root->left,root->right); }
```

### 543
```cpp
int diameterOfBinaryTree(TreeNode* root) {
    int ans=0;
    function<int(TreeNode*)> dep=[&](TreeNode* n){
        if (!n) return 0;
        int l=dep(n->left),r=dep(n->right); ans=max(ans,l+r);
        return 1+max(l,r);
    };
    dep(root); return ans;
}
```
