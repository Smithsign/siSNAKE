const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let snake = [{ x: 5 * box, y: 5 * box }];
let direction = "RIGHT";
let score = 0;
let food = {
  x: Math.floor(Math.random() * (canvasWidth / box)) * box,
  y: Math.floor(Math.random() * (canvasHeight / box)) * box,
};

let game;
let isGameRunning = false;

document.addEventListener("keydown", setDirection);

function setDirection(e) {
  const key = e.key.toLowerCase();
  if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
  if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
  if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#32CD32" : "#FFA500";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#222";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  const foodImg = new Image();
  foodImg.src = "orange.png";
  foodImg.onload = () => {
    ctx.drawImage(foodImg, food.x, food.y, box, box);
  };
  ctx.drawImage(foodImg, food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Check game over
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

  // Eat food
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

  // Score display
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

// Game over screen
function showGameOver(score) {
  canvas.style.display = "none";
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("finalScore").textContent = score;
}

// Start game logic
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  direction = "RIGHT";
  snake = [{ x: 5 * box, y: 5 * box }];
  score = 0;
  food = {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box,
  };
  game = setInterval(draw, 100);
}

document.getElementById("startGameBtn").addEventListener("click", () => {
  if (!isGameRunning) {
    isGameRunning = true;
    startGame();
  }
});
