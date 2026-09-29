
// ── DATA ──
const bloodInventory = [
  { type: 'A+',  units: 8420, max: 10000, status: 'ok' },
  { type: 'A−',  units: 1240, max: 5000,  status: 'low' },
  { type: 'B+',  units: 7880, max: 10000, status: 'ok' },
  { type: 'B−',  units: 890,  max: 5000,  status: 'low' },
  { type: 'AB+', units: 4320, max: 7000,  status: 'ok' },
  { type: 'AB−', units: 380,  max: 3000,  status: 'low' },
  { type: 'O+',  units: 9640, max: 12000, status: 'ok' }, 
  { type: 'O−',  units: 510,  max: 8000,  status: 'critical' },
];

const donorsData = [
  { name: 'Rahul Sharma',    blood: 'O+',  city: 'Indore',   donations: 8,  last: '2 weeks ago',   status: 'Available' },
  { name: 'Priya Mehta',     blood: 'A+',  city: 'Indore',   donations: 4,  last: '1 month ago',   status: 'Available' },
  { name: 'Arjun Singh',     blood: 'B+',  city: 'Bhopal',   donations: 12, last: '3 months ago',  status: 'Available' },
  { name: 'Sneha Patel',     blood: 'AB+', city: 'Indore',   donations: 2,  last: '5 months ago',  status: 'Available' },
  { name: 'Vikram Rao',      blood: 'O−',  city: 'Ujjain',   donations: 6,  last: '6 weeks ago',   status: 'Unavailable' },
  { name: 'Ananya Joshi',    blood: 'A−',  city: 'Indore',   donations: 3,  last: '2 months ago',  status: 'Available' },
  { name: 'Karan Malhotra',  blood: 'B−',  city: 'Dewas',    donations: 9,  last: '1 month ago',   status: 'Available' },
  { name: 'Deepika Verma',   blood: 'AB−', city: 'Indore',   donations: 1,  last: '8 months ago',  status: 'Available' },
  { name: 'Rohit Gupta',     blood: 'O+',  city: 'Indore',   donations: 15, last: '3 weeks ago',   status: 'Available' },
  { name: 'Meera Nair',      blood: 'A+',  city: 'Jabalpur', donations: 7,  last: '6 weeks ago',   status: 'Unavailable' },
  { name: 'Aditya Kumar',    blood: 'B+',  city: 'Indore',   donations: 5,  last: '2 months ago',  status: 'Available' },
  { name: 'Simran Kaur',     blood: 'O−',  city: 'Indore',   donations: 3,  last: '4 months ago',  status: 'Available' },
];

const requestsData = [
  { blood: 'O−',  patient: 'Ramesh P.',    hospital: 'City General',   units: 3, urgency: 'critical', status: 'Processing' },
  { blood: 'AB+', patient: 'Sunita D.',    hospital: "St. Mary's",     units: 2, urgency: 'urgent',   status: 'Matched' },
  { blood: 'A+',  patient: 'Kiran S.',     hospital: 'Metro Hospital', units: 1, urgency: 'standard', status: 'Fulfilled' },
  { blood: 'B+',  patient: 'Mohan L.',     hospital: 'Apollo',         units: 4, urgency: 'urgent',   status: 'Processing' },
  { blood: 'O+',  patient: 'Geeta R.',     hospital: 'Sunrise',        units: 2, urgency: 'critical', status: 'Processing' },
];

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 20);
});

// ── PAGE SWITCHER ──
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'donors') renderDonors(donorsData);
}

