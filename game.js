const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let snake = [{ x: 5 * box, y: 5 * box }];
let direction = "RIGHT";
let score = 0;
let food = randomFoodPosition();

let isGameStarted = false;
let game;

// Load assets
const foodImg = new Image();
foodImg.src = "orange.jpg";

const headImg = new Image();
headImg.src = "xin.jpg";

// Start button config
const startBtn = {
  x: canvasWidth / 2 - 80,
  y: canvasHeight / 2 - 25,
  width: 160,
  height: 50,
  radius: 15,
  text: "START GAME"
};

// Draw rounded rectangle
function drawRoundedRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Draw initial screen
function drawStartScreen() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw Start Button
  drawRoundedRect(startBtn.x, startBtn.y, startBtn.width, startBtn.height, startBtn.radius);
  ctx.fillStyle = "#ff8c00";
  ctx.fill();

  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(startBtn.text, canvasWidth / 2, canvasHeight / 2 + 6);
}

drawStartScreen();

function startGame() {
  isGameStarted = true;
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = "RIGHT";
  score = 0;
  food = randomFoodPosition();
  game = setInterval(draw, 100);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.drawImage(headImg, snake[i].x, snake[i].y, box, box);
    } else {
      ctx.fillStyle = "#ffa500";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }

  // Draw food
  ctx.drawImage(foodImg, food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Game over condition
  if (
    headX < 0 || headX >= canvasWidth ||
    headY < 0 || headY >= canvasHeight ||
    snake.some((s, i) => i !== 0 && s.x === headX && s.y === headY)
  ) {
    clearInterval(game);
    showGameOver(score);
    return;
  }

  let newHead = { x: headX, y: headY };

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    food = randomFoodPosition();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

// Get random food position
function randomFoodPosition() {
  return {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box
  };
}

// Mouse click to detect start button
canvas.addEventListener("click", function (e) {
  if (!isGameStarted) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (
      mx >= startBtn.x && mx <= startBtn.x + startBtn.width &&
      my >= startBtn.y && my <= startBtn.y + startBtn.height
    ) {
      startGame();
    }
  }
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
  if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
  if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
});

// Game over screen
function showGameOver(score) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2 - 30);
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, canvasWidth / 2, canvasHeight / 2 + 10);
  ctx.fillText("Refresh to play again", canvasWidth / 2, canvasHeight / 2 + 40);
}
