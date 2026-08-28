# Hot100 C++ 最小模板 · 01

### 1
```cpp
vector<int> twoSum(vector<int>& a, int target) {
    unordered_map<int,int> pos;
    for (int i=0;i<a.size();++i) {
        if (pos.count(target-a[i])) return {pos[target-a[i]], i};
        pos[a[i]]=i;
    }
    return {};
}
```

### 49
```cpp
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string,vector<string>> mp;
    for (auto& s: strs) {
        array<int,26> cnt{};
        for (char c:s) ++cnt[c-'a'];
        string key;
        for (int x:cnt) key += "#" + to_string(x);
        mp[key].push_back(s);
    }
    vector<vector<string>> ans;
    for (auto& [_,v]:mp) ans.push_back(move(v));
    return ans;
}
```

### 128
```cpp
int longestConsecutive(vector<int>& nums) {
    unordered_set<int> st(nums.begin(), nums.end());
    int ans=0;
    for (int x:st) if (!st.count(x-1)) {
        int y=x;
        while (st.count(y)) ++y;
        ans=max(ans,y-x);
    }
    return ans;
}
```

### 283
```cpp
void moveZeroes(vector<int>& a) {
    int w=0;
    for (int x:a) if (x) a[w++]=x;
    while (w<a.size()) a[w++]=0;
}
```

### 11
```cpp
int maxArea(vector<int>& h) {
    int l=0,r=h.size()-1,ans=0;
    while (l<r) {
        ans=max(ans,min(h[l],h[r])*(r-l));
        if (h[l]<h[r]) ++l; else --r;
    }
    return ans;
}
```

### 15
```cpp
vector<vector<int>> threeSum(vector<int>& a) {
    sort(a.begin(),a.end()); vector<vector<int>> ans;
    for (int i=0;i+2<a.size();++i) {
        if (i&&a[i]==a[i-1]) continue;
        int l=i+1,r=a.size()-1;
        while (l<r) {
            long long s=(long long)a[i]+a[l]+a[r];
            if (s<0) ++l; else if (s>0) --r;
            else {
                ans.push_back({a[i],a[l],a[r]}); ++l; --r;
                while (l<r&&a[l]==a[l-1]) ++l;
                while (l<r&&a[r]==a[r+1]) --r;
            }
        }
    }
    return ans;
}
```

### 42
```cpp
int trap(vector<int>& h) {
    int l=0,r=h.size()-1,lm=0,rm=0,ans=0;
    while (l<=r) {
        if (lm<=rm) { lm=max(lm,h[l]); ans+=lm-h[l++]; }
        else { rm=max(rm,h[r]); ans+=rm-h[r--]; }
    }
    return ans;
}
```

### 3
```cpp
int lengthOfLongestSubstring(string s) {
    vector<int> last(128,-1); int l=0,ans=0;
    for (int r=0;r<s.size();++r) {
        l=max(l,last[s[r]]+1); last[s[r]]=r;
        ans=max(ans,r-l+1);
    }
    return ans;
}
```

### 438
```cpp
vector<int> findAnagrams(string s, string p) {
    if (s.size()<p.size()) return {};
    array<int,26> need{},win{}; vector<int> ans;
    for (char c:p) ++need[c-'a'];
    for (int r=0;r<s.size();++r) {
        ++win[s[r]-'a'];
        if (r>=p.size()) --win[s[r-p.size()]-'a'];
        if (r+1>=p.size() && win==need) ans.push_back(r-p.size()+1);
    }
    return ans;
}
```

### 560
```cpp
int subarraySum(vector<int>& nums, int k) {
    unordered_map<long long,int> cnt{{0,1}};
    long long s=0; int ans=0;
    for (int x:nums) { s+=x; ans+=cnt[s-k]; ++cnt[s]; }
    return ans;
}
```

### 239
```cpp
vector<int> maxSlidingWindow(vector<int>& a, int k) {
    deque<int> q; vector<int> ans;
    for (int i=0;i<a.size();++i) {
        while (!q.empty()&&q.front()<=i-k) q.pop_front();
        while (!q.empty()&&a[q.back()]<=a[i]) q.pop_back();
        q.push_back(i);
        if (i>=k-1) ans.push_back(a[q.front()]);
    }
    return ans;
}
```

