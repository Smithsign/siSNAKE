// Load assets and game sounds
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 32;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };
let direction = "";
let score = 0;

let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box,
};

const foodImg = new Image();
foodImg.src = "orange.jpg";
const headImg = new Image();
headImg.src = "xin.jpg";

const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("gameover.mp3");
const bgMusic = new Audio("bgmusic.mp3");
bgMusic.volume = 0.2;
bgMusic.loop = true;
bgMusic.play();

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#FFA500" : "#FFD580";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(foodImg, food.x, food.y, box, box);
  ctx.drawImage(headImg, snake[0].x, snake[0].y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(gameLoop);
    gameOverSound.play();
    showGameOver(score);
    return;
  }

  snake.unshift(newHead);
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, box, box);
}

function collision(head, body) {
  return body.some((segment) => head.x === segment.x && head.y === segment.y);
}

function showGameOver(score) {
  const popup = document.getElementById("gameOverPopup");
  popup.style.display = "flex";
  document.getElementById("finalScore").innerText = score;
  document.getElementById("shareBtn").href = `https://x.com/intent/tweet?text=I scored ${score} in the Orange Snake Game! 🐍🍊 Try it: [YOUR_GAME_URL]`;
  saveScore(score);
}

function saveScore(score) {
  const name = localStorage.getItem("name");
  const image = localStorage.getItem("image");

  if (!name || !image) return;

  fetch("save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, image, score }),
  });
}

let gameLoop;
function startGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "";
  score = 0;
  document.getElementById("gameContainer").style.display = "block";
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("gameOverPopup").style.display = "none";
  gameLoop = setInterval(draw, 150);
}
