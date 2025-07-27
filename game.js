const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let canvasWidth = window.innerWidth < 600 ? 300 : 600;
let canvasHeight = window.innerHeight < 600 ? 300 : 600;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let snake;
let direction;
let score;
let food;
let game;
let isGameRunning = false;

const foodImg = new Image();
foodImg.src = "orange.png";

const headImg = new Image();
headImg.src = "xin.jpg";

function initGame() {
  canvasWidth = window.innerWidth < 600 ? 300 : 600;
  canvasHeight = window.innerHeight < 600 ? 300 : 600;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  snake = [{ x: 5 * box, y: 5 * box }];
  direction = "RIGHT";
  score = 0;
  food = {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box,
  };

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
  canvas.style.display = "block";

  if (game) clearInterval(game);
  game = setInterval(draw, 100);
  isGameRunning = true;
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.drawImage(headImg, snake[i].x, snake[i].y, box, box);
    } else {
      ctx.fillStyle = "#FFA500";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
      ctx.strokeStyle = "#111";
      ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
  }

  // Draw food
  ctx.drawImage(foodImg, food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  switch (direction) {
    case "UP": headY -= box; break;
    case "DOWN": headY += box; break;
    case "LEFT": headX -= box; break;
    case "RIGHT": headX += box; break;
  }

  // Game over conditions
  if (
    headX < 0 ||
    headX >= canvasWidth ||
    headY < 0 ||
    headY >= canvasHeight ||
    snake.some((s, index) => index !== 0 && s.x === headX && s.y === headY)
  ) {
    clearInterval(game);
    showGameOver(score);
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (canvasWidth / box)) * box,
      y: Math.floor(Math.random() * (canvasHeight / box)) * box,
    };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);

  // Score
  ctx.fillStyle = "white";
  ctx.font = "18px Segoe UI";
  ctx.fillText("Score: " + score, 10, 20);
}

function showGameOver(score) {
  canvas.style.display = "none";
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("finalScore").textContent = score;
  isGameRunning = false;
}

// Controls: Arrow Keys and WASD
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
  else if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
  else if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  else if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
});

// Start & Restart buttons
document.getElementById("startBtn").addEventListener("click", initGame);
document.getElementById("tryAgainBtn").addEventListener("click", initGame);

// Resize canvas on window resize
window.addEventListener("resize", () => {
  if (isGameRunning) {
    clearInterval(game);
    initGame(); // restart game to re-calculate size
  }
});
