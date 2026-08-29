(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Section-aware ambient Trace Atlas. */
  const canvas = document.getElementById('site-ambient');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let pointer = { x: .68, y: .24 };
    let mode = 'intro';
    let raf = 0;
    let visible = true;

    const layouts = {
      intro: {
        points: [[.10,.20],[.29,.20],[.48,.20],[.67,.20],[.86,.20],[.48,.44],[.67,.44]],
        edges: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,3]]
      },
      profile: {
        points: [[.18,.26],[.37,.18],[.37,.34],[.59,.18],[.59,.34],[.80,.26]],
        edges: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[1,2],[3,4]]
      },
      experience: {
        points: [[.12,.18],[.12,.42],[.12,.66],[.38,.18],[.56,.42],[.76,.66]],
        edges: [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]]
      },
      education: {
        points: [[.16,.24],[.36,.24],[.56,.24],[.76,.24],[.36,.52],[.56,.52]],
        edges: [[0,1],[1,2],[2,3],[1,4],[4,5],[5,2]]
      },
      projects: {
        points: [[.50,.24],[.23,.46],[.50,.46],[.77,.46],[.38,.70],[.62,.70]],
        edges: [[2,0],[2,1],[2,3],[2,4],[2,5],[1,0],[3,0]]
      },
      publications: {
        points: [[.14,.22],[.34,.22],[.58,.22],[.82,.22],[.14,.47],[.42,.47],[.72,.47]],
        edges: [[0,1],[1,2],[2,3],[4,5],[5,6]]
      },
      lab: {
        points: [[.18,.20],[.39,.20],[.60,.20],[.81,.20],[.18,.50],[.39,.50],[.60,.50],[.81,.50]],
        edges: [[0,1],[1,2],[2,3],[4,5],[5,6],[6,7],[1,5],[2,6]]
      },
      contact: {
        points: [[.14,.18],[.14,.52],[.36,.28],[.36,.62],[.62,.40],[.84,.40]],
        edges: [[0,2],[1,3],[2,4],[3,4],[4,5]]
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion) draw(0, false);
    };

    const draw = (time = 0, schedule = true) => {
      if (!visible && schedule) return;
      ctx.clearRect(0, 0, width, height);
      const layout = layouts[mode] || layouts.intro;
      const points = layout.points.map(([x,y], index) => {
        const sway = reduceMotion ? 0 : Math.sin(time * .00022 + index * 1.7) * 5;
        const px = x * width + sway + (pointer.x - .5) * (index % 2 ? 3 : -3);
        const py = y * height + (reduceMotion ? 0 : Math.cos(time * .00018 + index) * 3);
        return [px, py];
      });

      layout.edges.forEach((edge, index) => {
        const a = points[edge[0]];
        const b = points[edge[1]];
        ctx.strokeStyle = 'rgba(42,94,176,.075)';
        ctx.lineWidth = .75;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        const mx = (a[0] + b[0]) / 2;
        ctx.bezierCurveTo(mx, a[1], mx, b[1], b[0], b[1]);
        ctx.stroke();

        if (!reduceMotion) {
          const progress = (time * .000055 + index * .137) % 1;
          const x = a[0] + (b[0] - a[0]) * progress;
          const y = a[1] + (b[1] - a[1]) * progress;
          ctx.fillStyle = 'rgba(37,99,235,.18)';
          ctx.beginPath();
          ctx.arc(x, y, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      points.forEach(([x,y], index) => {
        ctx.fillStyle = index === 2 && mode === 'projects' ? 'rgba(37,99,235,.18)' : 'rgba(77,111,164,.11)';
        ctx.beginPath();
        ctx.arc(x, y, index % 3 === 0 ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(37,99,235,.055)';
        ctx.strokeRect(x - 8, y - 8, 16, 16);
      });

      if (!reduceMotion) {
        const gx = pointer.x * width;
        const gy = pointer.y * height;
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 150);
        glow.addColorStop(0, 'rgba(37,99,235,.035)');
        glow.addColorStop(1, 'rgba(37,99,235,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(gx - 150, gy - 150, 300, 300);
      }

      if (schedule && !reduceMotion) raf = requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', event => {
      if (reduceMotion) return;
      pointer.x = event.clientX / Math.max(1, width);
      pointer.y = event.clientY / Math.max(1, height);
    }, { passive: true });
    window.addEventListener('resize', resize, { passive: true });

    const observed = [...document.querySelectorAll('[data-observe-section]')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const visibleEntry = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visibleEntry) return;
        const id = visibleEntry.target.id || 'intro';
        mode = id === 'profile' ? 'profile'
          : id === 'experience' ? 'experience'
          : id === 'education' ? 'education'
          : id === 'projects' ? 'projects'
          : id === 'publications' ? 'publications'
          : id === 'lab' ? 'lab'
          : id === 'contact' ? 'contact'
          : 'intro';
        document.documentElement.dataset.ambientMode = mode;
        if (reduceMotion) draw(0, false);
      }, { rootMargin: '-30% 0px -45% 0px', threshold: [0,.15,.35] });
      observed.forEach(section => observer.observe(section));
    }

    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      if (visible && !reduceMotion && !raf) raf = requestAnimationFrame(draw);
    });

    resize();
    if (!reduceMotion) raf = requestAnimationFrame(draw);
  }

  /* Tool Contract Debugger */
  const toolLab = document.querySelector('[data-tool-debugger]');
  if (toolLab) {
    const cases = {
      missing: {
        call: '{ input_layer: "roads", output: "buffered" }',
        rows: [['ok','Contract','tool resolved: buffer'],['bad','Schema','required field missing: distance_m'],['warn','Classify','parameter_validation'],['ok','Recovery','request / derive missing parameter']],
        title: 'Blocked before execution',
        text: '工具没有真正运行。Harness 在执行边界先发现 schema 缺字段，并生成结构化 recovery metadata，而不是把异常字符串直接扔回 Agent。'
      },
      wrong: {
        call: '{ input_layer: "roads", distance_m: "500m" }',
        rows: [['ok','Contract','tool resolved: buffer'],['bad','Schema','distance_m expects number, got string'],['warn','Classify','type_mismatch'],['ok','Recovery','normalize only if contract explicitly allows it']],
        title: 'Type mismatch classified',
        text: '可恢复不等于偷偷修改参数。Harness 先识别类型错误；只有工具合约允许安全归一化时才修正，否则把可操作错误返回决策层。'
      },
      valid: {
        call: '{ input_layer: "roads", distance_m: 500 }',
        rows: [['ok','Contract','tool resolved: buffer'],['ok','Schema','arguments valid'],['ok','Execute','tool completed'],['ok','Observe','artifact + compact observation returned']],
        title: 'Contract satisfied',
        text: '合法调用进入执行层，完整执行细节留在 Trace；主 Agent 只拿需要的 Observation 与 Artifact 引用继续决策。'
      }
    };
    let active = 'missing';
    const controls = [...toolLab.querySelectorAll('[data-tool-case]')];
    const callEl = toolLab.querySelector('[data-tool-call]');
    const consoleEl = toolLab.querySelector('[data-tool-console]');
    const titleEl = toolLab.querySelector('[data-tool-title]');
    const textEl = toolLab.querySelector('[data-tool-text]');
    const render = (run = false) => {
      controls.forEach(button => button.classList.toggle('active', button.dataset.toolCase === active));
      const data = cases[active];
      callEl.textContent = data.call;
      consoleEl.innerHTML = (run ? data.rows : [['warn','Ready','choose a case, then run contract check']]).map(([state,label,value]) => `<div class="micro-console-row ${state}"><i></i><strong>${label}</strong><span>${value}</span></div>`).join('');
      titleEl.textContent = run ? data.title : 'Waiting for a tool call';
      textEl.textContent = run ? data.text : '这个 Demo 展示 Harness 为什么需要把 tool contract、schema validation、failure classification 与 recovery 分开。';
    };
    controls.forEach(button => button.addEventListener('click', () => { active = button.dataset.toolCase; render(false); }));
    toolLab.querySelector('[data-tool-run]').addEventListener('click', () => render(true));
    render(false);
  }

  /* Memory Query Router */
  const memoryLab = document.querySelector('[data-memory-router]');
  if (memoryLab) {
    const routes = {
      exact: {
        views: ['Episode Store','BM25','Source Expansion'],
        plan: ['Find lexical candidates','Expand linked episodes','Verify verbatim evidence'],
        title: 'Exact quote → evidence-first route',
        text: '精确措辞优先回到原始 Episode。Semantic summary 只作为辅助候选，不应替代 verbatim evidence。'
      },
      temporal: {
        views: ['Temporal View','Episode Timeline','Semantic View'],
        plan: ['Resolve entity / topic','Build time-ordered beliefs','Expand evidence around change points'],
        title: 'Temporal query → timeline + evidence',
        text: '“什么时候开始变化”需要时间视图和 Episode 时间线共同回答，最终仍回源原始证据验证。'
      },
      preference: {
        views: ['Preference View','Semantic View','Temporal Validity'],
        plan: ['Retrieve preference candidates','Check latest valid evidence','Resolve superseded beliefs'],
        title: 'Preference → current belief with provenance',
        text: '偏好不是永久 profile 字段。Router 会检查 temporal validity 与 supersede 关系，再组装当前有效证据。'
      },
      experience: {
        views: ['Experience View','Procedure View','Trace Store'],
        plan: ['Match similar task conditions','Retrieve successful traces','Return procedure + evidence'],
        title: 'Experience → case retrieval',
        text: '“上次类似任务怎么做的”更像 Experience / Procedure 检索，而不是普通聊天记忆 Top-K。'
      }
    };
    const controls = [...memoryLab.querySelectorAll('[data-memory-query]')];
    const views = memoryLab.querySelector('[data-memory-views]');
    const plan = memoryLab.querySelector('[data-memory-plan]');
    const title = memoryLab.querySelector('[data-memory-title]');
    const text = memoryLab.querySelector('[data-memory-text]');
    const render = key => {
      const data = routes[key];
      controls.forEach(button => button.classList.toggle('active', button.dataset.memoryQuery === key));
      views.innerHTML = data.views.map((view, i) => `<span class="micro-chip ${i < 2 ? 'active' : ''}">${view}</span>`).join('');
      plan.innerHTML = data.plan.map((step, i) => `<div><small>0${i+1}</small><strong>${step}</strong></div>`).join('');
      title.textContent = data.title;
      text.textContent = data.text;
    };
    controls.forEach(button => button.addEventListener('click', () => render(button.dataset.memoryQuery)));
    render('temporal');
  }

  /* Eval Failure Classifier */
  const evalLab = document.querySelector('[data-eval-classifier]');
  if (evalLab) {
    const failures = {
      setup: {
        category: 'Environment / Setup',
        business: 'Not a business-capability failure',
        metric: 'Environment readiness',
        action: 'Fix input path / dataset availability, then rerun',
        title: 'Do not punish the Agent for missing setup',
        text: '例如输入文件路径不存在、外部数据未准备。这应单独统计为 setup issue，而不是降低有效业务输入下的任务完成率。'
      },
      tool: {
        category: 'Tool Contract / Execution',
        business: 'Agent-system failure',
        metric: 'Tool correctness / parameter validity',
        action: 'Fix schema, selection or recovery metadata',
        title: 'Tool failure belongs to the execution layer',
        text: '错误工具、非法参数或执行失败需要进入 Harness 的工具正确率与恢复评估，而不仅看最终回答是否“像对的”。'
      },
      context: {
        category: 'Context / Capability Exposure',
        business: 'Agent-system failure',
        metric: 'Tool selection / unnecessary calls',
        action: 'Reduce visible capability surface or improve routing',
        title: 'Context mistakes are architecture mistakes',
        text: '错误 Skill 被激活、领域工具误触发、过多低级工具调用，往往来自能力暴露与上下文组织，而不是单个工具本身。'
      },
      recovery: {
        category: 'Recovery',
        business: 'Agent-system failure',
        metric: 'Recovery success / loop length',
        action: 'Improve failure taxonomy and next-action metadata',
        title: 'Recovery should be measurable',
        text: '失败后重复同一步、Skill loop 或恢复链过长，都应该作为过程指标进入 Trace Eval。'
      },
      answer: {
        category: 'Answer / Artifact Validity',
        business: 'Agent-system failure',
        metric: 'Answer completeness / artifact validity',
        action: 'Verify cited artifacts and final evidence coverage',
        title: 'Final answer must point to real outputs',
        text: '回答里引用不存在的文件、遗漏关键结果或证据不完整，属于最终交付层问题，需要与工具执行问题区分。'
      }
    };
    const controls = [...evalLab.querySelectorAll('[data-eval-case]')];
    const category = evalLab.querySelector('[data-eval-category]');
    const business = evalLab.querySelector('[data-eval-business]');
    const metric = evalLab.querySelector('[data-eval-metric]');
    const action = evalLab.querySelector('[data-eval-action]');
    const title = evalLab.querySelector('[data-eval-title]');
    const text = evalLab.querySelector('[data-eval-text]');
    const render = key => {
      const data = failures[key];
      controls.forEach(button => button.classList.toggle('active', button.dataset.evalCase === key));
      category.textContent = data.category;
      business.textContent = data.business;
      metric.textContent = data.metric;
      action.textContent = data.action;
      title.textContent = data.title;
      text.textContent = data.text;
    };
    controls.forEach(button => button.addEventListener('click', () => render(button.dataset.evalCase)));
    render('setup');
  }
})();