// ── TOAST ──
function toast(msg, type = 'success') {
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = (type === 'success' ? '✅' : '❌') + ' ' + msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ── BLOOD GRID (Hero) ──
function renderBloodGrid() {
  const grid = document.getElementById('bloodGrid');
  grid.innerHTML = bloodInventory.map(b => `
    <div class="blood-type-card" onclick="showPage('inventory')">
      <div class="bt-symbol">${b.type}</div>
      <div class="bt-units">${(b.units/1000).toFixed(1)}k u.</div>
      <div class="bt-status status-${b.status}">${b.status === 'ok' ? '● Good' : b.status === 'low' ? '● Low' : '● Critical'}</div>
    </div>
  `).join('');
  if (typeof initTilt === 'function') initTilt();
}

// ── INVENTORY GRID ──
function renderInventory() {
  const grid = document.getElementById('inventoryGrid');
  grid.innerHTML = bloodInventory.map(b => {
    const pct = Math.round((b.units / b.max) * 100);
    return `
      <div class="inv-card">
        <div class="inv-type">${b.type}</div>
        <div class="inv-units">${b.units.toLocaleString()}</div>
        <div class="inv-label">units available</div>
        <div class="inv-bar-wrap">
          <div class="inv-bar" style="width:${pct}%;background:${pct < 20 ? 'linear-gradient(90deg,#FFCDD2,#E53935)' : pct < 50 ? 'linear-gradient(90deg,#FFE0B2,#FF8F00)' : 'linear-gradient(90deg,#C8E6C9,#388E3C)'}"></div>
        </div>
        <div style="font-size:0.72rem;color:var(--text-light)">of ${b.max.toLocaleString()} max</div>
        <span class="badge badge-${b.status === 'ok' ? 'ok' : b.status === 'low' ? 'low' : 'critical'}">${b.status === 'ok' ? '✔ Adequate' : b.status === 'low' ? '⚠ Low' : '🚨 Critical'}</span>
      </div>
    `;
  }).join('');
}

// ── REQUESTS TABLE ──
function renderRequests() {
  const urgencyMap = { critical: ['badge-critical', '🔴 Critical'], urgent: ['badge-low', '🟠 Urgent'], standard: ['badge-ok', '🟢 Standard'] };
  const statusColor = { Processing: '#FFF3E0', Matched: '#E3F2FD', Fulfilled: '#E8F5E9' };
  const tbody = document.getElementById('reqTableBody');
  if (!tbody) return;
  tbody.innerHTML = requestsData.map(r => `
    <tr>
      <td class="td-type">${r.blood}</td>
      <td>${r.patient}</td>
      <td>${r.hospital}</td>
      <td><strong>${r.units}</strong> units</td>
      <td><span class="badge ${urgencyMap[r.urgency][0]}">${urgencyMap[r.urgency][1]}</span></td>
      <td><span style="padding:4px 10px;border-radius:99px;font-size:0.75rem;font-weight:600;background:${statusColor[r.status] || '#F3F4F6'}">${r.status}</span></td>
    </tr>
  `).join('');
}

// ── DONORS ──
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}
let currentFilter = 'All';
function renderDonors(list) {
  const container = document.getElementById('donorList');
  if (!container) return;
  if (!list.length) { container.innerHTML = '<p style="color:var(--text-muted);padding:1rem">No donors found.</p>'; return; }
  container.innerHTML = list.map((d, i) => `
    <div class="donor-card" onclick="openDonorModal(${i})">
      <div class="donor-avatar">${getInitials(d.name)}</div>
      <div class="donor-info">
        <div class="donor-name">${d.name}</div>
        <div class="donor-meta">📍 ${d.city} &nbsp;|&nbsp; ${d.donations} donations &nbsp;|&nbsp; Last: ${d.last}</div>
      </div>
      <div>
        <div class="donor-type">${d.blood}</div>
        <div style="font-size:0.7rem;color:${d.status === 'Available' ? '#2E7D32' : 'var(--text-light)'};font-weight:600;text-align:right;margin-top:4px">${d.status === 'Available' ? '● Available' : '○ Unavailable'}</div>
      </div>
    </div>
  `).join('');
}

function filterDonors(query) {
  const list = donorsData.filter(d =>
    (currentFilter === 'All' || d.blood === currentFilter) &&
    (d.name.toLowerCase().includes(query.toLowerCase()) || d.city.toLowerCase().includes(query.toLowerCase()))
  );
  renderDonors(list);
}

