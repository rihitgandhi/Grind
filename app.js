// ---------- Storage helpers ----------
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch(e) { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

let checkState = store.get('checkState', {});
let logs = store.get('logs', []);
let activeDayIdx = store.get('activeDayIdx', 0);

// ---------- Render workout tabs ----------
const tabsEl = document.getElementById('dayTabs');
PROGRAM.forEach((d, i) => {
  const b = document.createElement('button');
  b.className = 'tab' + (i === activeDayIdx ? ' active' : '');
  b.textContent = d.day;
  b.onclick = () => { activeDayIdx = i; store.set('activeDayIdx', i); renderWorkout(); renderTabs(); };
  tabsEl.appendChild(b);
});
function renderTabs(){
  [...tabsEl.children].forEach((b,i)=> b.classList.toggle('active', i===activeDayIdx));
}

function exId(dayIdx, blockIdx, itemIdx){ return `d${dayIdx}-b${blockIdx}-i${itemIdx}`; }

function renderWorkout(){
  const view = document.getElementById('workoutView');
  const d = PROGRAM[activeDayIdx];
  let html = `<div class="day-card">
    <div class="tag">${d.day}</div>
    <h2>${d.tag}</h2>`;
  d.blocks.forEach((block, bi) => {
    html += `<div class="section-label">${block.label}</div>`;
    block.items.forEach((item, ii) => {
      const id = exId(activeDayIdx, bi, ii);
      const done = !!checkState[id];
      html += `<div class="ex-row">
        <div class="ex-info">
          <div class="ex-name">${item.name}</div>
          <div class="ex-detail">${item.detail}</div>
        </div>
        <div class="ex-check ${done ? 'done' : ''}" data-id="${id}">${done ? '✓' : ''}</div>
      </div>`;
    });
  });
  html += `<div class="note-box">Tap a workout to check off exercises as you complete them. Increase weight when all sets hit the top of the rep range with 2+ reps in reserve, two sessions in a row.</div>
  </div>`;
  view.innerHTML = html;

  view.querySelectorAll('.ex-check').forEach(el => {
    el.onclick = () => {
      const id = el.dataset.id;
      checkState[id] = !checkState[id];
      store.set('checkState', checkState);
      el.classList.toggle('done');
      el.textContent = checkState[id] ? '✓' : '';
    };
  });
}

// ---------- Nutrition view ----------
function renderNutrition(){
  const view = document.getElementById('nutritionView');
  view.innerHTML = `
    <div class="nutri-grid">
      <div class="nutri-box"><div class="val">${NUTRITION.target}</div><div class="lbl">Daily calorie target</div></div>
      <div class="nutri-box"><div class="val">${NUTRITION.protein}</div><div class="lbl">Protein / day</div></div>
      <div class="nutri-box"><div class="val">${NUTRITION.carbs}</div><div class="lbl">Carbs / day</div></div>
      <div class="nutri-box"><div class="val">${NUTRITION.fat}</div><div class="lbl">Fat / day</div></div>
    </div>
    <div class="day-card" style="margin-top:16px;">
      <h2>Fueling notes</h2>
      ${NUTRITION.notes.map(n => `<div class="ex-row"><div class="ex-info"><div class="ex-detail">${n}</div></div></div>`).join('')}
    </div>`;
}

// ---------- Progress log view ----------
function renderLog(){
  const view = document.getElementById('logView');
  view.innerHTML = `
    <div class="log-form">
      <h2 style="margin:0 0 4px;">Log an update</h2>
      <label>Type</label>
      <select id="logType">
        <option value="Weight">Body weight</option>
        <option value="Lift">Lift number</option>
        <option value="Swim">Swim performance</option>
        <option value="Soreness/Injury">Soreness / injury</option>
        <option value="Note">General note</option>
      </select>
      <label>Details</label>
      <textarea id="logDetail" rows="3" placeholder="e.g. Goblet squat up to 35lb x10, felt RPE 6"></textarea>
      <button class="btn" id="addLogBtn">Save entry</button>
    </div>
    <div id="logList"></div>
  `;
  renderLogList();
  document.getElementById('addLogBtn').onclick = () => {
    const type = document.getElementById('logType').value;
    const detail = document.getElementById('logDetail').value.trim();
    if (!detail) return;
    logs.unshift({ type, detail, date: new Date().toLocaleDateString() });
    store.set('logs', logs);
    renderLog();
  };
}
function renderLogList(){
  const listEl = document.getElementById('logList');
  if (!listEl) return;
  if (logs.length === 0) { listEl.innerHTML = `<div class="empty">No entries yet. Log your first body weight, lift number, or swim note above.</div>`; return; }
  listEl.innerHTML = logs.map(l => `
    <div class="log-entry">
      <div class="d">${l.type} · ${l.date}</div>
      <div>${l.detail}</div>
    </div>`).join('');
}

// ---------- Bottom nav ----------
document.querySelectorAll('nav.bottom button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('nav.bottom button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['workoutView','nutritionView','logView'].forEach(id => {
      document.getElementById(id).style.display = (id === btn.dataset.view) ? 'block' : 'none';
    });
    document.getElementById('dayTabs').style.display = (btn.dataset.view === 'workoutView') ? 'flex' : 'none';
  };
});

// ---------- Init ----------
renderWorkout();
renderNutrition();
renderLog();

// ---------- PWA install prompt ----------
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBanner').style.display = 'flex';
});
document.getElementById('installBtn').onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('installBanner').style.display = 'none';
};

// ---------- Service worker registration ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
