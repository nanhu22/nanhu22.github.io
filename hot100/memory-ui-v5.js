/* Hot100 Memory Cards v5
 * This layer intentionally overrides only card rendering/binding from app.js.
 * Existing review state, queues, history, backup and exam mode remain unchanged.
 */

function V5_memory(item) {
  const data = window.HOT100_MEMORY || {};
  return data[item.id] || {
    mantra: item.core,
    trigger: item.topic,
    steps: [item.core, item.oral, `检查边界：${item.pitfall}`],
    invariant: item.oral,
    complexity: '以题解中的复杂度分析为准',
    acm: '读入题目数据 → 建模 → 调用核心算法 → 输出答案。',
    ask: ['核心状态是什么？', '为什么算法正确？', '最容易写错的边界是什么？']
  };
}

function V5_indentPython(code) {
  const lines = String(code || '').split('\n');
  const output = [];
  for (const line of lines) {
    const indent = (line.match(/^\s*/) || [''])[0];
    const body = line.slice(indent.length);
    // Expand the compressed one-line style only when it is safe enough for study display.
    const control = body.match(/^(for\s+.+|while\s+.+|if\s+.+|elif\s+.+|else|def\s+.+):(.+;.+)$/);
    if (control) {
      output.push(`${indent}${control[1]}:`);
      for (const part of control[2].split(';')) {
        if (part.trim()) output.push(`${indent}    ${part.trim()}`);
      }
      continue;
    }
    if (body.includes(';') && !body.includes('";"') && !body.includes("';'")) {
      const parts = body.split(';').map((part) => part.trim()).filter(Boolean);
      if (parts.length > 1) {
        output.push(...parts.map((part) => `${indent}${part}`));
        continue;
      }
    }
    output.push(line);
  }
  return output.join('\n');
}

function V5_pythonHelpers(code) {
  let helpers = '';
  if (/\bListNode\b/.test(code) && !/class\s+ListNode/.test(code)) {
    helpers += `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n`;
  }
  if (/\bTreeNode\b/.test(code) && !/class\s+TreeNode/.test(code)) {
    helpers += `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n`;
  }
  if (/copyRandomList/.test(code) && !/class\s+Node/.test(code)) {
    helpers += `class Node:\n    def __init__(self, val=0, next=None, random=None):\n        self.val = val\n        self.next = next\n        self.random = random\n\n`;
  }
  return helpers;
}

function V5_cppHelpers(code) {
  let helpers = '#include <bits/stdc++.h>\nusing namespace std;\n\n';
  if (/\bListNode\b/.test(code) && !/struct\s+ListNode/.test(code)) {
    helpers += `struct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x = 0, ListNode* n = nullptr) : val(x), next(n) {}\n};\n\n`;
  }
  if (/\bTreeNode\b/.test(code) && !/struct\s+TreeNode/.test(code)) {
    helpers += `struct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int x = 0, TreeNode* l = nullptr, TreeNode* r = nullptr)\n        : val(x), left(l), right(r) {}\n};\n\n`;
  }
  if (/copyRandomList/.test(code) && !/class\s+Node/.test(code) && !/struct\s+Node/.test(code)) {
    helpers += `class Node {\npublic:\n    int val;\n    Node* next;\n    Node* random;\n    Node(int x = 0) : val(x), next(nullptr), random(nullptr) {}\n};\n\n`;
  }
  return helpers;
}

function V5_commentHeader(item, lang) {
  const m = V5_memory(item);
  const prefix = lang === 'py' ? '# ' : '// ';
  const lines = [
    `题目：#${item.id} ${item.title}`,
    `背诵口诀：${m.mantra}`,
    `识别信号：${m.trigger}`,
    `不变量：${m.invariant}`,
    `复杂度：${m.complexity}`,
    `ACM 建模：${m.acm}`,
    '三步解法：',
    ...m.steps.map((step, index) => `${index + 1}. ${step}`),
    '提示：LeetCode 原题没有统一 stdin/stdout。本页 ACM 版强调“完整依赖 + 清晰核心实现 + 输入建模协议”，实际比赛时只需按题面替换读入/输出层。'
  ];
  return lines.map((line) => `${prefix}${line}`).join('\n');
}

function V5_studyPython(item) {
  const raw = V5_indentPython(item.py);
  return `${V5_commentHeader(item, 'py')}\n\n${V5_pythonHelpers(raw)}${raw}`.trim();
}

function V5_studyCpp(item) {
  const raw = String(CPP[item.id] || '');
  return `${V5_commentHeader(item, 'cpp')}\n\n${V5_cppHelpers(raw)}${raw}`.trim();
}

