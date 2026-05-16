let countdownDurationMs = 0;
let countdownStartAtMs = null;
let pausedRemainingMs = 0;
let isPaused = false;
let hasCelebrated = false;
let timerInterval;
let clockInterval;

const throwHugeConfetti = () => {
  if (typeof confetti !== 'function') return;

  const defaults = {
    spread: 360,
    ticks: 320,
    gravity: 0.7,
    decay: 0.94,
    startVelocity: 55,
    scalar: 1.35,
    zIndex: 9999
  };

  confetti({ ...defaults, particleCount: 350, origin: { x: 0.5, y: 0.6 } });
  confetti({ ...defaults, particleCount: 220, angle: 60, origin: { x: 0, y: 0.75 } });
  confetti({ ...defaults, particleCount: 220, angle: 120, origin: { x: 1, y: 0.75 } });
};

const updateTimer = (block, to) => {
  const oldContent = block.dataset.content;
  if (oldContent === to) return;

  const span = document.createElement('span');
  span.classList.add('text-gradient');
  span.innerText = to;

  block.dataset.content = to;
  block.children[0].style.transform = 'translateY(-100%)';
  block.appendChild(span);
  setTimeout(() => {
    block.children[0].remove();
  }, 160);
};

const getRemainingMs = () => {
  if (isPaused) return pausedRemainingMs;
  if (countdownStartAtMs === null) return countdownDurationMs;
  const elapsedMs = Date.now() - countdownStartAtMs;
  return Math.max(countdownDurationMs - elapsedMs, 0);
};

const renderCountdown = (remainingMs) => {
  const seconds = Math.floor((remainingMs / 1000) % 60);
  const minutes = Math.floor((remainingMs / 1000 / 60) % 60);
  const hours = Math.floor(remainingMs / 1000 / 60 / 60);

  updateTimer(document.getElementById('timer_block__hours'), hours.toString().padStart(2, '0'));
  updateTimer(document.getElementById('timer_block__minutes'), minutes.toString().padStart(2, '0'));
  updateTimer(document.getElementById('timer_block__seconds'), seconds.toString().padStart(2, '0'));
};

const calculateTimeLeft = () => {
  const remainingMs = getRemainingMs();
  renderCountdown(remainingMs);

  if (remainingMs === 0) {
    clearInterval(timerInterval);
    if (!hasCelebrated) {
      hasCelebrated = true;
      throwHugeConfetti();
    }
  }
};

const updateClock = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  updateTimer(document.getElementById('timer_block__hours'), hours);
  updateTimer(document.getElementById('timer_block__minutes'), minutes);
  updateTimer(document.getElementById('timer_block__seconds'), seconds);
};

const togglePauseResume = () => {
  const button = document.getElementById('pause-resume-btn');
  if (countdownStartAtMs === null && countdownDurationMs === 0) return;

  if (!isPaused) {
    pausedRemainingMs = getRemainingMs();
    isPaused = true;
    button.innerText = 'Resume';
  } else {
    countdownDurationMs = pausedRemainingMs;
    countdownStartAtMs = Date.now();
    isPaused = false;
    button.innerText = 'Pause';
    calculateTimeLeft();
  }
};

const startTimer = () => {
  const title = document.getElementById('title').value || 'Default Title';
  const subtitle = document.getElementById('subtitle').value || 'Default Subtitle';
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const mode = document.getElementById('mode').value || 'countdown';

  const countdownTime = (hours * 60 * 60 + minutes * 60) * 1000;
  countdownDurationMs = countdownTime;
  countdownStartAtMs = Date.now();
  pausedRemainingMs = countdownTime;
  isPaused = false;
  hasCelebrated = false;

  document.getElementById('pause-resume-btn').innerText = 'Pause';

  // Save to localStorage
  localStorage.setItem('countdownTitle', title);
  localStorage.setItem('countdownSubtitle', subtitle);
  localStorage.setItem('countdownTime', countdownTime);
  localStorage.setItem('countdownMode', mode);

  // Update UI
  document.getElementById('countdown-title').innerText = title;
  document.getElementById('countdown-subtitle').innerText = subtitle;

  document.getElementById('setup-form').style.display = 'none';
  document.getElementById('timer-container').style.display = 'block';

  if (mode === 'countdown') {
    clearInterval(clockInterval);
    clearInterval(timerInterval);
    calculateTimeLeft();
    timerInterval = setInterval(calculateTimeLeft, 1000);
  } else if (mode === 'clock') {
    clearInterval(timerInterval);
    countdownDurationMs = 0;
    countdownStartAtMs = null;
    pausedRemainingMs = 0;
    isPaused = false;
    hasCelebrated = false;
    document.getElementById('pause-resume-btn').innerText = 'Pause';
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }
};

const resetTimer = () => {
  clearInterval(timerInterval);
  clearInterval(clockInterval);
  countdownDurationMs = 0;
  countdownStartAtMs = null;
  pausedRemainingMs = 0;
  isPaused = false;
  hasCelebrated = false;
  document.getElementById('pause-resume-btn').innerText = 'Pause';
  document.getElementById('setup-form').style.display = 'block';
  document.getElementById('timer-container').style.display = 'none';
};

const toggleFullscreen = () => {
  const container = document.documentElement; // Fullscreen the entire page
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

// Load from localStorage
window.onload = () => {
  const savedTitle = localStorage.getItem('countdownTitle');
  const savedSubtitle = localStorage.getItem('countdownSubtitle');
  const savedTime = parseInt(localStorage.getItem('countdownTime'));
  const savedMode = localStorage.getItem('countdownMode');

  if (savedTitle && savedSubtitle && savedTime && savedMode) {
    document.getElementById('title').value = savedTitle;
    document.getElementById('subtitle').value = savedSubtitle;
    document.getElementById('hours').value = Math.floor(savedTime / (60 * 60 * 1000));
    document.getElementById('minutes').value = Math.floor((savedTime / (60 * 1000)) % 60);
    document.getElementById('mode').value = savedMode;
  }
};

document.getElementById('start-btn').addEventListener('click', startTimer);
document.getElementById('pause-resume-btn').addEventListener('click', togglePauseResume);
document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
document.getElementById('reset-btn').addEventListener('click', resetTimer);
