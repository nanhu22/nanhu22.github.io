/* Hot100 correctness/readability audit v8
 * - fixes requirement-violating default solutions
 * - removes unsafe code-golf formatting
 * - keeps explanation / memory / code on the same default method
 */

const V8_FIXES = {
  '41': {
    name: '原地换位：把值 x 放到下标 x - 1',
    tradeoff: '这题明确要求 O(n) 时间和 O(1) 额外空间，因此不能把 set 作为正式答案。原地换位虽然比 set 多一步理解，但满足题目要求，而且每个数只会被搬到自己的目标位置。',
    advanced: '不需要再背第二套。也可以用“符号标记”做到 O(1) 空间，但原地换位更容易检查。',
    mantra: '值 x 应该回到位置 x-1；最后找第一个没归位的位置',
    steps: [
      '只处理 1 到 n 范围内的值；如果 nums[i] 应该去别的位置，就把它交换到 nums[i]-1',
      '不断交换，直到当前位置的值越界，或目标位置已经是同一个值',
      '最后从左到右找第一个 nums[i] != i+1；答案就是 i+1'
    ],
    invariant: '完成换位后，只要数字 x 存在，它就会尽量出现在下标 x-1；因此第一个位置和值对不上的地方就是最小缺失正数。',
    complexity: 'O(n) 时间 / O(1) 额外空间',
    pitfall: '交换条件必须包含 nums[nums[i]-1] != nums[i]，否则重复值会造成死循环；只处理 1..n，其他值无需归位。',
    oral: '我把数组本身当成哈希表。值 x 如果在 1..n 之间，就应该放到下标 x-1。通过原地交换把能归位的数字都放回去，最后扫描第一个 nums[i] 不等于 i+1 的位置即可。每个数字只会被交换到目标位置有限次，所以总时间 O(n)，额外空间 O(1)。',
    py: `def firstMissingPositive(nums):
    n = len(nums)

    for i in range(n):
        # 当前位置的值如果属于 1..n，就应该去 value - 1 这个位置。
        while 1 <= nums[i] <= n:
            correct_index = nums[i] - 1

            # 目标位置已经放着同样的值，说明继续交换没有意义。
            if nums[correct_index] == nums[i]:
                break

            nums[i], nums[correct_index] = nums[correct_index], nums[i]

    for i in range(n):
        expected_value = i + 1
        if nums[i] != expected_value:
            return expected_value

    return n + 1`,
    cpp: `int firstMissingPositive(vector<int>& nums) {
    int n = static_cast<int>(nums.size());

    for (int i = 0; i < n; ++i) {
        while (nums[i] >= 1 && nums[i] <= n) {
            int correctIndex = nums[i] - 1;

            if (nums[correctIndex] == nums[i]) {
                break;
            }

            swap(nums[i], nums[correctIndex]);
        }
    }

    for (int i = 0; i < n; ++i) {
        int expectedValue = i + 1;
        if (nums[i] != expectedValue) {
            return expectedValue;
        }
    }

    return n + 1;
}`
  },
  '4': {
    name: '在较短数组上二分切分位置',
    tradeoff: '这题题面明确要求 O(log(m+n))，所以“先完整合并再取中位数”只能作为理解中位数的朴素思路，不能作为正式提交。正式答案必须用二分 partition。',
    advanced: '当前默认已经是满足复杂度要求的标准解法。第一次学习只需要记住“左右两边数量平衡 + 左边最大不超过右边最小”。',
    mantra: '短数组切一刀，另一刀由总长度决定；直到左边都不大于右边',
    steps: [
      '始终让 nums1 是较短数组，在 nums1 上二分切分位置 i',
      '根据左半部分总元素个数，直接算出 nums2 的切分位置 j',
      '检查 maxLeft1 <= minRight2 且 maxLeft2 <= minRight1；满足时根据奇偶返回中位数'
    ],
    invariant: '合法切分时，左右两边元素数量满足中位数定义，并且左半所有元素都不大于右半所有元素。',
    complexity: 'O(log(min(m,n))) 时间 / O(1) 空间',
    pitfall: '必须在较短数组上二分；切在数组边界时要用 ±∞ 哨兵；偶数长度时相加最好先转 double/long long，避免整数溢出。',
    oral: '我不真正合并两个数组，而是在较短数组上二分一个切分位置。另一个数组的切分位置由左半总元素个数直接确定。只要两边都满足“左边最大值 <= 右边最小值”，这个 partition 就是正确的；奇数取左侧最大值，偶数取左侧最大与右侧最小的平均值。',
    py: `def findMedianSortedArrays(nums1, nums2):
    # 始终在更短的数组上二分，这样切分位置一定更容易控制。
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m = len(nums1)
    n = len(nums2)

    left = 0
    right = m

    while left <= right:
        cut1 = (left + right) // 2
        cut2 = (m + n + 1) // 2 - cut1

        left1 = nums1[cut1 - 1] if cut1 > 0 else float('-inf')
        right1 = nums1[cut1] if cut1 < m else float('inf')

        left2 = nums2[cut2 - 1] if cut2 > 0 else float('-inf')
        right2 = nums2[cut2] if cut2 < n else float('inf')

        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 1:
                return max(left1, left2)

            left_max = max(left1, left2)
            right_min = min(right1, right2)
            return (left_max + right_min) / 2.0

        if left1 > right2:
            right = cut1 - 1
        else:
            left = cut1 + 1

    raise ValueError("输入数组必须有序")`,
    cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) {
        return findMedianSortedArrays(nums2, nums1);
    }

    int m = static_cast<int>(nums1.size());
    int n = static_cast<int>(nums2.size());

    int left = 0;
    int right = m;

    while (left <= right) {
        int cut1 = left + (right - left) / 2;
        int cut2 = (m + n + 1) / 2 - cut1;

        int left1 = (cut1 == 0) ? INT_MIN : nums1[cut1 - 1];
        int right1 = (cut1 == m) ? INT_MAX : nums1[cut1];

        int left2 = (cut2 == 0) ? INT_MIN : nums2[cut2 - 1];
        int right2 = (cut2 == n) ? INT_MAX : nums2[cut2];

        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 == 1) {
                return static_cast<double>(max(left1, left2));
            }

            long long leftMax = max(left1, left2);
            long long rightMin = min(right1, right2);
            return (leftMax + rightMin) / 2.0;
        }

        if (left1 > right2) {
            right = cut1 - 1;
        } else {
            left = cut1 + 1;
        }
    }

    throw invalid_argument("input arrays must be sorted");
}`
  },
  '287': {
    name: '在值域上二分 + 计数',
    tradeoff: '题目要求不能修改数组且只能用 O(1) 额外空间，因此 set 不是合规答案。为了比 Floyd 环入口更容易理解，默认用“值域二分 + 鸽巢原理”：时间 O(n log n)，空间 O(1)。',
    advanced: '熟练后再学 Floyd，把时间优化到 O(n)；Floyd 更快，但函数图/环入口的证明更抽象。',
    mantra: '不二分下标，二分“答案值”；左半数字太多，重复数就在左半',
    steps: [
      '答案一定在 1..n 中，对这个值域做二分，取 mid',
      '统计数组中 <= mid 的元素个数 count',
      '如果 count > mid，说明 1..mid 里塞了过多元素，重复数在左半；否则在右半'
    ],
    invariant: '区间 1..mid 只有 mid 个不同取值槽位；如果实际有超过 mid 个元素落在这里，根据鸽巢原理，重复值一定在这个区间。',
    complexity: 'O(n log n) 时间 / O(1) 额外空间',
    pitfall: '二分的是“值域”而不是数组下标；比较条件是 count > mid；这种方法不修改 nums，也不需要额外集合。',
    oral: '因为值都在 1..n，我对可能的答案值做二分。每次统计数组里有多少数小于等于 mid。如果数量超过 mid，说明 1..mid 这些槽位装了过多元素，根据鸽巢原理重复数一定在左半，否则去右半。这样不修改数组，额外空间 O(1)。',
    py: `def findDuplicate(nums):
    left = 1
    right = len(nums) - 1

    while left < right:
        mid = (left + right) // 2

        count = 0
        for value in nums:
            if value <= mid:
                count += 1

        if count > mid:
            right = mid
        else:
            left = mid + 1

    return left`,
    cpp: `int findDuplicate(vector<int>& nums) {
    int left = 1;
    int right = static_cast<int>(nums.size()) - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;

        int count = 0;
        for (int value : nums) {
            if (value <= mid) {
                ++count;
            }
        }

        if (count > mid) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}`
  },
  '148': {
    name: '链表归并排序',
    tradeoff: '“把值复制到数组排序再写回”虽然直观，但没有体现链表题本身的结构，也用了 O(n) 额外数组。标准面试答案是归并排序：快慢指针切半 + 递归排序 + 合并。',
    advanced: '这已经是链表排序最常规的标准方案。若严格讨论 O(1) 额外空间，可以进一步写自底向上的迭代归并。',
    mantra: '中点切两半，两边各自排，再像合并链表一样合回来',
    steps: [
      '用快慢指针找到中点，并把链表从中间断开',
      '递归地排序左半和右半',
      '用“合并两个有序链表”的方法把两半合并'
    ],
    invariant: '递归返回时左右两条链表都已经有序；合并步骤始终把两个有序链表当前较小的节点接到结果尾部，因此结果仍有序。',
    complexity: 'O(n log n) 时间 / O(log n) 递归栈空间',
    pitfall: '切半后必须断链，否则递归不会缩小；合并时最后别忘了接上剩余链表；快指针从 head.next 开始更容易得到左中点。',
    oral: '链表不适合随机访问，所以归并排序比快速排序更自然。我先用快慢指针把链表切成两半，递归排序左右两半，再用合并两个有序链表的过程合回来。每一层总共处理 n 个节点，一共 log n 层，所以 O(n log n)。',
    py: `def sortList(head):
    if head is None or head.next is None:
        return head

    # 1. 找到左半部分的最后一个节点。
    slow = head
    fast = head.next

    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next

    right_head = slow.next
    slow.next = None

    # 2. 分别排序左右两半。
    left_sorted = sortList(head)
    right_sorted = sortList(right_head)

    # 3. 合并两个已经有序的链表。
    dummy = ListNode(0)
    tail = dummy

    left = left_sorted
    right = right_sorted

    while left is not None and right is not None:
        if left.val <= right.val:
            tail.next = left
            left = left.next
        else:
            tail.next = right
            right = right.next

        tail = tail.next

    if left is not None:
        tail.next = left
    else:
        tail.next = right

    return dummy.next`,
    cpp: `ListNode* sortList(ListNode* head) {
    if (head == nullptr || head->next == nullptr) {
        return head;
    }

    ListNode* slow = head;
    ListNode* fast = head->next;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }

    ListNode* rightHead = slow->next;
    slow->next = nullptr;

    ListNode* leftSorted = sortList(head);
    ListNode* rightSorted = sortList(rightHead);

    ListNode dummy(0);
    ListNode* tail = &dummy;

    ListNode* left = leftSorted;
    ListNode* right = rightSorted;

    while (left != nullptr && right != nullptr) {
        if (left->val <= right->val) {
            tail->next = left;
            left = left->next;
        } else {
            tail->next = right;
            right = right->next;
        }

        tail = tail->next;
    }

    tail->next = (left != nullptr) ? left : right;
    return dummy.next;
}`
  }
};

Object.assign(V6_OVERRIDES, V8_FIXES);

for (const [id, fix] of Object.entries(V8_FIXES)) {
  V6_REGULAR_META[id] = {
    mantra: fix.mantra,
    steps: fix.steps,
    invariant: fix.invariant,
    complexity: fix.complexity,
    ask: [
      '这套默认方法为什么满足题目约束？',
      '三步法里最容易写错的是哪一步？',
      '如果要进一步优化，还有什么方法？'
    ]
  };
}

const V8_READABLE_STRUCTURES = {
  '155': {
    py: `class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, value):
        if not self.stack:
            current_min = value
        else:
            current_min = min(value, self.stack[-1][1])

        self.stack.append((value, current_min))

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1][0]

    def getMin(self):
        return self.stack[-1][1]`,
    cpp: `class MinStack {
private:
    vector<pair<int, int>> stackData;

public:
    MinStack() = default;

    void push(int value) {
        int currentMin = value;
        if (!stackData.empty()) {
            currentMin = min(value, stackData.back().second);
        }

        stackData.push_back({value, currentMin});
    }

    void pop() {
        stackData.pop_back();
    }

    int top() {
        return stackData.back().first;
    }

    int getMin() {
        return stackData.back().second;
    }
};`
  },
  '208': {
    py: `class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def insert(self, word):
        node = self

        for char in word:
            if char not in node.children:
                node.children[char] = Trie()
            node = node.children[char]

        node.is_end = True

    def _walk(self, text):
        node = self

        for char in text:
            if char not in node.children:
                return None
            node = node.children[char]

        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._walk(prefix) is not None`,
    cpp: `class Trie {
private:
    struct Node {
        array<Node*, 26> children{};
        bool isEnd = false;
    };

    Node* root;

    Node* walk(const string& text) {
        Node* node = root;

        for (char ch : text) {
            int index = ch - 'a';

            if (node->children[index] == nullptr) {
                return nullptr;
            }

            node = node->children[index];
        }

        return node;
    }

public:
    Trie() {
        root = new Node();
    }

    void insert(string word) {
        Node* node = root;

        for (char ch : word) {
            int index = ch - 'a';

            if (node->children[index] == nullptr) {
                node->children[index] = new Node();
            }

            node = node->children[index];
        }

        node->isEnd = true;
    }

    bool search(string word) {
        Node* node = walk(word);
        return node != nullptr && node->isEnd;
    }

    bool startsWith(string prefix) {
        return walk(prefix) != nullptr;
    }
};`
  },
  '23': {
    cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto compare = [](ListNode* left, ListNode* right) {
        return left->val > right->val;
    };

    priority_queue<
        ListNode*,
        vector<ListNode*>,
        decltype(compare)
    > minHeap(compare);

    for (ListNode* node : lists) {
        if (node != nullptr) {
            minHeap.push(node);
        }
    }

    ListNode dummy(0);
    ListNode* tail = &dummy;

    while (!minHeap.empty()) {
        ListNode* smallest = minHeap.top();
        minHeap.pop();

        tail->next = smallest;
        tail = tail->next;

        if (smallest->next != nullptr) {
            minHeap.push(smallest->next);
        }
    }

    return dummy.next;
}`
  },
  '295': {
    py: `import heapq

class MedianFinder:
    def __init__(self):
        # small 保存较小的一半；用负数模拟最大堆。
        self.small = []
        # large 保存较大的一半；正常最小堆。
        self.large = []

    def addNum(self, num):
        # 先放进 small。
        heapq.heappush(self.small, -num)

        # 把 small 中最大的数移动到 large，
        # 保证 small 中所有数 <= large 中所有数。
        moved = -heapq.heappop(self.small)
        heapq.heappush(self.large, moved)

        # 让 small 的数量与 large 相同，或多 1 个。
        if len(self.large) > len(self.small):
            moved_back = heapq.heappop(self.large)
            heapq.heappush(self.small, -moved_back)

    def findMedian(self):
        if len(self.small) > len(self.large):
            return float(-self.small[0])

        left_middle = -self.small[0]
        right_middle = self.large[0]
        return (left_middle + right_middle) / 2.0`,
    cpp: `class MedianFinder {
private:
    priority_queue<int> small;
    priority_queue<int, vector<int>, greater<int>> large;

public:
    MedianFinder() = default;

    void addNum(int num) {
        small.push(num);

        large.push(small.top());
        small.pop();

        if (large.size() > small.size()) {
            small.push(large.top());
            large.pop();
        }
    }

    double findMedian() {
        if (small.size() > large.size()) {
            return static_cast<double>(small.top());
        }

        long long leftMiddle = small.top();
        long long rightMiddle = large.top();
        return (leftMiddle + rightMiddle) / 2.0;
    }
};`
  },
  '146': {
    py: `class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.nodes = {}

        # head.next 是最近使用的节点；
        # tail.prev 是最久未使用的节点。
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        previous_node = node.prev
        next_node = node.next

        previous_node.next = next_node
        next_node.prev = previous_node

    def _add_to_front(self, node):
        first = self.head.next

        node.prev = self.head
        node.next = first

        self.head.next = node
        first.prev = node

    def get(self, key):
        if key not in self.nodes:
            return -1

        node = self.nodes[key]
        self._remove(node)
        self._add_to_front(node)

        return node.value

    def put(self, key, value):
        if key in self.nodes:
            node = self.nodes[key]
            node.value = value

            self._remove(node)
            self._add_to_front(node)
            return

        node = Node(key, value)
        self.nodes[key] = node
        self._add_to_front(node)

        if len(self.nodes) > self.capacity:
            least_recent = self.tail.prev
            self._remove(least_recent)
            del self.nodes[least_recent.key]`
  }
};


