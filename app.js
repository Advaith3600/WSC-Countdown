const searchParams = new URLSearchParams(location.search);
const date = searchParams.get('date');

document.body.style.setProperty('--background-color', searchParams.get('backgroundColor'));
document.body.style.setProperty('--primary-color', searchParams.get('primaryColor'));
document.body.style.setProperty('--secondary-color', searchParams.get('secondaryColor'));

if (searchParams.has('logoURL')) {
  const image = document.createElement('img');
  image.id = 'logo';
  image.alt = 'logo';
  image.src = searchParams.get('logoURL');
  document.getElementById('logo-wrapper').appendChild(image);
}

if (searchParams.has('title')) {
  const title = document.createElement('h1');
  title.id = 'title';
  title.innerText = searchParams.get('title');
  document.getElementById('logo-wrapper').appendChild(title);
}

const finalDate = new Date(date);

const updateTimer = (block, to) => {
  const oldContent = block.dataset.content;
  if (oldContent === to) return;

  const span = document.createElement('span');
  span.classList.add('text-gradient')
  span.innerText = to;

  block.dataset.content = to;
  block.children[0].style.transform = 'translateY(-100%)';
  block.appendChild(span);
  setTimeout(() => {
    block.children[0].remove();
  }, 160);
}

const holidays = [];

const calculateTrainingTimeLeft = () => {
  let days = 0;
  const now = new Date();
  // now.setHours(0, 0, 0, 0);

  const totalYears = finalDate.getFullYear() - now.getFullYear();

  for (let k = 0; k <= totalYears; k++) {
    for (let i = 1; i <= 12; i++) {
      for (let j = 1; j <= 31; j++) {
        const date = moment(`${now.getFullYear()}-${i}-${j}`, 'YYYY-MM-DD');
        if (
          holidays.includes(date.format('l')) ||
          date > finalDate ||
          date < now ||
          date.day() === 6 ||
          date.day() === 0 ||
          !date.isValid()
        ) {
          continue;
        }

        days++;
      }
    }
  }

  return days;
}

const calculateTimeLeft = () => {
  const now = new Date();
  const diff = Math.max(finalDate - now, 0);

  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  updateTimer(document.getElementById('timer_block__days'), days.toString().padStart(2, '0'));
  updateTimer(document.getElementById('timer_block__trainable_hours'), (calculateTrainingTimeLeft() * 8).toString().padStart(2, '0'));
}

calculateTimeLeft();
setInterval(() => calculateTimeLeft(), 1000);