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

const foodImg = new Image();
foodImg.src = "orange.png";

const headImg = new Image();
headImg.src = "xin.jpg";

document.addEventListener("keydown", setDirection);

function setDirection(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.drawImage(headImg, snake[i].x, snake[i].y, box, box);
    } else {
      ctx.fillStyle = "orange";
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

  // Check if food eaten
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

  // Display score
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function showGameOver(score) {
  const gameCanvas = document.getElementById("gameCanvas");
  const gameOverPopup = document.getElementById("gameOver");
  const finalScoreDisplay = document.getElementById("finalScore");

  gameCanvas.style.display = "none";
  gameOverPopup.style.display = "flex";
  finalScoreDisplay.textContent = score;

  // Optional: play game over sound
  const gameOverSound = new Audio("gameover.mp3");
  gameOverSound.play();
}

let game = setInterval(draw, 100);
