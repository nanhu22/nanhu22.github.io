/* Hot100 Deep Explanations v7
 * Focus: medium/hard problems only.
 * Adds slower reasoning, variable tables, walkthroughs, and richer code comments.
 */

const V7_TOPIC_GUIDES = {
  '哈希': {
    naive: '先想双重循环：对每个元素，再去找它需要的另一个元素。这个方法最直观，但会重复查找。',
    bridge: '当题目反复问“某个值是否已经出现 / 出现在哪”时，可以把“向前找”变成哈希表 O(1) 查询。',
    variables: [['map / set', '保存已经见过的信息'], ['current', '当前正在处理的元素'], ['answer', '已经确认的答案']]
  },
  '双指针': {
    naive: '最朴素的想法通常是枚举所有左右位置组合。这样容易想到，但经常是 O(n²)。',
    bridge: '如果数组有序、或者左右边界移动后能排除一批不可能答案，就可以让两个指针从两端或同向移动。',
    variables: [['left', '左边界或慢指针'], ['right', '右边界或快指针'], ['answer', '当前最好结果']]
  },
  '滑动窗口': {
    naive: '可以枚举所有子串，再逐个判断是否满足条件，但子串数量是 O(n²)，判断又可能额外耗时。',
    bridge: '当“右端加入一个元素、左端移除一个元素”后，状态可以增量维护时，就用窗口避免重复计算。',
    variables: [['left', '窗口左端'], ['right', '窗口右端'], ['window', '当前窗口里的统计信息'], ['need', '目标条件']]
  },
  '子串': {
    naive: '先枚举所有连续区间，再计算区间性质。思路简单，但大量区间之间有重复信息。',
    bridge: '连续区间问题通常优先检查：前缀和、滑动窗口、单调结构三种方向。',
    variables: [['prefix / window', '复用区间信息'], ['left/right', '当前区间边界'], ['answer', '累计数量或最优值']]
  },
  '普通数组': {
    naive: '先按题意直接模拟，明确每一步对数组产生什么影响。',
    bridge: '如果直接模拟会重复移动或重复计算，再考虑排序、前后缀、原地标记等结构化方法。',
    variables: [['index', '当前位置'], ['answer', '结果数组或最优值'], ['prefix / suffix', '左侧或右侧已经积累的信息']]
  },
  '矩阵': {
    naive: '先把矩阵看成二维数组，按行列直接遍历。不要一开始就追求 O(1) 空间。',
    bridge: '先用额外标记数组把逻辑写清楚，再考虑是否能复用第一行/第一列等位置优化空间。',
    variables: [['row', '当前行'], ['col', '当前列'], ['rows/cols', '矩阵尺寸'], ['mark', '需要延后执行的标记']]
  },
  '链表': {
    naive: '先把链表画出来，明确“当前节点、下一个节点、前一个节点”分别是谁。',
    bridge: '链表题真正难点通常不是算法，而是改指针时不要丢失后半段。优先多用临时变量换可读性。',
    variables: [['current', '当前处理节点'], ['next_node', '改指针前保存的后继'], ['previous', '已经处理好的前驱'], ['dummy', '统一处理头节点边界']]
  },
  '二叉树': {
    naive: '先问：我站在一个节点上，需要从左右子树拿到什么信息？',
    bridge: '如果父节点依赖子树结果，通常用后序递归；如果按层处理，通常用 BFS。',
    variables: [['node', '当前节点'], ['left_result', '左子树返回值'], ['right_result', '右子树返回值'], ['answer', '跨子树的全局答案']]
  },
  '图论': {
    naive: '先把“节点”和“边”说清楚，再决定是 DFS、BFS 还是拓扑排序。',
    bridge: '连通性用 DFS/BFS；最短步数常用 BFS；依赖顺序和有向无环判断常用拓扑排序。',
    variables: [['graph', '邻接表'], ['visited', '是否访问过'], ['queue / stack', '待处理节点'], ['indegree', '拓扑排序里的入度']]
  },
  '回溯': {
    naive: '把问题理解成“每一步做一个选择”，然后把所有选择树走一遍。',
    bridge: '回溯固定四件事：当前路径、可选集合、终止条件、撤销选择。先保证正确，再剪枝。',
    variables: [['path', '当前已经做出的选择'], ['start / index', '下一步从哪里选'], ['used', '哪些元素已使用'], ['answer', '所有合法方案']]
  },
  '二分查找': {
    naive: '先线性扫描找到答案位置，确认“答案到底是什么边界”。',
    bridge: '只要判断一次就能排除一半候选范围，就可以二分。最重要的是先定义区间语义，而不是背模板。',
    variables: [['left', '候选区间左边界'], ['right', '候选区间右边界'], ['mid', '本轮检查位置'], ['target', '目标值']]
  },
  '栈': {
    naive: '先直接模拟“最近一个还没处理完的东西”应该如何保存。',
    bridge: '如果后来的元素要优先匹配最近的未完成元素，就自然想到栈；若还要找下一个更大/更小，则考虑单调栈。',
    variables: [['stack', '尚未完成匹配/结算的元素'], ['current', '当前新元素'], ['answer', '已确定结果']]
  },
  '堆': {
    naive: '可以每次都把全部候选重新排序，但这样重复工作很多。',
    bridge: '如果只关心当前最大/最小几个元素，用堆保留“最需要被取出的候选”。',
    variables: [['heap', '当前候选集合'], ['top', '当前最值'], ['k', '需要保留或寻找的数量']]
  },
  '贪心算法': {
    naive: '先尝试写 DP 或枚举所有选择，理解完整状态。',
    bridge: '如果当前做一个局部最优选择后，不会损害未来能达到的最优结果，就可以贪心。',
    variables: [['current', '当前处理位置'], ['boundary / reach', '当前已能保证的最远范围'], ['answer', '累计选择次数或最优值']]
  },
  '动态规划': {
    naive: '先写递归：当前答案依赖哪些更小子问题？这一步比直接写 dp 数组更重要。',
    bridge: '如果同一个子问题会被重复计算，就把结果存下来；再把递归状态改成从小到大的 DP。',
    variables: [['dp[i]', '前 i 个元素/到位置 i 的子问题答案'], ['previous', '前一个状态'], ['answer', '最终状态']]
  },
  '多维动态规划': {
    naive: '先明确两个维度分别代表什么，例如两个字符串前缀、行和列、区间左右端点。',
    bridge: '写出 dp[i][j] 的中文定义，再问“最后一步发生了什么”，转移方程就会自然出现。',
    variables: [['dp[i][j]', '两个维度共同描述的子问题'], ['i / j', '两个前缀或两个位置'], ['previous states', '最后一步可能来自的更小状态']]
  },
  '技巧': {
    naive: '先用你最熟悉的哈希、排序、数组模拟把题做对。',
    bridge: '这类题往往有数学或位运算技巧，但第一遍不要求强记；先理解常规解法，再把技巧作为优化。',
    variables: [['state', '当前累计状态'], ['candidate', '候选答案'], ['count', '出现次数或平衡值']]
  }
};

