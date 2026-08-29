(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const projectData = {
    navigation: {
      index: '01 / Agent Application',
      title: 'Navigation Agent',
      description: 'An agent application focused on spatial navigation and decision-making. The case study structure is ready; implementation details will be added with the project material.',
      tags: ['Navigation', 'Spatial Reasoning', 'Agent'],
      visual: 'route'
    },
    gis: {
      index: '02 / Agent Application',
      title: 'GIS Agent',
      description: 'An agent application for GIS workflows and spatial tool use. The project panel is intentionally content-light until the full project material is added.',
      tags: ['GIS', 'Tool Use', 'Spatial AI'],
      visual: 'layers'
    },
    ggai: {
      index: '03 / Agent Application',
      title: 'GGAI',
      description: 'A general geographical agent direction that connects planning, spatial tools and agent collaboration. Detailed architecture will be added as a dedicated case study.',
      tags: ['Geographical AI', 'Multi-Agent', 'Planning'],
      visual: 'network'
    },
    memory: {
      index: '04 / Agent Foundation',
      title: 'Memory Research',
      description: 'Research on long-term agent memory, retrieval and memory organization. The visual language uses calm memory traces rather than a generic neural-network motif.',
      tags: ['Memory', 'Retrieval', 'Context'],
      visual: 'memory'
    },
    harness: {
      index: '05 / Agent Foundation',
      title: 'Agent Harness',
      description: 'Research on the runtime and control layer around agents: traces, tool execution and reliable orchestration. A deeper runtime case study will follow.',
      tags: ['Harness', 'Runtime', 'Trace'],
      visual: 'runtime'
    }
  };

  const detail = document.querySelector('[data-project-detail]');
  const projectNodes = [...document.querySelectorAll('[data-project]')];

  function setProject(key) {
    const data = projectData[key];
    if (!data || !detail) return;
    projectNodes.forEach(node => node.classList.toggle('active', node.dataset.project === key));
    detail.querySelector('[data-project-index]').textContent = data.index;
    detail.querySelector('[data-project-title]').textContent = data.title;
    detail.querySelector('[data-project-description]').textContent = data.description;
    const meta = detail.querySelector('[data-project-tags]');
    meta.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
    detail.querySelector('[data-project-visual]').dataset.visual = data.visual;
  }

  projectNodes.forEach(node => {
    node.addEventListener('mouseenter', () => setProject(node.dataset.project));
    node.addEventListener('focus', () => setProject(node.dataset.project));
    node.addEventListener('click', () => setProject(node.dataset.project));
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

  const canvas = document.getElementById('spatial-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let pointer = { x: .56, y: .45, active: false };
  let points = [];

  function buildPoints() {
    const count = width < 520 ? 22 : 36;
    points = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      vx: (Math.random() - .5) * .12,
      vy: (Math.random() - .5) * .12,
      r: i % 9 === 0 ? 2.3 : 1.2
    }));
  }

  function resize() {
    const rect = parent.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPoints();
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    const px = pointer.x * width;
    const py = pointer.y * height;

    points.forEach((point, i) => {
      if (!reduceMotion) {
        point.x += point.vx + Math.sin(time * .00035 + i) * .025;
        point.y += point.vy + Math.cos(time * .00028 + i) * .02;
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
          point.x += (dx / dist) * (150 - dist) * .006;
          point.y += (dy / dist) * (150 - dist) * .006;
        }
      }

      for (let j = i + 1; j < points.length; j++) {
        const other = points[j];
        const dist = Math.hypot(point.x - other.x, point.y - other.y);
        if (dist < 105) {
          ctx.strokeStyle = `rgba(53, 104, 191, ${(.14 * (1 - dist / 105)).toFixed(3)})`;
          ctx.lineWidth = .7;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = point.r > 2 ? 'rgba(37,99,235,.72)' : 'rgba(73,110,162,.46)';
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'rgba(37,99,235,.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * .08, height * .72);
    ctx.bezierCurveTo(width * .28, height * .38, width * .48, height * .82, width * .9, height * .28);
    ctx.stroke();

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  parent.addEventListener('pointermove', event => {
    const rect = parent.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
    pointer.active = true;
  });
  parent.addEventListener('pointerleave', () => { pointer.active = false; });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
