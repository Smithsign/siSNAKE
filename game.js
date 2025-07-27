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

  // Game over
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
  // TODO: send score to backend
}

let game = setInterval(draw, 100);