const V7_GUIDES = {
  '15': {
    plain: '找出数组里所有和为 0 的三元组，而且三元组不能重复。',
    naive: '最直接是三层循环枚举 i、j、k，时间 O(n³)。它一定能做对，但 n 大时太慢。',
    bridge: '先排序后，固定第一个数 nums[i]。剩下的问题就变成：在右侧有序区间里找两个数，使它们的和等于 -nums[i]。两数之和在有序数组里可以用左右双指针完成。',
    example: ['例如 [-1,0,1,2,-1,-4] 先排序成 [-4,-1,-1,0,1,2]。', '固定 i=1，nums[i]=-1，需要右侧两数和为 1。', 'left 指向 -1，right 指向 2，和为 1，得到 [-1,-1,2]。', '记录答案后 left/right 都移动，并跳过重复值，继续找 [-1,0,1]。'],
    variables: [['i', '固定的第一个数'], ['left', '第二个数的位置'], ['right', '第三个数的位置'], ['current_sum', '当前三个数之和'], ['answer', '已经找到且去重后的三元组']],
    codeRead: ['先排序，这是后面双指针能够单调移动的前提。', '外层循环只负责确定第一个数，并跳过重复的第一个数。', '内层 while 根据 current_sum 与 0 的大小移动 left 或 right。', '找到一个答案后，两个指针都要移动，并继续跳过重复值。'],
    stuck: '如果忘了怎么写，先只记一句：排序后“定一，夹二”。去重分别发生在 i、left、right 三处。'
  },
  '76': {
    plain: '在 s 中找最短的连续子串，使它包含 t 中所有字符，而且重复次数也要满足。',
    naive: '可以枚举每个起点和终点，再检查这个子串是否覆盖 t，但会产生大量重复统计。',
    bridge: '右指针负责把窗口扩大到“满足要求”，一旦满足，就移动左指针尽量缩短；缩到刚好不满足后，再继续右扩。',
    example: ['s="ADOBECODEBANC", t="ABC"。', '右指针一路扩到第一次包含 A/B/C，此时窗口 ADOBEC 满足。', '开始移动 left，尽量删掉无关字符；删到再删就不满足为止。', '之后继续右扩，最终能缩出 BANC，长度 4。'],
    variables: [['need', 't 中每个字符需要多少个'], ['window', '当前窗口里每个字符有多少个'], ['valid', '已经满足数量要求的字符种类数'], ['left/right', '当前窗口边界'], ['best', '目前最短合法窗口']],
    codeRead: ['先统计 need，以及一共有多少种字符需要满足。', 'right 每向右一步，只更新新进入字符的计数。', '当 valid == need 的种类数时，说明当前窗口已经完全覆盖。', '进入 while 缩左边；每次缩之前先尝试更新答案。', '如果移出的字符导致某种字符从“够用”变成“不够”，valid 才减一。'],
    stuck: '记住窗口只有两个阶段：不够就右扩，够了就左缩。不要同时想两边怎么动。'
  },
  '25': {
    plain: '链表每 k 个节点分成一组，每组反转；最后不足 k 个的部分保持不变。',
    naive: '最难的是原地反转时指针很多。第一遍可以先明确一组有哪些节点，再单独反转这一组。',
    bridge: '使用 dummy 统一头节点。每轮先向前走 k 步确认“这一组真的有 k 个”，再把这一段反转，最后接回前后链表。',
    example: ['1→2→3→4→5，k=2。', '第一组是 1,2，反转成 2→1，再接 3。', '第二组是 3,4，反转成 4→3，再接 5。', '最后只剩 5，不足 2 个，原样保留。'],
    variables: [['group_prev', '当前这一组前面的节点'], ['kth', '当前组第 k 个节点'], ['group_next', '下一组的第一个节点'], ['previous/current', '反转当前组时使用的两个指针']],
    codeRead: ['每轮先找 kth，不够 k 个就直接结束。', '保存 group_next，保证反转时知道最后要接到哪里。', '反转范围是 [group_prev.next, group_next)。', '反转完成后，旧的组头变成组尾，用它作为下一轮 group_prev。'],
    stuck: '先画四个名字：group_prev / first / kth / group_next。能画清楚，代码就不会乱。'
  },
  '146': {
    plain: '实现一个缓存：get/put 都要 O(1)，容量满时删除“最久没使用”的 key。',
    naive: '哈希表能 O(1) 找 key，但不知道谁最久没用；普通数组能记录顺序，但移动和删除是 O(n)。',
    bridge: '把两个结构组合：哈希表负责 O(1) 定位节点，双向链表负责 O(1) 移动到头部和删除尾部。',
    example: ['容量 2：put(1,1), put(2,2)，链表顺序是 2 → 1。', 'get(1) 后，1 变成最近使用，顺序变成 1 → 2。', 'put(3,3) 时超容量，删除尾部 2。'],
    variables: [['map', 'key → 链表节点'], ['head/tail', '两个哨兵节点'], ['head.next', '最近使用'], ['tail.prev', '最久未使用']],
    codeRead: ['先写 remove(node)：把一个节点从当前位置摘掉。', '再写 add_to_front(node)：把节点插到头部。', 'get 命中后必须移动到头部。', 'put 已存在时更新并移动；新 key 插头部，超容量就删 tail.prev。'],
    stuck: 'LRU 不是一道算法题，而是“哈希表 + 双向链表”两个职责组合。分别想清楚就简单很多。'
  },
  '105': {
    plain: '已知前序和中序遍历，重建唯一二叉树。',
    naive: '前序告诉你“谁是根”，中序告诉你“左右子树怎么分”。',
    bridge: '每次取前序的当前第一个未使用元素作为根，再去中序找到根的位置；左边区间构建左子树，右边区间构建右子树。',
    example: ['pre=[3,9,20,15,7], in=[9,3,15,20,7]。', '前序第一个 3 是根；中序中 3 左边只有 9，所以左子树只有 9。', '3 右侧中序是 [15,20,7]，下一前序元素 20 成为右子树根。'],
    variables: [['pre_index', '前序数组下一个根的位置'], ['inorder_index', '值 → 中序位置的哈希表'], ['left/right', '当前中序区间边界'], ['root', '本轮创建的根节点']],
    codeRead: ['先建立中序位置哈希表，避免每层递归都线性查根。', '递归函数只传中序区间 left/right。', 'pre_index 每创建一个节点就 +1。', '先递归左区间，再递归右区间，因为前序顺序是 根→左→右。'],
    stuck: '一句话：前序定根，中序切左右。'
  },
  '437': {
    plain: '统计树中所有“向下走”的路径，有多少条节点和等于 target。路径可以从任意节点开始。',
    naive: '最直观的做法就是：枚举每个节点作为起点，再从这个起点向下 DFS 累加路径和。',
    bridge: '这套 O(n²) 最坏复杂度的方法虽然不是最优，但非常好理解：外层负责“从哪开始”，内层负责“从这个起点往下有几条满足”。',
    example: ['对根节点调用 count_from(root, target)。', '递归尝试继续走左孩子和右孩子，并把 remaining 减去当前节点值。', '然后再分别把 root.left、root.right 当作新的路径起点重复统计。'],
    variables: [['count_from(node, remaining)', '固定起点后，向下寻找剩余和的路径数'], ['remaining', '当前还需要凑出的值'], ['answer', '所有起点的答案总和']],
    codeRead: ['先写辅助函数 count_from，它只处理“路径必须从当前 node 开始”。', '如果 node.val == remaining，说明以当前节点结尾形成一条答案。', '继续递归左右孩子，remaining 减去当前值。', '主函数再把每个节点都作为一次起点。'],
    stuck: '不要第一遍就上前缀和。先把“每个节点都当一次起点”写清楚。'
  },
  '124': {
    plain: '路径可以从任意节点开始和结束，但相邻节点必须连着；求最大路径和。',
    naive: '站在某个节点时，如果左右子树都提供正贡献，那么完整答案可以同时接左右；但往父节点返回时只能选一边。',
    bridge: '因此每个节点要做两件事：更新“经过自己、左右都接”的全局答案；再返回“自己 + 左右较大一边”的单边贡献。',
    example: ['节点 20，左孩子 15，右孩子 7。', '经过 20 的完整路径可以是 15 + 20 + 7 = 42。', '但如果 20 还要向父节点贡献，只能返回 20 + max(15,7)=35，不能形成分叉。'],
    variables: [['left_gain/right_gain', '左右子树向当前节点提供的最大单边贡献'], ['answer', '全局最大完整路径'], ['return value', '当前节点向父节点能提供的最大单边贡献']],
    codeRead: ['递归先拿到左右贡献；负贡献直接当 0，不如不接。', '用 node.val + left_gain + right_gain 更新全局答案。', '返回 node.val + max(left_gain,right_gain)。'],
    stuck: '最关键区别：更新答案可以左右都要；向父节点返回只能选一边。'
  },
  '207': {
    plain: '有若干课程依赖关系，问是否能把所有课程学完。',
    naive: '把课程看成有向图：先修课 → 后续课。如果图里有环，就永远有一组课程互相等待。',
    bridge: '拓扑排序就是不断拿走“当前没有前置要求”的课程。能全部拿完说明无环；最后还剩课程说明有环。',
    example: ['0→1 表示学 1 前要先学 0。', '先把所有入度为 0 的课程放进队列。', '弹出 0 后，1 的入度减 1；如果变成 0，再把 1 入队。'],
    variables: [['graph', '每门课学完后能解锁哪些课程'], ['indegree', '每门课还剩多少个未完成前置'], ['queue', '当前已经可以学习的课程'], ['finished', '已经处理的课程数量']],
    codeRead: ['先建邻接表和 indegree。', '把所有 indegree==0 的课入队。', '每学完一门课，就让它指向的课程入度 -1。', '最后 finished == numCourses 才说明可以全部完成。'],
    stuck: '把拓扑排序想成“不断删除没有前置依赖的课程”。'
  },
  '79': {
    plain: '在字符网格里找一个单词，只能上下左右走，同一个格子一条路径中不能重复使用。',
    naive: '从每个格子都试着作为单词第一个字符；匹配成功后，再向四周找下一个字符。',
    bridge: '这就是回溯：选择一个格子 → 暂时标记为已使用 → 递归找下一个字符 → 回来后恢复现场。',
    example: ['要找 ABCCED。先找到 A。', '从 A 的四邻居里找 B，找到后临时把 B 标记为已访问。', '继续找 C、C、E、D；如果某一步走不通，就恢复当前格子并换另一个方向。'],
    variables: [['row/col', '当前所在格子'], ['index', '当前要匹配 word[index]'], ['board[row][col]', '当前字符，同时可临时改成特殊符号表示访问过']],
    codeRead: ['终止条件先判断 index == len(word)，说明全部匹配完成。', '越界或字符不等就返回 False。', '临时保存当前字符，再写成特殊标记。', '递归四个方向，结束后恢复字符。'],
    stuck: '回溯的核心不是“递归”，而是“做选择 → 标记 → 递归 → 恢复”。'
  },
  '51': {
    plain: '在 n×n 棋盘放 n 个皇后，使任意两个皇后不同行、不同列、不同对角线。',
    naive: '按行放最自然：每一行只需要决定皇后放在哪一列。',
    bridge: '行冲突自动消失；只需要用三个集合记录已经占用的列、主对角线 row-col、副对角线 row+col。',
    example: ['第 0 行尝试放第 1 列，就记录 col=1、diag1=-1、diag2=1。', '进入第 1 行时，任何命中这三个集合的位置都不能放。', '如果后面走不通，就把第 0 行这个皇后撤掉，换下一列。'],
    variables: [['row', '当前正在放第几行'], ['columns', '已占用列'], ['diag1', 'row-col 相同表示同一主对角线'], ['diag2', 'row+col 相同表示同一副对角线'], ['board', '当前棋盘方案']],
    codeRead: ['递归深度就是 row，所以不用额外记录哪些行被占。', '每列先检查三个集合。', '合法就加入集合并写 Q，递归下一行。', '回来时必须同时恢复棋盘和三个集合。'],
    stuck: '只记三个冲突条件：同列、row-col、row+col。'
  },
  '84': {
    plain: '每根柱子都想成为某个矩形的最低高度，求最大矩形面积。',
    naive: '最直观是枚举每根柱子，再向左向右扩到比它矮的位置，最坏 O(n²)。',
    bridge: '单调栈只是把“找左边第一个更矮、右边第一个更矮”这件事一次性维护起来。当前高度变矮时，栈顶柱子的右边界就确定了。',
    example: ['高度 [2,1,5,6,2,3]。', '5、6 会依次进栈，因为高度递增。', '遇到 2 时，比 6 小，所以 6 的右边界确定，计算面积；继续弹 5，再计算 5 的面积。'],
    variables: [['stack', '下标栈，对应高度保持递增'], ['i', '当前扫描位置，也是被弹柱子的右边界'], ['index', '刚弹出的柱子下标'], ['left', '弹出后新的栈顶，是左边第一个更矮的位置']],
    codeRead: ['在末尾补一个 0，保证所有柱子最终都能被弹出结算。', '当前高度小于栈顶高度时，不断弹栈。', '弹出柱子的高度是 rectangle_height。', '宽度是 i - left - 1。'],
    stuck: '别背公式，先画图：弹出某柱子时，右边第一个更矮就是 i，左边第一个更矮就是弹出后的栈顶。'
  },
  '295': {
    plain: '数据不断插入，同时随时查询当前中位数。',
    naive: '每次插入后都排序当然能做，但插入很多次会反复排序。',
    bridge: '把所有数分成左右两半：左半用最大堆，右半用最小堆。这样中位数永远只和两个堆顶有关。',
    example: ['插入 1：左堆 [1]。中位数 1。', '插入 2：平衡成左堆 [1]、右堆 [2]，中位数 (1+2)/2。', '插入 3：最终左堆存较小的一半，右堆存较大的一半，大小差不超过 1。'],
    variables: [['small', '较小一半，最大堆'], ['large', '较大一半，最小堆'], ['heap top', '最接近中间的值']],
    codeRead: ['新数先放进一边，再移动堆顶保证 small 中所有数 <= large 中所有数。', '然后调整两个堆的大小，让数量差不超过 1。', '奇数个元素时取较大那一边的堆顶；偶数时取两个堆顶平均。'],
    stuck: '中位数问题不要想着“维护完整排序”，只维护中间分界线。'
  },
  '139': {
    plain: '判断字符串能否被字典中的若干单词完整拼出来，每个单词可以重复使用。',
    naive: '可以递归尝试所有切分点，但会反复判断相同前缀。',
    bridge: 'dp[i] 只回答一个问题：s 的前 i 个字符能不能成功拆分。要判断 dp[i]，枚举最后一个单词从 j 开始。',
    example: ['s="leetcode"，字典 {leet, code}。', 'dp[0]=True。', '当 i=4 时，j=0，s[0:4]="leet" 在字典，所以 dp[4]=True。', '当 i=8 时，j=4，dp[4]=True 且 s[4:8]="code" 在字典，所以 dp[8]=True。'],
    variables: [['dp[i]', '前 i 个字符是否能被成功拆分'], ['j', '最后一个单词的起点'], ['word_set', '字典集合，负责 O(1) 查询']],
    codeRead: ['dp[0]=True 表示空字符串天然可以成功拆分。', '外层枚举结束位置 i。', '内层枚举最后一个单词起点 j。', '只要找到一个 dp[j] 为 True 且 s[j:i] 在字典，就可以提前把 dp[i] 设为 True。'],
    stuck: 'DP 定义先说完整：dp[i] = 前 i 个字符是否可拆。然后只考虑最后一个单词。'
  },
  '300': {
    plain: '找最长的严格递增子序列，元素不要求连续。',
    naive: '最容易理解的是 O(n²) DP：每个位置都问“前面哪些比我小，我能接在谁后面”。',
    bridge: 'dp[i] 表示“必须以 nums[i] 结尾”的最长递增子序列长度。枚举 j<i，只要 nums[j]<nums[i]，就能从 dp[j] 转移。',
    example: ['nums=[10,9,2,5,3,7]。', '到 5 时，前面 2<5，所以 dp[3]=dp[2]+1=2。', '到 7 时，可以接在 2、5、3 后面，取这些 dp 的最大值 +1。'],
    variables: [['dp[i]', '以 nums[i] 结尾的 LIS 长度'], ['j', '枚举 i 前面的候选前驱'], ['answer', '所有 dp[i] 的最大值']],
    codeRead: ['先把每个 dp[i] 初始化为 1，因为单独一个数就是长度 1。', '双层循环枚举 i 和 j。', '只有 nums[j] < nums[i] 时才能接。', '最后取 max(dp)。'],
    stuck: '不要第一遍背 tails。先记：dp[i] = 以 i 结尾，向前找所有更小的。'
  },
  '416': {
    plain: '能否把数组分成两个子集，使两个子集和相等。',
    naive: '总和如果是 sum，那么问题等价于：能不能选一些数凑出 sum/2。',
    bridge: '这就是 0/1 背包的布尔版本。dp[j] 表示容量 j 能不能被当前已经看过的数字凑出来。',
    example: ['[1,5,11,5] 总和 22，target=11。', '开始只有 dp[0]=True。', '处理 1 后 dp[1]=True；处理 5 后 dp[5]、dp[6] 等可能变 True。', '最终 dp[11]=True，说明可以划分。'],
    variables: [['target', '总和的一半'], ['dp[j]', '是否能用已经处理的数凑出 j'], ['value', '当前这一个只能使用一次的数字']],
    codeRead: ['总和是奇数直接 False。', 'dp[0]=True。', '每个 value 处理一次，容量 j 必须从 target 向下更新。', '倒序的原因是防止同一个 value 在一轮里被重复使用。'],
    stuck: '把“分成两半”翻译成“选一些数凑 target”，题目就变成普通 0/1 背包。'
  },
  '32': {
    plain: '找最长的连续合法括号子串。',
    naive: '第一遍优先学栈，不需要直接上 DP。栈里保存还没有匹配掉的位置。',
    bridge: '栈底保存“当前合法区间前一个无效位置”。遇左括号压下标；遇右括号先弹，若栈空说明这个右括号无法匹配，就把它作为新的边界。',
    example: ['s=")()())"。', '开始栈放 -1。遇第一个 ) 后栈空，把 0 放进去作为新边界。', '后面 () 匹配后，当前长度可以用 i - stack.top() 算出来。'],
    variables: [['stack', '未匹配左括号下标 + 最近一个无效边界'], ['i', '当前字符下标'], ['answer', '当前最长合法长度']],
    codeRead: ['栈先放 -1，这是计算从 0 开始合法串长度的关键。', '遇 ( 就压下标。', '遇 ) 先弹；如果弹完为空，把当前 i 压成新边界。', '如果不空，合法长度就是 i - stack.top()。'],
    stuck: '栈里不只放左括号，还要保留“最近无效位置”。-1 就是第一个边界。'
  },
  '72': {
    plain: '把字符串 word1 变成 word2，允许插入、删除、替换，求最少操作次数。',
    naive: '先想最后一个字符。如果两个末尾字符相同，就不需要新操作；不同，就只能从插入、删除、替换三种最后一步里选最优。',
    bridge: '定义 dp[i][j]：把 word1 前 i 个字符变成 word2 前 j 个字符的最少操作数。这个定义一确定，三个方向就分别对应三种操作。',
    example: ['horse → ros。', '如果当前比较 word1[i-1] 和 word2[j-1] 相同，直接看 dp[i-1][j-1]。', '如果不同：删除看 dp[i-1][j]，插入看 dp[i][j-1]，替换看 dp[i-1][j-1]，三者最小 +1。'],
    variables: [['dp[i][j]', 'word1[:i] 变成 word2[:j] 的最少操作'], ['dp[i-1][j]', '删除 word1 当前字符'], ['dp[i][j-1]', '插入 word2 当前字符'], ['dp[i-1][j-1]', '替换或字符相等']],
    codeRead: ['先初始化第一列 dp[i][0]=i：变成空串只能一直删。', '第一行 dp[0][j]=j：空串变目标只能一直插。', '双层循环逐格填写。', '相等就继承左上；不等就三方向最小 +1。'],
    stuck: '别背方程，先记三方向含义：上=删，左=插，左上=换。'
  }
};

