/* Hot100 Readable Solutions v6
 * Goal: prefer ordinary, interview-friendly solutions over code-golf or contest tricks.
 * v5 memory/review state remains untouched.
 */

const V6_OVERRIDES = {
  '49': {
    name: '排序字符串作为分组键',
    tradeoff: '比 26 维计数签名稍慢一些，但最直观；优先用于第一次学习和面试口述。',
    advanced: '进阶时再记“26 维频次数组作为 key”，可把单词排序的 O(k log k) 降到 O(k)。',
    py: `from collections import defaultdict

def groupAnagrams(strs):
    groups = defaultdict(list)

    for word in strs:
        # 异位词排序后一定得到同一个字符串。
        key = ''.join(sorted(word))
        groups[key].append(word)

    return list(groups.values())`,
    cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;

    for (const string& word : strs) {
        string key = word;
        sort(key.begin(), key.end());
        groups[key].push_back(word);
    }

    vector<vector<string>> answer;
    for (auto& entry : groups) {
        answer.push_back(entry.second);
    }
    return answer;
}`
  },
  '42': {
    name: '左右最大值数组',
    tradeoff: '使用 O(n) 额外空间换取最清晰的推导；比双指针更适合作为第一套解法。',
    advanced: '熟练后再学双指针，把额外空间从 O(n) 降到 O(1)。',
    py: `def trap(height):
    n = len(height)
    if n < 3:
        return 0

    left_max = [0] * n
    right_max = [0] * n

    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], height[i])

    right_max[n - 1] = height[n - 1]
    for i in range(n - 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])

    water = 0
    for i in range(n):
        water_level = min(left_max[i], right_max[i])
        water += water_level - height[i]

    return water`,
    cpp: `int trap(vector<int>& height) {
    int n = static_cast<int>(height.size());
    if (n < 3) {
        return 0;
    }

    vector<int> leftMax(n);
    vector<int> rightMax(n);

    leftMax[0] = height[0];
    for (int i = 1; i < n; ++i) {
        leftMax[i] = max(leftMax[i - 1], height[i]);
    }

    rightMax[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; --i) {
        rightMax[i] = max(rightMax[i + 1], height[i]);
    }

    int water = 0;
    for (int i = 0; i < n; ++i) {
        int waterLevel = min(leftMax[i], rightMax[i]);
        water += waterLevel - height[i];
    }
    return water;
}`
  },
  '239': {
    name: '优先队列（最大堆）+ 延迟删除',
    tradeoff: 'O(n log n) 不是最优，但思路比单调队列更直接：窗口里始终取最大值，并丢掉过期下标。',
    advanced: '进阶方法是单调队列 O(n)：队列只保留仍可能成为最大值的候选。',
    py: `import heapq

