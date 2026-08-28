# Hot100 C++ 最小模板 · 03

### 102
```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {}; queue<TreeNode*> q; q.push(root); vector<vector<int>> ans;
    while (!q.empty()) {
        int n=q.size(); vector<int> row;
        while (n--) { auto p=q.front();q.pop();row.push_back(p->val);if(p->left)q.push(p->left);if(p->right)q.push(p->right); }
        ans.push_back(move(row));
    }
    return ans;
}
```

### 108
```cpp
TreeNode* sortedArrayToBST(vector<int>& a) {
    function<TreeNode*(int,int)> f=[&](int l,int r)->TreeNode*{
        if (l>r) return nullptr; int m=(l+r)/2;
        auto n=new TreeNode(a[m]); n->left=f(l,m-1); n->right=f(m+1,r); return n;
    };
    return f(0,a.size()-1);
}
```

### 98
```cpp
bool isValidBST(TreeNode* root) {
    function<bool(TreeNode*,long long,long long)> f=[&](TreeNode* n,long long lo,long long hi){
        return !n||(lo<n->val&&n->val<hi&&f(n->left,lo,n->val)&&f(n->right,n->val,hi));
    };
    return f(root,LLONG_MIN,LLONG_MAX);
}
```

### 230
```cpp
int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    while (true) {
        while (root) st.push(root),root=root->left;
        root=st.top();st.pop(); if (--k==0) return root->val; root=root->right;
    }
}
```

### 199
```cpp
vector<int> rightSideView(TreeNode* root) {
    if (!root) return {}; queue<TreeNode*> q; q.push(root); vector<int> ans;
    while (!q.empty()) {
        int n=q.size();
        for (int i=0;i<n;++i) { auto p=q.front();q.pop();if(i==n-1)ans.push_back(p->val);if(p->left)q.push(p->left);if(p->right)q.push(p->right); }
    }
    return ans;
}
```

### 114
```cpp
void flatten(TreeNode* root) {
    TreeNode* pre=nullptr;
    function<void(TreeNode*)> dfs=[&](TreeNode* n){
        if (!n) return; dfs(n->right); dfs(n->left); n->right=pre; n->left=nullptr; pre=n;
    };
    dfs(root);
}
```

### 105
```cpp
TreeNode* buildTree(vector<int>& pre, vector<int>& in) {
    unordered_map<int,int> pos; for (int i=0;i<in.size();++i) pos[in[i]]=i; int pi=0;
    function<TreeNode*(int,int)> f=[&](int l,int r)->TreeNode*{
        if (l>r) return nullptr; int v=pre[pi++],m=pos[v]; auto n=new TreeNode(v);
        n->left=f(l,m-1); n->right=f(m+1,r); return n;
    };
    return f(0,in.size()-1);
}
```

### 437
```cpp
int pathSum(TreeNode* root, long long target) {
    unordered_map<long long,int> cnt{{0,1}}; int ans=0;
    function<void(TreeNode*,long long)> dfs=[&](TreeNode* n,long long s){
        if (!n) return; s+=n->val; ans+=cnt[s-target]; ++cnt[s]; dfs(n->left,s); dfs(n->right,s); --cnt[s];
    };
    dfs(root,0); return ans;
}
```

### 236
```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root||root==p||root==q) return root;
    auto l=lowestCommonAncestor(root->left,p,q),r=lowestCommonAncestor(root->right,p,q);
    return l&&r?root:(l?l:r);
}
```

### 124
```cpp
int maxPathSum(TreeNode* root) {
    int ans=INT_MIN;
    function<int(TreeNode*)> f=[&](TreeNode* n){
        if (!n) return 0; int l=max(0,f(n->left)),r=max(0,f(n->right));
        ans=max(ans,n->val+l+r); return n->val+max(l,r);
    };
    f(root); return ans;
}
```

### 200
```cpp
int numIslands(vector<vector<char>>& g) {
    int m=g.size(),n=g[0].size(),ans=0;
    function<void(int,int)> dfs=[&](int i,int j){
        if (i<0||i>=m||j<0||j>=n||g[i][j]!='1') return;
        g[i][j]='0'; dfs(i+1,j);dfs(i-1,j);dfs(i,j+1);dfs(i,j-1);
    };
    for (int i=0;i<m;++i) for (int j=0;j<n;++j) if (g[i][j]=='1') ++ans,dfs(i,j);
    return ans;
}
```