function V7_isDeep(item) {
  return item && item.diff !== '简单';
}

function V7_topicGuide(item) {
  return V7_TOPIC_GUIDES[item.topic] || {
    naive: '先把题目按定义直接模拟，写出最朴素但正确的版本。',
    bridge: '再观察哪些计算被重复做了，把重复信息保存下来或利用结构单调性减少枚举。',
    variables: [['state', '当前状态'], ['answer', '最终答案']]
  };
}

function V7_guide(item) {
  const memory = V5_memory(item);
  const method = V6_methodInfo(item);
  const topic = V7_topicGuide(item);
  const special = V7_GUIDES[item.id] || {};
  return {
    plain: special.plain || `这题属于「${item.topic}」。先别想模板，先明确题目真正要你输出什么：${item.core}`,
    naive: special.naive || topic.naive,
    bridge: special.bridge || `${topic.bridge} 当前默认学习方法是「${method.name}」：${method.tradeoff}`,
    example: special.example || [
      '先准备一个最小样例，用 3～6 个元素即可，不要一开始拿大样例。',
      `按“${memory.steps[0]}”执行第一步，并写下状态变化。`,
      `继续执行“${memory.steps[1]}”，观察为什么状态能复用。`,
      `最后用“${memory.steps[2]}”得到答案，并检查边界。`
    ],
    variables: special.variables || topic.variables,
    codeRead: special.codeRead || [
      '先读初始化：每个变量分别代表什么，不要急着看循环。',
      '再读主循环：每轮只问“这一轮新加入了什么信息”。',
      '最后读状态更新和返回值：确认它们与三步法一一对应。'
    ],
    stuck: special.stuck || `卡住时先回到口诀「${memory.mantra}」，只尝试写出第一步，不要强行一次默写完整代码。`
  };
}