function V5_memoryDeckHTML(item) {
  const m = V5_memory(item);
  return `<section class="memory-deck">
    <div class="memory-topline">
      <span class="memory-label">① 一句话背诵</span>
      <span class="memory-trigger">看到「${escapeHTML(m.trigger)}」就想到它</span>
    </div>
    <div class="memory-mantra">${escapeHTML(m.mantra)}</div>

    <div class="memory-section">
      <div class="memory-label">② 三步默写</div>
      <ol class="memory-steps">${m.steps.map((step) => `<li><b>${escapeHTML(step)}</b></li>`).join('')}</ol>
    </div>

    <div class="memory-two-col">
      <div class="memory-callout invariant-box"><span>③ 不变量 / 为什么对</span><p>${escapeHTML(m.invariant)}</p></div>
      <div class="memory-callout complexity-box"><span>④ 复杂度</span><p>${escapeHTML(m.complexity)}</p></div>
    </div>

    <div class="memory-callout acm-box"><span>⑤ ACM 输入建模</span><p>${escapeHTML(m.acm)}</p></div>

    <details class="recall-box">
      <summary>闭眼自测：3 个问题</summary>
      <ol>${m.ask.map((question) => `<li>${escapeHTML(question)}</li>`).join('')}</ol>
      <p class="recall-tip">能不看代码回答这 3 个问题，再默写三步法，就算真正记住。</p>
    </details>
  </section>`;
}

function V5_explanationHTML(item) {
  const m = V5_memory(item);
  return `<div class="solution-story">
    <section><h4>1. 怎么识别这道题</h4><p><b>触发词：</b>${escapeHTML(m.trigger)}</p><p>${escapeHTML(item.core)}</p></section>
    <section><h4>2. 解法是怎么推出来的</h4><ol>${m.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol></section>
    <section><h4>3. 为什么这样做一定正确</h4><p>${escapeHTML(m.invariant)}</p><p class="solution-oral">${escapeHTML(item.oral)}</p></section>
    <section><h4>4. 最容易写错什么</h4><div class="pitfall-card">${escapeHTML(item.pitfall)}</div></section>
    <section><h4>5. 复杂度怎么口述</h4><p>${escapeHTML(m.complexity)}</p></section>
    <section><h4>6. 30 秒面试回答</h4><blockquote>${escapeHTML(item.oral)}</blockquote></section>
  </div>`;
}

function V5_codePane(item, lang) {
  const study = lang === 'py' ? V5_studyPython(item) : V5_studyCpp(item);
  const raw = lang === 'py' ? item.py : CPP[item.id];
  const label = lang === 'py' ? 'Python ACM 学习版' : 'C++ ACM 学习版';
  const copyKey = lang === 'py' ? 'study-py' : 'study-cpp';
  return `<div class="acm-note"><b>${label}</b><span>先背注释里的“口诀 / 不变量 / 三步法”，再默写代码；不要逐字符背代码。</span></div>
    <div class="codebox study-codebox"><button type="button" class="copy-btn" data-copy="${copyKey}">复制学习版</button><pre><code>${escapeHTML(study)}</code></pre></div>
    <details class="raw-template"><summary>20 秒速背模板（原精简版）</summary><div class="codebox"><button type="button" class="copy-btn" data-copy="${lang === 'py' ? 'raw-py' : 'raw-cpp'}">复制速背版</button><pre><code>${escapeHTML(raw)}</code></pre></div></details>`;
}

function V5_answerDetailsHTML(item, record) {
  return `${V5_memoryDeckHTML(item)}
    <div class="tabs v5-tabs">
      <button type="button" class="tab-btn active" data-tab="explain">题解推导</button>
      <button type="button" class="tab-btn" data-tab="py">Python ACM</button>
      <button type="button" class="tab-btn" data-tab="cpp">C++ ACM</button>
      <button type="button" class="tab-btn" data-tab="links">关联 / 发散</button>
    </div>
    <div class="pane active" data-pane="explain">${V5_explanationHTML(item)}</div>
    <div class="pane" data-pane="py">${V5_codePane(item, 'py')}</div>
    <div class="pane" data-pane="cpp">${V5_codePane(item, 'cpp')}</div>
    <div class="pane" data-pane="links"><div class="link-study"><p><b>Hot100 关联：</b>${escapeHTML(item.related)}</p><p><b>迁移发散：</b>${escapeHTML(item.expand)}</p><p><a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/">LeetCode 原题</a> · <a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/solutions/">题解聚合页</a></p></div></div>
    <div class="section-label">复习结果：不要按“看懂了”，按“能不能关掉答案写出来”来选</div>
    <div class="outcomes"><button type="button" class="result-btn good" data-result="good">能默写 ✓</button><button type="button" class="result-btn fuzzy" data-result="fuzzy">思路会 / 代码卡 △</button><button type="button" class="result-btn bad" data-result="bad">还不会 ×</button></div>
    <div class="section-label">手动复习阶段</div>
    <div class="review">${[0, 1, 2, 3].map((stage) => `<button type="button" class="review-btn ${record.stage === stage ? 'active' : ''}" data-stage="${stage}">${stageLabel(stage)}</button>`).join('')}</div>`;
}

