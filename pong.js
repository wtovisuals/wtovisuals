const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Load images
const leftPaddleImg = new Image();
leftPaddleImg.src = 'ChatGPT Image May 17, 2025 at 06_36_21 PM.00_00_00_00.Still001.png';

const rightPaddleImg = new Image();
rightPaddleImg.src = 'ChatGPT Image May 17, 2025 at 06_17_26 PM.png';

const ballImg = new Image();
ballImg.src = 'chickenleg.png';

// Sizes
const leftPaddleSize = { width: 120, height: 120 };
const rightPaddleSize = { width: 130, height: 120 };
const ballSize = 40;

let ballAngle = 0;

// Player data
const player1 = { x: 20, y: canvas.height / 2 - leftPaddleSize.height / 2, dy: 0, score: 0 };
const player2 = { x: canvas.width - rightPaddleSize.width - 20, y: canvas.height / 2 - rightPaddleSize.height / 2, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 5, dy: 5 };

// Draw helper
function drawImage(img, x, y, w, h, rotate = false, angle = 0, glow = false) {
  ctx.save();
  if (glow) {
    ctx.shadowColor = 'rgba(0, 174, 255, 0.5)';
    ctx.shadowBlur = 20;
  }
  if (rotate) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(angle);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  } else {
    ctx.drawImage(img, x, y, w, h);
  }
  ctx.restore();
}

// Game loop render
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const wiggle1 = Math.sin(Date.now() / 100) * 2;
  const wiggle2 = Math.cos(Date.now() / 100) * 2;

  drawImage(leftPaddleImg, player1.x, player1.y + wiggle1, leftPaddleSize.width, leftPaddleSize.height, false, 0, true);
  drawImage(rightPaddleImg, player2.x, player2.y + wiggle2, rightPaddleSize.width, rightPaddleSize.height, false, 0, true);
  drawImage(ballImg, ball.x, ball.y, ballSize, ballSize, true, ballAngle, false);
}

// Game update logic
function update() {
  // Move paddles
  player1.y += player1.dy;
  player1.y = Math.max(0, Math.min(canvas.height - leftPaddleSize.height, player1.y));

  const centerPaddle = player2.y + rightPaddleSize.height / 2;
  if (ball.y < centerPaddle - 10) player2.y -= 4;
  else if (ball.y > centerPaddle + 10) player2.y += 4;
  player2.y = Math.max(0, Math.min(canvas.height - rightPaddleSize.height, player2.y));

  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;
  ballAngle += 0.1;

  // Bounce off top/bottom
  if (ball.y < 0 || ball.y + ballSize > canvas.height) {
    ball.dy *= -1;
  }

  // Paddle collisions
  if (ball.x < player1.x + leftPaddleSize.width &&
      ball.y + ballSize > player1.y &&
      ball.y < player1.y + leftPaddleSize.height) {
    ball.dx *= -1;
    ball.x = player1.x + leftPaddleSize.width;
  }

  if (ball.x + ballSize > player2.x &&
      ball.y + ballSize > player2.y &&
      ball.y < player2.y + rightPaddleSize.height) {
    ball.dx *= -1;
    ball.x = player2.x - ballSize;
  }

  // Scoring
  if (ball.x < 0) {
    player2.score++;
    animateScore('scorePlayer2');
    resetBall();
  }

  if (ball.x + ballSize > canvas.width) {
    player1.score++;
    animateScore('scorePlayer1');
    resetBall();
  }

  // Update score display
  document.getElementById('scorePlayer1').textContent = player1.score;
  document.getElementById('scorePlayer2').textContent = player2.score;
}

// Animate score bump
function animateScore(id) {
  const el = document.getElementById(id);
  el.classList.remove('score');
  void el.offsetWidth; // force reflow
  el.classList.add('score');
}

// Reset ball after point
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1;
  ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballAngle = 0;
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Input controls
document.addEventListener('keydown', e => {
  if (e.key === 'w') player1.dy = -6;
  if (e.key === 's') player1.dy = 6;
});
document.addEventListener('keyup', e => {
  if (e.key === 'w' || e.key === 's') player1.dy = 0;
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  player1.y = e.clientY - rect.top - leftPaddleSize.height / 2;
});

// Start game
loop();
function animateScore(id) {
  const el = document.getElementById(id);
  const wrapper = id === 'scorePlayer1' ? document.getElementById('scorePlayer1Wrapper') : document.getElementById('scorePlayer2Wrapper');

  wrapper.style.animation = 'none';
  el.style.animation = 'none';
  void el.offsetWidth; // trigger reflow

  el.style.animation = 'bounce-pop 0.3s ease';
  wrapper.style.animation = 'bounce-pop 0.3s ease';
}
