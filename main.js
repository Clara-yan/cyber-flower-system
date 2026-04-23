<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>摄像头手势控制花朵粒子 p5.js</title>
    <!-- 稳定可用CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ml5/0.12.2/ml5.min.js"></script>
    <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{
            background:#000;
            display:flex;
            flex-direction:column;
            align-items:center;
            padding:20px;
            color:#fff;
            font-family:sans-serif;
        }
        h1{
            margin-bottom:20px;
            color:#ff9ed2;
        }
        .tips{
            margin-top:15px;
            font-size:16px;
        }
    </style>
</head>
<body>
    <h1>手势控制花朵 · 摄像头交互</h1>
    <div class="tips">允许摄像头 | 食指控花朵 | 手掌开合改变大小 | 粒子跟随</div>

<script>
let video;
let handPose;
let hands = [];
let particles = [];
let flowerSize = 80;

class Particle {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.vx = random(-2,2);
    this.vy = random(-2,2);
    this.size = random(5,15);
    this.c = [random(150,255),random(100,200),random(200,255)];
    this.life = 255;
  }
  update(tx,ty){
    this.vx = (tx-this.x)*0.05 + this.vx*0.9;
    this.vy = (ty-this.y)*0.05 + this.vy*0.9;
    this.x += this.vx;
    this.y += this.vy;
    this.life -=2;
  }
  display(){
    noStroke();
    fill(this.c[0],this.c[1],this.c[2],this.life);
    ellipse(this.x,this.y,this.size);
  }
  dead(){return this.life<=0;}
}

function setup(){
  createCanvas(800,600);
  video = createCapture(VIDEO);
  video.size(800,600);
  video.hide();

  handPose = ml5.handPose(video,{detectionConfidence:0.7},ready);
  handPose.on("pose",res=>hands=res);

  for(let i=0;i<50;i++){
    particles.push(new Particle(random(width),random(height)));
  }
}
function ready(){
  console.log("手势模型加载完成");
}

function draw(){
  image(video,0,0);
  fill(0,80);
  rect(0,0,width,height);

  if(hands.length>0){
    let p = hands[0].landmarks;
    let ix = p[8][0], iy = p[8][1];
    let dis = dist(p[4][0],p[4][1],p[20][0],p[20][1]);
    flowerSize = map(dis,40,180,40,160);

    drawFlower(ix,iy,flowerSize);

    if(frameCount%2===0) particles.push(new Particle(ix,iy));

    for(let i=particles.length-1;i>=0;i--){
      particles[i].update(ix,iy);
      particles[i].display();
      if(particles[i].dead()) particles.splice(i,1);
    }
  }else{
    fill(255);
    textAlign(CENTER,CENTER);
    textSize(28);
    text("请将手放入摄像头画面",width/2,height/2);
  }
}

function drawFlower(x,y,s){
  push();
  translate(x,y);
  fill(255,100,180);
  for(let i=0;i<8;i++){
    rotate(PI/4);
    ellipse(0,-s/2,s/2,s);
  }
  fill(255,220,0);
  ellipse(0,0,s/3,s/3);
  pop();
}
</script>
</body>
</html>