def maxSlidingWindow(nums, k):
    # Python 只有最小堆，所以存负数模拟最大堆。
    heap = []
    answer = []

    for right, value in enumerate(nums):
        heapq.heappush(heap, (-value, right))

        # 堆顶如果已经离开窗口，就不断弹出。
        window_left = right - k + 1
        while heap and heap[0][1] < window_left:
            heapq.heappop(heap)

        if right >= k - 1:
            answer.append(-heap[0][0])

    return answer`,
    cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    priority_queue<pair<int, int>> heap;
    vector<int> answer;

    for (int right = 0; right < static_cast<int>(nums.size()); ++right) {
        heap.push({nums[right], right});

        int windowLeft = right - k + 1;
        while (!heap.empty() && heap.top().second < windowLeft) {
            heap.pop();
        }

        if (right >= k - 1) {
            answer.push_back(heap.top().first);
        }
    }
    return answer;
}`
  },
  '41': {
    name: '哈希集合',
    tradeoff: '用 O(n) 空间换最直观的解法；先把所有正数放进 set，再从 1 开始找第一个缺失值。',
    advanced: '题目要求 O(1) 额外空间时，再学习“把值 x 放到索引 x-1”的原地下标哈希。',
    py: `def firstMissingPositive(nums):
    positive_numbers = set()

    for value in nums:
        if value > 0:
            positive_numbers.add(value)

    candidate = 1
    while candidate in positive_numbers:
        candidate += 1

    return candidate`,
    cpp: `int firstMissingPositive(vector<int>& nums) {
    unordered_set<int> positiveNumbers;

    for (int value : nums) {
        if (value > 0) {
            positiveNumbers.insert(value);
        }
    }

    int candidate = 1;
    while (positiveNumbers.count(candidate)) {
        ++candidate;
    }
    return candidate;
}`
  },
  '73': {
    name: '行标记 + 列标记数组',
    tradeoff: 'O(m+n) 额外空间，但没有“借第一行第一列当标记”的绕法，更容易一次写对。',
    advanced: '熟练后再学 O(1) 空间写法：复用第一行和第一列保存标记。',
    py: `def setZeroes(matrix):
    rows = len(matrix)
    cols = len(matrix[0])

    zero_rows = [False] * rows
    zero_cols = [False] * cols

    for row in range(rows):
        for col in range(cols):
            if matrix[row][col] == 0:
                zero_rows[row] = True
                zero_cols[col] = True

    for row in range(rows):
        for col in range(cols):
            if zero_rows[row] or zero_cols[col]:
                matrix[row][col] = 0`,
    cpp: `void setZeroes(vector<vector<int>>& matrix) {
    int rows = static_cast<int>(matrix.size());
    int cols = static_cast<int>(matrix[0].size());

    vector<bool> zeroRows(rows, false);
    vector<bool> zeroCols(cols, false);

    for (int row = 0; row < rows; ++row) {
        for (int col = 0; col < cols; ++col) {
            if (matrix[row][col] == 0) {
                zeroRows[row] = true;
                zeroCols[col] = true;
            }
        }
    }

    for (int row = 0; row < rows; ++row) {
        for (int col = 0; col < cols; ++col) {
            if (zeroRows[row] || zeroCols[col]) {
                matrix[row][col] = 0;
            }
        }
    }
}`
  },
  '234': {
    name: '复制到数组后双指针判断',
    tradeoff: 'O(n) 空间，但比“找中点 + 反转后半链表”更直观，适合第一遍掌握。',
    advanced: '进阶方法用快慢指针找中点并反转后半链表，可做到 O(1) 额外空间。',
    py: `def isPalindrome(head):
    values = []
    current = head

    while current is not None:
        values.append(current.val)
        current = current.next

    left = 0
    right = len(values) - 1
    while left < right:
        if values[left] != values[right]:
            return False
        left += 1
        right -= 1

    return True`,
    cpp: `bool isPalindrome(ListNode* head) {
    vector<int> values;

    for (ListNode* current = head; current != nullptr; current = current->next) {
        values.push_back(current->val);
    }

    int left = 0;
    int right = static_cast<int>(values.size()) - 1;
    while (left < right) {
        if (values[left] != values[right]) {
            return false;
        }
        ++left;
        --right;
    }
    return true;
}`
  },
  '142': {
    name: '哈希集合记录访问过的节点',
    tradeoff: 'O(n) 空间，但几乎没有公式推导；第一次重复遇到的节点就是环入口。',
    advanced: '进阶方法是 Floyd 快慢指针 O(1) 空间，需要理解相遇点到入口的距离关系。',
    py: `def detectCycle(head):
    visited = set()
    current = head

    while current is not None:
        if current in visited:
            return current
        visited.add(current)
        current = current.next

    return None`,
    cpp: `ListNode* detectCycle(ListNode* head) {
    unordered_set<ListNode*> visited;
    ListNode* current = head;

    while (current != nullptr) {
        if (visited.count(current)) {
            return current;
        }
        visited.insert(current);
        current = current->next;
    }
    return nullptr;
}`
  },
  '148': {
    name: '收集节点值 → 排序 → 写回链表',
    tradeoff: 'O(n) 额外空间，代码非常直观；适合先理解“排序链表”的结果要求。',
    advanced: '进阶/面试常问方法是链表归并排序：快慢指针切半 + 合并，O(n log n)。',
    py: `def sortList(head):
    if head is None:
        return None

    values = []
    current = head
    while current is not None:
        values.append(current.val)
        current = current.next

    values.sort()

    current = head
    for value in values:
        current.val = value
        current = current.next

    return head`,
    cpp: `ListNode* sortList(ListNode* head) {
    if (head == nullptr) {
        return nullptr;
    }

    vector<int> values;
    for (ListNode* current = head; current != nullptr; current = current->next) {
        values.push_back(current->val);
    }

    sort(values.begin(), values.end());

    ListNode* current = head;
    for (int value : values) {
        current->val = value;
        current = current->next;
    }
    return head;
}`
  },
  '4': {
    name: '双指针合并两个有序数组',
    tradeoff: 'O(m+n) 时间和空间，但推导最自然；先会这个，再考虑二分切分。',
    advanced: '进阶方法在较短数组上二分 partition，可做到 O(log(min(m,n)))。',
    py: `def findMedianSortedArrays(nums1, nums2):
    merged = []
    i = 0
    j = 0

    while i < len(nums1) and j < len(nums2):
        if nums1[i] <= nums2[j]:
            merged.append(nums1[i])
            i += 1
        else:
            merged.append(nums2[j])
            j += 1

    merged.extend(nums1[i:])
    merged.extend(nums2[j:])

    n = len(merged)
    middle = n // 2
    if n % 2 == 1:
        return merged[middle]
    return (merged[middle - 1] + merged[middle]) / 2`,
    cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    vector<int> merged;
    int i = 0;
    int j = 0;

    while (i < static_cast<int>(nums1.size()) && j < static_cast<int>(nums2.size())) {
        if (nums1[i] <= nums2[j]) {
            merged.push_back(nums1[i++]);
        } else {
            merged.push_back(nums2[j++]);
        }
    }

    while (i < static_cast<int>(nums1.size())) {
        merged.push_back(nums1[i++]);
    }
    while (j < static_cast<int>(nums2.size())) {
        merged.push_back(nums2[j++]);
    }

    int n = static_cast<int>(merged.size());
    if (n % 2 == 1) {
        return merged[n / 2];
    }
    return (merged[n / 2 - 1] + merged[n / 2]) / 2.0;
}`
  },
  '215': {
    name: '排序后直接取第 k 大',
    tradeoff: 'O(n log n)，但最符合直觉；如果只是面试第一遍，先写对再谈堆/快速选择。',
    advanced: '进阶可用大小为 k 的最小堆 O(n log k)，或快速选择平均 O(n)。',
    py: `def findKthLargest(nums, k):
    nums.sort(reverse=True)
    return nums[k - 1]`,
    cpp: `int findKthLargest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return nums[k - 1];
}`
  },
  '347': {
    name: '统计频率后排序',
    tradeoff: 'O(n log n) 上界，逻辑非常直接；比维护大小为 k 的堆更容易理解。',
    advanced: '进阶可以用最小堆 O(n log k) 或桶排序做到接近 O(n)。',
    py: `from collections import Counter

