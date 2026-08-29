(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const visualTemplates = {
    route: `
      <svg viewBox="0 0 520 220" preserveAspectRatio="none">
        <path class="viz-line faint" d="M35 176 C120 88 190 162 270 94 S415 42 490 68" />
        <path class="viz-line viz-dash" d="M35 176 C120 88 190 162 270 94 S415 42 490 68" />
        <circle class="viz-node faint" cx="35" cy="176" r="4" />
        <circle class="viz-node faint" cx="270" cy="94" r="4" />
        <circle class="viz-node viz-moving" cx="405" cy="56" r="5" />
        <circle class="viz-node" cx="490" cy="68" r="4" />
        <text x="34" y="200" fill="rgba(183,200,222,.68)" font-size="10">Decision</text>
        <text x="242" y="116" fill="rgba(183,200,222,.68)" font-size="10">Tool</text>
        <text x="425" y="45" fill="rgba(183,200,222,.68)" font-size="10">Observation</text>
      </svg>`,
    workflow: `
      <svg viewBox="0 0 520 220" preserveAspectRatio="none">
        <path class="viz-line faint" d="M92 110 H158 M218 110 H284 M344 110 H410" />
        <path class="viz-line viz-dash" d="M410 146 C350 190 170 190 92 146" />
        <rect class="viz-panel" x="30" y="70" width="112" height="78" rx="9" />
        <rect class="viz-panel" x="158" y="70" width="112" height="78" rx="9" />
        <rect class="viz-panel" x="286" y="70" width="112" height="78" rx="9" />
        <rect class="viz-panel" x="414" y="70" width="78" height="78" rx="9" />
        <circle class="viz-node" cx="86" cy="70" r="4" /><circle class="viz-node" cx="214" cy="70" r="4" /><circle class="viz-node" cx="342" cy="70" r="4" /><circle class="viz-node" cx="453" cy="70" r="4" />
        <text x="50" y="112" fill="rgba(229,239,255,.84)" font-size="11">Planner</text>
        <text x="177" y="112" fill="rgba(229,239,255,.84)" font-size="11">Executor</text>
        <text x="303" y="112" fill="rgba(229,239,255,.84)" font-size="11">Orchestrator</text>
        <text x="431" y="112" fill="rgba(229,239,255,.84)" font-size="11">Answer</text>
      </svg>`,
    general: `
      <svg viewBox="0 0 520 220" preserveAspectRatio="none">
        <path class="viz-line faint" d="M260 110 L95 56 M260 110 L425 56 M260 110 L95 170 M260 110 L425 170" />
        <path class="viz-line viz-dash" d="M425 56 C468 89 468 135 425 170" />
        <circle class="viz-node" cx="260" cy="110" r="8" />
        <circle class="viz-node faint" cx="95" cy="56" r="5" /><circle class="viz-node faint" cx="425" cy="56" r="5" /><circle class="viz-node faint" cx="95" cy="170" r="5" /><circle class="viz-node faint" cx="425" cy="170" r="5" />
        <text x="221" y="91" fill="rgba(229,239,255,.9)" font-size="11">Main Runtime</text>
        <text x="49" y="45" fill="rgba(183,200,222,.72)" font-size="10">Skill / MCP</text>
        <text x="397" y="45" fill="rgba(183,200,222,.72)" font-size="10">Workflow</text>
        <text x="53" y="192" fill="rgba(183,200,222,.72)" font-size="10">Memory</text>
        <text x="391" y="192" fill="rgba(183,200,222,.72)" font-size="10">SubAgent</text>
      </svg>`,
    memory: `
      <svg viewBox="0 0 520 220" preserveAspectRatio="none">
        <path class="viz-line faint" d="M84 112 C132 52 196 66 234 105 S330 164 432 88" />
        <path class="viz-line faint" d="M122 166 C186 128 226 150 266 122 S350 58 414 52" />
        <circle class="viz-node faint" cx="84" cy="112" r="4" />
        <circle class="viz-node" cx="234" cy="105" r="6" />
        <circle class="viz-node faint" cx="432" cy="88" r="4" />
        <circle class="viz-node faint" cx="122" cy="166" r="3" />
        <circle class="viz-node" cx="266" cy="122" r="4" />
        <circle class="viz-node faint" cx="414" cy="52" r="3" />
      </svg>`,
    runtime: `
      <svg viewBox="0 0 520 220" preserveAspectRatio="none">
        <path class="viz-line faint" d="M48 48 H468 M48 88 H468 M48 128 H468 M48 168 H468" />
        <path class="viz-line viz-dash" d="M72 48 H226 M282 88 H430 M112 128 H326 M344 168 H456" />
        <circle class="viz-node" cx="226" cy="48" r="4" />
        <circle class="viz-node faint" cx="282" cy="88" r="4" />
        <circle class="viz-node" cx="326" cy="128" r="4" />
        <circle class="viz-node faint" cx="344" cy="168" r="4" />
      </svg>`
  };

  const projectData = {
    navigation: {
      index: '01 / Era 01 · Single-Agent Runtime',
      title: 'Navigation Agent',
      description: '第一代架构：单 Agent 持有任务状态，在 ReAct 式 Decision → Tool → Observation 循环中完成路线规划、交通问答、人流与态势分析。',
      tags: ['Single-Agent Runtime', 'ReAct', 'Navigation'],
      visual: 'route',
      href: './projects/navigation-agent/'
    },
    gis: {
      index: '02 / Era 02 · Multi-Agent Workflow',
      title: 'GIS Agent',
      description: '第二代架构：随着 GIS 业务复杂度提升，显式拆分 Planner、ExecutorFlow、Orchestrator 与 Answer，分别负责规划、执行、共享状态控制和成果交付。',
      tags: ['Planner → Executor', 'Orchestrator', 'GIS Workflow'],
      visual: 'workflow',
      href: './projects/gis-agent/'
    },
    ggai: {
      index: '03 / Era 03 · General Runtime',
      title: 'GGAI',
      description: '第三代架构：回归通用 Single-Agent Runtime，领域流程下沉到可插拔 Skill/MCP/Workflow；主 Agent 根据任务依赖选择 direct execution 或 selective SubAgent fan-out。',
      tags: ['General Runtime', 'Skill / MCP', 'Selective SubAgent'],
      visual: 'general',
      href: './projects/ggai/'
    },
    memory: {
      index: '04 / Agent Foundation',
      title: 'Memory Research',
      description: '围绕长期 Agent Memory 的抽取、证据保留、检索、巩固与评测，研究记忆如何从 Trace 中形成并持续影响后续任务。',
      tags: ['Memory', 'Retrieval', 'Context'],
      visual: 'memory',
      href: './projects/memory/'
    },
    harness: {
      index: '05 / Agent Foundation',
      title: 'Agent Harness',
      description: '围绕 Agent 运行时与控制层展开研究，关注 Trace、工具执行、编排、上下文与可靠运行之间的系统关系。',
      tags: ['Harness', 'Runtime', 'Trace'],
      visual: 'runtime',
      href: './projects/agent-harness/'
    }
  };

  const detail = document.querySelector('[data-project-detail]');
  const projectMap = document.querySelector('[data-project-map]');
  const projectNodes = [...document.querySelectorAll('[data-project]')];
  const projectLines = [...document.querySelectorAll('[data-project-line]')];
  const projectOrder = projectNodes.map(node => node.dataset.project);

  function setProject(key) {
    const data = projectData[key];
    if (!data || !detail) return;

    projectNodes.forEach(node => node.classList.toggle('active', node.dataset.project === key));
    projectLines.forEach(line => line.classList.toggle('active', line.dataset.projectLine === key));
    if (projectMap) projectMap.dataset.projectMap = key;

    detail.querySelector('[data-project-index]').textContent = data.index;
    detail.querySelector('[data-project-title]').textContent = data.title;
    detail.querySelector('[data-project-description]').textContent = data.description;

    const meta = detail.querySelector('[data-project-tags]');
    meta.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');

    const visual = detail.querySelector('[data-project-visual]');
    visual.dataset.projectVisual = data.visual;
    visual.innerHTML = visualTemplates[data.visual] || '';

    const link = detail.querySelector('[data-project-link]');
    link.href = data.href;
  }

  projectNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => setProject(node.dataset.project));
    node.addEventListener('focus', () => setProject(node.dataset.project));
    node.addEventListener('click', () => setProject(node.dataset.project));
    node.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const nextIndex = (index + direction + projectOrder.length) % projectOrder.length;
      projectNodes[nextIndex].focus();
    });
  });
  setProject('navigation');

  const experienceButtons = [...document.querySelectorAll('[data-experience-tab]')];
  const experiencePanels = [...document.querySelectorAll('[data-experience-panel]')];
  experienceButtons.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.experienceTab;
      experienceButtons.forEach(item => item.classList.toggle('active', item === button));
      experiencePanels.forEach(panel => { panel.hidden = panel.dataset.experiencePanel !== key; });
    });
  });

  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const observedSections = [...document.querySelectorAll('[data-observe-section]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach(link => {
        const active = id && link.getAttribute('href') === `#${id}`;
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-32% 0px -56% 0px', threshold: [0, .1, .35] });
    observedSections.forEach(section => sectionObserver.observe(section));
  }

  function updateScrollProgress() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    doc.style.setProperty('--scroll-progress', progress.toFixed(4));
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();

  const canvas = document.getElementById('spatial-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let pointer = { x: .56, y: .45, active: false };
  let points = [];
  let canvasVisible = true;
  let animationFrame = 0;

  function buildPoints() {
    const count = width < 520 ? 20 : 34;
    points = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .1,
      vy: (Math.random() - .5) * .1,
      r: i % 9 === 0 ? 2.2 : 1.1
    }));
  }

  function resizeCanvas() {
    const rect = parent.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPoints();
    if (reduceMotion) drawField(0, false);
  }

  function drawField(time = 0, schedule = true) {
    if (!canvasVisible && schedule) return;
    ctx.clearRect(0, 0, width, height);
    const px = pointer.x * width;
    const py = pointer.y * height;

    points.forEach((point, i) => {
      if (!reduceMotion) {
        point.x += point.vx + Math.sin(time * .00035 + i) * .02;
        point.y += point.vy + Math.cos(time * .00028 + i) * .018;
        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;
      }

      if (pointer.active && !reduceMotion) {
        const dx = point.x - px;
        const dy = point.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 0) {
          point.x += (dx / dist) * (150 - dist) * .005;
          point.y += (dy / dist) * (150 - dist) * .005;
        }
      }

      for (let j = i + 1; j < points.length; j++) {
        const other = points[j];
        const dist = Math.hypot(point.x - other.x, point.y - other.y);
        if (dist < 105) {
          ctx.strokeStyle = `rgba(53, 104, 191, ${(.12 * (1 - dist / 105)).toFixed(3)})`;
          ctx.lineWidth = .7;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = point.r > 2 ? 'rgba(37,99,235,.68)' : 'rgba(73,110,162,.42)';
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'rgba(37,99,235,.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * .08, height * .72);
    ctx.bezierCurveTo(width * .28, height * .38, width * .48, height * .82, width * .9, height * .28);
    ctx.stroke();

    if (!reduceMotion && schedule && canvasVisible) animationFrame = requestAnimationFrame(drawField);
  }

  parent.addEventListener('pointermove', event => {
    const rect = parent.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
    pointer.active = true;
  });
  parent.addEventListener('pointerleave', () => { pointer.active = false; });
  window.addEventListener('resize', resizeCanvas, { passive: true });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const canvasObserver = new IntersectionObserver(entries => {
      canvasVisible = entries[0]?.isIntersecting ?? true;
      if (canvasVisible && !animationFrame) animationFrame = requestAnimationFrame(drawField);
      if (!canvasVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }, { threshold: .05 });
    canvasObserver.observe(parent);
  }

  resizeCanvas();
  if (reduceMotion) drawField(0, false);
  else animationFrame = requestAnimationFrame(drawField);
})();