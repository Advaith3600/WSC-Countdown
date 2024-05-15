const WSC24 = new Date('2024-09-07');

const updateTimer = (block, to) => {
  const oldContent = block.dataset.content;
  if (oldContent === to) return;

  const span = document.createElement('span');
  span.innerText = to;

  block.dataset.content = to;
  block.children[0].style.transform = 'translateY(-100%)';
  block.appendChild(span);
  setTimeout(() => {
    block.children[0].remove();
  }, 160);
}

const calculateTimeLeft = () => {
  const now = new Date();
  const diff = Math.max(WSC24 - now, 0);

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const days = Math.floor((diff / 1000 / 60 / 60) / 24);
  const weeks = Math.floor(days / 7);

  document.getElementById('split_left__weeks').innerText = weeks.toString().padStart(2, '0');
  document.getElementById('split_left__days').innerText = days.toString().padStart(2, '0');
  document.getElementById('split_left__hours').innerText = hours.toString().padStart(2, '0');

  updateTimer(document.getElementById('timer_block__hours'), hours.toString().padStart(2, '0'));
  updateTimer(document.getElementById('timer_block__minutes'), minutes.toString().padStart(2, '0'));
  updateTimer(document.getElementById('timer_block__seconds'), seconds.toString().padStart(2, '0'));
}

calculateTimeLeft();
setInterval(() => calculateTimeLeft(), 1000);

const holidays = [
  ''
];

const calculateTrainingTimeLeft = () => {
  let days = 0;
  const now = new Date();
  // now.setHours(0, 0, 0, 0);

  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 31; j++) {
      const date = new Date(`${now.getFullYear()}-${i}-${j}`);
      if (
        holidays.includes(date.toDateString()) ||
        date > WSC24 ||
        date < now ||
        date.getDay() === 6 ||
        date.getDay() === 0 ||
        !moment(`${now.getFullYear()}-${i}-${j}`, 'YYYY-MM-DD').isValid()
      ) {
        continue;
      }

      days++;
    }
  }

  document.getElementById('training_hours').innerText = (days * 8).toString().padStart(2, '0');

  document.getElementById('split_right__weeks').innerText = Math.floor(days / 7).toString().padStart(2, '0');
  document.getElementById('split_right__days').innerText = days.toString().padStart(2, '0');
  document.getElementById('split_right__hours').innerText = (days * 8).toString().padStart(2, '0');
}

calculateTrainingTimeLeft();
setInterval(() => calculateTrainingTimeLeft(), 60 * 1000);
