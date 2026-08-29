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
      </svg>`,
    layers: `
      <svg viewBox="0 0 520 220" preserveAspectRatio="none">
        <path class="viz-panel" d="M90 38 L390 28 L448 74 L148 86 Z" />
        <path class="viz-panel" d="M76 82 L376 72 L434 118 L134 130 Z" />
        <path class="viz-panel" d="M62 126 L362 116 L420 162 L120 174 Z" />
        <path class="viz-line faint" d="M148 86 L134 130 L120 174 M448 74 L434 118 L420 162" />
        <circle class="viz-node" cx="302" cy="108" r="5" />
      </svg>`,
    network: `
      <svg viewBox="0 0 520 220" preserveAspectRatio="none">
        <path class="viz-line faint" d="M260 110 L118 54 M260 110 L405 58 M260 110 L118 170 M260 110 L406 168" />
        <path class="viz-line viz-dash" d="M118 54 L405 58 M118 170 L406 168" />
        <circle class="viz-node" cx="260" cy="110" r="7" />
        <circle class="viz-node faint" cx="118" cy="54" r="5" />
        <circle class="viz-node faint" cx="405" cy="58" r="5" />
        <circle class="viz-node faint" cx="118" cy="170" r="5" />
        <circle class="viz-node faint" cx="406" cy="168" r="5" />
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
      index: '01 / Agent Application',
      title: 'Navigation Agent',
      description: '以空间导航与决策任务为核心的 Agent 应用方向，关注 Agent 如何理解环境、组织上下文并完成连续决策。',
      tags: ['Navigation', 'Spatial Reasoning', 'Agent'],
      visual: 'route',
      href: './projects/navigation-agent/'
    },
    gis: {
      index: '02 / Agent Application',
      title: 'GIS Agent',
      description: '面向 GIS 工作流与空间工具调用的 Agent 应用方向，探索自然语言任务如何转化为空间分析与工具执行过程。',
      tags: ['GIS', 'Tool Use', 'Spatial AI'],
      visual: 'layers',
      href: './projects/gis-agent/'
    },
    ggai: {
      index: '03 / Agent Application',
      title: 'GGAI',
      description: '通用 General Geographical Agent：基于主 Agent 与 Subagent 协作架构，连接规划、GIS 工具、OpenStreetMap 与任务执行。',
      tags: ['Geographical AI', 'Multi-Agent', 'Planning'],
      visual: 'network',
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