def topKFrequent(nums, k):
    frequency = Counter(nums)
    pairs = list(frequency.items())
    pairs.sort(key=lambda pair: pair[1], reverse=True)

    answer = []
    for index in range(k):
        answer.append(pairs[index][0])
    return answer`,
    cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> frequency;
    for (int value : nums) {
        ++frequency[value];
    }

    vector<pair<int, int>> pairs;
    for (const auto& entry : frequency) {
        pairs.push_back({entry.second, entry.first});
    }

    sort(pairs.begin(), pairs.end(), greater<pair<int, int>>());

    vector<int> answer;
    for (int i = 0; i < k; ++i) {
        answer.push_back(pairs[i].second);
    }
    return answer;
}`
  },
  '300': {
    name: 'O(n²) 动态规划',
    tradeoff: '虽然不是最快，但状态定义非常清楚：dp[i] 就是“以 i 结尾”的 LIS 长度。',
    advanced: '进阶再学习 tails + 二分，把复杂度优化到 O(n log n)。',
    py: `def lengthOfLIS(nums):
    if not nums:
        return 0

    n = len(nums)
    dp = [1] * n
    answer = 1

    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
        answer = max(answer, dp[i])

    return answer`,
    cpp: `int lengthOfLIS(vector<int>& nums) {
    int n = static_cast<int>(nums.size());
    if (n == 0) {
        return 0;
    }

    vector<int> dp(n, 1);
    int answer = 1;

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        answer = max(answer, dp[i]);
    }
    return answer;
}`
  },
  '32': {
    name: '栈记录未匹配括号位置',
    tradeoff: '比 DP 的下标推导直观；用 -1 作为最后一个无法匹配位置的哨兵。',
    advanced: '进阶可以学习 DP：dp[i] 表示以 i 结尾的最长有效括号长度。',
    py: `def longestValidParentheses(s):
    stack = [-1]
    answer = 0

    for index, char in enumerate(s):
        if char == '(':
            stack.append(index)
        else:
            stack.pop()

            if not stack:
                # 当前右括号无法匹配，它成为新的边界。
                stack.append(index)
            else:
                current_length = index - stack[-1]
                answer = max(answer, current_length)

    return answer`,
    cpp: `int longestValidParentheses(string s) {
    stack<int> positions;
    positions.push(-1);
    int answer = 0;

    for (int i = 0; i < static_cast<int>(s.size()); ++i) {
        if (s[i] == '(') {
            positions.push(i);
        } else {
            positions.pop();
            if (positions.empty()) {
                positions.push(i);
            } else {
                answer = max(answer, i - positions.top());
            }
        }
    }
    return answer;
}`
  },
  '169': {
    name: '哈希表计数',
    tradeoff: 'O(n) 空间但一眼能懂；先掌握频次统计，再学 Boyer-Moore 抵消法。',
    advanced: 'Boyer-Moore 可以做到 O(1) 空间，但需要理解“多数元素和其他元素互相抵消后仍会剩下”。',
    py: `from collections import Counter

def majorityElement(nums):
    frequency = Counter(nums)
    threshold = len(nums) // 2

    for value, count in frequency.items():
        if count > threshold:
            return value`,
    cpp: `int majorityElement(vector<int>& nums) {
    unordered_map<int, int> frequency;
    int threshold = static_cast<int>(nums.size()) / 2;

    for (int value : nums) {
        ++frequency[value];
        if (frequency[value] > threshold) {
            return value;
        }
    }
    return -1;
}`
  },
  '75': {
    name: '计数后重写数组',
    tradeoff: '两遍扫描、O(1) 额外空间，明显比荷兰国旗三指针更容易第一次写对。',
    advanced: '进阶再学荷兰国旗：一次扫描维护 0 区、1 区、2 区。',
    py: `def sortColors(nums):
    counts = [0, 0, 0]

    for value in nums:
        counts[value] += 1

    index = 0
    for color in range(3):
        for _ in range(counts[color]):
            nums[index] = color
            index += 1`,
    cpp: `void sortColors(vector<int>& nums) {
    array<int, 3> counts{0, 0, 0};

    for (int value : nums) {
        ++counts[value];
    }

    int index = 0;
    for (int color = 0; color < 3; ++color) {
        for (int count = 0; count < counts[color]; ++count) {
            nums[index++] = color;
        }
    }
}`
  },
  '287': {
    name: '哈希集合查重',
    tradeoff: 'O(n) 空间，但没有函数图/Floyd 的抽象跳跃，最适合作为第一套答案。',
    advanced: '题目若强制 O(1) 空间，再学 Floyd：把 nums[i] 当作 next 指针，重复值对应环入口。',
    py: `def findDuplicate(nums):
    seen = set()

    for value in nums:
        if value in seen:
            return value
        seen.add(value)

    return -1`,
    cpp: `int findDuplicate(vector<int>& nums) {
    unordered_set<int> seen;

    for (int value : nums) {
        if (seen.count(value)) {
            return value;
        }
        seen.insert(value);
    }
    return -1;
}`
  }
};

