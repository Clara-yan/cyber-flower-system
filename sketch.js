let cracks = [];
let particles = [];
let flowerCenter;
let input, button;
let sadnessLevel = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255);
  noStroke();
  flowerCenter = createVector(width/2, height/2);
  
  // 创建输入框和按钮
  input = createInput('');
  input.position(20, height - 60);
  input.size(300, 30);
  input.attribute('placeholder', '输入一段悲伤的文字...');
  
  button = createButton('生成悲伤之花');
  button.position(330, height - 60);
  button.size(150, 30);
  button.mousePressed(generateCracks);
  
  // 初始少量裂纹
  generateCracks();
}

function draw() {
  // 1. 渐变背景（靛蓝→紫罗兰）
  background(0);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(10, 10, 40), color(60, 20, 80), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  translate(flowerCenter.x, flowerCenter.y);
  
  // 2. 绘制花朵主体（半透明玻璃质感）
  fill(20, 40, 80, 150);
  stroke(150, 200, 255, 100);
  strokeWeight(2);
  drawPoppy(220);
  
  // 3. 绘制破碎裂纹（数量由悲伤值决定）
  stroke(255, 255, 255, 180);
  strokeWeight(1.5);
  for (let c of cracks) {
    line(c.start.x, c.start.y, c.end.x, c.end.y);
  }
  
  // 4. 生成蓝色发光粒子
  if (frameCount % 3 === 0) {
    let angle = random(TWO_PI);
    let r = random(80, 200);
    let x = r * cos(angle);
    let y = r * sin(angle);
    particles.push({
      pos: createVector(x, y),
      vel: p5.Vector.random2D().mult(random(0.5, 1.5)),
      alpha: 255,
      size: random(2, 5)
    });
  }
  
  // 5. 更新并绘制粒子
  fill(100, 200, 255, 150);
  noStroke();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.pos.add(p.vel);
    p.alpha -= 2;
    p.size *= 0.98;
    
    ellipse(p.pos.x, p.pos.y, p.size);
    if (p.alpha <= 0) particles.splice(i, 1);
  }
  
  // 6. 花芯（深色+高光）
  fill(20, 30, 60);
  ellipse(0, 0, 60);
  fill(100, 180, 255, 100);
  ellipse(0, 0, 30);
  
  // 7. 显示悲伤值
  fill(255);
  textSize(16);
  text(`悲伤值: ${sadnessLevel}`, 20, height - 80);
}

// 绘制虞美人轮廓
function drawPoppy(size) {
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let r = size * (1 + 0.2 * sin(angle * 3 + frameCount * 0.01));
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

// 根据文字生成裂纹（悲伤值越高，裂纹越多）
function generateCracks() {
  let text = input.value();
  // 简单计算悲伤值：文字长度 + 关键词权重
  let keywords = ['哭', '痛', '死', '悲', '伤', '泪', '碎', '绝望', '孤独'];
  sadnessLevel = text.length;
  for (let kw of keywords) {
    if (text.includes(kw)) sadnessLevel += 10;
  }
  sadnessLevel = constrain(sadnessLevel, 5, 40); // 限制在5-40之间
  
  // 清空旧裂纹，生成新裂纹
  cracks = [];
  for (let i = 0; i < sadnessLevel; i++) {
    let startAngle = random(TWO_PI);
    let start = p5.Vector.fromAngle(startAngle, random(50, 100));
    let end = p5.Vector.fromAngle(startAngle + random(-PI/4, PI/4), random(150, 220));
    cracks.push({ start: start, end: end, alpha: 200 });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  flowerCenter = createVector(width/2, height/2);
  input.position(20, height - 60);
  button.position(330, height - 60);
}
