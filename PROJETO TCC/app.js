/* ============================================================
   ADM AND DS — Corporate Portal | app.js
   Neuromarketing · Eye Tracking · Full Interaction Layer
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. CLOCK — Status bar real-time
───────────────────────────────────────── */
function updateClock() {
  const el = document.getElementById('statusTime');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

/* ─────────────────────────────────────────
   2. MOBILE OVERLAY SCREENS
───────────────────────────────────────── */
function showScreen(name) {
  closeScreen();
  const el = document.getElementById('screen' + capitalize(name));
  if (!el) return;
  requestAnimationFrame(() => el.classList.add('active'));
  document.body.style.overflow = 'hidden';
}

function closeScreen() {
  document.querySelectorAll('.mobile-overlay').forEach(o => o.classList.remove('active'));
  document.body.style.overflow = '';
}

// Close on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('mobile-overlay')) closeScreen();
});

/* ─────────────────────────────────────────
   3. DESKTOP TAB SWITCHER
───────────────────────────────────────── */
function desktopTab(tab) {
  const loginForm    = document.getElementById('dFormLogin');
  const registerForm = document.getElementById('dFormRegister');
  const tabLogin     = document.getElementById('tabLogin');
  const tabRegister  = document.getElementById('tabRegister');
  if (!loginForm || !registerForm) return;

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
  }
}

/* ─────────────────────────────────────────
   4. PASSWORD VISIBILITY TOGGLE
───────────────────────────────────────── */
function togglePass(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ─────────────────────────────────────────
   5. PASSWORD STRENGTH METER
───────────────────────────────────────── */
function checkPassStrength(val, fillId, labelId) {
  const fill  = document.getElementById(fillId);
  const label = document.getElementById(labelId);
  if (!fill || !label) return;

  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  if (val.length >= 12)          score++;

  const map = [
    { w: '0%',   color: '#4A5568', txt: '' },
    { w: '25%',  color: '#E53E3E', txt: 'Fraca' },
    { w: '50%',  color: '#DD6B20', txt: 'Razoável' },
    { w: '75%',  color: '#D69E2E', txt: 'Boa' },
    { w: '90%',  color: '#38A169', txt: 'Forte' },
    { w: '100%', color: '#48BB78', txt: 'Excelente' },
  ];
  const s = map[Math.min(score, 5)];
  fill.style.width = s.w;
  fill.style.background = s.color;
  label.textContent = s.txt;
  label.style.color = s.color;
}

// Wire up desktop register password
const dRegPass = document.getElementById('dRegPass');
if (dRegPass) {
  dRegPass.addEventListener('input', () =>
    checkPassStrength(dRegPass.value, 'dStrengthFill', 'dStrengthLabel')
  );
}

/* ─────────────────────────────────────────
   6. TOAST NOTIFICATIONS
───────────────────────────────────────── */
let toastTimer;
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);

  const colors = {
    success : '#38A169',
    error   : '#E53E3E',
    warning : '#D69E2E',
    info    : 'rgba(120,150,200,0.9)',
  };

  toast.textContent = msg;
  toast.style.borderColor = colors[type] || colors.info;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ─────────────────────────────────────────
   7. FORM HANDLERS — Login & Register
───────────────────────────────────────── */
function handleLogin() {
  // Gather active email/pass based on current view
  const isMobile = window.innerWidth < 900;
  let email = '', pass = '';

  if (isMobile) {
    const overlay = document.getElementById('screenLogin');
    if (overlay) {
      const inputs = overlay.querySelectorAll('.glass-input');
      email = inputs[0]?.value.trim() || '';
      pass  = inputs[1]?.value || '';
    }
  } else {
    const form = document.getElementById('dFormLogin');
    if (form) {
      const inputs = form.querySelectorAll('.glass-input');
      email = inputs[0]?.value.trim() || '';
      pass  = inputs[1]?.value || '';
    }
  }

  if (!email) { showToast('⚠️ Digite seu e-mail', 'warning'); return; }
  if (!validateEmail(email)) { showToast('⚠️ E-mail inválido', 'warning'); return; }
  if (pass.length < 6) { showToast('⚠️ Senha muito curta', 'warning'); return; }

  // Simulate login
  const btn = event?.target || document.querySelector('.btn-primary-form');
  animateBtn(btn, 'Entrando...', () => {
    showToast('✅ Login realizado! Bem-vindo de volta.', 'success');
    closeScreen();
    setTimeout(() => openDashboard(), 800);
  });
}