V8_READABLE_STRUCTURES['131'] = {
  py: `def partition(s):
    answer = []
    current_parts = []

    def is_palindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1

        return True

    def backtrack(start):
        if start == len(s):
            answer.append(current_parts[:])
            return

        for end in range(start, len(s)):
            if not is_palindrome(start, end):
                continue

            current_parts.append(s[start:end + 1])
            backtrack(end + 1)
            current_parts.pop()

    backtrack(0)
    return answer`,
  cpp: `vector<vector<string>> partition(string s) {
    vector<vector<string>> answer;
    vector<string> currentParts;

    auto isPalindrome = [&](int left, int right) {
        while (left < right) {
            if (s[left] != s[right]) {
                return false;
            }

            ++left;
            --right;
        }

        return true;
    };

    function<void(int)> backtrack = [&](int start) {
        if (start == static_cast<int>(s.size())) {
            answer.push_back(currentParts);
            return;
        }

        for (int end = start; end < static_cast<int>(s.size()); ++end) {
            if (!isPalindrome(start, end)) {
                continue;
            }

            currentParts.push_back(s.substr(start, end - start + 1));
            backtrack(end + 1);
            currentParts.pop_back();
        }
    };

    backtrack(0);
    return answer;
}`
};

V8_READABLE_STRUCTURES['5'] = {
  py: `def longestPalindrome(s):
    if not s:
        return ""

    best_start = 0
    best_length = 1

    def expand(left, right):
        nonlocal best_start, best_length

        while (
            left >= 0
            and right < len(s)
            and s[left] == s[right]
        ):
            current_length = right - left + 1

            if current_length > best_length:
                best_start = left
                best_length = current_length

            left -= 1
            right += 1

    for center in range(len(s)):
        # 奇数长度回文：中心是一个字符。
        expand(center, center)

        # 偶数长度回文：中心在两个字符之间。
        expand(center, center + 1)

    return s[best_start:best_start + best_length]`,
  cpp: `string longestPalindrome(string s) {
    if (s.empty()) {
        return "";
    }

    int bestStart = 0;
    int bestLength = 1;

    auto expand = [&](int left, int right) {
        while (
            left >= 0 &&
            right < static_cast<int>(s.size()) &&
            s[left] == s[right]
        ) {
            int currentLength = right - left + 1;

            if (currentLength > bestLength) {
                bestStart = left;
                bestLength = currentLength;
            }

            --left;
            ++right;
        }
    };

    for (int center = 0; center < static_cast<int>(s.size()); ++center) {
        expand(center, center);
        expand(center, center + 1);
    }

    return s.substr(bestStart, bestLength);
}`
};

