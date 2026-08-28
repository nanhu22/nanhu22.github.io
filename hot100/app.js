const OLD_KEY = 'hot100-review-v2';
const STORE_KEY = 'hot100-practice-v3';
const DAYS_KEY = 'hot100-study-days-v3';
const QUEUE_KEY = 'hot100-daily-queue-v3';
const HISTORY_KEY = 'hot100-attempt-history-v4';
const BACKUP_VERSION = 4;

let DATA = [];
let CPP = {};
let mode = 'all';
let focusId = null;
let examReveal = false;
let timerLeft = 20 * 60;
let timerId = null;
let timerRunning = false;
let storageAvailable = true;
let els = {};

function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    storageAvailable = false;
    console.warn(`Unable to read ${key}`, error);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    storageAvailable = false;
    console.warn(`Unable to write ${key}`, error);
    return false;
  }
}

let store = readJSON(STORE_KEY, {});
let history = readJSON(HISTORY_KEY, []);
const old = readJSON(OLD_KEY, {});
for (const [id, stage] of Object.entries(old)) {
  if (!store[id]) {
    store[id] = defaultRecord(Number(stage) || 0);
  }
}
writeJSON(STORE_KEY, store);

function defaultRecord(stage = 0) {
  return {
    stage,
    star: false,
    weak: false,
    mistakes: 0,
    lastResult: '',
    lastReviewed: '',
    nextReview: ''
  };
}

function rec(id) {
  if (!store[id]) store[id] = defaultRecord();
  return store[id];
}

