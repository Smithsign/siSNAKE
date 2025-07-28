// Add to the top of game.js
const guideBtn = document.getElementById("guideBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");

// Mobile controls elements
const mobileControls = `
  <div id="mobileControls" class="mobile-controls">
    <div class="d-pad">
      <button class="control-btn up" data-direction="UP">↑</button>
      <div class="middle-row">
        <button class="control-btn left" data-direction="LEFT">←</button>
        <button class="control-btn right" data-direction="RIGHT">→</button>
      </div>
      <button class="control-btn down" data-direction="DOWN">↓</button>
    </div>
    <div class="action-buttons">
      <button class="action-btn" id="mobilePause">II</button>
    </div>
  </div>
`;

// Add to initGame() function
function initGame() {
  // ... existing code ...
  
  // Add mobile controls if on mobile
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    document.getElementById("gameContainer").insertAdjacentHTML("beforeend", mobileControls);
    
    // Add mobile control event listeners
    document.querySelectorAll(".control-btn").forEach(btn => {
      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        nextDirection = e.target.dataset.direction;
      });
      
      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        if (nextDirection === e.target.dataset.direction) {
          nextDirection = direction; // Revert to current direction
        }
      });
    });
  }
  
  // Add button functionality
  guideBtn.addEventListener("click", showGuide);
  leaderboardBtn.addEventListener("click", showLeaderboard);
}

// Add these new functions
function showGuide() {
  alert(`HOW TO PLAY:
- Use ARROW KEYS or WASD to control the snake
- Eat the oranges to grow longer
- Don't hit the walls or yourself
- The more you eat, the faster you go!
  
Mobile users can use the on-screen controller.`);
}

function showLeaderboard() {
  window.location.href = "leaderboard.html";
}

// Update changeDirection function to include WASD
function changeDirection(e) {
  if (!gameRunning) return;
  
  const key = e.key.toUpperCase();
  
  // Arrow keys or WASD
  if (key === "ARROWUP" || key === "W") nextDirection = "UP";
  else if (key === "ARROWDOWN" || key === "S") nextDirection = "DOWN";
  else if (key === "ARROWLEFT" || key === "A") nextDirection = "LEFT";
  else if (key === "ARROWRIGHT" || key === "D") nextDirection = "RIGHT";
}

// Game Initialization
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const countdownElement = document.getElementById("countdown");
const countdownNumber = document.querySelector(".countdown-number");

// Game Settings
const box = 30; // Increased size for better visibility
const FPS = 60; // Smoother animation
let snake = [];
let direction = null;
let nextDirection = null; // For smoother direction changes
let food = {};
let score = 0;
let gameRunning = false;
let animationId;
let lastRenderTime = 0;
let gameSpeed = 150; // Initial speed (will increase with score)

// Load assets
const xinImage = new Image();
xinImage.src = "xin.jpg";
xinImage.onerror = () => console.error("Error loading snake head image");

const orangeImage = new Image();
orangeImage.src = "orange.png";
orangeImage.onerror = () => console.error("Error loading food image");

// Game Setup
function initGame() {
  canvas.width = Math.min(window.innerWidth - 40, 800);
  canvas.height = Math.min(window.innerHeight - 200, 600);
  
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = null;
  nextDirection = null;
  food = randomPosition();
  score = 0;
  gameSpeed = 150;
  
  // Clear any existing game loop
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
}

// Event Listeners
startBtn.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);