function filterByType(type, el) {
  currentFilter = type;
  document.querySelectorAll('#bloodChips .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const q = document.getElementById('donorSearch')?.value || '';
  filterDonors(q);
}

function openDonorModal(i) {
  const d = donorsData[i];
  document.getElementById('modalTitle').textContent = d.name;
  document.getElementById('modalBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
      <div class="donor-avatar" style="width:64px;height:64px;font-size:1.4rem">${getInitials(d.name)}</div>
      <div>
        <div style="font-size:2rem;font-family:'Sora',sans-serif;font-weight:800;color:var(--red)">${d.blood}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Blood Type</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1.5rem">
      <div style="background:var(--red-soft);border-radius:var(--radius-sm);padding:12px">
        <div style="font-size:1.4rem;font-weight:700;color:var(--red)">${d.donations}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">Total Donations</div>
      </div>
      <div style="background:#F3F4F6;border-radius:var(--radius-sm);padding:12px">
        <div style="font-size:1rem;font-weight:600">${d.last}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">Last Donated</div>
      </div>
    </div>
    <div style="font-size:0.875rem;color:var(--text-muted);margin-bottom:1rem">
      📍 ${d.city} &nbsp;|&nbsp; Status: <strong style="color:${d.status === 'Available' ? '#2E7D32' : '#888'}">${d.status}</strong>
    </div>
    ${d.status === 'Available' ? `<button class="btn btn-primary" style="width:100%" onclick="toast('Request sent to ${d.name}!');document.getElementById('modal').classList.remove('open')">🩸 Send Donation Request</button>` : `<button class="btn btn-secondary" style="width:100%;cursor:not-allowed" disabled>Donor currently unavailable</button>`}
  `;
  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target.id === 'modal') document.getElementById('modal').classList.remove('open');
}

// ── REGISTER DONOR ──
function registerDonor() {
  const fields = ['donorFirst','donorLast','donorEmail','donorPhone','donorDob','donorGender','donorBlood','donorWeight','donorCity'];
  const missing = fields.filter(f => !document.getElementById(f)?.value);
  if (missing.length) { toast('Please fill all required fields.', 'error'); return; }
  const name = document.getElementById('donorFirst').value + ' ' + document.getElementById('donorLast').value;
  donorsData.unshift({
    name, blood: document.getElementById('donorBlood').value,
    city: document.getElementById('donorCity').value,
    donations: 0, last: 'Never', status: 'Available'
  });
  toast(`Welcome, ${name}! Registration successful. 🎉`);
  ['donorFirst','donorLast','donorEmail','donorPhone','donorDob','donorWeight','donorCity'].forEach(f => { document.getElementById(f).value = ''; });
  document.getElementById('donorGender').value = '';
  document.getElementById('donorBlood').value = '';
}

// ── SUBMIT REQUEST ──
function submitRequest() {
  const fields = ['reqPatient','reqHospital','reqContact','reqPhone','reqBlood','reqUnits','reqUrgency'];
  const missing = fields.filter(f => !document.getElementById(f)?.value);
  if (missing.length) { toast('Please fill all required fields.', 'error'); return; }
  requestsData.unshift({
    blood: document.getElementById('reqBlood').value,
    patient: document.getElementById('reqPatient').value,
    hospital: document.getElementById('reqHospital').value,
    units: document.getElementById('reqUnits').value,
    urgency: document.getElementById('reqUrgency').value,
    status: 'Processing',
  });
  renderRequests();
  toast('Blood request submitted! Matching donors now...');
  ['reqPatient','reqHospital','reqContact','reqPhone','reqUnits','reqPurpose','reqNotes','reqAge'].forEach(f => {
    const el = document.getElementById(f); if (el) el.value = '';
  });
  document.getElementById('reqBlood').value = '';
  document.getElementById('reqUrgency').value = '';
}

// ── REFRESH ──
function refreshInventory() {
  bloodInventory.forEach(b => {
    b.units = Math.max(100, b.units + Math.floor((Math.random() - 0.5) * 200));
  });
  renderInventory();
  const total = bloodInventory.reduce((a, b) => a + b.units, 0);
  const crit = bloodInventory.filter(b => b.status === 'critical' || (b.units / b.max < 0.2)).length;
  document.getElementById('totalUnits').textContent = total.toLocaleString();
  document.getElementById('criticalCount').textContent = crit;
  toast('Inventory refreshed!');
}

// ── INIT ──
renderBloodGrid();
renderInventory();
renderRequests();
renderDonors(donorsData);

/* ════════════════ AUTH / SIGNUP / LOGIN / OTP ════════════════ */
let pendingUser = null;     // user data awaiting otp verification
let currentUser = null;     // logged-in user
let generatedOtp = '';
let otpTimerInterval = null;
let otpPurpose = 'signup';  // 'signup' or 'login'

function checkStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val) && val.length >= 10) score++;
  const bars = [document.getElementById('pb1'), document.getElementById('pb2'), document.getElementById('pb3')];
  bars.forEach(b => b.className = 'pwd-bar');
  const label = document.getElementById('pwdLabel');
  if (!val) { label.textContent = 'Use 8+ characters with numbers & symbols'; return; }
  if (score === 1) { bars[0].classList.add('active-weak'); label.textContent = 'Weak password'; }
  else if (score === 2) { bars[0].classList.add('active-mid'); bars[1].classList.add('active-mid'); label.textContent = 'Good password'; }
  else if (score >= 3) { bars.forEach(b => b.classList.add('active-strong')); label.textContent = 'Strong password'; }
}

function signupUser() {
  const name = document.getElementById('suName').value.trim();
  const email = document.getElementById('suEmail').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const pwd = document.getElementById('suPwd').value;
  const blood = document.getElementById('suBlood').value;
  const terms = document.getElementById('suTerms').checked;

  if (!name || !email || !phone || !pwd) { toast('Please fill all required fields.', 'error'); return; }
  if (!terms) { toast('Please accept the Terms to continue.', 'error'); return; }

  pendingUser = { name, email, phone, pwd, blood: blood || 'O+', city: 'Indore, MP', donations: 0 };
  otpPurpose = 'signup';
  goToOtp(phone);
}

function loginUser() {
  const id = document.getElementById('loginId').value.trim();
  const pwd = document.getElementById('loginPwd').value;
  if (!id || !pwd) { toast('Enter your email/phone and password.', 'error'); return; }
  pendingUser = { name: 'Jordan Smith', email: id.includes('@') ? id : 'jordan@example.com', phone: id.includes('@') ? '+91 98765 43210' : id, blood: 'O+', city: 'Indore, MP', donations: 7 };
  otpPurpose = 'login';
  goToOtp(pendingUser.phone);
}

function goToOtp(phone) {
  generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
  document.getElementById('otpDest').textContent = phone || '+91 98765 43210';
  showPage('otp');
  setTimeout(() => {
    toast(`Your OTP is ${generatedOtp} (demo)`);
    document.querySelector('#otpRow .otp-box').focus();
  }, 400);
  startOtpTimer();
}

function startOtpTimer() {
  let seconds = 120;
  const resend = document.getElementById('resendBtn');
  resend.classList.add('disabled');
  clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    seconds--;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    document.getElementById('otpTimer').textContent = `${m}:${s}`;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
      document.getElementById('otpTimer').textContent = 'Expired';
      resend.classList.remove('disabled');
    }
  }, 1000);
}

function resendOtp() {
  if (document.getElementById('resendBtn').classList.contains('disabled')) return;
  generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
  toast(`New OTP sent: ${generatedOtp} (demo)`);
  startOtpTimer();
}

function verifyOtp() {
  const boxes = [...document.querySelectorAll('#otpRow .otp-box')];
  const entered = boxes.map(b => b.value).join('');
  if (entered.length < 6) {
    boxes.forEach(b => { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); });
    toast('Please enter the full 6-digit code.', 'error');
    return;
  }
  if (entered !== generatedOtp) {
    boxes.forEach(b => { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); b.value=''; });
    boxes[0].focus();
    toast('Incorrect OTP. Try again.', 'error');
    return;
  }
  clearInterval(otpTimerInterval);
  currentUser = pendingUser;
  toast(otpPurpose === 'signup' ? `Welcome to LifeFlow, ${currentUser.name}! 🎉` : `Welcome back, ${currentUser.name}!`);
  loginSuccessUI();
  boxes.forEach(b => b.value = '');
  showPage('profile');
  pushAlert('ok', '✅', 'Phone number verified successfully', 'just now');
}

function loginSuccessUI() {
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('accountMenu').style.display = 'block';
  const initials = currentUser.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('accountInitials').textContent = initials;
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmail').textContent = currentUser.email;
  document.getElementById('profileBloodBadge').textContent = currentUser.blood;
  document.getElementById('profileDonations').textContent = currentUser.donations;
  document.getElementById('pName').textContent = currentUser.name;
  document.getElementById('pEmail').textContent = currentUser.email;
  document.getElementById('pPhone').textContent = currentUser.phone;
  document.getElementById('pBlood').textContent = currentUser.blood;
  document.getElementById('pCity').textContent = currentUser.city;
  const elig = Math.min(100, currentUser.donations === 0 ? 100 : 68);
  document.getElementById('eligPct').textContent = elig + '%';
  setTimeout(() => { document.getElementById('eligBar').style.width = elig + '%'; }, 200);
}

function logout() {
  currentUser = null;
  document.getElementById('authButtons').style.display = 'flex';
  document.getElementById('accountMenu').style.display = 'none';
  document.getElementById('accountDropdown').classList.remove('open');
  toast('Logged out successfully');
  showPage('home');
}

function toggleAccountMenu() {
  document.getElementById('accountDropdown').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('accountMenu');
  if (menu && !menu.contains(e.target)) document.getElementById('accountDropdown').classList.remove('open');
});

/* OTP box auto-advance */
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('otp-box')) {
    const boxes = [...document.querySelectorAll('#otpRow .otp-box')];
    const i = +e.target.dataset.i;
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0,1);
    if (e.target.value) {
      e.target.classList.add('filled');
      if (i < 5) boxes[i+1].focus();
    } else {
      e.target.classList.remove('filled');
    }
  }
});
document.addEventListener('keydown', (e) => {
  if (e.target.classList && e.target.classList.contains('otp-box') && e.key === 'Backspace' && !e.target.value) {
    const boxes = [...document.querySelectorAll('#otpRow .otp-box')];
    const i = +e.target.dataset.i;
    if (i > 0) boxes[i-1].focus();
  }
});
/* OTP paste support */
document.addEventListener('paste', (e) => {
  if (e.target.classList && e.target.classList.contains('otp-box')) {
    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g,'').slice(0,6);
    if (text.length) {
      const boxes = [...document.querySelectorAll('#otpRow .otp-box')];
      text.split('').forEach((ch, idx) => { if (boxes[idx]) { boxes[idx].value = ch; boxes[idx].classList.add('filled'); } });
      boxes[Math.min(text.length,6)-1].focus();
      e.preventDefault();
    }
  }
});

/* ════════════════ INSTANT ALERTS SYSTEM ════════════════ */
const alertsData = [
  { type: 'crit', icon: '🚨', text: 'O− blood critically low at St. Mary\'s Medical Center', time: '2 min ago' },
  { type: 'info', icon: '💉', text: 'New blood request: 3 units AB+ needed at City General', time: '18 min ago' },
  { type: 'ok',   icon: '✅', text: 'Your donation has been successfully recorded. Thank you!', time: '1 hr ago' },
  { type: 'info', icon: '📍', text: 'A blood donation camp is happening near Indore this weekend', time: '3 hrs ago' },
  { type: 'crit', icon: '🚨', text: 'Emergency: O+ needed urgently at Metro Hospital', time: '5 hrs ago' },
];

function renderAlerts(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = alertsData.map(a => `
    <div class="alert-item">
      <div class="alert-icon ${a.type}">${a.icon}</div>
      <div>
        <div class="alert-text">${a.text}</div>
        <div class="alert-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

function pushAlert(type, icon, text, time) {
  alertsData.unshift({ type, icon, text, time });
  if (alertsData.length > 8) alertsData.pop();
  renderAlerts('alertsFeed');
  renderAlerts('profileAlertFeed');
  const bell = document.getElementById('bellWrap');
  bell.classList.remove('bell-shake');
  void bell.offsetWidth;
  bell.classList.add('bell-shake');
  document.getElementById('bellDot').style.display = 'block';
}

function openAlertsPanel() {
  renderAlerts('alertsFeed');
  document.getElementById('alertsModal').classList.add('open');
  document.getElementById('bellDot').style.display = 'none';
}
function closeAlertsModal(e) {
  if (e.target.id === 'alertsModal') document.getElementById('alertsModal').classList.remove('open');
}

renderAlerts('alertsFeed');
renderAlerts('profileAlertFeed');

/* Simulate periodic live alerts */
const liveAlertPool = [
  { type: 'crit', icon: '🚨', text: 'AB− stock dropped below critical threshold' },
  { type: 'info', icon: '💉', text: 'New urgent request submitted for B+ at Apollo Specialty' },
  { type: 'info', icon: '🩸', text: 'A donor near you just registered — refer your friends!' },
  { type: 'ok',   icon: '✅', text: 'Inventory levels updated across all partner hospitals' },
];
setInterval(() => {
  const a = liveAlertPool[Math.floor(Math.random() * liveAlertPool.length)];
  pushAlert(a.type, a.icon, a.text, 'just now');
}, 25000);

/* ════════════════ SCROLL REVEAL ANIMATIONS ════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

function initReveals() {
  document.querySelectorAll('.card, .reveal, .donor-card, .inv-card').forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    revealObserver.observe(el);
  });
}
initReveals();
/* re-observe whenever a page becomes active (for dynamically filtered content) */
const pageObserver = new MutationObserver(() => initReveals());
pageObserver.observe(document.body, { attributeFilter: ['class'], subtree: true });

/* ════════════════ RIPPLE EFFECT ON BUTTONS ════════════════ */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = (e.clientX - rect.left - 10) + 'px';
  ripple.style.top = (e.clientY - rect.top - 10) + 'px';
  ripple.style.width = ripple.style.height = '20px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

/* ════════════════ 3D TILT ON BLOOD TYPE CARDS ════════════════ */
function initTilt() {
  document.querySelectorAll('.blood-type-card').forEach(card => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(400px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
initTilt();

(function spawnDrops() {
  const hero = document.querySelector('.hero-visual');
  if (!hero) return;
  hero.style.position = 'relative';
  for (let i = 0; i < 6; i++) {
    const d = document.createElement('div');
    d.className = 'float-drop';
    d.textContent = '🩸';
    d.style.left = (Math.random() * 90) + '%';
    d.style.animationDelay = (Math.random() * 8) + 's';
    d.style.animationDuration = (6 + Math.random() * 6) + 's';
    hero.appendChild(d);
  }
})();

