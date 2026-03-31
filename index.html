<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>赛博繁花 · 3D泪滴棱镜</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#020210;overflow:hidden;}
canvas{display:block;width:100vw;height:100vh;}
</style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.min.js"></script>
<script>
// 场景基础
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

// 轨道控制
const controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;

// 辉光材质
const mat = new THREE.MeshBasicMaterial({
  color:0xffffff,
  transparent:true,
  opacity:0.8,
  side:THREE.DoubleSide
});

// 泪滴棱镜几何体
function createTeardropPrism(hue){
  const g = new THREE.ConeGeometry(1.2,4,6);
  g.translate(0,-2,0);
  const m = mat.clone();
  m.color.setHSL(hue,1,0.7);
  const mesh = new THREE.Mesh(g,m);
  return mesh;
}

// 繁花组
const group = new THREE.Group();
scene.add(group);

const prisms = [];
for(let i=0;i<24;i++){
  const p = createTeardropPrism(i/24);
  const a = (i/24)*Math.PI*2;
  const r = 5 + Math.random()*2;
  p.position.set(Math.cos(a)*r, Math.sin(a)*r, (Math.random()-0.5)*4);
  p.rotation.z = a;
  group.add(p);
  prisms.push(p);
}

// 循环动画
function loop(t){
  requestAnimationFrame(loop);
  group.rotation.y += 0.003;
  group.rotation.x += 0.001;
  prisms.forEach((p,i)=>{
    p.rotation.z += 0.01 + i*0.0002;
  });
  controls.update();
  renderer.render(scene,camera);
}
loop();

window.addEventListener('resize',()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
</script>
</body>
</html>
