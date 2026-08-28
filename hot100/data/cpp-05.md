# Hot100 C++ 最小模板 · 05

### 70
```cpp
int climbStairs(int n) {
    int a=1,b=1;while(n--){int c=a+b;a=b;b=c;}return a;
}
```

### 118
```cpp
vector<vector<int>> generate(int n) {
    vector<vector<int>> ans;
    for(int i=0;i<n;++i){vector<int> row(i+1,1);for(int j=1;j<i;++j)row[j]=ans.back()[j-1]+ans.back()[j];ans.push_back(move(row));}
    return ans;
}
```

### 198
```cpp
int rob(vector<int>& a) {
    int p2=0,p1=0;for(int x:a){int cur=max(p1,p2+x);p2=p1;p1=cur;}return p1;
}
```

### 279
```cpp
int numSquares(int n) {
    vector<int> dp(n+1,1e9);dp[0]=0;
    for(int x=1;x<=n;++x)for(int j=1;j*j<=x;++j)dp[x]=min(dp[x],dp[x-j*j]+1);
    return dp[n];
}
```

### 322
```cpp
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount+1,amount+1);dp[0]=0;
    for(int x=1;x<=amount;++x)for(int c:coins)if(c<=x)dp[x]=min(dp[x],dp[x-c]+1);
    return dp[amount]>amount?-1:dp[amount];
}
```

### 139
```cpp
bool wordBreak(string s, vector<string>& words) {
    unordered_set<string> st(words.begin(),words.end());vector<char> dp(s.size()+1);dp[0]=1;
    for(int i=1;i<=s.size();++i)for(int j=0;j<i&&!dp[i];++j)if(dp[j]&&st.count(s.substr(j,i-j)))dp[i]=1;
    return dp.back();
}
```

### 300
```cpp
int lengthOfLIS(vector<int>& a) {
    vector<int> tails;
    for(int x:a){auto it=lower_bound(tails.begin(),tails.end(),x);if(it==tails.end())tails.push_back(x);else *it=x;}
    return tails.size();
}
```

### 152
```cpp
int maxProduct(vector<int>& a) {
    int hi=a[0],lo=a[0],ans=a[0];
    for(int i=1;i<a.size();++i){if(a[i]<0)swap(hi,lo);hi=max(a[i],hi*a[i]);lo=min(a[i],lo*a[i]);ans=max(ans,hi);}return ans;
}
```

### 416
```cpp
bool canPartition(vector<int>& a) {
    int s=accumulate(a.begin(),a.end(),0);if(s&1)return false;int t=s/2;vector<char> dp(t+1);dp[0]=1;
    for(int x:a)for(int j=t;j>=x;--j)dp[j]|=dp[j-x];return dp[t];
}
```

### 32
```cpp
int longestValidParentheses(string s) {
    vector<int> dp(s.size());int ans=0;
    for(int i=1;i<s.size();++i)if(s[i]==')'){int j=i-dp[i-1]-1;if(j>=0&&s[j]=='(')dp[i]=dp[i-1]+2+(j?dp[j-1]:0),ans=max(ans,dp[i]);}
    return ans;
}
```

### 62
```cpp
int uniquePaths(int m, int n) {
    vector<int> dp(n,1);for(int i=1;i<m;++i)for(int j=1;j<n;++j)dp[j]+=dp[j-1];return dp.back();
}
```

### 64
```cpp
int minPathSum(vector<vector<int>>& g) {
    int m=g.size(),n=g[0].size();vector<int> dp(n,INT_MAX);dp[0]=0;
    for(int i=0;i<m;++i)for(int j=0;j<n;++j)dp[j]=g[i][j]+min(dp[j],j?dp[j-1]:INT_MAX);return dp.back();
}
```

### 5
```cpp
string longestPalindrome(string s) {
    int bestL=0,best=0;
    auto ex=[&](int l,int r){while(l>=0&&r<s.size()&&s[l]==s[r])--l,++r;if(r-l-1>best)best=r-l-1,bestL=l+1;};
    for(int i=0;i<s.size();++i)ex(i,i),ex(i,i+1);return s.substr(bestL,best);
}
```

### 1143
```cpp
int longestCommonSubsequence(string a, string b) {
    vector<int> dp(b.size()+1);
    for(char x:a){int pre=0;for(int j=1;j<=b.size();++j){int old=dp[j];dp[j]=x==b[j-1]?pre+1:max(dp[j],dp[j-1]);pre=old;}}
    return dp.back();
}
```

### 72
```cpp
int minDistance(string a, string b) {
    vector<int> dp(b.size()+1);iota(dp.begin(),dp.end(),0);
    for(int i=1;i<=a.size();++i){vector<int> nd(b.size()+1);nd[0]=i;for(int j=1;j<=b.size();++j)nd[j]=a[i-1]==b[j-1]?dp[j-1]:1+min({dp[j],nd[j-1],dp[j-1]});dp.swap(nd);}return dp.back();
}
```

### 136
```cpp
int singleNumber(vector<int>& a) {
    int x=0;for(int v:a)x^=v;return x;
}
```

### 169
```cpp
int majorityElement(vector<int>& a) {
    int cand=0,c=0;for(int x:a){if(!c)cand=x;c+=x==cand?1:-1;}return cand;
}
```

### 75
```cpp
void sortColors(vector<int>& a) {
    int l=0,i=0,r=a.size()-1;
    while(i<=r){if(a[i]==0)swap(a[l++],a[i++]);else if(a[i]==2)swap(a[i],a[r--]);else ++i;}
}
```

### 31
```cpp
void nextPermutation(vector<int>& a) {
    int i=a.size()-2;while(i>=0&&a[i]>=a[i+1])--i;
    if(i>=0){int j=a.size()-1;while(a[j]<=a[i])--j;swap(a[i],a[j]);}
    reverse(a.begin()+i+1,a.end());
}
```

### 287
```cpp
int findDuplicate(vector<int>& a) {
    int s=a[0],f=a[0];do{s=a[s];f=a[a[f]];}while(s!=f);
    s=a[0];while(s!=f)s=a[s],f=a[f];return s;
}
```
