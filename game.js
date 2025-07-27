// game.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const cellSize = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = null;
let food = getRandomFood();
let score = 0;
let intervalId = null;
let countdownEl = document.getElementById("countdown");

const headImg = new Image();
headImg.src = "xin.jpg";
const foodImg = new Image();
foodImg.src = "orange.jpg";

function getRandomFood() {
  return { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw snake
  snake.forEach((seg, i) => {
    if (i === 0) {
      ctx.drawImage(headImg, seg.x * cellSize, seg.y * cellSize, cellSize, cellSize);
    } else {
      ctx.fillStyle = "#000";
      ctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize, cellSize);
    }
  });

  // draw food
  ctx.drawImage(foodImg, food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

function step() {
  const head = { ...snake[0] };

  switch (direction) {
    case "ArrowUp": head.y--; break;
    case "ArrowDown": head.y++; break;
    case "ArrowLeft": head.x--; break;
    case "ArrowRight": head.x++; break;
  }

  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize ||
      snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = getRandomFood();
  } else {
    snake.pop();
  }

  draw();
}

function startGame() {
  countdownEl.style.display = "block";
  let count = 3;
  countdownEl.textContent = count;
  const cd = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(cd);
      countdownEl.style.display = "none";
      document.getElementById("startGameBtn").style.display = "none";
      document.addEventListener("keydown", keyHandler);
      intervalId = setInterval(step, 200);
    } else {
      countdownEl.textContent = count;
    }
  }, 1000);
}

function endGame() {
  clearInterval(intervalId);
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverPopup").classList.remove("hidden");

  fetch("submit_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: localStorage.getItem("playerName"),
      image: localStorage.getItem("playerImage"),
      score
    })
  });
}

function keyHandler(e) {
  const key = e.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    direction = key;
  }
}

document.getElementById("startGameBtn").addEventListener("click", startGame);
document.getElementById("tryAgainBtn").addEventListener("click", () => window.location.reload());
document.getElementById("shareBtn").addEventListener("click", () => {
  const text = `I scored ${score} in Snake.SIGN!`;
  const url = encodeURIComponent(location.href);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, "_blank");
});