function V6_methodInfo(item) {
  return V6_OVERRIDES[item.id] || {
    name: '经典常规写法',
    tradeoff: '这道题的主流解法本身已经比较常规。v6 重点把缩写、一行多语句和隐式步骤展开，不做代码高尔夫。',
    advanced: '如果这题存在更激进的空间/时间优化，先在理解当前写法后再学习，不要求第一遍同时背两套。'
  };
}

function V6_expandPython(code) {
  const input = String(code || '').split('\n');
  const output = [];

  for (const originalLine of input) {
    const indent = (originalLine.match(/^\s*/) || [''])[0];
    const body = originalLine.slice(indent.length).trimEnd();

    if (!body) {
      output.push('');
      continue;
    }

    const oneLineControl = body.match(/^(if|elif|for|while)\s+(.+):\s*(.+)$/);
    if (oneLineControl && !oneLineControl[3].includes(':=')) {
      output.push(`${indent}${oneLineControl[1]} ${oneLineControl[2]}:`);
      const statements = oneLineControl[3].split(';').map((part) => part.trim()).filter(Boolean);
      for (const statement of statements) {
        output.push(`${indent}    ${statement}`);
      }
      continue;
    }

    const oneLineElse = body.match(/^else:\s*(.+)$/);
    if (oneLineElse) {
      output.push(`${indent}else:`);
      output.push(`${indent}    ${oneLineElse[1]}`);
      continue;
    }

    if (body.includes(';')) {
      const parts = body.split(';').map((part) => part.trim()).filter(Boolean);
      if (parts.length > 1) {
        for (const part of parts) {
          output.push(`${indent}${part}`);
        }
        continue;
      }
    }

    output.push(originalLine);
  }

  return output.join('\n');
}

