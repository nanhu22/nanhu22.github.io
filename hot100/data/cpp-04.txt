# Hot100 C++ 最小模板 · 04

### 131
```cpp
vector<vector<string>> partition(string s) {
    vector<vector<string>> ans; vector<string> path;
    auto pal=[&](int l,int r){while(l<r)if(s[l++]!=s[r--])return false;return true;};
    function<void(int)> bt=[&](int i){if(i==s.size()){ans.push_back(path);return;}for(int j=i;j<s.size();++j)if(pal(i,j)){path.push_back(s.substr(i,j-i+1));bt(j+1);path.pop_back();}};
    bt(0); return ans;
}
```

### 51
```cpp
vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> ans; vector<string> b(n,string(n,'.')); vector<int> col(n),d1(2*n),d2(2*n);
    function<void(int)> bt=[&](int r){if(r==n){ans.push_back(b);return;}for(int c=0;c<n;++c)if(!col[c]&&!d1[r-c+n]&&!d2[r+c]){col[c]=d1[r-c+n]=d2[r+c]=1;b[r][c]='Q';bt(r+1);b[r][c]='.';col[c]=d1[r-c+n]=d2[r+c]=0;}};
    bt(0); return ans;
}
```

### 35
```cpp
int searchInsert(vector<int>& a, int t) {
    return lower_bound(a.begin(),a.end(),t)-a.begin();
}
```

### 74
```cpp
bool searchMatrix(vector<vector<int>>& a, int t) {
    int m=a.size(),n=a[0].size(),l=0,r=m*n-1;
    while(l<=r){int mid=l+(r-l)/2,x=a[mid/n][mid%n];if(x==t)return true;if(x<t)l=mid+1;else r=mid-1;}
    return false;
}
```

### 34
```cpp
vector<int> searchRange(vector<int>& a, int t) {
    auto l=lower_bound(a.begin(),a.end(),t),r=upper_bound(a.begin(),a.end(),t);
    if(l==a.end()||*l!=t)return {-1,-1};
    return {(int)(l-a.begin()),(int)(r-a.begin()-1)};
}
```

### 33
```cpp
int search(vector<int>& a, int t) {
    int l=0,r=a.size()-1;
    while(l<=r){int m=l+(r-l)/2;if(a[m]==t)return m;if(a[l]<=a[m]){if(a[l]<=t&&t<a[m])r=m-1;else l=m+1;}else{if(a[m]<t&&t<=a[r])l=m+1;else r=m-1;}}
    return -1;
}
```

### 153
```cpp
int findMin(vector<int>& a) {
    int l=0,r=a.size()-1;
    while(l<r){int m=l+(r-l)/2;if(a[m]>a[r])l=m+1;else r=m;}
    return a[l];
}
```

### 4
```cpp
double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
    if(A.size()>B.size())return findMedianSortedArrays(B,A);
    int m=A.size(),n=B.size(),l=0,r=m;
    while(l<=r){
        int i=(l+r)/2,j=(m+n+1)/2-i;
        int al=i?A[i-1]:INT_MIN,ar=i<m?A[i]:INT_MAX,bl=j?B[j-1]:INT_MIN,br=j<n?B[j]:INT_MAX;
        if(al<=br&&bl<=ar)return (m+n)%2?max(al,bl):(max(al,bl)+min(ar,br))/2.0;
        if(al>br)r=i-1;else l=i+1;
    }
    return 0;
}
```

### 20
```cpp
bool isValid(string s) {
    unordered_map<char,char> mp{{')','('},{']','['},{'}','{'}}; stack<char> st;
    for(char c:s){if(mp.count(c)){if(st.empty()||st.top()!=mp[c])return false;st.pop();}else st.push(c);}return st.empty();
}
```

### 155
```cpp
class MinStack {
    stack<pair<int,int>> st;
public:
    void push(int x){st.push({x,st.empty()?x:min(x,st.top().second)});}
    void pop(){st.pop();}
    int top(){return st.top().first;}
    int getMin(){return st.top().second;}
};
```

### 394
```cpp
string decodeString(string s) {
    stack<pair<string,int>> st; string cur; int num=0;
    for(char c:s){
        if(isdigit(c))num=num*10+c-'0';
        else if(c=='['){st.push({cur,num});cur="";num=0;}
        else if(c==']'){auto [pre,k]=st.top();st.pop();string t;while(k--)t+=cur;cur=pre+t;}
        else cur+=c;
    }
    return cur;
}
```

### 739
```cpp
vector<int> dailyTemperatures(vector<int>& t) {
    vector<int> ans(t.size()),st;
    for(int i=0;i<t.size();++i){while(!st.empty()&&t[st.back()]<t[i]){int j=st.back();st.pop_back();ans[j]=i-j;}st.push_back(i);}return ans;
}
```

### 84
```cpp
int largestRectangleArea(vector<int>& h) {
    vector<int> st; int ans=0; h.push_back(0);
    for(int i=0;i<h.size();++i){while(!st.empty()&&h[st.back()]>h[i]){int j=st.back();st.pop_back();int l=st.empty()?-1:st.back();ans=max(ans,h[j]*(i-l-1));}st.push_back(i);}h.pop_back();return ans;
}
```

### 215
```cpp
int findKthLargest(vector<int>& a, int k) {
    nth_element(a.begin(),a.end()-k,a.end()); return a[a.size()-k];
}
```

### 347
```cpp
vector<int> topKFrequent(vector<int>& a, int k) {
    unordered_map<int,int> cnt;for(int x:a)++cnt[x];
    priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int,int>>> pq;
    for(auto [x,c]:cnt){pq.push({c,x});if(pq.size()>k)pq.pop();}
    vector<int> ans;while(!pq.empty()){ans.push_back(pq.top().second);pq.pop();}return ans;
}
```

### 295
```cpp
class MedianFinder {
    priority_queue<int> lo; priority_queue<int,vector<int>,greater<int>> hi;
public:
    void addNum(int x){lo.push(x);hi.push(lo.top());lo.pop();if(hi.size()>lo.size()){lo.push(hi.top());hi.pop();}}
    double findMedian(){return lo.size()>hi.size()?lo.top():(lo.top()+hi.top())/2.0;}
};
```

### 121
```cpp
int maxProfit(vector<int>& p) {
    int low=INT_MAX,ans=0;for(int x:p){low=min(low,x);ans=max(ans,x-low);}return ans;
}
```

### 55
```cpp
bool canJump(vector<int>& a) {
    int reach=0;for(int i=0;i<a.size();++i){if(i>reach)return false;reach=max(reach,i+a[i]);}return true;
}
```

### 45
```cpp
int jump(vector<int>& a) {
    int ans=0,end=0,far=0;for(int i=0;i+1<a.size();++i){far=max(far,i+a[i]);if(i==end)++ans,end=far;}return ans;
}
```

### 763
```cpp
vector<int> partitionLabels(string s) {
    vector<int> last(26);for(int i=0;i<s.size();++i)last[s[i]-'a']=i;
    vector<int> ans;int st=0,end=0;for(int i=0;i<s.size();++i){end=max(end,last[s[i]-'a']);if(i==end){ans.push_back(end-st+1);st=i+1;}}return ans;
}
```