function V7_variableTableHTML(guide) {
  return `<div class="v7-variable-table">${guide.variables.map(([name, meaning]) => `<div><code>${escapeHTML(name)}</code><span>${escapeHTML(meaning)}</span></div>`).join('')}</div>`;
}

function V7_deepExplanationHTML(item) {
  const guide = V7_guide(item);
  const memory = V5_memory(item);
  const method = V6_methodInfo(item);
  return `<div class="v7-deep-story">
    <section class="v7-slow-banner"><div><span>${item.diff === '困难' ? '困难题慢讲' : '中等题慢讲'}</span><strong>先把逻辑讲明白，再看代码</strong></div><p>这一层故意比普通题更啰嗦。目标不是记住“神奇模板”，而是让你能自己重新推出来。</p></section>
    <section><h4>1. 题目到底在问什么？</h4><p>${escapeHTML(guide.plain)}</p><div class="v7-question"><b>先回答：</b>输入是什么？输出是什么？连续/不连续？能不能重复用元素？有没有顺序约束？</div></section>
    <section><h4>2. 第一反应：先想最朴素的方法</h4><p>${escapeHTML(guide.naive)}</p><p class="v7-soft">朴素方法不一定最终提交，但它能帮你确认状态、边界和正确性，是理解优化方法的起点。</p></section>
    <section><h4>3. 从朴素方法怎么自然走到当前解法？</h4><p>${escapeHTML(guide.bridge)}</p><div class="v7-method-card"><span>当前默认方法</span><strong>${escapeHTML(method.name)}</strong><small>${escapeHTML(method.tradeoff)}</small></div></section>
    <section><h4>4. 把解法拆开，一步一步做</h4><ol class="v7-numbered">${memory.steps.map((step, index) => `<li><span>${index + 1}</span><p>${escapeHTML(step)}</p></li>`).join('')}</ol><p class="v7-soft">写代码时，一步通常对应一段初始化 / 循环 / 状态更新。不要把几步压在一行。</p></section>
    <section><h4>5. 这些变量分别在干什么？</h4>${V7_variableTableHTML(guide)}</section>
    <section><h4>6. 用一个小例子手算一遍</h4><ol class="v7-walkthrough">${guide.example.map((line) => `<li>${escapeHTML(line)}</li>`).join('')}</ol><p class="v7-soft">如果你无法手算一个 5 个元素左右的小例子，说明还没到背代码的时候。</p></section>
    <section><h4>7. 代码应该按什么顺序读？</h4><ol class="v7-code-read">${guide.codeRead.map((line) => `<li>${escapeHTML(line)}</li>`).join('')}</ol></section>
    <section><h4>8. 为什么它是对的？</h4><p><b>关键不变量：</b>${escapeHTML(memory.invariant)}</p><p>${escapeHTML(item.oral)}</p></section>
    <section><h4>9. 易错点不要只背一句话</h4><div class="pitfall-card"><b>原易错点：</b>${escapeHTML(item.pitfall)}</div><ul class="v7-checklist"><li>初始化是否覆盖空输入 / 单元素？</li><li>循环边界是否包含最后一个候选？</li><li>更新答案和移动指针的先后顺序是否正确？</li><li>如果有去重 / visited / 回溯恢复，是否在正确时机执行？</li></ul></section>
    <section><h4>10. 复杂度怎么理解，而不是怎么背</h4><p><b>${escapeHTML(memory.complexity)}</b></p><p class="v7-soft">数循环次数：每个元素被访问几次？辅助结构最多存多少元素？先回答这两个问题，再说复杂度。</p></section>
    <section class="v7-stuck"><h4>卡住时只看这一句</h4><p>${escapeHTML(guide.stuck)}</p></section>
  </div>`;
}