function V6_pythonCode(item) {
  const override = V6_OVERRIDES[item.id];
  if (override) return override.py;
  return V6_expandPython(item.py);
}

function V6_cppCode(item) {
  const override = V6_OVERRIDES[item.id];
  if (override) return override.cpp;
  return String(CPP[item.id] || '');
}

function V6_header(item, lang) {
  const memory = V5_memory(item);
  const method = V6_methodInfo(item);
  const prefix = lang === 'py' ? '# ' : '// ';
  const lines = [
    `题目：#${item.id} ${item.title}`,
    `默认方法：${method.name}`,
    `为什么先学它：${method.tradeoff}`,
    `口诀：${memory.mantra}`,
    `识别信号：${memory.trigger}`,
    `不变量：${memory.invariant}`,
    `复杂度：${memory.complexity}`,
    '',
    '写代码时不要背字符，按下面三步恢复：',
    ...memory.steps.map((step, index) => `${index + 1}. ${step}`)
  ];
  return lines.map((line) => `${prefix}${line}`).join('\n');
}

V5_studyPython = function V6_studyPython(item) {
  const code = V6_pythonCode(item);
  return `${V6_header(item, 'py')}\n\n${V5_pythonHelpers(code)}${code}`.trim();
};

V5_studyCpp = function V6_studyCpp(item) {
  const code = V6_cppCode(item);
  return `${V6_header(item, 'cpp')}\n\n${V5_cppHelpers(code)}${code}`.trim();
};

V5_explanationHTML = function V6_explanationHTML(item) {
  const memory = V5_memory(item);
  const method = V6_methodInfo(item);
  return `<div class="solution-story v6-story">
    <section class="v6-method-choice">
      <div class="v6-choice-head"><span>默认先学</span><strong>${escapeHTML(method.name)}</strong></div>
      <p>${escapeHTML(method.tradeoff)}</p>
      <div class="v6-principle">原则：先写出你能解释、能稳定复现的答案；再优化复杂度，而不是第一遍就背最技巧的写法。</div>
    </section>
    <section><h4>1. 先用人话理解题目</h4><p><b>看到：</b>${escapeHTML(memory.trigger)}</p><p><b>先想到：</b>${escapeHTML(memory.mantra)}</p><p>${escapeHTML(item.core)}</p></section>
    <section><h4>2. 把解法拆成三步</h4><ol>${memory.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol><p class="v6-note">每一步只回答一个问题，不要把初始化、循环、边界和返回值挤在同一行。</p></section>
    <section><h4>3. 为什么这套方法成立</h4><p>${escapeHTML(memory.invariant)}</p><p>${escapeHTML(item.oral)}</p></section>
    <section><h4>4. 写代码时重点看变量语义</h4><p>变量名优先表达含义，例如 <code>left / right / current / answer / frequency</code>，不要为了少敲几个字符把所有变量压成单字母。循环里的每个更新动作单独占一行。</p></section>
    <section><h4>5. 最容易错什么</h4><div class="pitfall-card">${escapeHTML(item.pitfall)}</div></section>
    <section><h4>6. 复杂度和面试口述</h4><p><b>复杂度：</b>${escapeHTML(memory.complexity)}</p><blockquote>${escapeHTML(item.oral)}</blockquote></section>
  </div>`;
};