function handleRegister() {
  const isMobile = window.innerWidth < 900;
  let name = '', email = '', pass = '';
  let termsChecked = false;

  if (isMobile) {
    const overlay = document.getElementById('screenRegister');
    if (overlay) {
      const inputs = overlay.querySelectorAll('.glass-input');
      name  = inputs[0]?.value.trim() || '';
      email = inputs[1]?.value.trim() || '';
      pass  = inputs[3]?.value || '';
      termsChecked = overlay.querySelector('.glass-check')?.checked || false;
    }
  } else {
    const form = document.getElementById('dFormRegister');
    if (form) {
      const inputs = form.querySelectorAll('.glass-input');
      name  = (inputs[0]?.value.trim() || '') + ' ' + (inputs[1]?.value.trim() || '');
      email = inputs[2]?.value.trim() || '';
      pass  = inputs[4]?.value || '';
      termsChecked = form.querySelector('.glass-check')?.checked || false;
    }
  }

  if (!name.trim()) { showToast('⚠️ Digite seu nome', 'warning'); return; }
  if (!validateEmail(email)) { showToast('⚠️ E-mail inválido', 'warning'); return; }
  if (pass.length < 8) { showToast('⚠️ Senha mínima: 8 caracteres', 'warning'); return; }
  if (!termsChecked) { showToast('⚠️ Aceite os Termos de Uso', 'warning'); return; }

  const btn = event?.target;
  animateBtn(btn, 'Criando conta...', () => {
    showToast('🎉 Conta criada com sucesso!', 'success');
    closeScreen();
    setTimeout(() => openDashboard(), 800);
  });
}

/* ─────────────────────────────────────────
   8. BUTTON LOADING ANIMATION
───────────────────────────────────────── */
function animateBtn(btn, loadingText, callback) {
  if (!btn) { setTimeout(callback, 1200); return; }
  const original = btn.textContent;
  btn.textContent = loadingText;
  btn.disabled = true;
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    btn.style.opacity = '';
    callback();
  }, 1400);
}

/* ─────────────────────────────────────────
   9. ACCESSIBILITY TOGGLE
───────────────────────────────────────── */
function toggleAccessibility() {
  document.body.classList.toggle('accessible');
  const on = document.body.classList.contains('accessible');
  showToast(on ? '♿ Modo acessível ativado' : '🎨 Modo padrão restaurado', 'info');
  localStorage.setItem('a11y', on ? '1' : '0');
}

// Restore on load
if (localStorage.getItem('a11y') === '1') {
  document.body.classList.add('accessible');
}

/* ─────────────────────────────────────────
   10. HELPERS
───────────────────────────────────────── */
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─────────────────────────────────────────
   11. RIPPLE EFFECT — all buttons
───────────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('button, .btn-glass');
  if (!btn) return;
  const circle = document.createElement('span');
  const r = Math.max(btn.clientWidth, btn.clientHeight);
  const rect = btn.getBoundingClientRect();
  circle.style.cssText = `
    position:absolute;width:${r}px;height:${r}px;
    border-radius:50%;background:rgba(255,255,255,0.15);
    top:${e.clientY - rect.top - r/2}px;
    left:${e.clientX - rect.left - r/2}px;
    transform:scale(0);animation:ripple 0.55s linear;
    pointer-events:none;
  `;
  if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
});

// Ripple keyframe injection
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple{to{transform:scale(4);opacity:0}}`;
document.head.appendChild(rippleStyle);

/* ─────────────────────────────────────────
   12. CURSOR EYE-TRACKING HALO (desktop)
───────────────────────────────────────── */
if (window.matchMedia('(pointer:fine)').matches) {
  const halo = document.createElement('div');
  halo.id = 'eyeHalo';
  halo.style.cssText = `
    position:fixed;width:48px;height:48px;
    border-radius:50%;pointer-events:none;z-index:9999;
    border:1.5px solid rgba(180,200,240,0.35);
    box-shadow:0 0 18px rgba(100,160,255,0.18);
    transform:translate(-50%,-50%);
    transition:transform 0.08s linear,width 0.2s,height 0.2s,opacity 0.3s;
    opacity:0;
  `;
  document.body.appendChild(halo);

  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;width:6px;height:6px;border-radius:50%;
    background:rgba(140,180,255,0.7);pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);transition:transform 0.04s linear;
    opacity:0;
  `;
  document.body.appendChild(dot);

  let mx=0,my=0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    halo.style.left = mx+'px'; halo.style.top = my+'px';
    halo.style.opacity = '1';
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    dot.style.opacity = '1';
  });

  // Expand halo on interactive elements
  document.addEventListener('mouseover', e => {
    const interactive = e.target.closest('button, input, a, label');
    if (interactive) {
      halo.style.width = '72px'; halo.style.height = '72px';
      halo.style.borderColor = 'rgba(100,200,255,0.55)';
    } else {
      halo.style.width = '48px'; halo.style.height = '48px';
      halo.style.borderColor = 'rgba(180,200,240,0.35)';
    }
  });

  document.addEventListener('mouseleave', () => { halo.style.opacity='0'; dot.style.opacity='0'; });
}

/* ─────────────────────────────────────────
   13. NEUROMARKETING DASHBOARD
───────────────────────────────────────── */
function openDashboard() {
  // Remove existing if any
  const existing = document.getElementById('nmDashboard');
  if (existing) existing.remove();

  const dash = document.createElement('div');
  dash.id = 'nmDashboard';
  dash.innerHTML = buildDashboardHTML();
  document.body.appendChild(dash);

  // Animate in
  requestAnimationFrame(() => {
    dash.style.opacity = '1';
    dash.style.transform = 'scale(1)';
  });

  // Start all dashboard animations
  setTimeout(() => {
    startEyeTracking();
    animateHeatmap();
    animateMetrics();
    animateAttentionBars();
    startNeuralPulse();
    startEmotionRadar();
  }, 400);

  // Close on ESC
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeDashboard(); document.removeEventListener('keydown', esc); }
  });
}

