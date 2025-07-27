const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startGameBtn");
const nameInput = document.getElementById("nameInput");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const countdownEl = document.getElementById("countdown");
const popup = document.getElementById("gameOverPopup");
const finalScoreEl = document.getElementById("finalScore");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const shareBtn = document.getElementById("shareBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const guideBtn = document.getElementById("guideBtn");

let username = "";
let userImage = null;
let score = 0;
let gameStarted = false;

// Enable Start button when both fields are filled
nameInput.addEventListener("input", checkForm);
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    userImage = file;
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";
    checkForm();
  }
});

function checkForm() {
  const valid = nameInput.value.endsWith(".SIGN") && userImage;
  startBtn.disabled = !valid;
}

startBtn.addEventListener("click", () => {
  username = nameInput.value.trim();
  startCountdown();
});

function startCountdown() {
  let count = 3;
  countdownEl.textContent = count;
  countdownEl.classList.remove("hidden");
  const interval = setInterval(() => {
    count--;
    countdownEl.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      countdownEl.classList.add("hidden");
      startGame();
    }
  }, 1000);
}

function startGame() {
  gameStarted = true;
  score = 0;
  drawInitial();
  updateGame(); // start game loop
}

function drawInitial() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Running...", 180, 300);
}

// Just a fake game loop for this template
function updateGame() {
  if (!gameStarted) return;
  setTimeout(() => {
    score += 1;
    if (score >= 10) {
      gameOver();
    } else {
      updateGame();
    }
  }, 500); // dummy loop
}

function gameOver() {
  gameStarted = false;
  finalScoreEl.textContent = score;
  popup.classList.remove("hidden");
  submitScore();
}

tryAgainBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
  startGame();
});

shareBtn.addEventListener("click", () => {
  const shareText = `I scored ${score} in Snake Game! Try to beat me!`;
  const shareURL = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  window.open(shareURL, "_blank");
});

function submitScore() {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("score", score);
  formData.append("image", userImage);

  fetch("save_score.php", {
    method: "POST",
    body: formData,
  }).then(res => res.text())
    .then(console.log)
    .catch(console.error);
}

leaderboardBtn.addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});

guideBtn.addEventListener("click", () => {
  alert("Use arrow keys to control the snake and eat the oranges!");
});
