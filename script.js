const bgWrapper = document.getElementById('bgWrapper');
const mainContainer = document.getElementById('mainContainer');
const canvas = document.getElementById('dynamicCanvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('bgMusic');
let drops = [], stars = [];
let mouseX = 0, mouseY = 0;

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for(let i=0; i<100; i++) {
        stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*2, blink: Math.random()*0.05, opacity: Math.random() });
    }
    drops = [];
    for(let i=0; i<120; i++) {
        drops.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, l: Math.random()*20+10, s: Math.random()*12+8 });
    }
}

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    bgWrapper.style.transform = `translate(${mouseX * -30}px, ${mouseY * -30}px)`;
    mainContainer.style.transform = `translate(${mouseX * 15}px, ${mouseY * 15}px)`;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.opacity += s.blink;
        if(s.opacity > 1 || s.opacity < 0) s.blink = -s.blink;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.opacity)})`;
        ctx.beginPath();
        ctx.arc(s.x + (mouseX * 20), s.y + (mouseY * 20), s.size, 0, Math.PI*2);
        ctx.fill();
    });
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    drops.forEach(d => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.l);
        ctx.stroke();
        d.y += d.s;
        if(d.y > canvas.height) d.y = -d.l;
    });
    requestAnimationFrame(draw);
}

function toggleMute() { audio.muted = !audio.muted; }
function updateVolume() { audio.volume = document.getElementById('volSlider').value / 100; }

window.addEventListener('resize', init);
document.body.addEventListener('click', () => { if(audio.paused) audio.play(); }, {once:true});

init();
draw();
