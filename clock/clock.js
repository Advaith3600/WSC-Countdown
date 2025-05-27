let countdownTime = 0;
let remainingTime = 0;
let isPaused = false;
let timerInterval;
let clockInterval;

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

const calculateTimeLeft = () => {
  if (isPaused) return;

  remainingTime = Math.max(remainingTime - 1000, 0);

  const seconds = Math.floor((remainingTime / 1000) % 60);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const hours = Math.floor(remainingTime / 1000 / 60 / 60);

  updateTimer(document.getElementById('timer_block__hours'), hours.toString().padStart(2, '0'));
  updateTimer(document.getElementById('timer_block__minutes'), minutes.toString().padStart(2, '0'));
  updateTimer(document.getElementById('timer_block__seconds'), seconds.toString().padStart(2, '0'));

  if (remainingTime === 0) {
    clearInterval(timerInterval);
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

  document.getElementById('timer_date').innerText = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const togglePauseResume = () => {
  const button = document.getElementById('pause-resume-btn');
  isPaused = !isPaused;

  if (isPaused) {
    button.innerText = 'Resume';
  } else {
    button.innerText = 'Pause';
  }
};

const startTimer = () => {
  // const title = document.getElementById('title').value || 'Default Title';
  // const subtitle = document.getElementById('subtitle').value || 'Default Subtitle';
  // const hours = parseInt(document.getElementById('hours').value) || 0;
  // const minutes = parseInt(document.getElementById('minutes').value) || 0;
  // const mode = document.getElementById('mode').value || 'countdown';

  // countdownTime = (hours * 60 * 60 + minutes * 60) * 1000;
  // remainingTime = countdownTime;

  // Save to localStorage
  // localStorage.setItem('countdownTitle', title);
  // localStorage.setItem('countdownSubtitle', subtitle);
  // localStorage.setItem('countdownTime', countdownTime);
  // localStorage.setItem('countdownMode', mode);

  // Update UI
  // document.getElementById('countdown-title').innerText = title;
  // document.getElementById('countdown-subtitle').innerText = subtitle;

  // document.getElementById('setup-form').style.display = 'none';
  // document.getElementById('timer-container').style.display = 'block';

  // if (mode === 'countdown') {
  //   clearInterval(clockInterval);
  //   calculateTimeLeft();
  //   timerInterval = setInterval(calculateTimeLeft, 1000);
  // } else if (mode === 'clock') {
    clearInterval(timerInterval);
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  // }
};

const resetTimer = () => {
  location.reload();
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

startTimer();

// Load from localStorage
// window.onload = () => {
//   const savedTitle = localStorage.getItem('countdownTitle');
//   const savedSubtitle = localStorage.getItem('countdownSubtitle');
//   const savedTime = parseInt(localStorage.getItem('countdownTime'));
//   const savedMode = localStorage.getItem('countdownMode');

//   if (savedTitle && savedSubtitle && savedTime && savedMode) {
//     document.getElementById('title').value = savedTitle;
//     document.getElementById('subtitle').value = savedSubtitle;
//     document.getElementById('hours').value = Math.floor(savedTime / (60 * 60 * 1000));
//     document.getElementById('minutes').value = Math.floor((savedTime / (60 * 1000)) % 60);
//     document.getElementById('mode').value = savedMode;
//   }
// };

// document.getElementById('start-btn').addEventListener('click', startTimer);
// document.getElementById('pause-resume-btn').addEventListener('click', togglePauseResume);
// document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
// document.getElementById('reset-btn').addEventListener('click', resetTimer);