### 76
```cpp
string minWindow(string s, string t) {
    vector<int> need(128),win(128); int kinds=0,valid=0,l=0,best=INT_MAX,start=0;
    for (char c:t) if (need[c]++==0) ++kinds;
    for (int r=0;r<s.size();++r) {
        char c=s[r]; if (++win[c]==need[c]&&need[c]) ++valid;
        while (valid==kinds) {
            if (r-l+1<best) best=r-l+1,start=l;
            char d=s[l++]; if (need[d]&&win[d]--==need[d]) --valid;
        }
    }
    return best==INT_MAX?"":s.substr(start,best);
}
```

### 53
```cpp
int maxSubArray(vector<int>& a) {
    int cur=a[0],ans=a[0];
    for (int i=1;i<a.size();++i) cur=max(a[i],cur+a[i]),ans=max(ans,cur);
    return ans;
}
```

### 56
```cpp
vector<vector<int>> merge(vector<vector<int>>& in) {
    sort(in.begin(),in.end()); vector<vector<int>> ans;
    for (auto& x:in) {
        if (!ans.empty()&&x[0]<=ans.back()[1]) ans.back()[1]=max(ans.back()[1],x[1]);
        else ans.push_back(x);
    }
    return ans;
}
```

### 189
```cpp
void rotate(vector<int>& a, int k) {
    int n=a.size(); if (!n) return; k%=n;
    reverse(a.begin(),a.end());
    reverse(a.begin(),a.begin()+k);
    reverse(a.begin()+k,a.end());
}
```

### 238
```cpp
vector<int> productExceptSelf(vector<int>& a) {
    int n=a.size(); vector<int> ans(n,1); long long p=1;
    for (int i=0;i<n;++i) ans[i]=p,p*=a[i];
    p=1;
    for (int i=n-1;i>=0;--i) ans[i]*=p,p*=a[i];
    return ans;
}
```

### 41
```cpp
int firstMissingPositive(vector<int>& a) {
    int n=a.size();
    for (int i=0;i<n;++i)
        while (a[i]>=1&&a[i]<=n&&a[a[i]-1]!=a[i]) swap(a[i],a[a[i]-1]);
    for (int i=0;i<n;++i) if (a[i]!=i+1) return i+1;
    return n+1;
}
```

### 73
```cpp
void setZeroes(vector<vector<int>>& a) {
    int m=a.size(),n=a[0].size(); bool row=false,col=false;
    for (int j=0;j<n;++j) row|=a[0][j]==0;
    for (int i=0;i<m;++i) col|=a[i][0]==0;
    for (int i=1;i<m;++i) for (int j=1;j<n;++j) if (!a[i][j]) a[i][0]=a[0][j]=0;
    for (int i=1;i<m;++i) for (int j=1;j<n;++j) if (!a[i][0]||!a[0][j]) a[i][j]=0;
    if (row) fill(a[0].begin(),a[0].end(),0);
    if (col) for (auto& r:a) r[0]=0;
}
```

### 54
```cpp
vector<int> spiralOrder(vector<vector<int>>& a) {
    vector<int> ans; int t=0,b=a.size()-1,l=0,r=a[0].size()-1;
    while (t<=b&&l<=r) {
        for (int j=l;j<=r;++j) ans.push_back(a[t][j]); ++t;
        for (int i=t;i<=b;++i) ans.push_back(a[i][r]); --r;
        if (t<=b) { for (int j=r;j>=l;--j) ans.push_back(a[b][j]); --b; }
        if (l<=r) { for (int i=b;i>=t;--i) ans.push_back(a[i][l]); ++l; }
    }
    return ans;
}
```

### 48
```cpp
void rotate(vector<vector<int>>& a) {
    int n=a.size();
    for (int i=0;i<n;++i) for (int j=i+1;j<n;++j) swap(a[i][j],a[j][i]);
    for (auto& row:a) reverse(row.begin(),row.end());
}
```