function V8_splitTopLevel(text, delimiter = ';', keepDelimiter = false) {
  const parts = [];
  let current = '';
  let paren = 0;
  let bracket = 0;
  let brace = 0;
  let single = false;
  let double = false;
  let escaped = false;

  for (const char of String(text)) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      current += char;
      escaped = true;
      continue;
    }

    if (!double && char === "'") {
      single = !single;
      current += char;
      continue;
    }

    if (!single && char === '"') {
      double = !double;
      current += char;
      continue;
    }

    if (single || double) {
      current += char;
      continue;
    }

    if (char === '(') paren += 1;
    else if (char === ')') paren -= 1;
    else if (char === '[') bracket += 1;
    else if (char === ']') bracket -= 1;
    else if (char === '{') brace += 1;
    else if (char === '}') brace -= 1;

    if (
      char === delimiter &&
      paren === 0 &&
      bracket === 0 &&
      brace === 0
    ) {
      if (keepDelimiter) {
        current += char;
      }
      if (current.trim()) parts.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function V8_findTopLevelColon(text) {
  let paren = 0;
  let bracket = 0;
  let brace = 0;
  let single = false;
  let double = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (!double && char === "'") {
      single = !single;
      continue;
    }

    if (!single && char === '"') {
      double = !double;
      continue;
    }

    if (single || double) continue;

    if (char === '(') paren += 1;
    else if (char === ')') paren -= 1;
    else if (char === '[') bracket += 1;
    else if (char === ']') bracket -= 1;
    else if (char === '{') brace += 1;
    else if (char === '}') brace -= 1;
    else if (
      char === ':' &&
      paren === 0 &&
      bracket === 0 &&
      brace === 0
    ) {
      return i;
    }
  }

  return -1;
}

