AOS.init({ once: true, duration: 850, easing: 'ease-out-cubic' });

// -----------------------------
// Page visibility change (title + favicon)
// -----------------------------
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    document.title = 'Cyber Security';
    document
      .querySelector("link[rel*='icon']")
      .setAttribute('href', './favIcon.svg');
  } else {
    document.title = 'Come Back Please';
    document
      .querySelector("link[rel*='icon']")
      .setAttribute('href', './favhand.png');
  }
});
// -----------------------------
// Theme toggle (persists in localStorage)
// -----------------------------
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const saved = localStorage.getItem('cyberlab_theme');
if (saved === 'light') body.classList.add('light');
// ensure the switch state matches the current theme on load
themeToggle.setAttribute(
  'aria-checked',
  String(body.classList.contains('light'))
);
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  themeToggle.setAttribute('aria-checked', String(isLight));
  localStorage.setItem('cyberlab_theme', isLight ? 'light' : 'dark');
});

// -----------------------------
// Countdown target: now + 4 months (keeps previous logic but safer)
// -----------------------------
const targetDate = new Date();
const startDay = targetDate.getDate();
targetDate.setMonth(targetDate.getMonth() + 4);
if (targetDate.getDate() !== startDay) targetDate.setDate(0);

const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};
let lastValues = { days: '', hours: '', minutes: '', seconds: '' };

function tickEl(el) {
  el.classList.remove('tick');
  void el.offsetWidth;
  el.classList.add('tick');
  setTimeout(() => el.classList.remove('tick'), 400);
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<div class="time-box" style="min-width:100%"><div class="num">🎉</div><div class="label">We are live — Cyber Lab is online!</div></div>';
    clearInterval(interval);
    return;
  }
  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / (3600 * 24));
  const hours = Math.floor((sec % (3600 * 24)) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);
  const values = {
    days: String(days),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
  for (const k of Object.keys(values)) {
    if (lastValues[k] !== values[k]) {
      els[k].textContent = values[k];
      tickEl(els[k]);
      lastValues[k] = values[k];
    }
  }
}
updateCountdown();
const interval = setInterval(updateCountdown, 1000);

// -----------------------------
// Friendly toast helper
// -----------------------------
function showToast(message, ttl = 3500) {
  const wrap = document.getElementById('toastWrap');
  const card = document.createElement('div');
  card.className = 'toast-card';
  card.setAttribute('role', 'status');
  card.textContent = message;
  wrap.appendChild(card);
  setTimeout(() => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
  }, ttl - 350);
  setTimeout(() => wrap.removeChild(card), ttl);
}

// -----------------------------
// Subscribe handler (mock)
// -----------------------------
const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbzfwJkG0kuAhBBcChXAivsQvGSUjWJFZ6DFjxE7gW1WAgWifzE7WO4tnqqgAROLSLn0sA/exec';

async function subscribe(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const note = document.getElementById('note')?.value || '';

  if (!email) {
    showToast('Please enter a valid email.', 'error');
    return;
  }

  const form = new FormData();
  form.append('email', email);
  form.append('note', note);

  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: form,
  });

  showToast(
    'Thanks! You’ll be notified when the new version is released.✅',
    4000
  );
  e.target.reset();
}

// Accessibility: announce target date off-screen
const targetAnnouncement = document.createElement('div');
targetAnnouncement.setAttribute('aria-hidden', 'true');
targetAnnouncement.style.position = 'absolute';
targetAnnouncement.style.left = '-9999px';
targetAnnouncement.textContent =
  'Target launch date: ' + targetDate.toLocaleString();
document.body.appendChild(targetAnnouncement);

console.log('Countdown target date:', targetDate.toString());
