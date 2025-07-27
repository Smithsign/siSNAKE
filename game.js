const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let box = 32;
let snake = [];
let score = 0;

let direction;
let gameInterval;
let xinImg = new Image();
xinImg.src = "xin.jpg";

let orangeImg = new Image();
orangeImg.src = "orange.jpg";

// Snake starts with 1 block
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

// Generate orange
let orange = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
};

// Handle input
document.addEventListener("keydown", directionHandler);
function directionHandler(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#FF922B" : "#FFA94D";
    ctx.beginPath();
    ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  ctx.drawImage(orangeImg, orange.x, orange.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Game over
  if (
    headX < 0 || headX >= canvas.width ||
    headY < 0 || headY >= canvas.height ||
    collision({ x: headX, y: headY }, snake)
  ) {
    clearInterval(gameInterval);
    document.getElementById('scoreDisplay').innerText = score;
    document.getElementById('gameoverModal').style.display = 'flex';
    uploadScore();
    return;
  }

  let newHead = { x: headX, y: headY };

  if (headX === orange.x && headY === orange.y) {
    score++;
    orange = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

function startGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = undefined;
  score = 0;
  orange = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
  };
  document.getElementById('gameoverModal').style.display = 'none';
  gameInterval = setInterval(draw, 150);
}

// Share score
function shareScore() {
  const username = localStorage.getItem("username");
  const tweet = `https://twitter.com/intent/tweet?text=I scored ${score} 🍊 in the Snake Game! Can you beat me? %23SnakeGame %23OrangeDynasty`;
  window.open(tweet, "_blank");
}

// Upload to backend
function uploadScore() {
  const username = localStorage.getItem("username");
  const image = localStorage.getItem("userImage");

  fetch("submit_score.php", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, image, score })
  });
}
