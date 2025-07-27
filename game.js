const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let canvasWidth = window.innerWidth < 600 ? 300 : 600;
let canvasHeight = window.innerHeight < 600 ? 300 : 600;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let snake = [];
let direction = "RIGHT";
let score = 0;
let food;
let game;
let speed = 100;

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
  speed = 100;

  food = {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box,
  };

  document.getElementById("gameOverPopup").classList.add("hidden");
  document.getElementById("score").textContent = score;
  canvas.style.display = "block";

  if (game) clearInterval(game);
  game = setInterval(draw, speed);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.beginPath();
    if (i === 0) {
      ctx.drawImage(headImg, snake[i].x, snake[i].y, box, box);
    } else {
      ctx.fillStyle = "#000"; // black body
      ctx.arc(snake[i].x + box/2, snake[i].y + box/2, box/2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.closePath();
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

  // If snake eats food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = {
      x: Math.floor(Math.random() * (canvasWidth / box)) * box,
      y: Math.floor(Math.random() * (canvasHeight / box)) * box,
    };
    clearInterval(game);
    if (speed > 40) speed -= 5;
    game = setInterval(draw, speed);
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function showGameOver(score) {
  canvas.style.display = "none";
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverPopup").classList.remove("hidden");

  // Optionally save to localStorage or send to server
}

// Controls
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
  else if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
  else if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  else if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
});

document.getElementById("startGameBtn").addEventListener("click", () => {
  document.getElementById("startGameBtn").style.display = "none";
  setTimeout(initGame, 3000); // 3-second countdown if needed
});

document.getElementById("tryAgainBtn").addEventListener("click", () => {
  document.getElementById("startGameBtn").style.display = "block";
  document.getElementById("gameOverPopup").classList.add("hidden");
  score = 0;
  direction = "RIGHT";
  initGame();
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const text = `I scored ${score} on SIGN Snake Game! 🍊🎮 Try it now!`;
  const url = encodeURIComponent(window.location.href);
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
  window.open(shareUrl, "_blank");
});
