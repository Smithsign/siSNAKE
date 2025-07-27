const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let snake = [{ x: 5 * box, y: 5 * box }];
let direction = "RIGHT";
let score = 0;
let game;
let gameStarted = false;

let food = {
  x: Math.floor(Math.random() * (canvasWidth / box)) * box,
  y: Math.floor(Math.random() * (canvasHeight / box)) * box,
};

// Draw START GAME button before game starts
function drawStartScreen() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("SNAKE SIGN GAME", canvasWidth / 2, canvasHeight / 2 - 60);

  // Draw button
  const buttonWidth = 200;
  const buttonHeight = 50;
  const buttonX = (canvasWidth - buttonWidth) / 2;
  const buttonY = canvasHeight / 2;

  ctx.fillStyle = "orange";
  ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 25);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("START GAME", canvasWidth / 2, buttonY + 32);

  canvas.addEventListener("click", function clickHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight
    ) {
      canvas.removeEventListener("click", clickHandler);
      startGame();
    }
  });
}

// Extend CanvasRenderingContext2D to support rounded rect
CanvasRenderingContext2D.prototype.roundRect = function (
  x,
  y,
  width,
  height,
  radius
) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};

// Handle key inputs
document.addEventListener("keydown", setDirection);

function setDirection(e) {
  const key = e.key.toLowerCase();
  if ((key === "arrowup" || key === "w") && direction !== "DOWN")
    direction = "UP";
  else if ((key === "arrowdown" || key === "s") && direction !== "UP")
    direction = "DOWN";
  else if ((key === "arrowleft" || key === "a") && direction !== "RIGHT")
    direction = "LEFT";
  else if ((key === "arrowright" || key === "d") && direction !== "LEFT")
    direction = "RIGHT";
}

function startGame() {
  gameStarted = true;
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = "RIGHT";
  score = 0;
  food = {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box,
  };
  game = setInterval(draw, 100);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "orange";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  const foodImg = new Image();
  foodImg.src = "orange.jpg";
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
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function showGameOver(score) {
  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("gameOver").style.display = "block";
  document.getElementById("finalScore").textContent = score;
  // Optional: POST score to backend here
}

// Start on landing screen
drawStartScreen();
