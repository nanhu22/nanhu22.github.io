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

  /* V8 assets are loaded only on the homepage so the resume stays dependency-light. */
  if (!document.querySelector('link[data-micro-labs-v8]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './assets/micro-labs-v8.css';
    link.dataset.microLabsV8 = '';
    document.head.appendChild(link);
  }
  if (!document.getElementById('site-ambient')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'site-ambient';
    canvas.className = 'site-ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }

  const lab = document.getElementById('lab');
  const labGrid = lab?.querySelector('.lab-grid');
  if (lab && labGrid && !lab.querySelector('[data-engineering-micro-labs]')) {
    const micro = document.createElement('div');
    micro.setAttribute('data-engineering-micro-labs', '');
    micro.innerHTML = `
      <div class="section-head" style="margin-top:64px">
        <div class="section-number mono">Micro Labs / Engineering toys</div>
        <div>
          <h2 class="section-title" style="font-size:clamp(34px,5vw,58px)">Small systems,<br>made explorable.</h2>
          <p class="section-intro">这些 Demo 不连接真实生产环境，只把我关注的 Agent Harness / Memory / Eval 决策抽象成可以点击验证的小模型。</p>
        </div>
      </div>
      <div class="micro-labs">
        <article class="micro-lab" data-tool-debugger>
          <div class="eyebrow mono">Micro Lab / 01 · Harness</div>
          <h3>Tool Contract Debugger</h3>
          <p>选择一个工具调用，再让 Harness 走一遍 contract → schema → failure classification → recovery。</p>
          <div class="micro-lab-controls">
            <button class="active" type="button" data-tool-case="missing">Missing field</button>
            <button type="button" data-tool-case="wrong">Wrong type</button>
            <button type="button" data-tool-case="valid">Valid call</button>
          </div>
          <div class="micro-console"><div class="micro-console-row ok"><i></i><strong>Call</strong><span data-tool-call></span></div></div>
          <div class="micro-console" data-tool-console></div>
          <div class="micro-output"><div class="micro-output-kicker">Harness decision</div><strong data-tool-title></strong><p data-tool-text></p></div>
          <button class="micro-run" type="button" data-tool-run>Run contract check →</button>
        </article>

        <article class="micro-lab" data-memory-router>
          <div class="eyebrow mono">Micro Lab / 02 · Memory</div>
          <h3>Memory Query Router</h3>
          <p>长期记忆不是统一 Top-K。换一个 Query 类型，看 Retrieval Planner 会选择哪些 View 与 Evidence 路径。</p>
          <div class="micro-lab-controls">
            <button type="button" data-memory-query="exact">Exact quote</button>
            <button class="active" type="button" data-memory-query="temporal">Temporal</button>
            <button type="button" data-memory-query="preference">Preference</button>
            <button type="button" data-memory-query="experience">Experience</button>
          </div>
          <div><div class="micro-output-kicker">Selected views</div><div class="micro-chip-row" data-memory-views></div></div>
          <div class="route-plan" data-memory-plan></div>
          <div class="micro-output"><div class="micro-output-kicker">Retrieval strategy</div><strong data-memory-title></strong><p data-memory-text></p></div>
          <div class="micro-lab-note">Evidence remains source-of-truth; views are query-dependent access paths.</div>
        </article>

        <article class="micro-lab" data-eval-classifier>
          <div class="eyebrow mono">Micro Lab / 03 · Eval</div>
          <h3>Failure Classifier</h3>
          <p>同样是一次“失败”，它可能属于环境、工具、上下文、恢复或最终交付。分类决定该修什么，也决定指标该怎么算。</p>
          <div class="micro-lab-controls">
            <button class="active" type="button" data-eval-case="setup">Setup</button>
            <button type="button" data-eval-case="tool">Tool</button>
            <button type="button" data-eval-case="context">Context</button>
            <button type="button" data-eval-case="recovery">Recovery</button>
            <button type="button" data-eval-case="answer">Answer</button>
          </div>
          <div class="eval-classification">
            <div><small>Category</small><strong data-eval-category></strong></div>
            <div><small>Business failure?</small><strong data-eval-business></strong></div>
            <div><small>Metric</small><strong data-eval-metric></strong></div>
            <div><small>Next action</small><strong data-eval-action></strong></div>
          </div>
          <div class="micro-output"><div class="micro-output-kicker">Evaluation decision</div><strong data-eval-title></strong><p data-eval-text></p></div>
          <div class="micro-lab-note">尤其区分 setup issue 与有效业务输入下的 Agent capability failure。</div>
        </article>
      </div>`;
    labGrid.insertAdjacentElement('afterend', micro);
  }

  if (!document.querySelector('script[data-micro-labs-v8]')) {
    const script = document.createElement('script');
    script.src = './assets/micro-labs-v8.js';
    script.dataset.microLabsV8 = '';
    document.body.appendChild(script);
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