function closeDashboard() {
  const dash = document.getElementById('nmDashboard');
  if (!dash) return;
  dash.style.opacity = '0';
  dash.style.transform = 'scale(0.96)';
  setTimeout(() => dash.remove(), 400);
}

function buildDashboardHTML() {
  return `
<style>
/* ── Dashboard Overlay ── */
#nmDashboard {
  position:fixed;inset:0;z-index:500;
  background:linear-gradient(135deg,#04060A 0%,#080C14 50%,#040810 100%);
  overflow-y:auto;overflow-x:hidden;
  opacity:0;transform:scale(0.97);
  transition:all 0.45s cubic-bezier(0.22,1,0.36,1);
  font-family:'Sora',-apple-system,sans-serif;
  color:rgba(255,255,255,0.92);
}

/* Ambient blobs */
#nmDashboard::before,#nmDashboard::after {
  content:'';position:fixed;border-radius:50%;
  filter:blur(120px);pointer-events:none;z-index:0;
}
#nmDashboard::before {
  width:700px;height:700px;top:-200px;left:-150px;
  background:radial-gradient(circle,rgba(100,60,220,0.12),transparent);
}
#nmDashboard::after {
  width:600px;height:600px;bottom:-150px;right:-100px;
  background:radial-gradient(circle,rgba(0,180,255,0.10),transparent);
}

/* ── Layout ── */
.nm-wrap { position:relative;z-index:1;max-width:1400px;margin:0 auto;padding:24px; }

/* ── Header ── */
.nm-header {
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:28px;
  border-bottom:1px solid rgba(255,255,255,0.07);
  padding-bottom:18px;
}
.nm-logo {
  display:flex;align-items:center;gap:14px;
}
.nm-logo-dot {
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,#7B2FFF,#00BFFF);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(123,47,255,0.45);
}
.nm-logo h1 { font-size:18px;font-weight:700;letter-spacing:-0.02em; }
.nm-logo span { font-size:11px;color:rgba(255,255,255,0.45);font-weight:400;display:block;margin-top:1px; }

.nm-header-right { display:flex;align-items:center;gap:12px; }

.nm-live-badge {
  display:flex;align-items:center;gap:6px;
  background:rgba(255,80,80,0.12);border:1px solid rgba(255,80,80,0.3);
  border-radius:999px;padding:5px 12px;
  font-size:11px;font-weight:600;color:#FF7070;letter-spacing:0.04em;
}
.nm-live-dot {
  width:7px;height:7px;border-radius:50%;background:#FF4444;
  animation:nmPulse 1.4s ease-in-out infinite;
}
@keyframes nmPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

.nm-close-btn {
  width:36px;height:36px;border-radius:50%;
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);
  color:rgba(255,255,255,0.6);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:18px;transition:all 0.2s;
}
.nm-close-btn:hover { background:rgba(255,255,255,0.12);color:#fff; }

/* ── KPI Cards Row ── */
.nm-kpi-row {
  display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;
}
@media(max-width:900px){.nm-kpi-row{grid-template-columns:repeat(2,1fr);}}
@media(max-width:500px){.nm-kpi-row{grid-template-columns:1fr;}}

.nm-kpi {
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.09);
  border-radius:18px;padding:18px;
  position:relative;overflow:hidden;
  transition:transform 0.2s;
}
.nm-kpi:hover { transform:translateY(-2px); }
.nm-kpi-accent {
  position:absolute;top:0;left:0;width:100%;height:3px;border-radius:3px 3px 0 0;
}
.nm-kpi-icon { font-size:22px;margin-bottom:8px; }
.nm-kpi-label { font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px; }
.nm-kpi-val { font-size:28px;font-weight:700;letter-spacing:-0.03em; }
.nm-kpi-sub { font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px; }

/* ── Main Grid ── */
.nm-main-grid {
  display:grid;grid-template-columns:1fr 1fr 340px;gap:16px;
  margin-bottom:16px;
}
@media(max-width:1100px){.nm-main-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:700px){.nm-main-grid{grid-template-columns:1fr;}}

/* ── Cards ── */
.nm-card {
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:20px;padding:20px;
  position:relative;overflow:hidden;
}
.nm-card-title {
  font-size:12px;text-transform:uppercase;letter-spacing:0.07em;
  color:rgba(255,255,255,0.4);font-weight:600;margin-bottom:16px;
  display:flex;align-items:center;gap:8px;
}
.nm-card-title svg { opacity:0.6; }

/* ── Eye Tracking Canvas ── */
#eyeCanvas {
  width:100%;border-radius:12px;display:block;
  background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.07);
}

/* ── Heatmap ── */
#heatmapCanvas {
  width:100%;border-radius:12px;display:block;
  background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.07);
}

/* ── Emotion Radar ── */
#radarCanvas {
  width:100%;border-radius:12px;display:block;
  background:rgba(0,0,0,0.3);
}

/* ── Attention Bars ── */
.nm-attention-list { display:flex;flex-direction:column;gap:12px; }
.nm-att-item {}
.nm-att-head { display:flex;justify-content:space-between;margin-bottom:5px; }
.nm-att-label { font-size:11px;color:rgba(255,255,255,0.6);font-weight:500; }
.nm-att-val { font-size:11px;font-weight:700; }
.nm-att-bar { height:6px;border-radius:999px;background:rgba(255,255,255,0.07); }
.nm-att-fill { height:100%;border-radius:999px;width:0%;transition:width 1.2s cubic-bezier(0.34,1.56,0.64,1); }

/* ── Bottom Row ── */
.nm-bottom-row { display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px; }
@media(max-width:900px){.nm-bottom-row{grid-template-columns:1fr;}}

/* ── Neural Pulse ── */
#neuralCanvas { width:100%;display:block;border-radius:12px; }

/* ── Emotion Timeline ── */
.nm-timeline { display:flex;flex-direction:column;gap:8px; }
.nm-tl-item {
  display:flex;align-items:center;gap:10px;
  background:rgba(255,255,255,0.04);border-radius:10px;padding:9px 12px;
  border:1px solid rgba(255,255,255,0.07);
}
.nm-tl-emoji { font-size:18px;width:28px;text-align:center; }
.nm-tl-info { flex:1; }
.nm-tl-name { font-size:11px;font-weight:600;color:rgba(255,255,255,0.8); }
.nm-tl-time { font-size:10px;color:rgba(255,255,255,0.3); }
.nm-tl-bar {
  width:60px;height:4px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;
}
.nm-tl-fill { height:100%;border-radius:999px; }

/* ── Session Info ── */
.nm-session-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
.nm-sess-item {
  background:rgba(255,255,255,0.04);border-radius:12px;padding:14px;
  border:1px solid rgba(255,255,255,0.07);text-align:center;
}
.nm-sess-val { font-size:20px;font-weight:700;margin-bottom:3px; }
.nm-sess-lbl { font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.07em; }

/* ── Fixation Dots ── */
.fix-dot {
  position:absolute;border-radius:50%;pointer-events:none;
  animation:fixIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes fixIn { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }

/* ── Scan Lines ── */
.nm-scanline {
  position:fixed;inset:0;pointer-events:none;z-index:1;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);
}
</style>

<div class="nm-scanline"></div>

<div class="nm-wrap">

  <!-- Header -->
  <div class="nm-header">
    <div class="nm-logo">
      <div class="nm-logo-dot">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          <path d="M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      </div>
      <div>
        <h1>NeuroMarketing Hub</h1>
        <span>ADM AND DS · Eye Tracking · Cognitive Analytics</span>
      </div>
    </div>
    <div class="nm-header-right">
      <div class="nm-live-badge">
        <div class="nm-live-dot"></div>
        AO VIVO
      </div>
      <button class="nm-close-btn" onclick="closeDashboard()">✕</button>
    </div>
  </div>

  <!-- KPI Row -->
  <div class="nm-kpi-row">
    <div class="nm-kpi">
      <div class="nm-kpi-accent" style="background:linear-gradient(90deg,#7B2FFF,#A56FFF)"></div>
      <div class="nm-kpi-icon">👁️</div>
      <div class="nm-kpi-label">Fixações Totais</div>
      <div class="nm-kpi-val" id="kpiFixations">0</div>
      <div class="nm-kpi-sub">↑ 12% vs. sessão anterior</div>
    </div>
    <div class="nm-kpi">
      <div class="nm-kpi-accent" style="background:linear-gradient(90deg,#00BFFF,#00FFCC)"></div>
      <div class="nm-kpi-icon">⏱️</div>
      <div class="nm-kpi-label">Tempo Médio de Fixação</div>
      <div class="nm-kpi-val" id="kpiDuration">0<span style="font-size:14px">ms</span></div>
      <div class="nm-kpi-sub">Limiar cognitivo: 150ms</div>
    </div>
    <div class="nm-kpi">
      <div class="nm-kpi-accent" style="background:linear-gradient(90deg,#FF6B6B,#FFB347)"></div>
      <div class="nm-kpi-icon">🧠</div>
      <div class="nm-kpi-label">Carga Cognitiva</div>
      <div class="nm-kpi-val" id="kpiCognitive">0<span style="font-size:14px">%</span></div>
      <div class="nm-kpi-sub">Índice de engajamento neural</div>
    </div>
    <div class="nm-kpi">
      <div class="nm-kpi-accent" style="background:linear-gradient(90deg,#48BB78,#81E6D9)"></div>
      <div class="nm-kpi-icon">😊</div>
      <div class="nm-kpi-label">Valência Emocional</div>
      <div class="nm-kpi-val" id="kpiValence">0<span style="font-size:14px">%</span></div>
      <div class="nm-kpi-sub">Positivo vs. Negativo</div>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="nm-main-grid">

    <!-- Eye Tracking Panel -->
    <div class="nm-card">
      <div class="nm-card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        Eye Tracking — Mapa de Fixações
      </div>
      <canvas id="eyeCanvas" height="240"></canvas>
      <div style="margin-top:12px;display:flex;gap:16px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:rgba(255,255,255,0.5)">
          <div style="width:10px;height:10px;border-radius:50%;background:#FF4444;opacity:0.8"></div> Alta atenção
        </div>
        <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:rgba(255,255,255,0.5)">
          <div style="width:10px;height:10px;border-radius:50%;background:#FFD700;opacity:0.8"></div> Média
        </div>
        <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:rgba(255,255,255,0.5)">
          <div style="width:10px;height:10px;border-radius:50%;background:#00BFFF;opacity:0.8"></div> Passagem
        </div>
      </div>
    </div>

    <!-- Heatmap -->
    <div class="nm-card">
      <div class="nm-card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M12 12h.01"/></svg>
        Mapa de Calor — Zonas Quentes
      </div>
      <canvas id="heatmapCanvas" height="240"></canvas>
    </div>

    <!-- Emotion Radar -->
    <div class="nm-card">
      <div class="nm-card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Radar Emocional
      </div>
      <canvas id="radarCanvas" height="220"></canvas>
    </div>

  </div>

  <!-- Attention Bars + Bottom Row -->
  <div style="display:grid;grid-template-columns:320px 1fr;gap:16px;margin-bottom:16px">
    @media(max-width:700px){display:block!important}
    <div class="nm-card">
      <div class="nm-card-title">📊 Atenção por Zona</div>
      <div class="nm-attention-list" id="attentionList">
        ${buildAttentionBars()}
      </div>
    </div>
    <div class="nm-card">
      <div class="nm-card-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Onda Neural — EEG Simulado
      </div>
      <canvas id="neuralCanvas" height="120"></canvas>
    </div>
  </div>

  <!-- Bottom Row -->
  <div class="nm-bottom-row">

    <!-- Emotion Timeline -->
    <div class="nm-card">
      <div class="nm-card-title">🎭 Linha do Tempo Emocional</div>
      <div class="nm-timeline">
        ${buildEmotionTimeline()}
      </div>
    </div>

    <!-- Session Stats -->
    <div class="nm-card">
      <div class="nm-card-title">📈 Sessão Atual</div>
      <div class="nm-session-grid">
        <div class="nm-sess-item">
          <div class="nm-sess-val" style="color:#A56FFF" id="sessTime">00:00</div>
          <div class="nm-sess-lbl">Duração</div>
        </div>
        <div class="nm-sess-item">
          <div class="nm-sess-val" style="color:#00BFFF">3</div>
          <div class="nm-sess-lbl">Participantes</div>
        </div>
        <div class="nm-sess-item">
          <div class="nm-sess-val" style="color:#48BB78" id="sessScans">0</div>
          <div class="nm-sess-lbl">Scans</div>
        </div>
        <div class="nm-sess-item">
          <div class="nm-sess-val" style="color:#FFB347">87%</div>
          <div class="nm-sess-lbl">Precisão</div>
        </div>
      </div>
      <div style="margin-top:16px;padding:12px;background:rgba(123,47,255,0.08);border:1px solid rgba(123,47,255,0.2);border-radius:12px;">
        <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px">Insight IA</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.5" id="aiInsight">
          Zona superior-direita concentra 68% das fixações primárias. Recomendado: posicionar CTA nesta área.
        </div>
      </div>
    </div>

    <!-- Pupil Dilation -->
    <div class="nm-card">
      <div class="nm-card-title">🔬 Dilatação Pupilar</div>
      <canvas id="pupilCanvas" height="120" style="width:100%;border-radius:12px;display:block"></canvas>
      <div style="margin-top:12px;display:flex;justify-content:space-between">
        <div style="text-align:center">
          <div style="font-size:20px;font-weight:700;color:#FF6B6B" id="pupilLeft">4.2mm</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase">Esquerdo</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:20px;font-weight:700;color:#00BFFF" id="pupilRight">4.5mm</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase">Direito</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:20px;font-weight:700;color:#48BB78">+7%</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35);text-transform:uppercase">Variação</div>
        </div>
      </div>
    </div>

  </div>

</div><!-- end nm-wrap -->
`;
}

