const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Grid config
const gridSize = 10;
const box = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.9 / gridSize);
canvas.width = box * gridSize;
canvas.height = box * gridSize;

let snake = [];
let direction = "RIGHT";
let score = 0;
let food;
let game;
let speed = 150;

// Load images
const foodImg = new Image();
foodImg.src = "orange.png";

const headImg = new Image();
headImg.src = "xin.jpg";

function initGame() {
  snake = [{ x: 5, y: 5 }];
  direction = "RIGHT";
  score = 0;
  speed = 150;

  food = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };

  document.getElementById("gameOverPopup").classList.add("hidden");
  document.getElementById("score").textContent = score;
  canvas.style.display = "block";

  if (game) clearInterval(game);
  game = setInterval(draw, speed);
}

function drawGrid() {
  ctx.strokeStyle = "#FFB347";
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * box, 0);
    ctx.lineTo(i * box, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * box);
    ctx.lineTo(canvas.width, i * box);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  // Draw snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.drawImage(headImg, segment.x * box, segment.y * box, box, box);
    } else {
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(segment.x * box + box / 2, segment.y * box + box / 2, box / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw food
  ctx.drawImage(foodImg, food.x * box, food.y * box, box, box);

  // Move snake
  const headX = snake[0].x;
  const headY = snake[0].y;
  let newHead = { x: headX, y: headY };

  if (direction === "UP") newHead.y--;
  if (direction === "DOWN") newHead.y++;
  if (direction === "LEFT") newHead.x--;
  if (direction === "RIGHT") newHead.x++;

  // Game over
  if (
    newHead.x < 0 ||
    newHead.x >= gridSize ||
    newHead.y < 0 ||
    newHead.y >= gridSize ||
    snake.some((s, i) => i !== 0 && s.x === newHead.x && s.y === newHead.y)
  ) {
    clearInterval(game);
    showGameOver(score);
    return;
  }

  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };

    if (speed > 60) {
      clearInterval(game);
      speed -= 5;
      game = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function showGameOver(score) {
  canvas.style.display = "none";
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverPopup").classList.remove("hidden");
}

// Controls
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
  else if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
  else if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  else if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
});

// Buttons
document.getElementById("startGameBtn").addEventListener("click", () => {
  document.getElementById("startGameBtn").style.display = "none";
  initGame();
});

document.getElementById("tryAgainBtn").addEventListener("click", () => {
  document.getElementById("startGameBtn").style.display = "block";
  document.getElementById("gameOverPopup").classList.add("hidden");
  initGame();
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const text = `I scored ${score} on SIGN Snake Game! 🍊🎮 Try it now!`;
  const url = encodeURIComponent(window.location.href);
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
  window.open(shareUrl, "_blank");
});