function V7_commentBlock(item, lang) {
  if (!V7_isDeep(item)) return '';
  const guide = V7_guide(item);
  const prefix = lang === 'py' ? '# ' : '// ';
  const lines = [
    '================ 中等/困难题阅读指南 ================',
    `题目先用人话理解：${guide.plain}`,
    `朴素想法：${guide.naive}`,
    `为什么转到当前解法：${guide.bridge}`,
    '',
    '关键变量：',
    ...guide.variables.map(([name, meaning]) => `- ${name}: ${meaning}`),
    '',
    '阅读代码顺序：',
    ...guide.codeRead.map((text, index) => `${index + 1}. ${text}`),
    '',
    `卡住提示：${guide.stuck}`,
    '======================================================'
  ];
  return lines.map((line) => `${prefix}${line}`).join('\n');
}

const V7_previousStudyPython = V5_studyPython;
const V7_previousStudyCpp = V5_studyCpp;
const V7_previousExplanation = V5_explanationHTML;

V5_studyPython = function V7_studyPython(item) {
  const base = V7_previousStudyPython(item);
  if (!V7_isDeep(item)) return base;
  return `${V7_commentBlock(item, 'py')}\n\n${base}`;
};

V5_studyCpp = function V7_studyCpp(item) {
  const base = V7_previousStudyCpp(item);
  if (!V7_isDeep(item)) return base;
  return `${V7_commentBlock(item, 'cpp')}\n\n${base}`;
};

V5_explanationHTML = function V7_explanationHTML(item) {
  if (!V7_isDeep(item)) return V7_previousExplanation(item);
  return V7_deepExplanationHTML(item);
};

if (typeof DATA !== 'undefined' && DATA.length) {
  render();
}