function saveStore() {
  writeJSON(STORE_KEY, store);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function dayString(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function timeString(date = new Date()) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addDays(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return dayString(date);
}

function markStudyDay() {
  const days = new Set(readJSON(DAYS_KEY, []));
  days.add(dayString());
  writeJSON(DAYS_KEY, [...days].sort());
}

function streak() {
  const days = new Set(readJSON(DAYS_KEY, []));
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  if (!days.has(dayString(date))) date.setDate(date.getDate() - 1);
  let count = 0;
  while (days.has(dayString(date))) {
    count += 1;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function stageLabel(stage) {
  return ['未刷', '首刷', '二刷', '三刷'][stage || 0];
}

function resultName(result) {
  return { good: '掌握', fuzzy: '模糊', bad: '不会' }[result] || result;
}

function escapeHTML(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function diffClass(diff) {
  if (diff === '简单') return 'easy';
  if (diff === '中等') return 'mid';
  return 'hard';
}

function parseCards(markdown) {
  const output = [];
  for (const block of markdown.split(/^### /m).slice(1)) {
    const [head, ...rest] = block.split('\n');
    const parts = head.split('|').map((item) => item.trim());
    if (parts.length < 5) continue;
    const body = rest.join('\n');
    const get = (key) => ((body.match(new RegExp(`\\*\\*${key}\\*\\*：([^\\n]+)`)) || [])[1] || '').trim();
    const py = ((body.match(/```python\n([\s\S]*?)```/) || [])[1] || '').trim();
    output.push({
      id: parts[0], title: parts[1], topic: parts[2], diff: parts[3], slug: parts[4],
      core: get('核心'), pitfall: get('易错'), oral: get('口述'),
      related: get('关联'), expand: get('发散'), py
    });
  }
  return output;
}

function parseCpp(markdown) {
  const output = {};
  const pattern = /^### (\d+)\s*\n```cpp\n([\s\S]*?)```/gm;
  let match;
  while ((match = pattern.exec(markdown))) {
    output[match[1]] = match[2].trim();
  }
  return output;
}

function getRequired(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`页面缺少必要元素 #${id}`);
  return element;
}

function cacheDOM() {
  els = {
    total: getRequired('total'), first: getRequired('first'), second: getRequired('second'),
    third: getRequired('third'), mastery: getRequired('mastery'), streak: getRequired('streakEl'),
    bar: getRequired('bar'), progressText: getRequired('progressText'), loadError: getRequired('loadError'),
    todayN: getRequired('todayN'), starN: getRequired('starN'), mistakeN: getRequired('mistakeN'),
    weakN: getRequired('weakN'), randomBtn: getRequired('randomBtn'), interviewBtn: getRequired('interviewBtn'),
    examBtn: getRequired('examBtn'), q: getRequired('q'), topic: getRequired('topic'), diff: getRequired('diff'),
    rf: getRequired('rf'), resultCount: getRequired('resultCount'), grid: getRequired('grid'),
    timerPanel: getRequired('timerPanel'), timerClock: getRequired('timerClock'), timerToggle: getRequired('timerToggle'),
    timerReset: getRequired('timerReset'), timerExit: getRequired('timerExit'),
    dailyDone: getRequired('dailyDone'), dailyTotal: getRequired('dailyTotal'), dailyBar: getRequired('dailyBar'),
    historyList: getRequired('historyList'), exportBtn: getRequired('exportBtn'), importBtn: getRequired('importBtn'),
    importInput: getRequired('importInput'), storageWarning: getRequired('storageWarning')
  };
}

async function load() {
  try {
    const cardFiles = Array.from({ length: 15 }, (_, i) => `./data/cards-${pad(i + 1)}.md`);
    const cppFiles = Array.from({ length: 5 }, (_, i) => `./data/cpp-${pad(i + 1)}.md`);
    const getText = async (file) => {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`无法加载 ${file}`);
      return response.text();
    };
    const [cards, cpp] = await Promise.all([
      Promise.all(cardFiles.map(getText)),
      Promise.all(cppFiles.map(getText))
    ]);
    DATA = parseCards(cards.join('\n')).sort((a, b) => Number(a.id) - Number(b.id));
    CPP = cpp.reduce((acc, text) => Object.assign(acc, parseCpp(text)), {});
    const missingCpp = DATA.filter((item) => !CPP[item.id]);
    if (DATA.length !== 100) throw new Error(`题卡数量校验失败：${DATA.length}/100`);
    if (Object.keys(CPP).length !== 100 || missingCpp.length) {
      throw new Error(`C++ 模板校验失败：${100 - missingCpp.length}/100`);
    }
    const topics = [...new Set(DATA.map((item) => item.topic))];
    for (const topicName of topics) {
      const option = document.createElement('option');
      option.value = topicName;
      option.textContent = topicName;
      els.topic.appendChild(option);
    }
    ensureDailyQueue();
    applyInitialMode();
    render();
    if (!storageAvailable) showStorageWarning();
  } catch (error) {
    console.error(error);
    els.loadError.innerHTML = `<div class="error">载入失败：${escapeHTML(error.message)}</div>`;
    els.progressText.textContent = '数据载入失败';
  }
}

function ensureDailyQueue() {
  const today = dayString();
  const cached = readJSON(QUEUE_KEY, {});
  if (cached.date === today && Array.isArray(cached.ids)) return cached.ids;
  const candidates = DATA
    .filter((item) => {
      const record = rec(item.id);
      return !record.nextReview || record.nextReview <= today;
    })
    .sort((a, b) => {
      const A = rec(a.id), B = rec(b.id);
      const priorityA = A.weak ? 0 : A.mistakes ? 1 : A.stage === 0 ? 2 : 3;
      const priorityB = B.weak ? 0 : B.mistakes ? 1 : B.stage === 0 ? 2 : 3;
      return priorityA - priorityB || A.stage - B.stage || hash(today + a.id) - hash(today + b.id);
    });
  const ids = candidates.slice(0, 12).map((item) => item.id);
  writeJSON(QUEUE_KEY, { date: today, ids });
  return ids;
}

function dailySnapshot() {
  const ids = ensureDailyQueue();
  const today = dayString();
  const done = ids.filter((id) => rec(id).lastReviewed === today).length;
  return { ids, done, total: ids.length, remaining: Math.max(0, ids.length - done) };
}

function todayQueue() {
  const snapshot = dailySnapshot();
  const ids = new Set(snapshot.ids);
  const today = dayString();
  return DATA.filter((item) => ids.has(item.id) && rec(item.id).lastReviewed !== today);
}

function baseList() {
  if (mode === 'today') {
    const ids = new Set(todayQueue().map((item) => item.id));
    return DATA.filter((item) => ids.has(item.id));
  }
  if (mode === 'starred') return DATA.filter((item) => rec(item.id).star);
  if (mode === 'mistake') return DATA.filter((item) => rec(item.id).mistakes > 0);
  if (mode === 'weak') return DATA.filter((item) => rec(item.id).weak);
  if (['random', 'interview', 'exam'].includes(mode)) return DATA.filter((item) => item.id === focusId);
  return DATA;
}

function filtered() {
  const query = els.q.value.trim().toLowerCase();
  const selectedTopic = els.topic.value;
  const selectedDiff = els.diff.value;
  const selectedReview = els.rf.value;
  return baseList().filter((item) => {
    const text = `${item.id}${item.title}${item.core}${item.topic}`.toLowerCase();
    return (!query || text.includes(query)) &&
      (!selectedTopic || item.topic === selectedTopic) &&
      (!selectedDiff || item.diff === selectedDiff) &&
      (selectedReview === '' || String(rec(item.id).stage) === selectedReview);
  });
}

function modeName() {
  return {
    all: '全部题卡', today: '今日复习', starred: '收藏', mistake: '错题本', weak: '薄弱题',
    random: '随机抽卡', interview: '计时面试', exam: '考试模式'
  }[mode] || '全部题卡';
}

function render() {
  const items = filtered();
  els.resultCount.textContent = `当前 ${items.length} 题 · ${modeName()}`;
  els.grid.innerHTML = items.length
    ? items.map(cardHTML).join('')
    : '<div class="empty">这里暂时没有题目。可以切回“全部题卡”，或调整筛选条件。</div>';
  bindCards();
  renderStats();
  renderModeCounts();
  renderDailyProgress();
  renderHistory();
  if (focusId) {
    const element = document.querySelector(`.card[data-id="${CSS.escape(String(focusId))}"]`);
    if (element) {
      element.classList.add('open');
      window.setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
    }
  }
}

function cardHTML(item) {
  const record = rec(item.id);
  const due = !record.nextReview || record.nextReview <= dayString();
  const isExamLocked = mode === 'exam' && item.id === focusId && !examReveal;
  const core = isExamLocked ? '考试模式：先独立口述思路并写出解法，再点击“查看答案”。' : item.core;
  const details = isExamLocked ? examLockedHTML() : answerDetailsHTML(item, record);
  return `<article class="card${isExamLocked ? ' exam-locked' : ''}" data-id="${escapeHTML(item.id)}">
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
      <p class="core">${escapeHTML(core)}</p>
      <div class="card-note">${due ? '<span class="due">今日可复习</span>' : `下次复习 ${escapeHTML(record.nextReview)}`} ${record.lastResult ? `· 上次：${resultName(record.lastResult)}` : ''}</div>
    </div>
    <div class="detail">${details}</div>
  </article>`;
}

function examLockedHTML() {
  return `<div class="exam-guard">
    <div class="exam-icon">◎</div>
    <div><strong>答案已隐藏</strong><p>先写出思路、复杂度和代码。准备好后再揭晓 Python / C++ 模板、易错点和口述答案。</p></div>
    <button type="button" class="reveal-btn" id="revealAnswerBtn">查看答案</button>
  </div>`;
}

function answerDetailsHTML(item, record) {
  return `<div class="tabs">
      <button type="button" class="tab-btn active" data-tab="py">Python</button>
      <button type="button" class="tab-btn" data-tab="cpp">C++</button>
      <button type="button" class="tab-btn" data-tab="pitfall">易错点</button>
      <button type="button" class="tab-btn" data-tab="oral">面试口述</button>
      <button type="button" class="tab-btn" data-tab="links">关联 / 发散</button>
    </div>
    <div class="pane active" data-pane="py"><div class="codebox"><button type="button" class="copy-btn" data-copy="py">复制 Python</button><pre><code>${escapeHTML(item.py)}</code></pre></div></div>
    <div class="pane" data-pane="cpp"><div class="codebox"><button type="button" class="copy-btn" data-copy="cpp">复制 C++</button><pre><code>${escapeHTML(CPP[item.id])}</code></pre></div></div>
    <div class="pane" data-pane="pitfall"><p>${escapeHTML(item.pitfall)}</p></div>
    <div class="pane" data-pane="oral"><p>${escapeHTML(item.oral)}</p></div>
    <div class="pane" data-pane="links"><p><b>Hot100 关联：</b>${escapeHTML(item.related)}</p><p><b>发散：</b>${escapeHTML(item.expand)}</p><p><a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/">LeetCode 原题</a> · <a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${encodeURIComponent(item.slug)}/solutions/">题解聚合页</a></p></div>
    <div class="section-label">本轮结果</div>
    <div class="outcomes"><button type="button" class="result-btn good" data-result="good">掌握 ✓</button><button type="button" class="result-btn fuzzy" data-result="fuzzy">模糊 △</button><button type="button" class="result-btn bad" data-result="bad">不会 ×</button></div>
    <div class="section-label">手动复习阶段</div>
    <div class="review">${[0, 1, 2, 3].map((stage) => `<button type="button" class="review-btn ${record.stage === stage ? 'active' : ''}" data-stage="${stage}">${stageLabel(stage)}</button>`).join('')}</div>`;
}

function applyResult(id, result) {
  const record = rec(id);
  record.lastResult = result;
  record.lastReviewed = dayString();
  markStudyDay();
  if (result === 'good') {
    record.stage = Math.min(3, record.stage + 1);
    if (record.stage >= 2) record.weak = false;
    record.nextReview = addDays([0, 1, 3, 7][record.stage] || 7);
  } else if (result === 'fuzzy') {
    record.weak = true;
    record.nextReview = addDays(1);
  } else if (result === 'bad') {
    record.stage = Math.max(0, record.stage - 1);
    record.weak = true;
    record.mistakes = (record.mistakes || 0) + 1;
    record.nextReview = addDays(1);
  }
  logAttempt(id, result);
  saveStore();
  render();
}

function setStage(id, stage) {
  const record = rec(id);
  record.stage = stage;
  record.lastReviewed = dayString();
  record.nextReview = stage === 0 ? dayString() : addDays([0, 1, 3, 7][stage]);
  markStudyDay();
  logAttempt(id, `stage-${stage}`);
  saveStore();
  render();
}

function toggleStar(id) {
  const record = rec(id);
  record.star = !record.star;
  saveStore();
  render();
}

function logAttempt(id, result) {
  history.unshift({ id, result, day: dayString(), time: timeString() });
  history = history.slice(0, 120);
  writeJSON(HISTORY_KEY, history);
}

async function copyText(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  textarea.remove();
  if (!ok) throw new Error('浏览器不允许复制');
}

function bindCards() {
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
      const text = button.dataset.copy === 'cpp' ? CPP[id] : item.py;
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
}

function masteryScore() {
  if (!DATA.length) return 0;
  const total = DATA.reduce((sum, item) => sum + rec(item.id).stage / 3, 0);
  return Math.round((total / DATA.length) * 100);
}

function renderStats() {
  const stages = DATA.map((item) => rec(item.id).stage);
  const thirdCount = stages.filter((stage) => stage >= 3).length;
  els.total.textContent = DATA.length;
  els.first.textContent = stages.filter((stage) => stage >= 1).length;
  els.second.textContent = stages.filter((stage) => stage >= 2).length;
  els.third.textContent = thirdCount;
  els.mastery.textContent = `${masteryScore()}%`;
  els.streak.textContent = streak();
  els.bar.style.width = `${DATA.length ? thirdCount / DATA.length * 100 : 0}%`;
  els.progressText.textContent = `三刷完成 ${thirdCount} / ${DATA.length} · 今日剩余 ${dailySnapshot().remaining} 题`;
}

function renderModeCounts() {
  els.todayN.textContent = dailySnapshot().remaining;
  els.starN.textContent = DATA.filter((item) => rec(item.id).star).length;
  els.mistakeN.textContent = DATA.filter((item) => rec(item.id).mistakes > 0).length;
  els.weakN.textContent = DATA.filter((item) => rec(item.id).weak).length;
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
}

function renderDailyProgress() {
  const snapshot = dailySnapshot();
  els.dailyDone.textContent = snapshot.done;
  els.dailyTotal.textContent = snapshot.total;
  const percent = snapshot.total ? snapshot.done / snapshot.total * 100 : 100;
  els.dailyBar.style.width = `${percent}%`;
}

function renderHistory() {
  const recent = history.slice(0, 8);
  if (!recent.length) {
    els.historyList.innerHTML = '<div class="history-empty">完成一次“掌握 / 模糊 / 不会”后，这里会出现训练记录。</div>';
    return;
  }
  els.historyList.innerHTML = recent.map((entry) => {
    const item = DATA.find((value) => value.id === String(entry.id));
    if (!item) return '';
    const label = String(entry.result).startsWith('stage-') ? `手动设为${stageLabel(Number(entry.result.slice(-1)))}` : resultName(entry.result);
    return `<button type="button" class="history-item" data-history-id="${escapeHTML(item.id)}"><span><b>#${escapeHTML(item.id)} ${escapeHTML(item.title)}</b><small>${escapeHTML(entry.day)} ${escapeHTML(entry.time)}</small></span><em>${escapeHTML(label)}</em></button>`;
  }).join('');
  document.querySelectorAll('[data-history-id]').forEach((button) => {
    button.addEventListener('click', () => {
      clearFilters();
      mode = 'random';
      focusId = button.dataset.historyId;
      examReveal = false;
      render();
    });
  });
}

function clearFilters() {
  els.q.value = '';
  els.topic.value = '';
  els.diff.value = '';
  els.rf.value = '';
}

function setMode(nextMode) {
  mode = nextMode;
  focusId = null;
  examReveal = false;
  if (nextMode !== 'interview') stopTimer(true);
  render();
}

function randomCard(nextMode = 'random') {
  clearFilters();
  if (nextMode !== 'interview') stopTimer(true);
  const preferred = DATA.filter((item) => rec(item.id).stage < 3 || rec(item.id).weak);
  const pool = ['interview', 'exam'].includes(nextMode) && preferred.length ? preferred : DATA;
  const pick = pool[Math.floor(Math.random() * pool.length)] || DATA[0];
  focusId = pick.id;
  mode = nextMode;
  examReveal = false;
  if (nextMode === 'interview') startInterview();
  render();
}

function fmtTime(seconds) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}

function drawTimer() {
  els.timerClock.textContent = fmtTime(timerLeft);
  els.timerToggle.textContent = timerRunning ? '暂停' : '继续';
}

function runTimer() {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    if (timerRunning && timerLeft > 0) {
      timerLeft -= 1;
      drawTimer();
    }
    if (timerLeft === 0) {
      timerRunning = false;
      window.clearInterval(timerId);
      timerId = null;
      els.timerClock.textContent = '00:00 · 时间到';
    }
  }, 1000);
}

function startInterview() {
  timerLeft = 20 * 60;
  timerRunning = true;
  els.timerPanel.classList.add('show');
  drawTimer();
  runTimer();
}

function stopTimer(hide = true) {
  window.clearInterval(timerId);
  timerId = null;
  timerRunning = false;
  if (hide) els.timerPanel.classList.remove('show');
}

function resetTimer() {
  timerLeft = 20 * 60;
  timerRunning = true;
  els.timerPanel.classList.add('show');
  drawTimer();
  runTimer();
}

function showStorageWarning() {
  els.storageWarning.hidden = false;
  els.storageWarning.textContent = '浏览器阻止了本地存储：本次进度可使用，但刷新页面后可能无法保留。';
}

function exportProgress() {
  const backup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    store,
    studyDays: readJSON(DAYS_KEY, []),
    dailyQueue: readJSON(QUEUE_KEY, {}),
    history
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hot100-progress-${dayString()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importProgress(file) {
  if (!file) return;
  const text = await file.text();
  const backup = JSON.parse(text);
  if (!backup || typeof backup.store !== 'object' || !Array.isArray(backup.studyDays)) {
    throw new Error('备份文件格式不正确');
  }
  store = backup.store;
  history = Array.isArray(backup.history) ? backup.history.slice(0, 120) : [];
  writeJSON(STORE_KEY, store);
  writeJSON(DAYS_KEY, backup.studyDays);
  writeJSON(HISTORY_KEY, history);
  if (backup.dailyQueue && typeof backup.dailyQueue === 'object') writeJSON(QUEUE_KEY, backup.dailyQueue);
  render();
}

function applyInitialMode() {
  const requested = new URLSearchParams(window.location.search).get('mode');
  const allowed = new Set(['all', 'today', 'starred', 'mistake', 'weak']);
  if (allowed.has(requested)) mode = requested;
}

function bindStaticEvents() {
  ['q', 'topic', 'diff', 'rf'].forEach((key) => {
    const eventName = key === 'q' ? 'input' : 'change';
    els[key].addEventListener(eventName, render);
  });
  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });
  els.randomBtn.addEventListener('click', () => randomCard('random'));
  els.interviewBtn.addEventListener('click', () => randomCard('interview'));
  els.examBtn.addEventListener('click', () => randomCard('exam'));
  els.timerToggle.addEventListener('click', () => {
    if (timerLeft === 0) {
      resetTimer();
      return;
    }
    timerRunning = !timerRunning;
    drawTimer();
  });
  els.timerReset.addEventListener('click', resetTimer);
  els.timerExit.addEventListener('click', () => setMode('all'));
  els.exportBtn.addEventListener('click', exportProgress);
  els.importBtn.addEventListener('click', () => els.importInput.click());
  els.importInput.addEventListener('change', async () => {
    const file = els.importInput.files && els.importInput.files[0];
    try {
      await importProgress(file);
      els.importBtn.textContent = '恢复成功';
    } catch (error) {
      console.error(error);
      els.importBtn.textContent = '恢复失败';
      window.alert(`恢复失败：${error.message}`);
    } finally {
      window.setTimeout(() => { els.importBtn.textContent = '恢复进度'; }, 1200);
      els.importInput.value = '';
    }
  });
}

function init() {
  try {
    cacheDOM();
    bindStaticEvents();
    load();
  } catch (error) {
    console.error('Hot100 Practice Lab initialization failed', error);
    const fallback = document.getElementById('loadError');
    if (fallback) fallback.innerHTML = `<div class="error">页面初始化失败：${escapeHTML(error.message)}</div>`;
  }
}

init();