### 994
```cpp
int orangesRotting(vector<vector<int>>& g) {
    int m=g.size(),n=g[0].size(),fresh=0,t=0; queue<pair<int,int>> q;
    for(int i=0;i<m;++i)for(int j=0;j<n;++j) if(g[i][j]==2)q.push({i,j});else if(g[i][j]==1)++fresh;
    int d[5]={1,0,-1,0,1};
    while(!q.empty()&&fresh){
        int sz=q.size(); while(sz--){auto [i,j]=q.front();q.pop();for(int k=0;k<4;++k){int x=i+d[k],y=j+d[k+1];if(x>=0&&x<m&&y>=0&&y<n&&g[x][y]==1)g[x][y]=2,--fresh,q.push({x,y});}}
        ++t;
    }
    return fresh?-1:t;
}
```

### 207
```cpp
bool canFinish(int n, vector<vector<int>>& pre) {
    vector<vector<int>> g(n); vector<int> deg(n); queue<int> q;
    for (auto& e:pre) g[e[1]].push_back(e[0]),++deg[e[0]];
    for (int i=0;i<n;++i) if (!deg[i]) q.push(i);
    int seen=0;
    while (!q.empty()) { int u=q.front();q.pop();++seen;for(int v:g[u])if(--deg[v]==0)q.push(v); }
    return seen==n;
}
```

### 208
```cpp
class Trie {
    struct N { N* ch[26]{}; bool end=false; } *root;
public:
    Trie():root(new N){}
    void insert(string w){auto p=root;for(char c:w){int i=c-'a';if(!p->ch[i])p->ch[i]=new N;p=p->ch[i];}p->end=true;}
    N* walk(const string& w){auto p=root;for(char c:w){p=p->ch[c-'a'];if(!p)return nullptr;}return p;}
    bool search(string w){auto p=walk(w);return p&&p->end;}
    bool startsWith(string p){return walk(p);}
};
```

### 46
```cpp
vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> ans; vector<int> path; vector<char> used(nums.size());
    function<void()> bt=[&]{ if(path.size()==nums.size()){ans.push_back(path);return;}for(int i=0;i<nums.size();++i)if(!used[i]){used[i]=1;path.push_back(nums[i]);bt();path.pop_back();used[i]=0;} };
    bt(); return ans;
}
```

### 78
```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> ans; vector<int> path;
    function<void(int)> bt=[&](int s){ ans.push_back(path);for(int i=s;i<nums.size();++i){path.push_back(nums[i]);bt(i+1);path.pop_back();} };
    bt(0); return ans;
}
```

### 17
```cpp
vector<string> letterCombinations(string d) {
    if (d.empty()) return {}; vector<string> mp={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"},ans; string path;
    function<void(int)> bt=[&](int i){if(i==d.size()){ans.push_back(path);return;}for(char c:mp[d[i]-'0']){path+=c;bt(i+1);path.pop_back();}};
    bt(0); return ans;
}
```

### 39
```cpp
vector<vector<int>> combinationSum(vector<int>& a, int target) {
    sort(a.begin(),a.end()); vector<vector<int>> ans; vector<int> path;
    function<void(int,int)> bt=[&](int s,int rem){if(!rem){ans.push_back(path);return;}for(int i=s;i<a.size()&&a[i]<=rem;++i){path.push_back(a[i]);bt(i,rem-a[i]);path.pop_back();}};
    bt(0,target); return ans;
}
```

### 22
```cpp
vector<string> generateParenthesis(int n) {
    vector<string> ans; string s;
    function<void(int,int)> bt=[&](int l,int r){if(s.size()==2*n){ans.push_back(s);return;}if(l<n){s+='(';bt(l+1,r);s.pop_back();}if(r<l){s+=')';bt(l,r+1);s.pop_back();}};
    bt(0,0); return ans;
}
```

### 79
```cpp
bool exist(vector<vector<char>>& b, string w) {
    int m=b.size(),n=b[0].size();
    function<bool(int,int,int)> dfs=[&](int i,int j,int k){
        if(k==w.size())return true;if(i<0||i>=m||j<0||j>=n||b[i][j]!=w[k])return false;
        char c=b[i][j];b[i][j]='#';bool ok=dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1);b[i][j]=c;return ok;
    };
    for(int i=0;i<m;++i)for(int j=0;j<n;++j)if(dfs(i,j,0))return true;return false;
}
```
