(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = open => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
      document.body.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setOpen(false);
    }, { passive: true });
  }

  const projects = document.getElementById('projects');
  const projectNodes = projects ? [...projects.querySelectorAll('[data-project]')] : [];
  const sectionHead = projects?.querySelector('.section-head > div:last-child');
  if (!projects || !sectionHead || projectNodes.length < 3) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const control = document.createElement('div');
  control.className = 'evolution-launch';
  control.innerHTML = `
    <button class="evolution-button" type="button" data-evolution-play aria-label="播放三代 Agent 架构演进">▶ Play architecture evolution</button>
    <div class="evolution-status" data-evolution-status>主动播放：Single-Agent → Multi-Agent Workflow → General Runtime</div>
  `;
  sectionHead.appendChild(control);

  const play = control.querySelector('[data-evolution-play]');
  const status = control.querySelector('[data-evolution-status]');
  const byKey = key => projectNodes.find(node => node.dataset.project === key);
  const sequence = [
    { key: 'navigation', label: 'Era 01 · Single-Agent Runtime', note: '一个 Agent 负责 Decision → Tool → Observation。' },
    { key: 'gis', label: 'Era 02 · Multi-Agent Workflow', note: '业务复杂度提升，拆分 Planner → Executor → Orchestrator → Answer。' },
    { key: 'ggai', label: 'Era 03 · General Runtime', note: '重新收敛为通用 Single-Agent Runtime，领域流程下沉到可插拔能力。' }
  ];

  let timerIds = [];
  const clearTimers = () => {
    timerIds.forEach(id => window.clearTimeout(id));
    timerIds = [];
  };

  const show = item => {
    byKey(item.key)?.click();
    status.innerHTML = `<strong>${item.label}</strong> · ${item.note}`;
  };

  play.addEventListener('click', () => {
    clearTimers();
    projects.classList.remove('evolution-foundations');
    projects.classList.add('evolution-playing');
    play.disabled = true;
    play.textContent = 'Playing…';

    if (reduceMotion) {
      show(sequence[2]);
      projects.classList.add('evolution-foundations');
      projects.classList.remove('evolution-playing');
      status.innerHTML = '<strong>Era 03 · General Runtime</strong> · Memory 与 Harness 作为跨项目基础研究浮现。';
      play.disabled = false;
      play.textContent = '↻ Replay evolution';
      return;
    }

    sequence.forEach((item, index) => {
      timerIds.push(window.setTimeout(() => show(item), index * 1450));
    });

    timerIds.push(window.setTimeout(() => {
      projects.classList.add('evolution-foundations');
      projects.classList.remove('evolution-playing');
      status.innerHTML = '<strong>Foundation layer</strong> · Memory 与 Agent Harness 从三代实践中沉淀为持续研究。';
      play.disabled = false;
      play.textContent = '↻ Replay evolution';
    }, sequence.length * 1450 + 300));
  });
})();
