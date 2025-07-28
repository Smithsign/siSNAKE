// Game Initialization
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const countdownElement = document.getElementById("countdown");
const countdownNumber = document.querySelector(".countdown-number");
const guideBtn = document.getElementById("guideBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");

// Game Settings
const box = 30;
const FPS = 60;
let snake = [];
let direction = null;
let nextDirection = null;
let food = {};
let score = 0;
let gameRunning = false;
let animationId;
let lastRenderTime = 0;

// Speed Configuration
const baseSpeed = 500; // Starting speed (higher = slower)
let currentSpeed = baseSpeed;
let orangesEaten = 0; // Track total oranges eaten

// Speed increase tiers (min oranges, max oranges, speed increase %)
const speedTiers = [
  { min: 1, max: 5, increase: 0.01 },    // 1-5 oranges: 1% increase
  { min: 6, max: 10, increase: 0.05 },    // 6-10: 5% increase
  { min: 11, max: 20, increase: 0.15 },   // 11-20: 15% increase
  { min: 21, max: 30, increase: 0.35 },   // 21-30: 35% increase
  { min: 31, max: 40, increase: 0.55 },   // 31-40: 55% increase
  { min: 41, max: 50, increase: 0.75 },   // 41-50: 75% increase
  { min: 51, max: 60, increase: 0.85 },   // 51-60: 85% increase
  { min: 61, max: 90, increase: 1.00 },   // 61-90: 100% increase
  { min: 91, max: 1000, increase: 10.00 } // 91+: 1000% increase
];

// Load assets
const xinImage = new Image();
xinImage.src = "xin.jpg";
xinImage.onerror = () => console.error("Error loading snake head image");

const orangeImage = new Image();
orangeImage.src = "orange.png";
orangeImage.onerror = () => console.error("Error loading food image");

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

// Game Setup
function initGame() {
  canvas.width = Math.min(window.innerWidth - 40, 800);
  canvas.height = Math.min(window.innerHeight - 200, 600);
  
  snake = [{ x: 5 * box, y: 5 * box }];
  direction = null;
  nextDirection = null;
  food = randomPosition();
  score = 0;
  orangesEaten = 0;
  currentSpeed = baseSpeed;
  
  // Clear any existing game loop
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  // Add mobile controls if on mobile
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    const existingControls = document.getElementById("mobileControls");
    if (!existingControls) {
      document.getElementById("gameContainer").insertAdjacentHTML("beforeend", mobileControls);
      
      document.querySelectorAll(".control-btn").forEach(btn => {
        btn.addEventListener("touchstart", (e) => {
          e.preventDefault();
          nextDirection = e.target.dataset.direction;
          e.target.style.backgroundColor = "rgba(255, 165, 0, 0.8)";
        });
        
        btn.addEventListener("touchend", (e) => {
          e.preventDefault();
          if (nextDirection === e.target.dataset.direction) {
            nextDirection = direction;
          }
          e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        });
      });
    }
  }
}

// Event Listeners
startBtn.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);
guideBtn.addEventListener("click", showGuide);
leaderboardBtn.addEventListener("click", showLeaderboard);

function showGuide() {
  alert(`HOW TO PLAY:
- Use ARROW KEYS or WASD to control the snake
- Eat the oranges to grow longer
- Don't hit the walls or yourself
- Speed increases based on oranges eaten:
  1-5: +1% per orange
  6-10: +5% per orange
  11-20: +15% per orange
  21-30: +35% per orange
  31-40: +55% per orange
  41-50: +75% per orange
  51-60: +85% per orange
  61-90: +100% per orange
  91+: +1000% per orange
  
Mobile users can use the on-screen controller.`);
}

function showLeaderboard() {
  window.location.href = "leaderboard.html";
}

// Direction Handling
function changeDirection(e) {
  if (!gameRunning) return;
  
  const key = e.key.toUpperCase();
  
  // Prevent 180-degree turns
  if ((key === "ARROWUP" || key === "W") && direction !== "DOWN") nextDirection = "UP";
  else if ((key === "ARROWDOWN" || key === "S") && direction !== "UP") nextDirection = "DOWN";
  else if ((key === "ARROWLEFT" || key === "A") && direction !== "RIGHT") nextDirection = "LEFT";
  else if ((key === "ARROWRIGHT" || key === "D") && direction !== "LEFT") nextDirection = "RIGHT";
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

// Main Game Loop
function gameLoop(timestamp) {
  if (!gameRunning) return;
  
  const secondsSinceLastRender = (timestamp - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / (FPS / (currentSpeed / 150))) {
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
    orangesEaten++;
    
    // Calculate speed increase based on tiers
    const tier = speedTiers.find(t => orangesEaten >= t.min && orangesEaten <= t.max);
    if (tier) {
      const speedMultiplier = 1 - tier.increase; // Convert % increase to multiplier
      currentSpeed = Math.max(50, currentSpeed * speedMultiplier); // Never go below 50ms
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
     ctx.fillStyle = index % 2 === 0 ? "#FF9800" : "#FFA726";
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
  
  // Draw score and speed info
  ctx.fillStyle = "#FF9800";
  ctx.font = "20px 'Orbitron', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${score}`, 20, 30);
  
  drawSpeedInfo();
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

function drawSpeedInfo() {
  // Calculate current tier
  const tier = speedTiers.find(t => orangesEaten >= t.min && orangesEaten <= t.max) || speedTiers[speedTiers.length-1];
  const speedPercentage = Math.round(((baseSpeed - currentSpeed) / baseSpeed) * 100);
  
  // Draw speed bar
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fillRect(20, 50, 200, 15);
  ctx.fillStyle = `hsl(${Math.min(120, 120 - (speedPercentage/2))}, 100%, 50%)`;
  ctx.fillRect(20, 50, Math.min(200, speedPercentage * 2), 15);
  
  // Draw text info
  ctx.fillStyle = "#FF9800";
  ctx.font = "14px 'Orbitron', sans-serif";
  ctx.fillText(`ORANGES: ${orangesEaten}`, 20, 45);
  ctx.fillText(`TIER: ${tier.increase*100}% increase`, 20, 80);
  ctx.fillText(`SPEED: ${Math.round((baseSpeed/currentSpeed)*100)}%`, 20, 95);
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
    body: JSON.stringify({ username: name, score, image, oranges: orangesEaten })
  }).catch(err => console.error("Error saving score:", err));
}

function tryAgain() {
  document.getElementById("gameOverPopup").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

function shareOnX() {
  const name = localStorage.getItem("playerName") || "Player";
  const tweet = `I scored ${score} (${orangesEaten} oranges) in SNAKE.SIGN! 🐍 Can you beat me? #SnakeSIGN`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`);
}

// Initialize on load
window.addEventListener("load", initGame);
