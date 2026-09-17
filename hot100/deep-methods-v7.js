/* Simpler default methods for selected hard/medium problems. */

V6_OVERRIDES['25'] = {
  name: '先收集一整组节点，再反转这一组',
  tradeoff: '使用 O(k) 临时数组换取清晰度。每组先完整收集 k 个节点，再重新连接，避免一开始就陷入多指针原地反转。',
  advanced: '熟练后再改成 O(1) 额外空间的原地反转；核心边界 group_prev / kth / group_next 不变。',
  py: `def reverseKGroup(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy

    while True:
        # 1. 先尝试收集完整的 k 个节点。
        group = []
        current = group_prev.next

        for _ in range(k):
            if current is None:
                # 剩余节点不足 k 个，保持原样。
                return dummy.next
            group.append(current)
            current = current.next

        # current 此时就是下一组的第一个节点。
        group_next = current

        # 2. 把这一组内部的 next 指针反过来。
        for index in range(k - 1, 0, -1):
            group[index].next = group[index - 1]

        # 3. 组尾接回下一组，前一组接到新的组头。
        group[0].next = group_next
        group_prev.next = group[k - 1]

        # 原来的组头已经变成组尾，下一轮从它后面继续。
        group_prev = group[0]`,
  cpp: `ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0, head);
    ListNode* groupPrev = &dummy;

    while (true) {
        // 1. 先收集完整的一组 k 个节点。
        vector<ListNode*> group;
        ListNode* current = groupPrev->next;

        for (int count = 0; count < k; ++count) {
            if (current == nullptr) {
                // 剩余不足 k 个，保持原样。
                return dummy.next;
            }
            group.push_back(current);
            current = current->next;
        }

        // current 是下一组的第一个节点。
        ListNode* groupNext = current;

        // 2. 反转当前组内部连接。
        for (int index = k - 1; index > 0; --index) {
            group[index]->next = group[index - 1];
        }

        // 3. 接回前后链表。
        group[0]->next = groupNext;
        groupPrev->next = group[k - 1];

        // 原组头变成组尾。
        groupPrev = group[0];
    }
}`
};

V6_OVERRIDES['437'] = {
  name: '枚举每个节点作为路径起点 + 向下 DFS',
  tradeoff: '最坏 O(n²)，但逻辑非常直观：外层决定从哪开始，内层只统计从这个起点向下的路径。对于第一次理解远比树上前缀和自然。',
  advanced: '熟练后再学习“树上前缀和 + 哈希回溯”，可把复杂度优化到 O(n)。',
  py: `def pathSum(root, targetSum):
    def count_from(node, remaining):
        if node is None:
            return 0

        count = 0

        # 如果当前节点正好补完 remaining，找到一条路径。
        if node.val == remaining:
            count += 1

        # 继续向左右孩子走，路径方向只能向下。
        next_remaining = remaining - node.val
        count += count_from(node.left, next_remaining)
        count += count_from(node.right, next_remaining)

        return count

    if root is None:
        return 0

    # 当前 root 作为起点的答案。
    answer = count_from(root, targetSum)

    # 再让左右子树里的每个节点都有机会成为新的起点。
    answer += pathSum(root.left, targetSum)
    answer += pathSum(root.right, targetSum)

    return answer`,
  cpp: `int pathSum(TreeNode* root, long long targetSum) {
    function<int(TreeNode*, long long)> countFrom =
        [&](TreeNode* node, long long remaining) -> int {
            if (node == nullptr) {
                return 0;
            }

            int count = 0;

            // 当前节点正好补完 remaining，找到一条路径。
            if (node->val == remaining) {
                ++count;
            }

            // 路径只能继续向下走。
            long long nextRemaining = remaining - node->val;
            count += countFrom(node->left, nextRemaining);
            count += countFrom(node->right, nextRemaining);

            return count;
        };

    if (root == nullptr) {
        return 0;
    }

    int answer = countFrom(root, targetSum);
    answer += pathSum(root->left, targetSum);
    answer += pathSum(root->right, targetSum);

    return answer;
}`
};

if (window.HOT100_MEMORY) {
  window.HOT100_MEMORY['25'] = {
    mantra: '先凑够一组，再只反转这一组',
    trigger: '链表 + 每 k 个一组 + 不足 k 个保留',
    steps: [
      '从 group_prev 后面先收集完整 k 个节点，不够就直接结束',
      '把这 k 个节点内部从后往前重新连接',
      '新的组尾接 group_next，group_prev 接新的组头，再进入下一组'
    ],
    invariant: '每轮开始时，group_prev 之前的链表已经处理完成；当前组只在确认有 k 个节点后才修改。',
    complexity: 'O(n) 时间 / O(k) 额外空间',
    acm: '构造链表后调用核心函数；重点验证不足 k 个节点时保持原顺序。',
    ask: ['为什么必须先确认这一组有 k 个节点？', 'group[0] 反转后变成什么角色？', 'group_next 为什么必须提前保存？']
  };

  window.HOT100_MEMORY['437'] = {
    mantra: '每个节点都当一次起点，再向下找路径',
    trigger: '树上路径和 + 起点可以任意 + 路径只能向下',
    steps: [
      '写 count_from：固定当前节点为起点，统计向下能凑出 remaining 的路径',
      '当前节点命中后继续递归左右孩子，remaining 减去 node.val',
      '主函数让 root、root.left、root.right... 每个节点都轮流成为起点'
    ],
    invariant: 'count_from 只统计“必须从传入 node 开始”的路径；主函数负责枚举所有可能起点，因此不会漏。',
    complexity: '最坏 O(n²) 时间 / O(h) 递归栈空间',
    acm: '构造树后调用 pathSum；第一次学习优先理解“枚举起点 + 向下 DFS”。',
    ask: ['为什么需要两层递归？', 'count_from 和 pathSum 各自负责什么？', '为什么路径不会向父节点走？']
  };
}