// Override v4 renderer with the memorization-first v5 card.
cardHTML = function V5_cardHTML(item) {
  const record = rec(item.id);
  const m = V5_memory(item);
  const due = !record.nextReview || record.nextReview <= dayString();
  const isExamLocked = mode === 'exam' && item.id === focusId && !examReveal;
  const summary = isExamLocked ? '考试模式：先自己说出口诀、三步法和复杂度，再揭晓。' : m.mantra;
  const details = isExamLocked ? examLockedHTML() : V5_answerDetailsHTML(item, record);
  return `<article class="card memory-card${isExamLocked ? ' exam-locked' : ''}" data-id="${escapeHTML(item.id)}">
    <div class="summary">
      <div class="row">
        <span class="num">#${escapeHTML(item.id)}</span>
        <strong class="title">${escapeHTML(item.title)}</strong>
        <span class="tag">${escapeHTML(item.topic)}</span>
        <span class="tag ${diffClass(item.diff)}">${escapeHTML(item.diff)}</span>
        <span class="tag">${stageLabel(record.stage)}</span>
        ${record.weak ? '<span class="tag weak">薄弱</span>' : ''}
        ${record.mistakes ? `<span class="tag mistake">错 ${record.mistakes}</span>` : ''}
        <span class="spacer"></span>
        <button type="button" class="icon-btn star ${record.star ? 'starred' : ''}" aria-label="${record.star ? '取消收藏' : '收藏题目'}">${record.star ? '★' : '☆'}</button>
      </div>
      <div class="summary-memory"><span>口诀</span><b>${escapeHTML(summary)}</b></div>
      ${isExamLocked ? '' : `<div class="summary-trigger">触发：${escapeHTML(m.trigger)}</div>`}
      <div class="card-note">${due ? '<span class="due">今日可复习</span>' : `下次复习 ${escapeHTML(record.nextReview)}`} ${record.lastResult ? `· 上次：${resultName(record.lastResult)}` : ''}</div>
    </div>
    <div class="detail">${details}</div>
  </article>`;
};

bindCards = function V5_bindCards() {
  document.querySelectorAll('.summary').forEach((element) => {
    element.addEventListener('click', () => element.parentElement.classList.toggle('open'));
  });
  document.querySelectorAll('.star').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleStar(button.closest('.card').dataset.id);
    });
  });
  document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const card = button.closest('.card');
      card.querySelectorAll('.tab-btn,.pane').forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      const pane = card.querySelector(`[data-pane="${button.dataset.tab}"]`);
      if (pane) pane.classList.add('active');
    });
  });
  document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      const card = button.closest('.card');
      const id = card.dataset.id;
      const item = DATA.find((value) => value.id === id);
      let text = '';
      if (button.dataset.copy === 'study-py') text = V5_studyPython(item);
      else if (button.dataset.copy === 'study-cpp') text = V5_studyCpp(item);
      else if (button.dataset.copy === 'raw-cpp') text = CPP[id];
      else text = item.py;
      const original = button.textContent;
      try {
        await copyText(text);
        button.textContent = '已复制';
      } catch (error) {
        button.textContent = '复制失败';
        console.warn(error);
      }
      window.setTimeout(() => { button.textContent = original; }, 1000);
    });
  });
  document.querySelectorAll('[data-result]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      applyResult(button.closest('.card').dataset.id, button.dataset.result);
    });
  });
  document.querySelectorAll('[data-stage]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      setStage(button.closest('.card').dataset.id, Number(button.dataset.stage));
    });
  });
  const reveal = document.getElementById('revealAnswerBtn');
  if (reveal) {
    reveal.addEventListener('click', (event) => {
      event.stopPropagation();
      examReveal = true;
      render();
    });
  }
};

// If app.js finished loading from a very fast cache before this extension executed, refresh once.
if (typeof DATA !== 'undefined' && DATA.length) render();