/* ─────────────────────────────────────────
   14. ATTENTION BARS HTML
───────────────────────────────────────── */
const attentionZones = [
  { label: 'Zona Hero (topo)',      val: 84, color: '#7B2FFF' },
  { label: 'Call-to-Action',        val: 72, color: '#FF6B6B' },
  { label: 'Logotipo / Brand',      val: 65, color: '#00BFFF' },
  { label: 'Navegação',             val: 48, color: '#FFB347' },
  { label: 'Corpo / Texto',         val: 33, color: '#48BB78' },
  { label: 'Rodapé',                val: 15, color: '#A56FFF' },
];

function buildAttentionBars() {
  return attentionZones.map((z, i) => `
    <div class="nm-att-item">
      <div class="nm-att-head">
        <span class="nm-att-label">${z.label}</span>
        <span class="nm-att-val" style="color:${z.color}">${z.val}%</span>
      </div>
      <div class="nm-att-bar">
        <div class="nm-att-fill" id="attBar${i}" style="background:${z.color}"></div>
      </div>
    </div>
  `).join('');
}

function animateAttentionBars() {
  attentionZones.forEach((z, i) => {
    const el = document.getElementById('attBar' + i);
    if (el) setTimeout(() => { el.style.width = z.val + '%'; }, i * 120);
  });
}

