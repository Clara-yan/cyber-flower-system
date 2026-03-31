let currentEmotion = "joy";

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(20, 20, 30);
  translate(mouseX, mouseY);
  
  let emotionParams = {
    joy: { color: color(255, 107, 107), speed: 5, scale: 1.2 },
    lonely: { color: color(107, 107, 255), speed: 2, scale: 0.8 },
    miss: { color: color(255, 182, 193), speed: 3, scale: 1.0 }
  };
  
  let params = emotionParams[currentEmotion];
  
  // 绘制发光光晕
  for (let i = 8; i > 0; i--) {
    push();
    fill(0, 0, 0, 5);
    strokeWeight(i);
    stroke(params.color, 80/i);
    drawFlower(params.scale * 100, params.speed);
    pop();
  }
  
  // 绘制主体花朵
  fill(params.color);
  drawFlower(params.scale * 100, params.speed);
}

function drawFlower(size, speed) {
  let petals = 12;
  beginShape();
  for (let i = 0; i < petals * 2; i++) {
    let angle = map(i, 0, petals * 2, 0, TWO_PI);
    let r = size * sin(angle * petals + frameCount * 0.05 * speed);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function mousePressed() {
  let emotions = ["joy", "lonely", "miss"];
  currentEmotion = emotions[int(random(emotions.length))];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
