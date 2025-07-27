const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let box = 20;
let snake = [{ x: 5 * box, y: 5 * box }];
let direction = null;
let food = randomPosition();
let score = 0;
let interval;

let xinImage = new Image();
xinImage.src = "xin.jpg";

let orangeImage = new Image();
orangeImage.src = "orange.jpg";

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(i === 0 ? xinImage : xinImage, snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(orangeImage, food.x, food.y, box, box);

  let head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // Game over conditions
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(interval);
    showGameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomPosition();
  } else {
    snake.pop();
  }
}

function randomPosition() {
  let x = Math.floor(Math.random() * (canvas.width / box)) * box;
  let y = Math.floor(Math.random() * (canvas.height / box)) * box;
  return { x, y };
}

function collision(head, arr) {
  return arr.slice(1).some(segment => head.x === segment.x && head.y === segment.y);
}

function showGameOver() {
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverPopup").classList.remove("hidden");

  // Save score to server
  const name = localStorage.getItem("playerName");
  const image = localStorage.getItem("playerImage");

  fetch("submit_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: name, score, image })
  });
}

function tryAgain() {
  window.location.href = "index.html";
}

function shareOnX() {
  const name = localStorage.getItem("playerName");
  const tweet = `I scored ${score} in Snake Game! 🍊 Try to beat me! #SnakeSIGN`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`);
}

interval = setInterval(drawGame, 150);
