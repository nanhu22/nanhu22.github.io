(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ambient field follows the visitor very lightly; it never captures pointer events.
  let raf = 0;
  let px = 68;
  let py = 24;
  const applyAmbient = () => {
    raf = 0;
    document.documentElement.style.setProperty('--ambient-x', `${px.toFixed(2)}%`);
    document.documentElement.style.setProperty('--ambient-y', `${py.toFixed(2)}%`);
  };
  window.addEventListener('pointermove', event => {
    if (reduceMotion) return;
    px = (event.clientX / Math.max(1, window.innerWidth)) * 100;
    py = (event.clientY / Math.max(1, window.innerHeight)) * 100;
    if (!raf) raf = requestAnimationFrame(applyAmbient);
  }, { passive: true });
  window.addEventListener('scroll', () => {
    if (reduceMotion) return;
    const offset = Math.min(44, window.scrollY * .018);
    document.documentElement.style.setProperty('--ambient-scroll', `${offset.toFixed(1)}px`);
  }, { passive: true });

  const story = document.querySelector('[data-agent-story]');
  if (story) {
    const stages = {
      cot: {
        era: 'Prelude / Reasoning',
        title: 'Chain-of-Thought',
        description: '大模型先学会把复杂问题拆成中间推理步骤，但推理仍主要发生在模型内部：它可以解释“怎么想”，却无法可靠地读取环境、执行动作或验证结果。',
        pressure: 'Reasoning alone cannot act on or verify the outside world.',
        change: 'Intermediate reasoning made harder tasks tractable, but the system still lacked an action / feedback loop.',
        visual: `
          <svg viewBox="0 0 520 176" role="img" aria-label="Chain-of-Thought reasoning-only stage">
            <path class="story-line active" d="M54 88 H142 H230 H318 H452"/>
            <rect class="story-node" x="18" y="62" width="78" height="52" rx="10"/><text class="story-label" x="38" y="91">Prompt</text>
            <rect class="story-node main" x="122" y="54" width="100" height="68" rx="10"/><text class="story-label" x="145" y="82">Thought 1</text><text class="story-label muted" x="145" y="100">decompose</text>
            <rect class="story-node main" x="242" y="54" width="100" height="68" rx="10"/><text class="story-label" x="265" y="82">Thought 2</text><text class="story-label muted" x="265" y="100">reason</text>
            <rect class="story-node" x="370" y="62" width="118" height="52" rx="10"/><text class="story-label" x="397" y="91">Answer</text>
            <rect class="story-node warn" x="188" y="132" width="144" height="30" rx="8"/><text class="story-label muted" x="206" y="151">No tool / observation</text>
          </svg>`
      },
      react: {
        era: 'Era 01 / Tool Use',
        title: 'ReAct Agent',
        description: '推理不再停在文本里。Agent 根据当前状态决定工具调用，再把 Observation 带回下一轮决策，形成 Decision → Tool → Observation 的闭环；Navigation Agent 就建立在这条路径上。',
        pressure: 'Real tasks require actions, external state and feedback—not only better reasoning.',
        change: 'Tools and observations turn reasoning into an executable loop.',
        visual: `
          <svg viewBox="0 0 520 176" role="img" aria-label="ReAct Agent stage with tool and observation loop">
            <rect class="story-node main" x="184" y="42" width="152" height="76" rx="12"/><text class="story-label" x="221" y="73">Agent</text><text class="story-label muted" x="211" y="93">decision owner</text>
            <rect class="story-node" x="28" y="50" width="112" height="60" rx="10"/><text class="story-label" x="55" y="78">User goal</text>
            <rect class="story-node" x="382" y="30" width="108" height="48" rx="10"/><text class="story-label" x="410" y="59">Tool</text>
            <rect class="story-node" x="382" y="100" width="108" height="48" rx="10"/><text class="story-label" x="395" y="129">Observation</text>
            <path class="story-line active" d="M140 80 H184 M336 70 C360 70 362 54 382 54 M436 78 V100 M382 124 C346 124 352 104 336 104"/>
            <circle class="story-pulse" cx="354" cy="70" r="4"/><text class="story-label muted" x="193" y="141">reason → act → observe → decide</text>
          </svg>`
      },
      multi: {
        era: 'Era 02 / Business Complexity',
        title: 'Multi-Agent Workflow',
        description: '复杂 GIS 业务带来更长的计划、共享工作区、恢复与 Artifact 交付。一个 Agent 同时承担规划、执行和全局控制会变得脆弱，于是职责拆成 Planner → Executor → Orchestrator → Answer。',
        pressure: 'Long, stateful business workflows overload one Agent with planning, execution, recovery and delivery.',
        change: 'Role separation and orchestration make complex workflows controllable and repeatable.',
        visual: `
          <svg viewBox="0 0 520 176" role="img" aria-label="Multi-Agent workflow with Planner Executor Orchestrator and Answer">
            <path class="story-line active" d="M84 88 H154 H250 H350 H454"/>
            <rect class="story-node" x="24" y="56" width="116" height="64" rx="10"/><text class="story-label" x="48" y="83">Planner</text><text class="story-label muted" x="48" y="101">task graph</text>
            <rect class="story-node main" x="160" y="48" width="116" height="80" rx="10"/><text class="story-label" x="180" y="80">Executor</text><text class="story-label muted" x="180" y="99">ReAct step</text>
            <rect class="story-node main" x="296" y="48" width="126" height="80" rx="10"/><text class="story-label" x="311" y="80">Orchestrator</text><text class="story-label muted" x="311" y="99">state / retry</text>
            <rect class="story-node" x="438" y="56" width="68" height="64" rx="10"/><text class="story-label" x="451" y="88">Answer</text>
            <path class="story-line" d="M359 128 C335 157 205 157 218 128"/><text class="story-label muted" x="235" y="159">shared state + recovery</text>
          </svg>`
      },
      harness: {
        era: 'Era 03 / System Infrastructure',
        title: 'Agent Harness',
        description: '当每个领域都复制自己的 Planner / Executor / Graph，控制逻辑又开始侵入业务。新的方向是稳定 General Runtime，把 Skill、MCP、Workflow、SubAgent、Memory、Trace 放到可插拔边界，并显式隔离决策上下文与执行上下文。',
        pressure: 'Domain-specific agent graphs duplicate control logic and make the runtime harder to reuse, observe and evolve.',
        change: 'A stable runtime spine + pluggable capabilities + context / trace boundaries scales better than copying agent graphs.',
        visual: `
          <svg viewBox="0 0 520 176" role="img" aria-label="Agent Harness stage with stable runtime and pluggable capabilities">
            <rect class="story-node main" x="191" y="52" width="142" height="72" rx="14"/><text class="story-label" x="218" y="82">General Runtime</text><text class="story-label muted" x="219" y="101">decision / control</text>
            <rect class="story-node" x="25" y="26" width="108" height="44" rx="9"/><text class="story-label" x="52" y="53">Skill / MCP</text>
            <rect class="story-node" x="385" y="26" width="108" height="44" rx="9"/><text class="story-label" x="408" y="53">Workflow</text>
            <rect class="story-node" x="25" y="108" width="108" height="44" rx="9"/><text class="story-label" x="52" y="135">Memory</text>
            <rect class="story-node" x="385" y="108" width="108" height="44" rx="9"/><text class="story-label" x="406" y="135">SubAgent</text>
            <rect class="story-node warn" x="205" y="139" width="114" height="28" rx="8"/><text class="story-label muted" x="225" y="157">Trace / Eval</text>
            <path class="story-line active" d="M133 48 L191 72 M385 48 L333 72 M133 130 L191 104 M385 130 L333 104 M262 124 V139"/>
            <text class="story-label muted" x="195" y="30">stable spine · pluggable perimeter</text>
          </svg>`
      }
    };

    const visual = story.querySelector('[data-story-visual]');
    const era = story.querySelector('[data-story-era]');
    const title = story.querySelector('[data-story-title]');
    const description = story.querySelector('[data-story-description]');
    const pressure = story.querySelector('[data-story-pressure]');
    const change = story.querySelector('[data-story-change]');
    const tabs = [...story.querySelectorAll('[data-story-stage]')];
    const play = story.querySelector('[data-story-play]');
    const order = ['cot', 'react', 'multi', 'harness'];
    let current = 0;
    let timers = [];

    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    function setStage(key, focus = false) {
      if (!stages[key]) return;
      clearTimers();
      current = order.indexOf(key);
      const data = stages[key];
      story.classList.remove('story-changing');
      void story.offsetWidth;
      story.classList.add('story-changing');
      visual.innerHTML = data.visual;
      era.textContent = data.era;
      title.textContent = data.title;
      description.textContent = data.description;
      pressure.textContent = data.pressure;
      change.textContent = data.change;
      tabs.forEach(button => {
        const active = button.dataset.storyStage === key;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      if (focus) tabs[current]?.focus();
    }

    tabs.forEach((button, index) => {
      button.addEventListener('click', () => setStage(button.dataset.storyStage));
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const next = (index + delta + order.length) % order.length;
        setStage(order[next], true);
      });
    });

    play?.addEventListener('click', () => {
      clearTimers();
      play.disabled = true;
      play.textContent = reduceMotion ? 'Showing current era…' : 'Playing story…';
      if (reduceMotion) {
        setStage('harness');
        play.disabled = false;
        play.textContent = '↻ Replay story';
        return;
      }
      order.forEach((key, index) => {
        timers.push(setTimeout(() => setStage(key), index * 1500));
      });
      timers.push(setTimeout(() => {
        play.disabled = false;
        play.textContent = '↻ Replay story';
      }, order.length * 1500));
    });

    setStage('cot');
  }

  const contextToy = document.querySelector('[data-context-toy]');
  if (contextToy) {
    const modes = {
      decision: {
        status: 'IN PROMPT',
        note: 'minimum sufficient context',
        chips: ['Goal', 'Constraints', 'History summary', 'Retrieved memory', 'Capability state', 'Key observations']
      },
      execution: {
        status: 'ISOLATED',
        note: 'working state stays outside',
        chips: ['Tool args', 'Workspace state', 'Intermediate artifacts', 'SubAgent working memory', 'Raw tool output']
      },
      evidence: {
        status: 'TRACE STORE',
        note: 'retained, not continuously injected',
        chips: ['Events', 'Failures', 'Recovery metadata', 'Artifact refs', 'Eval signals', 'Provenance']
      }
    };
    const buttons = [...contextToy.querySelectorAll('[data-context-mode]')];
    const chips = contextToy.querySelector('[data-context-chips]');
    const status = contextToy.querySelector('[data-context-status]');
    const note = contextToy.querySelector('[data-context-note]');
    function render(key) {
      const data = modes[key];
      if (!data) return;
      buttons.forEach(button => button.classList.toggle('active', button.dataset.contextMode === key));
      chips.innerHTML = data.chips.map(item => `<span class="context-chip">${item}</span>`).join('');
      status.textContent = data.status;
      note.textContent = data.note;
    }
    buttons.forEach(button => button.addEventListener('click', () => render(button.dataset.contextMode)));
    render('decision');
  }
})();