function V6_advancedHTML(item) {
  const method = V6_methodInfo(item);
  const override = V6_OVERRIDES[item.id];
  if (!override) {
    return `<div class="v6-advanced"><h4>这题不强求第二套写法</h4><p>${escapeHTML(method.advanced)}</p><p>下面仍保留原来的精简模板，仅用于快速复习，不建议第一次学习时直接背它。</p></div>`;
  }
  return `<div class="v6-advanced"><h4>什么时候再学进阶方法？</h4><p>${escapeHTML(method.advanced)}</p><div class="v6-tradeoff"><b>当前默认：</b>${escapeHTML(method.name)}<br><b>取舍：</b>${escapeHTML(method.tradeoff)}</div></div>`;
}

V5_codePane = function V6_codePane(item, lang) {
  const study = lang === 'py' ? V5_studyPython(item) : V5_studyCpp(item);
  const method = V6_methodInfo(item);
  const copyKey = lang === 'py' ? 'study-py' : 'study-cpp';
  const languageName = lang === 'py' ? 'Python' : 'C++';
  return `<div class="acm-note v6-code-note"><b>${languageName} · 常规可读版</b><span>${escapeHTML(method.name)}。代码刻意展开书写，不追求最短行数。</span></div>
    <div class="codebox study-codebox"><button type="button" class="copy-btn" data-copy="${copyKey}">复制可读版</button><pre><code>${escapeHTML(study)}</code></pre></div>`;
};

V5_answerDetailsHTML = function V6_answerDetailsHTML(item, record) {
  const rawPy = item.py;
  const rawCpp = CPP[item.id];
  return `${V5_memoryDeckHTML(item)}
    <div class="tabs v5-tabs v6-tabs">
      <button type="button" class="tab-btn active" data-tab="explain">先理解</button>
      <button type="button" class="tab-btn" data-tab="py">Python 常规版</button>
      <button type="button" class="tab-btn" data-tab="cpp">C++ 常规版</button>
      <button type="button" class="tab-btn" data-tab="advanced">进阶 / 优化</button>
      <button type="button" class="tab-btn" data-tab="links">关联 / 发散</button>
    </div>
    <div class="pane active" data-pane="explain">${V5_explanationHTML(item)}</div>
    <div class="pane" data-pane="py">${V5_codePane(item, 'py')}</div>
    <div class="pane" data-pane="cpp">${V5_codePane(item, 'cpp')}</div>
    <div class="pane" data-pane="advanced">${V6_advancedHTML(item)}
      <details class="raw-template"><summary>查看原来的 20 秒速背模板（不建议作为第一套答案）</summary>
        <h4>Python 速背版</h4><div class="codebox"><button type="button" class="copy-btn" data-copy="raw-py">复制</button><pre><code>${escapeHTML(rawPy)}</code></pre></div>
        <h4>C++ 速背版</h4><div class="codebox"><button type="button" class="copy-btn" data-copy="raw-cpp">复制</button><pre><code>${escapeHTML(rawCpp)}</code></pre></div>
      </details></div>
    <div class="pane" data-pane="links"><div class="link-study"><p><b>Hot100 关联：</b>${escapeHTML(item.related)}</p><p><b>迁移发散：</b>${escapeHTML(item.expand)}</p><p><a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/">LeetCode 原题</a> · <a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/solutions/">题解聚合页</a></p></div></div>
    <div class="section-label">复习结果：标准是“能否用正常代码独立写出来”</div>
    <div class="outcomes"><button type="button" class="result-btn good" data-result="good">能独立写出 ✓</button><button type="button" class="result-btn fuzzy" data-result="fuzzy">思路会 / 实现卡 △</button><button type="button" class="result-btn bad" data-result="bad">还不会 ×</button></div>
    <div class="section-label">手动复习阶段</div>
    <div class="review">${[0, 1, 2, 3].map((stage) => `<button type="button" class="review-btn ${record.stage === stage ? 'active' : ''}" data-stage="${stage}">${stageLabel(stage)}</button>`).join('')}</div>`;
};

if (typeof DATA !== 'undefined' && DATA.length) {
  render();
}
