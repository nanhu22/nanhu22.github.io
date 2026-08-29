(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path = window.location.pathname;
  const project = path.includes('/navigation-agent/') ? 'navigation'
    : path.includes('/gis-agent/') ? 'gis'
    : path.includes('/ggai/') ? 'ggai'
    : null;
  if (!project) return;

  const traces = {
    navigation: {
      title: 'Play a Single-Agent trace',
      subtitle: '同一个 Agent 在 Decision → Tool → Observation 循环里逐步完成路线任务。',
      steps: [
        ['Single Agent', 'Intent detection', 'Parse the user goal and identify route-planning intent.', 'A compact task contract: origin, destination, comparison goal.'],
        ['Single Agent', 'Plan next action', 'Choose the next decision and the domain capability required.', 'Current goal and constraints remain in Agent state.'],
        ['Maps / Tool', 'Resolve entities', 'Geocode origin and destination into spatial entities.', 'Coordinates / place identity become an observation.'],
        ['Route Tool', 'Retrieve options', 'Call routing and traffic capabilities for candidate travel modes.', 'Travel time, cost, transfers and traffic context.'],
        ['Single Agent', 'Compare observations', 'Reason across returned evidence instead of following a fixed script.', 'A ranked set of candidate modes with trade-offs.'],
        ['Runtime', 'Synthesize answer', 'Turn the selected evidence into a concise user-facing response.', 'Recommendation + supporting observations + map-oriented result.']
      ]
    },
    gis: {
      title: 'Play a Multi-Agent GIS trace',
      subtitle: 'Planner → ExecutorFlow → Orchestrator → Answer：角色拆分服务于长链路 GIS 业务，而不是为了并行而并行。',
      steps: [
        ['Planner', 'Understand spatial goal', 'Interpret the business objective, datasets and spatial constraints.', 'A structured GIS task with success criteria.'],
        ['Planner', 'Build ordered plan', 'Decompose the request into dependent GIS sub-tasks.', 'An ordered plan where later steps can depend on earlier artifacts.'],
        ['Orchestrator', 'Prepare shared workflow', 'Activate the ExecutorFlow, tool scope and shared GIS state.', 'A controlled hand-off with workspace and recovery context.'],
        ['ExecutorFlow', 'Load & inspect data', 'Use GIS tools to load layers, inspect schema, extent and attributes.', 'Observations describing the actual spatial data state.'],
        ['ExecutorFlow', 'Run geoprocessing', 'Execute QGIS / PostGIS operations for the current plan step.', 'Intermediate layers, fields, statistics or derived artifacts.'],
        ['Orchestrator', 'Validate progress', 'Check intermediate outputs and decide whether the workflow can advance.', 'Validated artifact state or a classified execution issue.'],
        ['Orchestrator', 'Recover if needed', 'Retry, clarify, adjust parameters or request human interaction.', 'A recoverable state rather than an unstructured error string.'],
        ['ExecutorFlow', 'Finalize artifacts', 'Save the final layers, map, tables and analysis outputs.', 'Verifiable GIS artifacts remain in the workspace.'],
        ['Answer', 'Deliver result', 'Consume the completed evidence without re-running the analysis.', 'A final explanation grounded in maps, files and execution evidence.']
      ]
    },
    ggai: {
      title: 'Play a General Runtime trace',
      subtitle: '同一 Runtime 根据依赖结构选择 direct execution 或 selective SubAgent fan-out，并保持决策上下文与执行上下文隔离。',
      steps: [
        ['Main Runtime', 'Detect request', 'Understand the user objective and current capability state.', 'A general task representation, not a domain-specific agent mode.'],
        ['Skill / MCP', 'Activate capability', 'Progressively expose only the domain capability needed now.', 'A smaller visible tool / skill surface for the next decision.'],
        ['Main Runtime', 'Analyze dependencies', 'Decompose the task and classify independent vs shared-state branches.', 'Execution strategy becomes an explicit runtime decision.'],
        ['Main Runtime', 'Choose strategy', 'Independent branches may fan out; shared-state workflows remain direct.', 'A bounded execution plan with clear context ownership.'],
        ['Tool / SubAgent', 'Execute in isolation', 'Run a workflow/tool directly or launch isolated SubAgents as tools.', 'Detailed working state stays behind the execution boundary.'],
        ['Runtime', 'Collect compact observations', 'Return summaries, artifacts and necessary observations—not raw transcripts.', 'Decision context stays compact while evidence remains traceable.'],
        ['Trace & Eval', 'Observe and validate', 'Persist execution evidence and classify tool, context or recovery issues.', 'Trace becomes an engineering feedback signal outside the prompt.'],
        ['Main Runtime', 'Synthesize answer', 'Combine normalized observations into the final response.', 'One general runtime delivers the result regardless of execution shape.']
      ]
    }
  };

  const data = traces[project];
  const firstCase = document.querySelector('main .case-section');
  if (!firstCase) return;

  const section = document.createElement('section');
  section.className = 'case-section trace-player-section';
  section.innerHTML = `
    <div class="container case-grid">
      <div class="case-label mono">Interactive / Trace Player</div>
      <div class="case-content">
        <h2>${data.title}</h2>
        <p>${data.subtitle}</p>
        <div class="trace-player" data-trace-player style="--trace-count:${data.steps.length}">
          <div class="trace-player-head">
            <div><h3>Agent execution trace</h3><p>点击任一步查看状态，也可以主动播放整条链路。不会自动播放。</p></div>
            <button class="trace-play" type="button" data-trace-play>▶ Play trace</button>
          </div>
          <div class="trace-progress"><span data-trace-progress></span></div>
          <div class="trace-steps" data-trace-steps></div>
          <div class="trace-detail" data-trace-detail></div>
        </div>
        <div class="trace-discovery">Interactive evidence · user initiated · public-safe trace abstraction</div>
      </div>
    </div>`;
  firstCase.insertAdjacentElement('afterend', section);

  const player = section.querySelector('[data-trace-player]');
  const stepsEl = player.querySelector('[data-trace-steps]');
  const detailEl = player.querySelector('[data-trace-detail]');
  const progressEl = player.querySelector('[data-trace-progress]');
  const play = player.querySelector('[data-trace-play]');
  let current = 0;
  let timers = [];

  data.steps.forEach((step, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'trace-step';
    button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${step[1]}</strong>`;
    button.addEventListener('click', () => show(index));
    stepsEl.appendChild(button);
  });

  const buttons = [...stepsEl.querySelectorAll('.trace-step')];
  function show(index) {
    current = Math.max(0, Math.min(index, data.steps.length - 1));
    const [role, title, action, observation] = data.steps[current];
    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === current);
      button.classList.toggle('completed', i < current);
      button.setAttribute('aria-current', i === current ? 'step' : 'false');
    });
    const progress = data.steps.length === 1 ? 100 : (current / (data.steps.length - 1)) * 100;
    player.style.setProperty('--trace-progress', `${progress}%`);
    progressEl.style.width = `${progress}%`;
    detailEl.innerHTML = `
      <div><div class="trace-detail-role">${role}</div><h4>${title}</h4></div>
      <div class="trace-detail-copy">
        <div><small>Action / state</small><p>${action}</p></div>
        <div><small>Observation / output</small><p>${observation}</p></div>
      </div>`;
  }

  function clearTimers() { timers.forEach(id => clearTimeout(id)); timers = []; }
  play.addEventListener('click', () => {
    clearTimers();
    play.disabled = true;
    play.textContent = 'Playing…';
    if (reduceMotion) {
      show(data.steps.length - 1);
      play.disabled = false;
      play.textContent = '↻ Replay trace';
      return;
    }
    data.steps.forEach((_, index) => {
      timers.push(setTimeout(() => show(index), index * 850));
    });
    timers.push(setTimeout(() => {
      play.disabled = false;
      play.textContent = '↻ Replay trace';
    }, data.steps.length * 850));
  });

  show(0);
})();