function V8_formatPython(code) {
  const output = [];

  function formatLine(line, forcedIndent = null) {
    const originalIndent = (line.match(/^\s*/) || [''])[0];
    const indent = forcedIndent === null ? originalIndent : forcedIndent;
    const body = line.slice(originalIndent.length).trim();

    if (!body) {
      output.push('');
      return;
    }

    const isCompound = /^(async\s+def|def|if|elif|else|for|while)\b/.test(body);
    const colon = isCompound ? V8_findTopLevelColon(body) : -1;

    if (colon >= 0) {
      const header = body.slice(0, colon + 1).trim();
      const suite = body.slice(colon + 1).trim();

      if (suite) {
        output.push(indent + header);

        const statements = V8_splitTopLevel(suite);
        for (const statement of statements) {
          formatLine(statement, indent + '    ');
        }
        return;
      }
    }

    const statements = V8_splitTopLevel(body);
    if (statements.length > 1) {
      for (const statement of statements) {
        output.push(indent + statement);
      }
      return;
    }

    output.push(indent + body);
  }

  for (const line of String(code || '').split('\n')) {
    formatLine(line);
  }

  return output.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function V8_formatCpp(code) {
  const output = [];

  function emitStatement(statement, indent) {
    const text = statement.trim();
    if (!text) return;

    // Expand: if (...) action;
    let match = text.match(/^if\s*(\(.+\))\s+([^{}].*;)$/);
    if (match) {
      output.push(indent + 'if ' + match[1] + ' {');
      output.push(indent + '    ' + match[2]);
      output.push(indent + '}');
      return;
    }

    // Expand: else if (...) action;
    match = text.match(/^else\s+if\s*(\(.+\))\s+([^{}].*;)$/);
    if (match) {
      output.push(indent + 'else if ' + match[1] + ' {');
      output.push(indent + '    ' + match[2]);
      output.push(indent + '}');
      return;
    }

    // Expand: else action;
    match = text.match(/^else\s+([^{}].*;)$/);
    if (match) {
      output.push(indent + 'else {');
      output.push(indent + '    ' + match[1]);
      output.push(indent + '}');
      return;
    }

    // Expand simple for/while bodies that are written on the same line.
    match = text.match(/^(for|while)\s*(\(.+\))\s+([^{}].*;)$/);
    if (match) {
      output.push(indent + match[1] + ' ' + match[2] + ' {');
      output.push(indent + '    ' + match[3]);
      output.push(indent + '}');
      return;
    }

    // Expand a one-line control block: if/for/while (...) { a; b; }
    match = text.match(/^(if|for|while)\s*(\(.+\))\s*\{\s*([\s\S]*)\s*\}$/);
    if (match) {
      output.push(indent + match[1] + ' ' + match[2] + ' {');
      const inner = V8_splitTopLevel(match[3], ';', true);
      for (const piece of inner) {
        emitStatement(piece, indent + '    ');
      }
      output.push(indent + '}');
      return;
    }

    // Expand a normal one-line function/method body.
    // Lambda expressions are intentionally excluded and handled by explicit readable overrides where needed.
    match = text.match(/^(.+\))\s*\{\s*([\s\S]+)\s*\}$/);
    if (match && !text.includes('[](') && !text.includes('[&](')) {
      output.push(indent + match[1] + ' {');
      const inner = V8_splitTopLevel(match[2], ';', true);
      for (const piece of inner) {
        emitStatement(piece, indent + '    ');
      }
      output.push(indent + '}');
      return;
    }

    output.push(indent + text);
  }

  for (const originalLine of String(code || '').split('\n')) {
    const indent = (originalLine.match(/^\s*/) || [''])[0];
    const body = originalLine.slice(indent.length).trim();

    if (!body) {
      output.push('');
      continue;
    }

    // Important: split top-level statements FIRST.
    // This preserves if/else relationships and avoids swallowing everything after the first if.
    const statements = V8_splitTopLevel(body, ';', true);

    for (const statement of statements) {
      emitStatement(statement, indent);
    }
  }

  return output.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function V8_defaultCode(item, lang) {
  const structured = V8_READABLE_STRUCTURES[item.id];

  if (structured && structured[lang]) {
    return structured[lang];
  }

  const override = V6_OVERRIDES[item.id];
  const raw = override
    ? (lang === 'py' ? override.py : override.cpp)
    : (lang === 'py' ? item.py : CPP[item.id]);

  return lang === 'py'
    ? V8_formatPython(raw)
    : V8_formatCpp(raw);
}

function V8_profile(item) {
  const memory = V5_memory(item);
  const method = V6_methodInfo(item);
  const fix = V8_FIXES[item.id];

  if (fix) {
    return {
      core: `默认使用「${fix.name}」。${fix.mantra}`,
      oral: fix.oral,
      pitfall: fix.pitfall
    };
  }

  if (V6_OVERRIDES[item.id]) {
    return {
      core: `默认使用「${method.name}」。${memory.mantra}`,
      oral: `我先采用「${method.name}」。${memory.steps.join('；')}。这套写法的复杂度是 ${memory.complexity}。`,
      pitfall: `当前默认方法与进阶方法不同。复习时先按「${method.name}」理解和默写，不要把进阶模板中的边界条件混进默认代码。`
    };
  }

  return {
    core: item.core,
    oral: item.oral,
    pitfall: item.pitfall
  };
}


function V8_commentBlock(item, lang) {
  if (!V7_isDeep(item)) return '';

  const guide = V7_guide(item);
  const profile = V8_profile(item);
  const prefix = lang === 'py' ? '# ' : '// ';

  const lines = [
    '================ 中等/困难题阅读指南 ================',
    `题目先用人话理解：${profile.core}`,
    `朴素想法：${guide.naive}`,
    `为什么转到当前解法：${guide.bridge}`,
    '',
    '关键变量：',
    ...guide.variables.map(([name, meaning]) => `- ${name}: ${meaning}`),
    '',
    '阅读代码顺序：',
    ...guide.codeRead.map((text, index) => `${index + 1}. ${text}`),
    '',
    `最容易错：${profile.pitfall}`,
    `卡住提示：${guide.stuck}`,
    '======================================================'
  ];

  return lines.map((line) => prefix + line).join('\n');
}

function V8_header(item, lang) {
  const memory = V5_memory(item);
  const method = V6_methodInfo(item);
  const profile = V8_profile(item);
  const prefix = lang === 'py' ? '# ' : '// ';

  const lines = [
    `题目：#${item.id} ${item.title}`,
    `默认方法：${method.name}`,
    `为什么用它：${method.tradeoff}`,
    `核心理解：${profile.core}`,
    `口诀：${memory.mantra}`,
    `复杂度：${memory.complexity}`,
    '',
    '三步恢复：',
    ...memory.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    `最容易错：${profile.pitfall}`
  ];

  return lines.map((line) => prefix + line).join('\n');
}

V5_studyPython = function V8_studyPython(item) {
  const code = V8_defaultCode(item, 'py');
  const deepGuide = V7_isDeep(item) ? V8_commentBlock(item, 'py') + '\n\n' : '';

  return (
    deepGuide +
    V8_header(item, 'py') +
    '\n\n' +
    V5_pythonHelpers(code) +
    code
  ).trim();
};

V5_studyCpp = function V8_studyCpp(item) {
  const code = V8_defaultCode(item, 'cpp');
  const deepGuide = V7_isDeep(item) ? V8_commentBlock(item, 'cpp') + '\n\n' : '';

  return (
    deepGuide +
    V8_header(item, 'cpp') +
    '\n\n' +
    V5_cppHelpers(code) +
    code
  ).trim();
};

function V8_explanationHTML(item) {
  const memory = V5_memory(item);
  const method = V6_methodInfo(item);
  const profile = V8_profile(item);

  if (!V7_isDeep(item)) {
    return `<div class="solution-story v8-story">
      <section class="v8-audit-note"><b>当前默认答案：</b>${escapeHTML(method.name)}<p>${escapeHTML(method.tradeoff)}</p></section>
      <section><h4>1. 先说清楚题目在做什么</h4><p>${escapeHTML(profile.core)}</p></section>
      <section><h4>2. 三步解法</h4><ol>${memory.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol></section>
      <section><h4>3. 为什么正确</h4><p>${escapeHTML(memory.invariant)}</p></section>
      <section><h4>4. 易错点</h4><div class="pitfall-card">${escapeHTML(profile.pitfall)}</div></section>
      <section><h4>5. 面试怎么说</h4><blockquote>${escapeHTML(profile.oral)}</blockquote><p><b>复杂度：</b>${escapeHTML(memory.complexity)}</p></section>
    </div>`;
  }

  const guide = V7_guide(item);

  return `<div class="v7-deep-story v8-story">
    <section class="v7-slow-banner"><div><span>${item.diff === '困难' ? '困难题慢讲' : '中等题慢讲'}</span><strong>讲解、代码、复杂度已经统一到同一套默认方法</strong></div><p>不再把“常规版代码”和“竞赛版口述”混在一起。</p></section>
    <section><h4>1. 题目到底在问什么？</h4><p>${escapeHTML(profile.core)}</p></section>
    <section><h4>2. 第一反应：朴素方法怎么想？</h4><p>${escapeHTML(guide.naive)}</p></section>
    <section><h4>3. 为什么过渡到当前方法？</h4><p>${escapeHTML(guide.bridge)}</p><div class="v7-method-card"><span>当前默认方法</span><strong>${escapeHTML(method.name)}</strong><small>${escapeHTML(method.tradeoff)}</small></div></section>
    <section><h4>4. 一步一步写</h4><ol class="v7-numbered">${memory.steps.map((step, index) => `<li><span>${index + 1}</span><p>${escapeHTML(step)}</p></li>`).join('')}</ol></section>
    <section><h4>5. 变量分别是什么意思？</h4>${V7_variableTableHTML(guide)}</section>
    <section><h4>6. 小例子手算</h4><ol class="v7-walkthrough">${guide.example.map((line) => `<li>${escapeHTML(line)}</li>`).join('')}</ol></section>
    <section><h4>7. 代码阅读顺序</h4><ol class="v7-code-read">${guide.codeRead.map((line) => `<li>${escapeHTML(line)}</li>`).join('')}</ol></section>
    <section><h4>8. 为什么正确？</h4><p><b>关键不变量：</b>${escapeHTML(memory.invariant)}</p><p>${escapeHTML(profile.oral)}</p></section>
    <section><h4>9. 易错点与边界</h4><div class="pitfall-card">${escapeHTML(profile.pitfall)}</div><ul class="v7-checklist"><li>空输入 / 单元素是否处理？</li><li>循环左右边界是否一致？</li><li>答案更新和指针移动的先后顺序是否正确？</li><li>回溯 / visited / 去重状态是否在正确时机恢复？</li></ul></section>
    <section><h4>10. 复杂度</h4><p><b>${escapeHTML(memory.complexity)}</b></p></section>
    <section class="v7-stuck"><h4>卡住时只看这一句</h4><p>${escapeHTML(guide.stuck)}</p></section>
  </div>`;
}

V5_explanationHTML = V8_explanationHTML;

function V8_advancedHTML(item) {
  const method = V6_methodInfo(item);
  const shouldShowOriginal = (
    V6_OVERRIDES[item.id] &&
    !['4', '41', '148'].includes(item.id)
  );

  let code = '';
  if (shouldShowOriginal) {
    const pythonAdvanced = V8_formatPython(item.py);
    const cppAdvanced = V8_formatCpp(CPP[item.id]);

    code = `<details class="raw-template v8-advanced-code">
      <summary>查看进阶方法的格式化代码</summary>
      <h4>Python</h4><pre><code>${escapeHTML(pythonAdvanced)}</code></pre>
      <h4>C++</h4><pre><code>${escapeHTML(cppAdvanced)}</code></pre>
    </details>`;
  }

  return `<div class="v6-advanced v8-advanced">
    <h4>进阶 / 优化</h4>
    <p>${escapeHTML(method.advanced)}</p>
    <p class="v8-soft">默认卡片不再显示未经整理的“一行速背代码”。需要学习第二套方法时，这里展示的代码也会先做安全格式化。</p>
    ${code}
  </div>`;
}

V5_answerDetailsHTML = function V8_answerDetailsHTML(item, record) {
  return `${V5_memoryDeckHTML(item)}
    <div class="tabs v5-tabs v8-tabs">
      <button type="button" class="tab-btn active" data-tab="explain">详细题解</button>
      <button type="button" class="tab-btn" data-tab="py">Python 可读版</button>
      <button type="button" class="tab-btn" data-tab="cpp">C++ 可读版</button>
      <button type="button" class="tab-btn" data-tab="advanced">进阶 / 优化</button>
      <button type="button" class="tab-btn" data-tab="links">关联 / 发散</button>
    </div>
    <div class="pane active" data-pane="explain">${V8_explanationHTML(item)}</div>
    <div class="pane" data-pane="py">${V5_codePane(item, 'py')}</div>
    <div class="pane" data-pane="cpp">${V5_codePane(item, 'cpp')}</div>
    <div class="pane" data-pane="advanced">${V8_advancedHTML(item)}</div>
    <div class="pane" data-pane="links"><div class="link-study"><p><b>Hot100 关联：</b>${escapeHTML(item.related)}</p><p><b>迁移发散：</b>${escapeHTML(item.expand)}</p><p><a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/">LeetCode 原题</a> · <a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/solutions/">题解聚合页</a></p></div></div>
    <div class="section-label">复习结果：以“能否独立写出当前默认方法”为准</div>
    <div class="outcomes"><button type="button" class="result-btn good" data-result="good">能独立写出 ✓</button><button type="button" class="result-btn fuzzy" data-result="fuzzy">思路会 / 实现卡 △</button><button type="button" class="result-btn bad" data-result="bad">还不会 ×</button></div>
    <div class="section-label">手动复习阶段</div>
    <div class="review">${[0, 1, 2, 3].map((stage) => `<button type="button" class="review-btn ${record.stage === stage ? 'active' : ''}" data-stage="${stage}">${stageLabel(stage)}</button>`).join('')}</div>`;
};

function V8_runtimeAudit() {
  if (!Array.isArray(DATA) || DATA.length !== 100) {
    return;
  }

  const suspicious = [];

  for (const item of DATA) {
    const pythonCode = V8_defaultCode(item, 'py');
    const cppCode = V8_defaultCode(item, 'cpp');

    if (/^\s*(def|if|for|while).*:\s*.+;.+$/m.test(pythonCode)) {
      suspicious.push(`#${item.id} Python`);
    }

    if (/\{[^\n{}]*;[^\n{}]*;[^\n{}]*\}/m.test(cppCode)) {
      suspicious.push(`#${item.id} C++`);
    }
  }

  if (suspicious.length) {
    console.warn('Hot100 v8 readability audit still found compact code:', suspicious);
  }
}

const V8_previousRender = render;
render = function V8_render() {
  V8_previousRender();
  V8_runtimeAudit();
};

if (typeof DATA !== 'undefined' && DATA.length) {
  render();
}