/* ─────────────────────────────────────────
   15. EMOTION TIMELINE HTML
───────────────────────────────────────── */
const emotions = [
  { emoji:'😲', name:'Surpresa',   time:'há 2s',   pct:82, color:'#FFD700' },
  { emoji:'😊', name:'Satisfação', time:'há 8s',   pct:74, color:'#48BB78' },
  { emoji:'🤔', name:'Curiosidade',time:'há 15s',  pct:68, color:'#00BFFF' },
  { emoji:'😐', name:'Neutro',     time:'há 22s',  pct:45, color:'#A0AEC0' },
  { emoji:'😟', name:'Hesitação',  time:'há 31s',  pct:28, color:'#FC8181' },
];

function buildEmotionTimeline() {
  return emotions.map(e => `
    <div class="nm-tl-item">
      <div class="nm-tl-emoji">${e.emoji}</div>
      <div class="nm-tl-info">
        <div class="nm-tl-name">${e.name}</div>
        <div class="nm-tl-time">${e.time}</div>
      </div>
      <div class="nm-tl-bar">
        <div class="nm-tl-fill" style="width:${e.pct}%;background:${e.color}"></div>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────
   16. EYE TRACKING ANIMATION
───────────────────────────────────────── */
function startEyeTracking() {
  const canvas = document.getElementById('eyeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = 240;
  canvas.width = W; canvas.height = H;

  // Static fixation points
  const fixations = [
    { x: W*0.72, y: H*0.22, r: 18, alpha: 0.85, color:'#FF4444' },
    { x: W*0.28, y: H*0.35, r: 14, alpha: 0.70, color:'#FF6B6B' },
    { x: W*0.50, y: H*0.55, r: 11, alpha: 0.55, color:'#FFD700' },
    { x: W*0.80, y: H*0.65, r: 9,  alpha: 0.45, color:'#FFD700' },
    { x: W*0.15, y: H*0.70, r: 7,  alpha: 0.35, color:'#00BFFF' },
    { x: W*0.60, y: H*0.82, r: 6,  alpha: 0.28, color:'#00BFFF' },
  ];

  // Saccade path
  let gazeX = W/2, gazeY = H/2;
  let targetIdx = 0;
  let phase = 0;

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
  }

  function drawScanpath() {
    // Draw lines between fixations
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4,6]);
    ctx.beginPath();
    fixations.forEach((f, i) => {
      i === 0 ? ctx.moveTo(f.x,f.y) : ctx.lineTo(f.x,f.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawFixations() {
    fixations.forEach((f, i) => {
      // Outer ring
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r + 6, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(${hexToRgb(f.color)},${f.alpha*0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Filled circle
      const grad = ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r);
      grad.addColorStop(0, `rgba(${hexToRgb(f.color)},${f.alpha})`);
      grad.addColorStop(1, `rgba(${hexToRgb(f.color)},0)`);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Number
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `bold ${Math.max(8,f.r*0.6)}px Sora, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i+1, f.x, f.y);
    });
  }

  function drawGaze() {
    const target = fixations[targetIdx % fixations.length];
    gazeX += (target.x - gazeX) * 0.06;
    gazeY += (target.y - gazeY) * 0.06;

    const dist = Math.hypot(target.x - gazeX, target.y - gazeY);
    if (dist < 5) {
      targetIdx = (targetIdx + 1) % fixations.length;
    }

    // Gaze cursor
    ctx.beginPath();
    ctx.arc(gazeX, gazeY, 10, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(gazeX, gazeY, 3, 0, Math.PI*2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Crosshair
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gazeX-18,gazeY); ctx.lineTo(gazeX-11,gazeY);
    ctx.moveTo(gazeX+11,gazeY); ctx.lineTo(gazeX+18,gazeY);
    ctx.moveTo(gazeX,gazeY-18); ctx.lineTo(gazeX,gazeY-11);
    ctx.moveTo(gazeX,gazeY+11); ctx.lineTo(gazeX,gazeY+18);
    ctx.stroke();
  }

  function tick() {
    if (!document.getElementById('eyeCanvas')) return;
    ctx.clearRect(0,0,W,H);
    drawGrid();
    drawScanpath();
    drawFixations();
    drawGaze();
    requestAnimationFrame(tick);
  }
  tick();
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

/* ─────────────────────────────────────────
   17. HEATMAP ANIMATION
───────────────────────────────────────── */
function animateHeatmap() {
  const canvas = document.getElementById('heatmapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = 240;
  canvas.width = W; canvas.height = H;

  const hotspots = [
    { x: W*0.72, y: H*0.22, intensity: 1.0,  r: 75 },
    { x: W*0.28, y: H*0.35, intensity: 0.75, r: 60 },
    { x: W*0.50, y: H*0.55, intensity: 0.55, r: 50 },
    { x: W*0.80, y: H*0.65, intensity: 0.40, r: 40 },
    { x: W*0.15, y: H*0.70, intensity: 0.30, r: 35 },
  ];

  let frame = 0;
  function draw() {
    if (!document.getElementById('heatmapCanvas')) return;
    ctx.clearRect(0,0,W,H);

    // Background mock UI lines
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(W*0.05, H*0.12, W*0.9, 8);
    ctx.fillRect(W*0.05, H*0.28, W*0.6, 6);
    ctx.fillRect(W*0.05, H*0.40, W*0.8, 6);
    ctx.fillRect(W*0.05, H*0.52, W*0.5, 6);
    ctx.fillRect(W*0.62, H*0.16, W*0.3, 14);

    hotspots.forEach(h => {
      const pulse = 1 + Math.sin(frame*0.05)*0.08;
      const gr = ctx.createRadialGradient(h.x,h.y,0,h.x,h.y,h.r*pulse);
      gr.addColorStop(0,   `rgba(255,0,0,${h.intensity*0.8})`);
      gr.addColorStop(0.3, `rgba(255,165,0,${h.intensity*0.5})`);
      gr.addColorStop(0.6, `rgba(255,255,0,${h.intensity*0.25})`);
      gr.addColorStop(1,   'rgba(0,100,255,0)');
      ctx.beginPath();
      ctx.arc(h.x,h.y,h.r*pulse,0,Math.PI*2);
      ctx.fillStyle = gr;
      ctx.fill();
    });

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────────────
   18. EMOTION RADAR
───────────────────────────────────────── */
function startEmotionRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = 220;
  canvas.width = W; canvas.height = H;
  const cx = W/2, cy = H/2;
  const R = Math.min(cx,cy) - 24;

  const labels = ['Alegria','Medo','Raiva','Tristeza','Nojo','Surpresa'];
  const values = [0.74, 0.22, 0.18, 0.30, 0.12, 0.82];
  let phase = 0;

  function drawRadar() {
    if (!document.getElementById('radarCanvas')) return;
    ctx.clearRect(0,0,W,H);
    const n = labels.length;
    const step = (Math.PI*2) / n;

    // Rings
    [0.25,0.5,0.75,1].forEach(r => {
      ctx.beginPath();
      for (let i=0;i<n;i++) {
        const a = -Math.PI/2 + i*step;
        const x = cx + Math.cos(a)*R*r;
        const y = cy + Math.sin(a)*R*r;
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,${r===1?0.12:0.06})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Spokes
    for (let i=0;i<n;i++) {
      const a = -Math.PI/2 + i*step;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.stroke();
    }

    // Animated data polygon
    const anim = values.map((v,i) => v + Math.sin(phase*0.05 + i*1.2)*0.06);

    ctx.beginPath();
    for (let i=0;i<n;i++) {
      const a = -Math.PI/2 + i*step;
      const rv = R * Math.max(0.05, anim[i]);
      const x = cx + Math.cos(a)*rv;
      const y = cy + Math.sin(a)*rv;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.closePath();
    const gr = ctx.createRadialGradient(cx,cy,0,cx,cy,R);
    gr.addColorStop(0, 'rgba(123,47,255,0.45)');
    gr.addColorStop(1, 'rgba(0,191,255,0.15)');
    ctx.fillStyle = gr;
    ctx.fill();
    ctx.strokeStyle = 'rgba(165,111,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '10px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i=0;i<n;i++) {
      const a = -Math.PI/2 + i*step;
      const lx = cx + Math.cos(a)*(R+18);
      const ly = cy + Math.sin(a)*(R+18);
      ctx.fillText(labels[i], lx, ly);
    }

    // Dots
    for (let i=0;i<n;i++) {
      const a = -Math.PI/2 + i*step;
      const rv = R * Math.max(0.05, anim[i]);
      ctx.beginPath();
      ctx.arc(cx+Math.cos(a)*rv, cy+Math.sin(a)*rv, 4, 0, Math.PI*2);
      ctx.fillStyle = '#A56FFF';
      ctx.fill();
    }

    phase++;
    requestAnimationFrame(drawRadar);
  }
  drawRadar();
}

/* ─────────────────────────────────────────
   19. NEURAL WAVE (EEG)
───────────────────────────────────────── */
function startNeuralPulse() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = 120;
  canvas.width = W; canvas.height = H;

  let offset = 0;
  const waves = [
    { freq:0.03, amp:22, speed:1.8, color:'rgba(123,47,255,0.9)',  lw:2.0 },
    { freq:0.06, amp:14, speed:2.5, color:'rgba(0,191,255,0.65)',  lw:1.5 },
    { freq:0.09, amp: 8, speed:3.2, color:'rgba(72,187,120,0.50)', lw:1.0 },
  ];

  function draw() {
    if (!document.getElementById('neuralCanvas')) return;
    ctx.clearRect(0,0,W,H);

    // Center line
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();

    waves.forEach(wave => {
      ctx.beginPath();
      for (let x=0;x<W;x++) {
        const y = H/2 + Math.sin((x*wave.freq) + offset*wave.speed) * wave.amp
                      + Math.sin((x*wave.freq*2.3) + offset*wave.speed*1.5) * wave.amp*0.4;
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = wave.lw;
      ctx.stroke();
    });

    // Spike occasionally
    if (Math.floor(offset) % 120 === 0) {
      const sx = W*0.7;
      ctx.beginPath();
      ctx.moveTo(sx, H/2);
      ctx.lineTo(sx+3, H*0.1);
      ctx.lineTo(sx+6, H*0.85);
      ctx.lineTo(sx+9, H/2);
      ctx.strokeStyle = 'rgba(255,100,100,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    offset += 0.4;
    requestAnimationFrame(draw);
  }
  draw();

  // Pupil canvas
  const pupilC = document.getElementById('pupilCanvas');
  if (pupilC) {
    const pc = pupilC.getContext('2d');
    const pW = pupilC.offsetWidth;
    const pH = 120;
    pupilC.width = pW; pupilC.height = pH;
    let po = 0;

    function drawPupil() {
      if (!document.getElementById('pupilCanvas')) return;
      pc.clearRect(0,0,pW,pH);
      pc.strokeStyle = 'rgba(255,255,255,0.05)';
      pc.lineWidth = 1;
      pc.beginPath(); pc.moveTo(0,pH/2); pc.lineTo(pW,pH/2); pc.stroke();

      // Left pupil line
      pc.beginPath();
      for (let x=0;x<pW;x++) {
        const y = pH/2 + Math.sin(x*0.04 + po)*18 + Math.sin(x*0.12+po*0.7)*5;
        x===0?pc.moveTo(x,y):pc.lineTo(x,y);
      }
      pc.strokeStyle = 'rgba(255,107,107,0.8)';
      pc.lineWidth = 2;
      pc.stroke();

      // Right pupil line
      pc.beginPath();
      for (let x=0;x<pW;x++) {
        const y = pH/2 + Math.sin(x*0.04 + po + 0.5)*20 + Math.sin(x*0.11+po*0.8)*6;
        x===0?pc.moveTo(x,y):pc.lineTo(x,y);
      }
      pc.strokeStyle = 'rgba(0,191,255,0.8)';
      pc.lineWidth = 2;
      pc.stroke();

      po += 0.3;
      requestAnimationFrame(drawPupil);
    }
    drawPupil();
  }
}

/* ─────────────────────────────────────────
   20. ANIMATED METRICS (KPI counters)
───────────────────────────────────────── */
function animateMetrics() {
  animateCounter('kpiFixations', 0, 247, 1800);
  animateCounter('kpiDuration',  0, 312, 1600);
  animateCounter('kpiCognitive', 0, 76,  1400);
  animateCounter('kpiValence',   0, 68,  1500);

  // Session timer
  let seconds = 0;
  const sessTimer = setInterval(() => {
    if (!document.getElementById('sessTime')) { clearInterval(sessTimer); return; }
    seconds++;
    const m = String(Math.floor(seconds/60)).padStart(2,'0');
    const s = String(seconds%60).padStart(2,'0');
    document.getElementById('sessTime').textContent = `${m}:${s}`;
  }, 1000);

  // Scan counter
  let scans = 0;
  const scanTimer = setInterval(() => {
    if (!document.getElementById('sessScans')) { clearInterval(scanTimer); return; }
    scans += Math.floor(Math.random()*3)+1;
    document.getElementById('sessScans').textContent = scans;
  }, 800);

  // AI Insights rotation
  const insights = [
    'Zona superior-direita concentra 68% das fixações primárias. Recomendado: posicionar CTA nesta área.',
    'Dilatação pupilar indica resposta emocional positiva ao elemento visual do topo.',
    'Tempo de fixação no logotipo (1.2s) sugere alta memorabilidade da marca.',
    'Padrão de sacada Z detectado: usuário segue fluxo natural de leitura ocidental.',
    'Emoção dominante: Surpresa (82%) — conteúdo gera alto impacto na primeira visão.',
  ];
  let insightIdx = 0;
  setInterval(() => {
    const el = document.getElementById('aiInsight');
    if (!el) return;
    insightIdx = (insightIdx+1) % insights.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = insights[insightIdx];
      el.style.opacity = '1';
    }, 300);
    el.style.transition = 'opacity 0.3s';
  }, 5000);

  // Pupil values
  setInterval(() => {
    const pl = document.getElementById('pupilLeft');
    const pr = document.getElementById('pupilRight');
    if (!pl||!pr) return;
    pl.textContent = (3.8 + Math.random()*0.8).toFixed(1)+'mm';
    pr.textContent = (4.0 + Math.random()*0.9).toFixed(1)+'mm';
  }, 1200);
}

function animateCounter(id, from, to, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const suffix = el.querySelector('span');
  const suffixText = suffix ? suffix.outerHTML : '';
  const start = performance.now();
  function update(now) {
    if (!document.getElementById(id)) return;
    const t = Math.min((now-start)/duration, 1);
    const ease = 1 - Math.pow(1-t, 3);
    const val = Math.round(from + (to-from)*ease);
    el.innerHTML = val + suffixText;
    if (t<1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ─────────────────────────────────────────
   21. KEYBOARD SHORTCUTS
───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.altKey && e.key === 'd') openDashboard();
  if (e.altKey && e.key === 'a') toggleAccessibility();
});

/* ─────────────────────────────────────────
   22. INIT
───────────────────────────────────────── */
console.log('%c ADM AND DS — Neuromarketing Portal Loaded ✓ ', 
  'background:#7B2FFF;color:#fff;font-size:13px;font-weight:700;border-radius:4px;padding:4px 8px');
console.log('%c Alt+D → Abrir Dashboard | Alt+A → Acessibilidade ',
  'color:#A56FFF;font-size:11px');