// Direction Handling (with buffer for smoother turns)
function changeDirection(e) {
  if (!gameRunning) return;
  
  const key = e.key;
  
  // Prevent 180-degree turns
  if (key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
  else if (key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
  else if (key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
  else if (key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
}

// Game Start Sequence
function startGame() {
  initGame();
  document.getElementById("startScreen").classList.add("hidden");
  countdownElement.classList.remove("hidden");
  
  let count = 3;
  countdownNumber.textContent = count;
  
  const countdownInterval = setInterval(() => {
    count--;
    countdownNumber.textContent = count;
    
    if (count <= 0) {
      clearInterval(countdownInterval);
      countdownElement.classList.add("hidden");
      gameRunning = true;
      lastRenderTime = 0;
      animationId = requestAnimationFrame(gameLoop);
    }
  }, 1000);
}

// Main Game Loop (using requestAnimationFrame for smoother animation)
function gameLoop(timestamp) {
  if (!gameRunning) return;
  
  const secondsSinceLastRender = (timestamp - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / (FPS / (gameSpeed / 150))) {
    animationId = requestAnimationFrame(gameLoop);
    return;
  }
  lastRenderTime = timestamp;
  
  // Update direction from buffer
  if (nextDirection) {
    direction = nextDirection;
    nextDirection = null;
  }
  
  update();
  draw();
  
  animationId = requestAnimationFrame(gameLoop);
}

function update() {
  if (!direction) return;
  
  // Move snake
  const head = { ...snake[0] };
  
  switch (direction) {
    case "UP": head.y -= box; break;
    case "DOWN": head.y += box; break;
    case "LEFT": head.x -= box; break;
    case "RIGHT": head.x += box; break;
  }
  
  // Check collisions
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    gameOver();
    return;
  }
  
  snake.unshift(head);
  
  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    // Increase speed every 5 points
    if (score % 5 === 0 && gameSpeed > 50) {
      gameSpeed -= 10;
    }
    food = randomPosition();
  } else {
    snake.pop();
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid pattern
  drawGrid();
  
  // Draw snake
  snake.forEach((segment, index) => {
    ctx.save();
    if (index === 0) {
      // Head with rotation based on direction
      ctx.translate(segment.x + box/2, segment.y + box/2);
      switch(direction) {
        case "UP": ctx.rotate(-Math.PI/2); break;
        case "DOWN": ctx.rotate(Math.PI/2); break;
        case "LEFT": ctx.rotate(Math.PI); break;
        case "RIGHT": ctx.rotate(0); break;
      }
      ctx.drawImage(xinImage, -box/2, -box/2, box, box);
    } else {
      // Body segments
      ctx.fillStyle = index % 2 === 0 ? "#4CAF50" : "#8BC34A";
      ctx.beginPath();
      ctx.roundRect(segment.x, segment.y, box, box, 5);
      ctx.fill();
    }
    ctx.restore();
  });
  
  // Draw food with shadow and glow effect
  ctx.save();
  ctx.shadowColor = "rgba(255, 165, 0, 0.7)";
  ctx.shadowBlur = 15;
  ctx.drawImage(orangeImage, food.x, food.y, box, box);
  ctx.restore();
  
  // Draw score
  ctx.fillStyle = "#FF9800";
  ctx.font = "20px 'Orbitron', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${score}`, 20, 30);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255, 152, 0, 0.1)";
  ctx.lineWidth = 1;
  
  // Vertical lines
  for (let x = 0; x <= canvas.width; x += box) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y <= canvas.height; y += box) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function randomPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  
  return position;
}

function collision(head, arr) {
  return arr.slice(1).some(segment => head.x === segment.x && head.y === segment.y);
}

function gameOver() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  
  // Show player info
  const name = localStorage.getItem("playerName") || "Player";
  const image = localStorage.getItem("playerImage") || "";
  
  document.getElementById("playerName").textContent = name;
  document.getElementById("playerAvatar").src = image;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverPopup").classList.remove("hidden");
  
  // Save score
  fetch("submit_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: name, score, image })
  }).catch(err => console.error("Error saving score:", err));
}

function tryAgain() {
  document.getElementById("gameOverPopup").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

function shareOnX() {
  const name = localStorage.getItem("playerName") || "Player";
  const tweet = `I scored ${score} in SNAKE.SIGN! 🐍 Can you beat me? #SnakeSIGN`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`);
}

// Initialize on load
window.addEventListener("load", initGame);
