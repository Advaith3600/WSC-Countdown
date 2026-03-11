const searchParams = new URLSearchParams(location.search);
const date = searchParams.get("date");

document.body.style.setProperty(
  "--background-color",
  searchParams.get("backgroundColor")
);
document.body.style.setProperty(
  "--primary-color",
  searchParams.get("primaryColor")
);
document.body.style.setProperty(
  "--secondary-color",
  searchParams.get("secondaryColor")
);

if (searchParams.has("logoURL")) {
  const image = document.createElement("img");
  image.id = "logo";
  image.alt = "logo";
  image.src = searchParams.get("logoURL");
  document.getElementById("logo-wrapper").appendChild(image);
}

if (searchParams.has("title")) {
  const title = document.createElement("h1");
  title.id = "title";
  title.innerText = searchParams.get("title");
  document.getElementById("logo-wrapper").appendChild(title);
}

const showDetails = searchParams.get("showDetails") === "true";
if (showDetails) {
  document.getElementById("timer-detail-wrapper").style.display = "";
}

const lightTheme = searchParams.get("lightTheme") === "true";
if (lightTheme) {
  document.body.classList.add("light-theme");
}

const finalDate = new Date(date);

const updateTimer = (block, to) => {
  const oldContent = block.dataset.content;
  if (oldContent === to) return;

  const span = document.createElement("span");
  span.classList.add("text-gradient");
  span.innerText = to;

  block.dataset.content = to;
  block.children[0].style.transform = "translateY(-100%)";
  block.appendChild(span);
  setTimeout(() => {
    block.children[0].remove();
  }, 160);
};

const calculateTimeLeft = () => {
  const now = new Date();
  const diff = Math.max(finalDate - now, 0);

  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  const hours = Math.floor((diff / 1000 / 60 / 60) % 24);

  updateTimer(
    document.getElementById("timer_block__days"),
    days.toString().padStart(2, "0")
  );
  updateTimer(
    document.getElementById("timer_block__hours"),
    hours.toString().padStart(2, "0")
  );

  if (showDetails) {
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    updateTimer(
      document.getElementById("timer_block__minutes"),
      minutes.toString().padStart(2, "0")
    );
    updateTimer(
      document.getElementById("timer_block__seconds"),
      seconds.toString().padStart(2, "0")
    );
  }

  document.getElementById("timer_date").innerText =
    finalDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
};

calculateTimeLeft();
setInterval(() => calculateTimeLeft(), 1000);
