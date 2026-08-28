const OLD_KEY='hot100-review-v2';
const STORE_KEY='hot100-practice-v3';
const DAYS_KEY='hot100-study-days-v3';
const QUEUE_KEY='hot100-daily-queue-v3';
let DATA=[],CPP={},mode='all',focusId=null,timerLeft=20*60,timerId=null,timerRunning=false;
let store=readJSON(STORE_KEY,{});
const old=readJSON(OLD_KEY,{});
for(const [id,stage] of Object.entries(old)) if(!store[id]) store[id]={stage:Number(stage)||0,star:false,weak:false,mistakes:0,lastResult:'',lastReviewed:'',nextReview:''};
saveStore();

function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch{return fallback}}
function saveStore(){localStorage.setItem(STORE_KEY,JSON.stringify(store))}
function rec(id){return store[id]||(store[id]={stage:0,star:false,weak:false,mistakes:0,lastResult:'',lastReviewed:'',nextReview:''})}
function pad(n){return String(n).padStart(2,'0')}
function dayString(d=new Date()){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`}
function addDays(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return dayString(d)}
function markStudyDay(){const days=new Set(readJSON(DAYS_KEY,[]));days.add(dayString());localStorage.setItem(DAYS_KEY,JSON.stringify([...days].sort()))}
function streak(){const days=new Set(readJSON(DAYS_KEY,[]));let d=new Date();d.setHours(12,0,0,0);if(!days.has(dayString(d)))d.setDate(d.getDate()-1);let n=0;while(days.has(dayString(d))){++n;d.setDate(d.getDate()-1)}return n}
function hash(s){let h=2166136261;for(let i=0;i<s.length;++i)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
const stageLabel=n=>['未刷','首刷','二刷','三刷'][n||0];
const escapeHTML=s=>(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const diffClass=d=>d==='简单'?'easy':d==='中等'?'mid':'hard';

function parseCards(md){
  const out=[];
  for(const b of md.split(/^### /m).slice(1)){
    const [head,...rest]=b.split('\n'),p=head.split('|').map(x=>x.trim());if(p.length<5)continue;
    const body=rest.join('\n');
    const get=k=>((body.match(new RegExp('\\*\\*'+k+'\\*\\*：([^\\n]+)'))||[])[1]||'').trim();
    const py=((body.match(/```python\n([\s\S]*?)```/)||[])[1]||'').trim();
    out.push({id:p[0],title:p[1],topic:p[2],diff:p[3],slug:p[4],core:get('核心'),pitfall:get('易错'),oral:get('口述'),related:get('关联'),expand:get('发散'),py});
  }
  return out;
}
function parseCpp(md){const out={};const re=/^### (\d+)\s*\n```cpp\n([\s\S]*?)```/gm;let m;while((m=re.exec(md)))out[m[1]]=m[2].trim();return out}

async function load(){
  try{
    const cardFiles=Array.from({length:15},(_,i)=>`./data/cards-${pad(i+1)}.md`);
    const cppFiles=Array.from({length:5},(_,i)=>`./data/cpp-${pad(i+1)}.md`);
    const get=async f=>{const r=await fetch(f);if(!r.ok)throw new Error(`无法加载 ${f}`);return r.text()};
    const [cards,cpp]=await Promise.all([Promise.all(cardFiles.map(get)),Promise.all(cppFiles.map(get))]);
    DATA=parseCards(cards.join('\n')).sort((a,b)=>Number(a.id)-Number(b.id));
    CPP=cpp.reduce((acc,txt)=>Object.assign(acc,parseCpp(txt)),{});
    const missing=DATA.filter(x=>!CPP[x.id]);
    if(DATA.length!==100)throw new Error(`题卡数量校验失败：${DATA.length}/100`);
    if(Object.keys(CPP).length!==100||missing.length)throw new Error(`C++ 模板校验失败：${100-missing.length}/100`);
    [...new Set(DATA.map(x=>x.topic))].forEach(t=>topic.insertAdjacentHTML('beforeend',`<option>${t}</option>`));
    ensureDailyQueue();render();
  }catch(e){loadError.innerHTML=`<div class="error">载入失败：${escapeHTML(e.message)}</div>`;progressText.textContent='数据载入失败'}
}

function ensureDailyQueue(){
  const today=dayString(),cached=readJSON(QUEUE_KEY,{});
  if(cached.date===today&&Array.isArray(cached.ids)) return cached.ids;
  const candidates=DATA.filter(x=>{const r=rec(x.id);return !r.nextReview||r.nextReview<=today})
    .sort((a,b)=>{const A=rec(a.id),B=rec(b.id);const pa=A.weak?0:A.mistakes?1:A.stage===0?2:3,pb=B.weak?0:B.mistakes?1:B.stage===0?2:3;return pa-pb||A.stage-B.stage||hash(today+a.id)-hash(today+b.id)});
  const ids=candidates.slice(0,12).map(x=>x.id);localStorage.setItem(QUEUE_KEY,JSON.stringify({date:today,ids}));return ids;
}
function todayQueue(){const today=dayString(),ids=new Set(ensureDailyQueue());return DATA.filter(x=>ids.has(x.id)&&rec(x.id).lastReviewed!==today)}
function baseList(){
  if(mode==='today'){const ids=new Set(todayQueue().map(x=>x.id));return DATA.filter(x=>ids.has(x.id))}
  if(mode==='starred')return DATA.filter(x=>rec(x.id).star);
  if(mode==='mistake')return DATA.filter(x=>rec(x.id).mistakes>0);
  if(mode==='weak')return DATA.filter(x=>rec(x.id).weak);
  if(mode==='random'||mode==='interview')return DATA.filter(x=>x.id===focusId);
  return DATA;
}
function filtered(){const qq=q.value.trim().toLowerCase(),tp=topic.value,df=diff.value,rv=rf.value;return baseList().filter(x=>(!qq||`${x.id}${x.title}${x.core}${x.topic}`.toLowerCase().includes(qq))&&(!tp||x.topic===tp)&&(!df||x.diff===df)&&(rv===''||String(rec(x.id).stage)===rv))}

function render(){
  const arr=filtered();resultCount.textContent=`当前 ${arr.length} 题 · ${modeName()}`;
  grid.innerHTML=arr.length?arr.map(cardHTML).join(''):`<div class="empty">这里暂时没有题目。可以切回“全部题卡”，或调整筛选条件。</div>`;
  bindCards();stats();updateModes();
  if(focusId){const el=document.querySelector(`.card[data-id="${focusId}"]`);if(el){el.classList.add('open');setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),20)}}
}
function modeName(){return {all:'全部题卡',today:'今日复习',starred:'收藏',mistake:'错题本',weak:'薄弱题',random:'随机抽卡',interview:'计时面试'}[mode]||'全部题卡'}
function cardHTML(x){
  const r=rec(x.id),due=!r.nextReview||r.nextReview<=dayString();
  return `<article class="card" data-id="${x.id}">
    <div class="summary"><div class="row"><span class="num">#${x.id}</span><strong class="title">${x.title}</strong><span class="tag">${x.topic}</span><span class="tag ${diffClass(x.diff)}">${x.diff}</span><span class="tag">${stageLabel(r.stage)}</span>${r.weak?'<span class="tag weak">薄弱</span>':''}${r.mistakes?`<span class="tag mistake">错 ${r.mistakes}</span>`:''}<span class="spacer"></span><button class="icon-btn star ${r.star?'starred':''}" title="收藏题目">${r.star?'★':'☆'}</button></div><p class="core">${x.core}</p><div class="card-note">${due?'<span class="due">今日可复习</span>':`下次复习 ${r.nextReview}`} ${r.lastResult?`· 上次：${resultName(r.lastResult)}`:''}</div></div>
    <div class="detail">
      <div class="tabs"><button class="tab-btn active" data-tab="py">Python</button><button class="tab-btn" data-tab="cpp">C++</button><button class="tab-btn" data-tab="pitfall">易错点</button><button class="tab-btn" data-tab="oral">面试口述</button><button class="tab-btn" data-tab="links">关联 / 发散</button></div>
      <div class="pane active" data-pane="py"><div class="codebox"><button class="copy-btn" data-copy="py">复制 Python</button><pre><code>${escapeHTML(x.py)}</code></pre></div></div>
      <div class="pane" data-pane="cpp"><div class="codebox"><button class="copy-btn" data-copy="cpp">复制 C++</button><pre><code>${escapeHTML(CPP[x.id])}</code></pre></div></div>
      <div class="pane" data-pane="pitfall"><p>${x.pitfall}</p></div>
      <div class="pane" data-pane="oral"><p>${x.oral}</p></div>
      <div class="pane" data-pane="links"><p><b>Hot100 关联：</b>${x.related}</p><p><b>发散：</b>${x.expand}</p><p><a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${x.slug}/">LeetCode 原题</a> · <a target="_blank" rel="noopener" href="https://leetcode.cn/problems/${x.slug}/solutions/">题解聚合页</a></p></div>
      <div class="section-label">本轮结果</div><div class="outcomes"><button class="result-btn good" data-result="good">掌握 ✓</button><button class="result-btn fuzzy" data-result="fuzzy">模糊 △</button><button class="result-btn bad" data-result="bad">不会 ×</button></div>
      <div class="section-label">手动复习阶段</div><div class="review">${[0,1,2,3].map(n=>`<button class="review-btn ${r.stage===n?'active':''}" data-stage="${n}">${stageLabel(n)}</button>`).join('')}</div>
    </div></article>`;
}
function resultName(x){return {good:'掌握',fuzzy:'模糊',bad:'不会'}[x]||x}

function applyResult(id,result){
  const r=rec(id);r.lastResult=result;r.lastReviewed=dayString();markStudyDay();
  if(result==='good'){r.stage=Math.min(3,r.stage+1);if(r.stage>=2)r.weak=false;r.nextReview=addDays([0,1,3,7][r.stage]||7)}
  if(result==='fuzzy'){r.weak=true;r.nextReview=addDays(1)}
  if(result==='bad'){r.stage=Math.max(0,r.stage-1);r.weak=true;r.mistakes=(r.mistakes||0)+1;r.nextReview=addDays(1)}
  saveStore();render();
}
function setStage(id,stage){const r=rec(id);r.stage=stage;r.lastReviewed=dayString();r.nextReview=stage===0?dayString():addDays([0,1,3,7][stage]);markStudyDay();saveStore();render()}
function toggleStar(id){const r=rec(id);r.star=!r.star;saveStore();render()}

function bindCards(){
  document.querySelectorAll('.summary').forEach(x=>x.addEventListener('click',()=>x.parentElement.classList.toggle('open')));
  document.querySelectorAll('.star').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();toggleStar(b.closest('.card').dataset.id)}));
  document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const c=b.closest('.card');c.querySelectorAll('.tab-btn,.pane').forEach(x=>x.classList.remove('active'));b.classList.add('active');c.querySelector(`[data-pane="${b.dataset.tab}"]`).classList.add('active')}));
  document.querySelectorAll('.copy-btn').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const c=b.closest('.card'),id=c.dataset.id,x=DATA.find(v=>v.id===id),txt=b.dataset.copy==='cpp'?CPP[id]:x.py;navigator.clipboard.writeText(txt).then(()=>{const old=b.textContent;b.textContent='已复制';setTimeout(()=>b.textContent=old,900)}).catch(()=>b.textContent='复制失败')}));
  document.querySelectorAll('[data-result]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();applyResult(b.closest('.card').dataset.id,b.dataset.result)}));
  document.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();setStage(b.closest('.card').dataset.id,+b.dataset.stage)}));
}

function stats(){
  const stages=DATA.map(x=>rec(x.id).stage);total.textContent=DATA.length;first.textContent=stages.filter(x=>x>=1).length;second.textContent=stages.filter(x=>x>=2).length;third.textContent=stages.filter(x=>x>=3).length;streakEl.textContent=streak();
  const done=stages.filter(x=>x>=3).length;bar.style.width=(DATA.length?done/DATA.length*100:0)+'%';progressText.textContent=`三刷完成 ${done} / ${DATA.length} · 今日剩余 ${todayQueue().length} 题`;
}
function updateModes(){todayN.textContent=todayQueue().length;starN.textContent=DATA.filter(x=>rec(x.id).star).length;mistakeN.textContent=DATA.filter(x=>rec(x.id).mistakes>0).length;weakN.textContent=DATA.filter(x=>rec(x.id).weak).length;document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode))}
function clearFilters(){q.value='';topic.value='';diff.value='';rf.value=''}
function setMode(m){mode=m;focusId=null;if(m!=='interview')stopTimer(true);render()}
function randomCard(interview=false){
  clearFilters();if(!interview)stopTimer(true);
  const preferred=DATA.filter(x=>rec(x.id).stage<3||rec(x.id).weak),pool=interview&&preferred.length?preferred:DATA;
  const pick=pool[Math.floor(Math.random()*pool.length)]||DATA[0];focusId=pick.id;mode=interview?'interview':'random';if(interview)startInterview();render();
}

function fmtTime(s){return `${pad(Math.floor(s/60))}:${pad(s%60)}`}
function drawTimer(){timerClock.textContent=fmtTime(timerLeft);timerToggle.textContent=timerRunning?'暂停':'继续'}
function runTimer(){clearInterval(timerId);timerId=setInterval(()=>{if(timerRunning&&timerLeft>0){--timerLeft;drawTimer()}if(timerLeft===0){timerRunning=false;clearInterval(timerId);timerId=null;timerClock.textContent='00:00 · 时间到'}},1000)}
function startInterview(){timerLeft=20*60;timerRunning=true;timerPanel.classList.add('show');drawTimer();runTimer()}
function stopTimer(hide=true){clearInterval(timerId);timerId=null;timerRunning=false;if(hide)timerPanel.classList.remove('show')}
function resetTimer(){timerLeft=20*60;timerRunning=true;timerPanel.classList.add('show');drawTimer();runTimer()}

['q','topic','diff','rf'].forEach(id=>document.querySelector('#'+id).addEventListener(id==='q'?'input':'change',render));
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
randomBtn.addEventListener('click',()=>randomCard(false));interviewBtn.addEventListener('click',()=>randomCard(true));
timerToggle.addEventListener('click',()=>{if(timerLeft===0){resetTimer();return}timerRunning=!timerRunning;drawTimer()});timerReset.addEventListener('click',resetTimer);timerExit.addEventListener('click',()=>setMode('all'));
load();
