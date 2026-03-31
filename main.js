import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.FogExp2(0x050510, 0.008);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 1.5, 3.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const effectComposer = new EffectComposer(renderer);
effectComposer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.3, 0.85);
bloomPass.strength = 0.8;
effectComposer.addPass(bloomPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.enableDamping = true;
controls.target.set(0, 0.6, 0);

const ambientLight = new THREE.AmbientLight(0x22223b);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(2, 3, 1.5);
scene.add(dirLight);
const backLight = new THREE.PointLight(0x8866ff, 0.5);
backLight.position.set(-1, 1.5, -2);
scene.add(backLight);

let currentFlower = null, particleSystem = null, currentSadness = 0, isDying = false;

function analyzeSadness(text) {
    if (!text.trim()) return 0.2;
    let score = 0;
    const keywords = ['痛','泪','悲','伤','心碎','孤独','绝望','哭泣','破碎','lost','cry','pain'];
    keywords.forEach(kw => { if(text.toLowerCase().includes(kw)) score += 0.12; });
    score += Math.min(0.4, text.length / 80);
    return Math.min(0.98, Math.max(0.15, score));
}

function createPetal(angle, radius, yOff, crack) {
    const geo = new THREE.PlaneGeometry(0.55, 0.7, 32, 32);
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2a1e3c';
    ctx.fillRect(0, 0, 512, 512);
    const grad = ctx.createLinearGradient(0,0,512,512);
    grad.addColorStop(0,'#3a2a5a'); grad.addColorStop(1,'#2a1e44');
    ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
    const crackCount = Math.floor(8 + crack * 35);
    ctx.strokeStyle = 'rgba(200,220,255,0.9)';
    ctx.lineWidth = 4 + crack * 8;
    for(let i=0;i<crackCount;i++){
        ctx.beginPath();
        ctx.moveTo(Math.random()*512, Math.random()*512);
        for(let s=0;s<4;s++) ctx.lineTo(Math.random()*512, Math.random()*512);
        ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshStandardMaterial({ map:tex, color:0xc8b0ff, emissive:0x221a44, emissiveIntensity:0.3+crack*0.5, metalness:0.85, roughness:0.25, transparent:true, opacity:0.92 });
    const petal = new THREE.Mesh(geo, mat);
    const rad = radius;
    petal.position.set(Math.cos(angle)*rad, yOff + Math.sin(angle*2)*0.05, Math.sin(angle)*rad);
    petal.lookAt(0, yOff+0.2, 0);
    return petal;
}
function createFlower(sadness) {
    const group = new THREE.Group();
    const stamen = new THREE.Mesh(new THREE.SphereGeometry(0.18,32,32), new THREE.MeshStandardMaterial({ color:0x88aaff, emissive:0x3366aa, emissiveIntensity:0.8 }));
    group.add(stamen);
    for(let i=0;i<8;i++) group.add(createPetal(i*Math.PI*2/8, 0.65, 0.2, sadness));
    for(let i=0;i<6;i++) group.add(createPetal(i*Math.PI*2/6+0.3, 0.45, 0.17, sadness));
    return group;
}

function createParticles(sadness) {
    const count = Math.floor(400 + sadness * 600);
    const geo = new THREE.BufferGeometry();
    const pos = [];
    for(let i=0;i<count;i++){
        const r = 1.2 + Math.random()*1.5;
        const theta = Math.random()*Math.PI*2;
        const phi = Math.acos(2*Math.random()-1);
        pos.push(Math.sin(phi)*Math.cos(theta)*r, Math.sin(phi)*Math.sin(theta)*r+0.5, Math.cos(phi)*r);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color:0x88aaff, size:0.035, blending:THREE.AdditiveBlending }));
}

function wither() {
    if(isDying) return;
    isDying = true;
    const start = performance.now();
    function anim(now){
        let p = Math.min(1, (now-start)/1500);
        if(currentFlower) currentFlower.children.forEach(c => { if(c.material) c.material.opacity = Math.max(0, 0.92*(1-p)); });
        if(particleSystem) particleSystem.material.opacity = 1-p;
        if(p<1) requestAnimationFrame(anim);
        else {
            if(currentFlower) scene.remove(currentFlower);
            if(particleSystem) scene.remove(particleSystem);
            isDying = false;
        }
    }
    requestAnimationFrame(anim);
}

function bloom(text){
    if(isDying) return;
    const sadness = analyzeSadness(text);
    currentSadness = sadness;
    document.getElementById('sadnessMeter').innerHTML = `悲伤指数: ${Math.floor(sadness*100)}%`;
    if(currentFlower) wither();
    setTimeout(() => {
        if(!isDying){
            currentFlower = createFlower(sadness);
            scene.add(currentFlower);
            particleSystem = createParticles(sadness);
            scene.add(particleSystem);
            currentFlower.scale.set(0,0,0);
            let t=0;
            function grow(){ t+=0.05; let s=Math.min(1,t); currentFlower.scale.set(s,s,s); if(s<1) requestAnimationFrame(grow); }
            requestAnimationFrame(grow);
        }
    }, 300);
}

document.getElementById('submitBtn').onclick = () => bloom(document.getElementById('sadInput').value || "微光之哀");
document.getElementById('sadInput').onkeypress = (e) => { if(e.key==='Enter') bloom(e.target.value); };

let time = 0;
function animate(){
    time += 0.016;
    if(particleSystem && !isDying){
        particleSystem.rotation.y = time * 0.2;
        particleSystem.material.size = 0.03 + currentSadness*0.025 + Math.sin(time*5)*0.005;
    }
    controls.update();
    effectComposer.render();
    requestAnimationFrame(animate);
}
animate();
bloom("寂静的思念");
window.onresize = () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    effectComposer.setSize(window.innerWidth, window.innerHeight);
};
