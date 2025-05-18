// ---- Setup ----
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const W      = canvas.width;
const H      = canvas.height;
const TILE   = 50;
const ROWS   = H / TILE;

// ---- Images (replace paths as needed) ----
const playerImg = new Image();
playerImg.src = 'character.png';   // your frog sprite
const trapImg   = new Image();
trapImg.src   = 'trap.png';        // your car/log sprite

// ---- Player ----
const player = {
  x: Math.floor((W/2) / TILE) * TILE,
  y: (ROWS - 1) * TILE,
  w: TILE, h: TILE
};

// ---- Lanes & Traps ----
const lanes = [
  { row: 2, speed: 2, dir:  1, count: 3 },
  { row: 3, speed: 3, dir: -1, count: 4 },
  { row: 4, speed: 2, dir:  1, count: 3 },
  { row: 5, speed: 3, dir: -1, count: 4 }
];

const traps = [];
lanes.forEach(l => {
  for(let i=0; i<l.count; i++){
    traps.push({
      x: i * (W / l.count),
      y: l.row * TILE,
      w: TILE, h: TILE,
      dx: l.speed * l.dir
    });
  }
});

// ---- Game Loop ----
function update() {
  // move traps
  traps.forEach(t => {
    t.x += t.dx;
    if (t.dx > 0 && t.x > W)       t.x = -t.w;
    if (t.dx < 0 && t.x < -t.w)    t.x = W;

    // collision?
    if (
      player.x < t.x + t.w &&
      player.x + player.w > t.x &&
      player.y < t.y + t.h &&
      player.y + player.h > t.y
    ) {
      // reset on hit
      player.x = Math.floor((W/2) / TILE) * TILE;
      player.y = (ROWS - 1) * TILE;
    }
  });
}

function draw() {
  // clear
  ctx.clearRect(0, 0, W, H);

  // draw background rows
  for(let r=0; r<ROWS; r++){
    ctx.fillStyle = (r % 2 === 0) ? '#eaeaea' : '#d5d5d5';
    ctx.fillRect(0, r*TILE, W, TILE);
  }

  // draw traps & player
  traps.forEach(t => ctx.drawImage(trapImg, t.x, t.y, t.w, t.h));
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// ---- Controls ----
document.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp':
      if (player.y > 0) player.y -= TILE;
      break;
    case 'ArrowDown':
      if (player.y < (ROWS -1)*TILE) player.y += TILE;
      break;
    case 'ArrowLeft':
      if (player.x > 0) player.x -= TILE;
      break;
    case 'ArrowRight':
      if (player.x < W - TILE) player.x += TILE;
      break;
  }
});

// ---- Start when images loaded ----
playerImg.onload = () => {
  trapImg.onload = () => {
    loop();
  }
};
// JavaScript Document