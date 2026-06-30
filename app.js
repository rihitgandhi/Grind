// ---------- Storage helpers ----------
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch(e) { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

let checkState = store.get('checkState', {});
let activeDayIdx = store.get('activeDayIdx', 0);
let profileStats = store.get('profileStats', { height: '', weight: '', age: '' });
let measurements = store.get('measurements', []);

// ---------- Render workout day tabs ----------
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

  // Fixed: previously this could desync after one tap on mobile (iOS in particular),
  // requiring an extra uncheck/recheck. We now compute the new state explicitly and
  // force both the data attribute and the visual class to that exact value in one step,
  // instead of relying on two separate toggle() calls that could fall out of sync.
  view.querySelectorAll('.ex-check').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const newVal = !checkState[id];
      checkState[id] = newVal;
      store.set('checkState', checkState);
      el.classList.toggle('done', newVal);
      el.textContent = newVal ? '✓' : '';
    }, { passive: true });
  });
}

// ---------- Stretching view ----------
let stretchState = { routineIdx: null, poseIdx: 0, remaining: 0, timerId: null, paused: false };

function fmtTime(sec){
  const m = Math.floor(sec/60), s = sec%60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function renderStretch(){
  const view = document.getElementById('stretchView');
  if (stretchState.routineIdx !== null) { renderActiveStretch(); return; }

  let html = '';
  STRETCHES.forEach((r, i) => {
    const totalSec = r.poses.reduce((a,p) => a + p.seconds, 0);
    html += `<div class="day-card">
      <div class="tag">${r.target}</div>
      <h2>${r.name}</h2>
      <div class="section-label">${r.poses.length} poses · ${fmtTime(totalSec)} total</div>
      ${r.poses.map(p => `<div class="ex-row"><div class="ex-info"><div class="ex-name">${p.name}</div></div><div class="ex-detail">${p.seconds}s</div></div>`).join('')}
      <button class="btn" data-start="${i}">Start Routine</button>
    </div>`;
  });
  view.innerHTML = html;

  view.querySelectorAll('[data-start]').forEach(btn => {
    btn.addEventListener('click', () => startRoutine(parseInt(btn.dataset.start)), { passive: true });
  });
}

function startRoutine(idx){
  stretchState.routineIdx = idx;
  stretchState.poseIdx = 0;
  stretchState.remaining = STRETCHES[idx].poses[0].seconds;
  stretchState.paused = false;
  runTimer();
  renderActiveStretch();
}

function runTimer(){
  clearInterval(stretchState.timerId);
  stretchState.timerId = setInterval(() => {
    if (stretchState.paused) return;
    stretchState.remaining--;
    if (stretchState.remaining <= 0) {
      const routine = STRETCHES[stretchState.routineIdx];
      if (navigator.vibrate) navigator.vibrate(150);
      stretchState.poseIdx++;
      if (stretchState.poseIdx >= routine.poses.length) {
        clearInterval(stretchState.timerId);
        stretchState.routineIdx = null;
        renderStretch();
        return;
      }
      stretchState.remaining = routine.poses[stretchState.poseIdx].seconds;
    }
    renderActiveStretch();
  }, 1000);
}

function renderActiveStretch(){
  const view = document.getElementById('stretchView');
  const routine = STRETCHES[stretchState.routineIdx];
  const pose = routine.poses[stretchState.poseIdx];
  view.innerHTML = `
    <div class="day-card" style="text-align:center;">
      <div class="tag">${routine.name} · Pose ${stretchState.poseIdx + 1} of ${routine.poses.length}</div>
      <h2 style="margin-top:10px;">${pose.name}</h2>
      <div style="font-family:'Anybody',sans-serif; font-size:56px; font-weight:800; color:var(--accent); text-shadow:0 0 24px rgba(25,211,255,0.4); margin:18px 0;">${fmtTime(stretchState.remaining)}</div>
      <div style="display:flex; gap:10px; margin-top:6px;">
        <button class="btn" id="pauseBtn" style="background:var(--card-solid); color:var(--text); box-shadow:none; border:1px solid var(--line);">${stretchState.paused ? 'Resume' : 'Pause'}</button>
        <button class="btn" id="skipBtn" style="background:var(--card-solid); color:var(--text); box-shadow:none; border:1px solid var(--line);">Skip</button>
        <button class="btn" id="stopBtn" style="background:var(--card-solid); color:var(--text); box-shadow:none; border:1px solid var(--line);">Stop</button>
      </div>
    </div>`;
  document.getElementById('pauseBtn').addEventListener('click', () => {
    stretchState.paused = !stretchState.paused;
    renderActiveStretch();
  }, { passive: true });
  document.getElementById('skipBtn').addEventListener('click', () => {
    stretchState.remaining = 1; // forces advance on next tick
  }, { passive: true });
  document.getElementById('stopBtn').addEventListener('click', () => {
    clearInterval(stretchState.timerId);
    stretchState.routineIdx = null;
    renderStretch();
  }, { passive: true });
}

// ---------- Profile / measurements view ----------
function renderProfile(){
  const view = document.getElementById('profileView');
  view.innerHTML = `
    <div class="log-form">
      <h2 style="margin:0 0 4px;">Current Stats</h2>
      <label>Height</label>
      <input type="text" id="pHeight" placeholder="e.g. 6'1.5&quot;" value="${profileStats.height}">
      <label>Weight (lb)</label>
      <input type="number" id="pWeight" placeholder="e.g. 140" value="${profileStats.weight}">
      <label>Age</label>
      <input type="number" id="pAge" placeholder="e.g. 14" value="${profileStats.age}">
      <button class="btn" id="saveStatsBtn">Save Stats</button>
    </div>

    <div class="log-form">
      <h2 style="margin:0 0 4px;">Log a Measurement</h2>
      <label>Weight (lb)</label>
      <input type="number" id="mWeight" placeholder="e.g. 141">
      <label>Waist (in)</label>
      <input type="number" id="mWaist" placeholder="optional">
      <label>Chest (in)</label>
      <input type="number" id="mChest" placeholder="optional">
      <label>Arms (in)</label>
      <input type="number" id="mArms" placeholder="optional">
      <label>Notes</label>
      <textarea id="mNotes" rows="2" placeholder="how you're feeling, progress photo taken, etc."></textarea>
      <button class="btn" id="addMeasureBtn">Save Entry</button>
    </div>

    <div class="section-label">History</div>
    <div id="measureList"></div>
  `;
  renderMeasureList();

  document.getElementById('saveStatsBtn').addEventListener('click', () => {
    profileStats = {
      height: document.getElementById('pHeight').value.trim(),
      weight: document.getElementById('pWeight').value.trim(),
      age: document.getElementById('pAge').value.trim()
    };
    store.set('profileStats', profileStats);
  }, { passive: true });

  document.getElementById('addMeasureBtn').addEventListener('click', () => {
    const weight = document.getElementById('mWeight').value.trim();
    const waist = document.getElementById('mWaist').value.trim();
    const chest = document.getElementById('mChest').value.trim();
    const arms = document.getElementById('mArms').value.trim();
    const notes = document.getElementById('mNotes').value.trim();
    if (!weight && !waist && !chest && !arms && !notes) return;
    measurements.unshift({ weight, waist, chest, arms, notes, date: new Date().toLocaleDateString() });
    store.set('measurements', measurements);
    renderProfile();
  }, { passive: true });
}

function renderMeasureList(){
  const listEl = document.getElementById('measureList');
  if (!listEl) return;
  if (measurements.length === 0) { listEl.innerHTML = `<div class="empty">No measurements logged yet.</div>`; return; }
  listEl.innerHTML = measurements.map(m => {
    const parts = [];
    if (m.weight) parts.push(`${m.weight} lb`);
    if (m.waist) parts.push(`waist ${m.waist}"`);
    if (m.chest) parts.push(`chest ${m.chest}"`);
    if (m.arms) parts.push(`arms ${m.arms}"`);
    return `<div class="log-entry">
      <div class="d">${m.date}</div>
      <div>${parts.join(' · ') || '—'}</div>
      ${m.notes ? `<div style="color:var(--muted); margin-top:4px;">${m.notes}</div>` : ''}
    </div>`;
  }).join('');
}

// ---------- Bottom nav ----------
document.querySelectorAll('nav.bottom button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav.bottom button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ['workoutView','stretchView','profileView'].forEach(id => {
      document.getElementById(id).style.display = (id === btn.dataset.view) ? 'block' : 'none';
    });
    document.getElementById('dayTabs').style.display = (btn.dataset.view === 'workoutView') ? 'flex' : 'none';
  }, { passive: true });
});

// ---------- Init ----------
renderWorkout();
renderStretch();
renderProfile();

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

// Note: service worker registration is handled by the inline script in index.html.
// (Removed the duplicate registration that used to live here, to avoid two
// registrations of the same scope running at once.)
