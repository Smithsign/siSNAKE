let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let gridSize = 20; // 20x20 grid
let box = canvas.width / gridSize;
let snake = [{ x: 9, y: 9 }];
let direction = "";
let food = generateFood();
let score = 0;
let gameStarted = false;

// Load assets
const headImg = new Image();
headImg.src = "xin.jpg";

const foodImg = new Image();
foodImg.src = "orange.jpg";

// Countdown function
function startCountdown(callback) {
  let count = 3;
  const countdownEl = document.getElementById("countdown");
  countdownEl.style.display = "block";
  countdownEl.innerText = count;

  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(interval);
      countdownEl.style.display = "none";
      callback();
    } else {
      countdownEl.innerText = count;
    }
  }, 1000);
}

// Game logic
function draw() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    if (i === 0) {
      ctx.drawImage(headImg, segment.x * box, segment.y * box, box, box);
    } else {
      ctx.fillStyle = "#FFA500";
      ctx.fillRect(segment.x * box, segment.y * box, box, box);
    }
  }

  // Draw food
  ctx.drawImage(foodImg, food.x * box, food.y * box, box, box);

  // Move
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;

  // Check game over
  if (
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize ||
    collision(head)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = generateFood();
  } else {
    snake.pop();
  }
}

function collision(head) {
  return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };
}

function gameOver() {
  clearInterval(game);
  document.getElementById("gameOverScreen").style.display = "flex";
  document.getElementById("finalScore").innerText = `Score: ${score}`;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

document.getElementById("startGame").addEventListener("click", () => {
  document.getElementById("landing").style.display = "none";
  document.getElementById("canvasWrapper").style.display = "block";
  startCountdown(() => {
    gameStarted = true;
    game = setInterval(draw, 200);
  });
});
