// --- 1. CUSTOM CURSOR & BLUR EFFECT ---
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Update mouse globally for cursor and constellations
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Parallax logic for clouds/stars
    const stars1 = document.getElementById('stars');
    const stars2 = document.getElementById('stars2');
    if(stars1) stars1.style.transform = `translate(${mouseX * -0.05}px, ${mouseY * -0.02}px)`;
    if(stars2) stars2.style.transform = `translate(${mouseX * -0.02}px, ${mouseY * -0.01}px)`;
});

// Only run cursor logic if on non-touch device
if (window.matchMedia("(pointer: fine)").matches) {
    let cursorX = mouseX;
    let cursorY = mouseY;
    let blurX = mouseX;
    let blurY = mouseY;

    // Smooth Lerp for Cursor
    function animateCursor() {
        // Cursor dot - fast follow
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;

        // Blur - slow follow (parallax feel)
        blurX += (mouseX - blurX) * 0.05;
        blurY += (mouseY - blurY) * 0.05;

        if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        if (cursorBlur) cursorBlur.style.transform = `translate(${blurX}px, ${blurY}px)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const iteractives = document.querySelectorAll('a, button, .polaroid, .music-control, #envelope');
    iteractives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('cursor-hover');
        });
    });
}

// --- 2. 3D TILT EFFECT FOR POLAROIDS ---
// Utiliza la librería VanillaTilt importada en HTML
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.05
    });
}

// --- 3. SCROLL REVEAL (Intersection Observer) ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.reveal-element').forEach((el) => revealObserver.observe(el));

// --- 4. CONFIGURACIÓN Y FRASES (Románticas/Cósmicas) ---
const frasesDeFondo = [
    "«En cada flor que florece, veo un reflejo de tu sonrisa.»",
    "«Nuestras almas están hechas de la misma luz de primavera.»",
    "«Si la primavera es eterna, mi amor por ti es su esencia.»",
    "«Eres mi flor favorita en este inmenso jardín.»",
    "«Incluso si el cielo se nubla, tu calidez sigue iluminando mi mundo.»",
    "«Somos dos semillas que tuvieron la suerte de germinar juntas.»",
    "«Cada uno de nuestros latidos es un eco en la suave brisa del viento.»",
    "«Descubrí que la eternidad existe en el instante en que te miro a los ojos.»",
    "«No importa las estaciones, mi alma siempre florecerá a tu lado.»",
    "«Contigo, el frío del invierno desaparece por completo.»",
    "«Eres la luz que hace crecer todos mis sueños.»",
    "«Tu belleza es aún más deslumbrante que una mañana de abril.»",
    "«Estar a tu lado es como caminar por un prado lleno de luz.»",
    "«Tus ojos tienen el brillo exacto del sol de primavera.»",
    "«Nuestro amor es más fuerte que las raíces del roble más antiguo.»",
    "«Tú y yo: un jardín inmenso floreciendo al unísono.»",
    "«De todas las casualidades de la naturaleza, encontrarte fue la más hermosa.»",
    "«Eres la brújula que guía mi camino en este bosque de la vida.»",
    "«Contigo cada día es un renacer lleno de colores hermosos.»"
];

function iniciarCicloFrases() {
    const contenedor = document.getElementById('background-phrases');
    if (!contenedor) return;

    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;

    // Crear 8 frases estáticas iniciales (menos qty para elegancia)
    for (let i = 0; i < 8; i++) {
        crearFraseFlotante(contenedor, anchoPantalla, altoPantalla);
    }

    // Cambiar una frase cada 8 segundos
    setInterval(() => {
        const frasesActuales = contenedor.querySelectorAll('.bg-phrase');
        if (frasesActuales.length > 0) {
            const fraseAModificar = frasesActuales[Math.floor(Math.random() * frasesActuales.length)];
            fraseAModificar.classList.remove('show-phrase');

            setTimeout(() => {
                fraseAModificar.remove();
                crearFraseFlotante(contenedor, anchoPantalla, altoPantalla);
            }, 2000);
        }
    }, 8000);
}

function crearFraseFlotante(contenedor, anchoPantalla, altoPantalla) {
    const span = document.createElement('span');
    span.className = 'bg-phrase';
    span.innerText = frasesDeFondo[Math.floor(Math.random() * frasesDeFondo.length)];
    contenedor.appendChild(span);

    const margin = 100;
    const width = 250; // Estimated max width
    const height = 80; // Estimated max height

    let posValida = false;
    let intentos = 0;
    let x, y;

    // Collision Check Loop
    while (!posValida && intentos < 50) {
        x = margin + Math.random() * (anchoPantalla - margin * 2 - width);
        y = margin + Math.random() * (altoPantalla - margin * 2 - height);

        posValida = true;
        const existentes = contenedor.querySelectorAll('.bg-phrase');
        for (let el of existentes) {
            if (el === span) continue;

            const ex = parseFloat(el.style.left) || 0;
            const ey = parseFloat(el.style.top) || 0;

            // Check intersection logic
            if (x < ex + width && x + width > ex && y < ey + height && y + height > ey) {
                posValida = false;
                break;
            }
        }
        intentos++;
    }

    span.style.left = `${x}px`;
    span.style.top = `${y}px`;

    // Smooth reveal
    setTimeout(() => {
        span.classList.add('show-phrase');
    }, 100);
}

// --- 5. PARTÍCULAS DE CORAZÓN (Fondo) ---
function crearParticulaCorazon() {
    const container = document.getElementById('particles-container');
    if (!container || document.querySelectorAll('.particle-heart').length > 30) return;

    const corazon = document.createElement('div');
    corazon.innerHTML = '🌸'; // Flores o brillos
    if (Math.random() > 0.5) corazon.innerHTML = '🌼';

    corazon.className = 'particle-heart';
    corazon.style.left = Math.random() * 100 + 'vw';
    corazon.style.cursor = 'pointer';
    corazon.style.pointerEvents = 'auto'; // allow click

    corazon.addEventListener('click', function(e) {
        e.stopPropagation(); // prevent clicking other elements behind
        for (let i=0; i<4; i++) {
            const burst = document.createElement('div');
            burst.innerHTML = '✨';
            burst.style.position = 'fixed';
            burst.style.left = this.style.left;
            burst.style.top = this.getBoundingClientRect().top + 'px';
            burst.style.fontSize = '14px';
            burst.style.pointerEvents = 'none';
            burst.style.zIndex = '9999';
            const tx = (Math.random() - 0.5) * 120;
            const ty = (Math.random() - 0.5) * 120;
            burst.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], { duration: 600, easing: 'ease-out' });
            document.body.appendChild(burst);
            setTimeout(() => burst.remove(), 600);
        }
        this.remove();
    });

    const size = Math.random() * 25 + 15;
    corazon.style.fontSize = size + 'px';

    const duracion = Math.random() * 15 + 15; // 15s to 30s fall
    corazon.style.animationDuration = duracion + 's';

    container.appendChild(corazon);

    setTimeout(() => {
        corazon.remove();
    }, duracion * 1000);
}
setInterval(crearParticulaCorazon, 800);

// --- 6. MÚSICA & AUDIO VISUALIZER ---
let audioContext;
let audioSource;
let analyser;
let isAudioInitialized = false;

function iniciarAudioVisualizer() {
    if (isAudioInitialized) return;

    const audio = document.getElementById('miMusica');
    const canvas = document.getElementById('audio-visualizer');
    if (!audio || !canvas) return;

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();

        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 64; // Bajo para mejor rendimiento (32 bins)
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const ctx = canvas.getContext('2d');
        canvas.width = 140;
        canvas.height = 140;

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            const musicBtn = document.getElementById('music-container');

            if (audio.paused) {
                if (musicBtn) {
                    musicBtn.style.transform = 'scale(1)';
                    musicBtn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                }
                return; // Cleanup drawing cycles when paused
            }

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 35; // Size of the button roughly

            // Bass calc for pumping button effect
            let bassSum = 0;
            for (let i = 0; i < 3; i++) bassSum += dataArray[i];
            let bassAvg = bassSum / 3;
            let scaleBase = 1 + (bassAvg / 255) * 0.15; // Scale up to 1.15x
            if (musicBtn) {
                musicBtn.style.transition = 'transform 0.05s ease-out';
                musicBtn.style.transform = `scale(${scaleBase})`;
            }

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            const usableBins = 24; // Usable half ring

            for (let i = 0; i < usableBins; i++) {
                const value = dataArray[i];
                const percent = value / 255;
                const barHeight = Math.max(2, percent * 30); // Max 30px

                // Color gradient based on intensity
                const r = 255;
                const g = 77 + percent * 100;
                const b = 133 + percent * 100;

                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + percent * 0.6})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;

                // Draw mirrored sides
                // Right side
                const angleR = (i * Math.PI) / usableBins - Math.PI / 2;
                drawBar(angleR, barHeight);

                if (i > 0) {
                    // Left side
                    const angleL = (-i * Math.PI) / usableBins - Math.PI / 2;
                    drawBar(angleL, barHeight);
                }
            }

            function drawBar(angle, height) {
                // start slightly outside button to avoid overlap with border
                const x1 = centerX + Math.cos(angle) * (radius + 2);
                const y1 = centerY + Math.sin(angle) * (radius + 2);
                const x2 = centerX + Math.cos(angle) * (radius + 2 + height);
                const y2 = centerY + Math.sin(angle) * (radius + 2 + height);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }

        renderFrame();
        isAudioInitialized = true;
    } catch (e) {
        console.error("Audio Context Init error: ", e);
    }
}

function toggleMusica() {
    const musica = document.getElementById('miMusica');
    const icono = document.getElementById('music-icon');
    const contenedor = document.getElementById('music-container');

    if (musica.paused) {
        musica.play().then(() => {
            // Must be called after user interaction
            iniciarAudioVisualizer();
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }).catch(e => console.log("Esperando interacción..."));

        icono.innerText = '🎵';
        contenedor.classList.add('playing');

        // Clear canvas if paused previously
        const canvas = document.getElementById('audio-visualizer');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        musica.pause();
        icono.innerText = '🔇';
        contenedor.classList.remove('playing');
    }
}

// --- 7. ENVELOPE (CARTA FÍSICA) ---
let isEnvelopeOpen = false;

function abrirSobre(e) {
    if (e && e.target.classList.contains('close-letter-btn')) return;
    const envelope = document.getElementById('envelope');

    if (!isEnvelopeOpen) {
        // Step 1: Open Flap
        envelope.classList.add('open');
        isEnvelopeOpen = true;

        // Shoot Confetti
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff4d85', '#8b3dff', '#ffffff'],
                zIndex: 10000
            });
        }, 600);

        // Step 2: Pop out and expand letter for reading
        setTimeout(() => {
            envelope.classList.add('read-mode');
        }, 1500);
    }
}

function cerrarSobre(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const envelope = document.getElementById('envelope');

    // Reverse Steps
    envelope.classList.remove('read-mode');

    // The letter takes 1.4s to retreat into the opening slot because of the 0.6s delay + 0.8s slide
    setTimeout(() => {
        envelope.classList.remove('open');
        isEnvelopeOpen = false;
    }, 1400);
}

// --- 8. CONTADOR DE TIEMPO ---
function actualizarContador() {
    const fechaInicio = new Date("2024-07-21T00:00:00");
    const ahora = new Date();
    const dif = ahora - fechaInicio;

    const dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    const horas = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));

    const elemento = document.getElementById('tiempo-transcurrido');
    if (elemento) {
        elemento.innerText = `${dias}d ${horas}h ${minutos}m juntos ✨`;
    }
}

// --- 9. CLICK BURST EFFECT ---
document.addEventListener('click', (e) => {
    if (e.target.closest('.action-btn') || e.target.closest('.music-control')) return;

    const burst = document.createElement('div');
    burst.innerHTML = '✨';
    burst.style.position = 'fixed';
    burst.style.left = (e.clientX - 10) + 'px';
    burst.style.top = (e.clientY - 10) + 'px';
    burst.style.fontSize = '20px';
    burst.style.pointerEvents = 'none';
    burst.style.zIndex = '9999';
    burst.style.animation = 'clickPop 0.8s ease-out forwards';
    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 800);
});

// Create CSS for clickPop dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes clickPop {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(2) translateY(-20px); opacity: 0; }
}`;
document.head.appendChild(style);


// --- 10. LIGHTBOX FOTOS ---
document.querySelectorAll('.polaroid-inner').forEach((item) => {
    item.addEventListener('click', function () {
        // En dispositivo móvil el tilt detiene clicks simples a veces, esto ayuda
        const imgPath = this.querySelector('img').src;
        const captionText = this.querySelector('.caption').innerText;

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCap = document.getElementById('lightbox-caption');

        if (lightbox && lightboxImg && lightboxCap) {
            lightboxImg.src = imgPath;
            lightboxCap.innerText = captionText;
            lightbox.classList.add('active');
        }
    });
});

document.getElementById('lightbox')?.addEventListener('click', function () {
    this.classList.remove('active');
});

// --- EASTER EGG (Opcional, Foto Especial) ---
const specialPhoto = document.getElementById('special-photo');
if (specialPhoto) {
    specialPhoto.parentElement.addEventListener('dblclick', (e) => {
        e.preventDefault();
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            shapes: ['heart']
        });
    });
}

// --- 11. INTERACTIVE CONSTELLATIONS (CANVAS) ---
function initConstellations() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    // Disable on small devices for performance
    if (window.innerWidth < 768) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        // Update and draw
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections (Constellations)
        const connectionDistance = 120;
        const mouseConnectionDistance = 180;

        for (let i = 0; i < particles.length; i++) {
            // Check connection to mouse
            const dx = mouseX - particles[i].x;
            const dy = mouseY - particles[i].y;
            const distMouse = Math.sqrt(dx * dx + dy * dy);

            if (distMouse < mouseConnectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 77, 133, ${1 - distMouse / mouseConnectionDistance})`; // Nebula Pink
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
            }

            // Check connection between particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx2 = particles[i].x - particles[j].x;
                const dy2 = particles[i].y - particles[j].y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist2 < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist2 / connectionDistance) * 0.3})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    animate();
}

// --- INICIALIZACIÓN GENERAL ---
window.onload = () => {
    iniciarCicloFrases();
    actualizarContador();
    initConstellations();

    setInterval(actualizarContador, 10000); // 10s avoids constant reflow

    // Ocultar preloader después de animación de SVG (3.5s approx total)
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 1000);
        }
    }, 3500);
};

// --- 12. EASTER EGGS (SECRET CODES) ---
let inputBuffer = "";

window.addEventListener("keydown", (e) => {
    // Ignore typing in inputs if there were any
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Match only letters
    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        inputBuffer += e.key.toLowerCase();

        // Keep string length capped to longest code
        if (inputBuffer.length > 20) {
            inputBuffer = inputBuffer.substring(inputBuffer.length - 20);
        }

        // Matches!
        if (inputBuffer.endsWith("micielo")) {
            triggerEasterEgg();
            inputBuffer = ""; // Reset limit
        }
        if (inputBuffer.endsWith("ginger")) {
            triggerGingerEasterEgg();
            inputBuffer = ""; // Reset limit
        }
    }
});

function triggerGingerEasterEgg() {
    if(document.getElementById('ginger-overlay')) return; // Prevent multiple instances

    // 1. Black overlay like a cinema
    const overlay = document.createElement("div");
    overlay.id = 'ginger-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(255,255,255,0.7)';
    overlay.style.zIndex = '9998';
    overlay.style.transition = 'opacity 0.5s';
    
    // 2. The 3D Dog Container
    const dog = document.createElement("div");
    dog.id = 'ginger-dog';
    
    // Using the pre-processed transparent 3D image
    const dogImg = document.createElement("img");
    dogImg.src = "img/ginger_alpha.png";
    dogImg.alt = "Ginger 3D Rottweiler";
    dogImg.style.width = "450px"; 
    dogImg.style.height = "auto";
    dogImg.style.display = "block";
    dogImg.style.filter = "drop-shadow(15px 25px 20px rgba(0,0,0,0.9))"; 
    
    // Inner wrapper for the running "wobble" animation
    const innerWrapper = document.createElement("div");
    innerWrapper.appendChild(dogImg);
    dog.appendChild(innerWrapper);
    
    dog.style.position = "fixed";
    dog.style.pointerEvents = "none";
    dog.style.zIndex = "9999";
    dog.style.transformOrigin = "center bottom";

    const startY = Math.floor(Math.random() * 40) + 10; 
    const midY = Math.floor(Math.random() * 50) + 10;
    const endY = Math.floor(Math.random() * 30) + 30;
    
    const animId = 'run3D_' + Date.now();
    if(!document.getElementById('ginger-styles')) {
        const style = document.createElement("style");
        style.id = 'ginger-styles';
        document.head.appendChild(style);
    }
    
    const styleSheet = document.getElementById('ginger-styles');
    styleSheet.innerHTML = `
        @keyframes ${animId} {
            0% { 
                left: -500px; 
                top: ${startY}%;
                transform: scale(0.3) perspective(800px) translateZ(-300px) rotateY(-20deg); 
            }
            30% { 
                top: ${midY}%;
                transform: scale(0.8) perspective(800px) translateZ(100px) rotateY(-5deg); 
            }
            70% { 
                top: ${endY}%;
                transform: scale(1.3) perspective(800px) translateZ(300px) rotateY(15deg); 
            }
            100% { 
                left: 110vw; 
                top: ${endY - 10}%;
                transform: scale(0.6) perspective(800px) translateZ(-100px) rotateY(30deg); 
            }
        }
        @keyframes gingerBobbing {
            0% { padding-top: 0px; }
            100% { padding-top: 50px; }
        }
        @keyframes gingerLegsMove {
            0% { transform: rotate(-8deg) translateY(-5px); }
            100% { transform: rotate(12deg) translateY(5px); }
        }
    `;

    // Forward path + up/down bouncing
    dog.style.animation = `${animId} 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards, gingerBobbing 0.25s infinite alternate ease-in-out`;
    // Fast leg "wobbling" rotation
    innerWrapper.style.animation = "gingerLegsMove 0.15s infinite alternate ease-in-out";

    const nameText = document.createElement('div');
    nameText.innerText = "¡Ginger! 🐾";
    nameText.style.position = 'absolute';
    nameText.style.top = '-40px';
    nameText.style.left = '50%';
    nameText.style.transform = 'translateX(-50%)';
    nameText.style.fontSize = '50px';
    nameText.style.fontFamily = 'var(--font-heading)';
    nameText.style.color = '#ff9900';
    nameText.style.textShadow = '0 0 20px #ff0000, 2px 2px 0px #000';
    nameText.style.whiteSpace = 'nowrap';
    dog.appendChild(nameText);

    document.body.appendChild(overlay);
    document.body.appendChild(dog);

    try {
        const bark = new Audio('https://www.soundjay.com/nature/sounds/dog-barking-2.mp3');
        bark.volume = 0.5;
        bark.play().catch(e => {}); 
    } catch(e) {}

    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if(overlay.parentNode) overlay.remove();
            if(dog.parentNode) dog.remove();
        }, 500);
    }, 4000);
}

function triggerEasterEgg() {
    // 1. Epic Confetti Explosion (Sides to center)
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
        // Left Cannon
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: ['#ff4d85', '#ffd700', '#ffffff', '#4a154b']
        });
        // Right Cannon
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: ['#ff4d85', '#ffd700', '#ffffff', '#4a154b']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // 2. Magical Floating Text Overlay
    const overlay = document.createElement("div");
    overlay.innerHTML = "🌸 ¡Hola Mi Cielo! 🌸<br><span style='font-size:2rem; font-family: var(--font-heading)'>Esta primavera floreció para nosotros.</span>";
    overlay.style.position = "fixed";
    overlay.style.top = "50%";
    overlay.style.left = "50%";
    overlay.style.width = "100%";
    overlay.style.textAlign = "center";
    overlay.style.transform = "translate(-50%, -50%) scale(0)";
    overlay.style.color = "var(--starlight)";
    overlay.style.fontFamily = "var(--font-script)";
    overlay.style.fontSize = "6rem";
    overlay.style.lineHeight = "1.2";
    overlay.style.textShadow = "0 0 20px var(--nebula-pink), 0 0 50px var(--nebula-purple), 0 0 80px rgba(255,255,255,0.8)";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1.5s";

    // Mobile adjust
    if (window.innerWidth < 768) {
        overlay.style.fontSize = "3.5rem";
    }

    document.body.appendChild(overlay);

    // Animate In Text
    setTimeout(() => {
        overlay.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);

    // 3. Background pulse zoom
    const bg = document.getElementById("cosmic-bg");
    if (bg) {
        bg.style.transition = "transform 3s ease";
        bg.style.transform = "scale(1.15)";
    }

    // Fade Out & Remove
    setTimeout(() => {
        overlay.style.opacity = "0";
        if (bg) {
            bg.style.transform = "scale(1)";
        }
        setTimeout(() => overlay.remove(), 1500);
    }, 5500);
}

// --- 14. MEMORY STORAGE (INDEXEDDB) ---
let memoryDB;

function initDB() {
    const request = indexedDB.open('LoveGalleryDB', 1);

    request.onupgradeneeded = function(e) {
        memoryDB = e.target.result;
        if (!memoryDB.objectStoreNames.contains('memories')) {
            memoryDB.createObjectStore('memories', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function(e) {
        memoryDB = e.target.result;
        loadMemories();
    };

    request.onerror = function(e) {
        console.error("IndexedDB error:", e);
    };
}

// Call initDB on load
window.addEventListener('load', initDB);

window.abrirModalMemoria = function() {
    document.getElementById('modal-memory').classList.remove('hidden');
};

window.cerrarModalMemoria = function() {
    document.getElementById('modal-memory').classList.add('hidden');
    // Reset fields
    document.getElementById('memory-upload').value = '';
    document.getElementById('memory-preview-container').style.display = 'none';
    document.getElementById('memory-preview').src = '';
    document.getElementById('memory-caption').value = '';
    const btnSave = document.getElementById('btn-save-memory');
    btnSave.disabled = true;
    btnSave.style.opacity = '0.5';
    btnSave.style.cursor = 'not-allowed';
};

let currentMemoryBase64 = null;

window.previewMemory = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        currentMemoryBase64 = e.target.result;
        document.getElementById('memory-preview').src = currentMemoryBase64;
        document.getElementById('memory-preview-container').style.display = 'block';
        
        const btnSave = document.getElementById('btn-save-memory');
        btnSave.disabled = false;
        btnSave.style.opacity = '1';
        btnSave.style.cursor = 'pointer';
    };
    reader.onerror = function() {
        alert("Error al leer la imagen. Intenta con otra foto.");
    };
    reader.readAsDataURL(file);
};

window.guardarMemoria = function() {
    if (!currentMemoryBase64) return;
    const caption = document.getElementById('memory-caption').value || "Un hermoso recuerdo nuevo 🌸";

    const memoryParams = {
        image: currentMemoryBase64,
        caption: caption,
        date: new Date().getTime()
    };

    if (!memoryDB) {
        // Fallback if IndexedDB is blocked or failed
        cerrarModalMemoria();
        agregarPolaroidDOM(memoryParams.image, memoryParams.caption, Date.now());
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ff4d85', '#77DD77'] });
        return;
    }

    try {
        const transaction = memoryDB.transaction(['memories'], 'readwrite');
        const store = transaction.objectStore('memories');
        const request = store.add(memoryParams);

        request.onsuccess = function(event) {
            cerrarModalMemoria();
            const newId = event.target.result;
            // Add to DOM instantly
            agregarPolaroidDOM(memoryParams.image, memoryParams.caption, newId);
            // Celebration
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ff4d85', '#77DD77'] });
        };
        request.onerror = function() {
            alert("No se pudo guardar permanentemente, pero se mostrará ahora.");
            cerrarModalMemoria();
            agregarPolaroidDOM(memoryParams.image, memoryParams.caption, Date.now());
        };
    } catch(err) {
        cerrarModalMemoria();
        agregarPolaroidDOM(memoryParams.image, memoryParams.caption, Date.now());
    }
};

function loadMemories() {
    const transaction = memoryDB.transaction(['memories'], 'readonly');
    const store = transaction.objectStore('memories');
    const request = store.getAll();

    request.onsuccess = function(e) {
        const memories = e.target.result;
        memories.forEach(mem => {
            agregarPolaroidDOM(mem.image, mem.caption, mem.id);
        });
    };
}

function agregarPolaroidDOM(imageSrc, captionText, dbId) {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    const newItem = document.createElement('div');
    newItem.className = 'timeline-item reveal-element show-reveal';
    
    // Create inner HTML safely to prevent Base64 string crashes in DOM parser
    newItem.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="polaroid tilt-effect" style="position: relative;">
            <button class="delete-btn" onclick="borrarMemoria(${dbId}, this, event)" title="Borrar Recuerdo" style="position: absolute; top: -15px; right: -15px; background: #ff4d85; color: white; border: 2px solid white; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; z-index: 50; font-size: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; transition: transform 0.2s;">🗑️</button>
            <div class="polaroid-inner">
                <img loading="lazy">
                <p class="caption"></p>
            </div>
        </div>
    `;

    // Force visibility just in case intersection observer missed it
    newItem.style.opacity = '1';
    newItem.style.visibility = 'visible';
    newItem.style.transform = 'translateY(0)';

    // Safely assign data bypassing HTML DOM string parser issues with large Base64
    const photoImg = newItem.querySelector('img');
    photoImg.src = imageSrc;
    photoImg.alt = captionText;
    
    newItem.querySelector('p.caption').textContent = '"' + captionText + '"';

    // Add interactivity to the delete button
    const deleteBtn = newItem.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.onmouseover = () => deleteBtn.style.transform = 'scale(1.2)';
        deleteBtn.onmouseout = () => deleteBtn.style.transform = 'scale(1)';
    }

    // Add click event for lightbox
    const img = newItem.querySelector('img');
    img.addEventListener('click', (e) => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        if(lightbox && lightboxImg) {
            lightboxImg.src = e.target.src;
            if(lightboxCaption) lightboxCaption.textContent = captionText;
            lightbox.classList.add('active');
        }
    });

    timelineContainer.appendChild(newItem);

    // Apply VanillaTilt to new element if available
    const tiltEl = newItem.querySelector('.tilt-effect');
    if (tiltEl && window.VanillaTilt) {
        VanillaTilt.init(tiltEl, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }
}

window.borrarMemoria = function(id, btnElement, event) {
    event.stopPropagation();
    if (!confirm("¿Estás seguro de que deseas eliminar este recuerdo para siempre? 💔")) return;

    // Remove from UI first for responsiveness
    const timelineItem = btnElement.closest('.timeline-item');
    if (timelineItem) {
        timelineItem.style.transition = 'opacity 0.5s, transform 0.5s';
        timelineItem.style.opacity = '0';
        timelineItem.style.transform = 'scale(0.8)';
        setTimeout(() => timelineItem.remove(), 500);
    }

    if (memoryDB) {
        try {
            const transaction = memoryDB.transaction(['memories'], 'readwrite');
            const store = transaction.objectStore('memories');
            store.delete(id);
        } catch (e) {
            console.error("Error al borrar en BD", e);
        }
    }
};

// --- 13. EASTER EGG HUNT ---
let huevosEncontrados = 0;
window.encontrarHuevo = function(elemento) {
    if (elemento.classList.contains('encontrado')) return;
    
    elemento.classList.add('encontrado');
    elemento.style.opacity = '1';
    elemento.style.transform = 'scale(1.5)';
    elemento.style.transition = 'all 0.3s';
    
    huevosEncontrados++;
    
    // Confetti for single egg
    confetti({
        particleCount: 40,
        spread: 60,
        origin: { 
            x: elemento.getBoundingClientRect().left / window.innerWidth,
            y: elemento.getBoundingClientRect().top / window.innerHeight
        },
        shapes: ['circle']
    });
    
    if (huevosEncontrados === 3) {
        // Grand finale
        setTimeout(() => triggerEggFinale(), 800);
    }
};

function triggerEggFinale() {
    confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#ff4d85', '#ffd700', '#ffffff', '#8b3dff']
    });
    
    const overlay = document.createElement("div");
    overlay.innerHTML = "🎉 ¡Felicidades! 🎉<br><span style='font-size:2rem; font-family: var(--font-heading)'>Efectivamente, encontraste todo. ¡Eres increíble!</span>";
    overlay.style.position = "fixed";
    overlay.style.top = "50%";
    overlay.style.left = "50%";
    overlay.style.width = "100%";
    overlay.style.textAlign = "center";
    overlay.style.transform = "translate(-50%, -50%) scale(0)";
    overlay.style.color = "var(--text-color)";
    overlay.style.fontFamily = "var(--font-script)";
    overlay.style.fontSize = "4rem";
    overlay.style.lineHeight = "1.2";
    overlay.style.textShadow = "0 0 20px rgba(255,255,255,0.8)";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "transform 0.8s, opacity 1.5s";

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.transform = "translate(-50%, -50%) scale(1)";
    }, 100);

    setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 1500);
    }, 5500);
}

// --- 15. DYNAMIC CLOUDS ---
function generarNubesPrimavera() {
    const container = document.getElementById('clouds-container');
    if (!container) return;

    // Create 15 organic clouds
    for (let i = 0; i < 15; i++) {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud-puff');
        
        // Randomizations for a natural sky
        const scale = 0.4 + Math.random() * 1.5;
        const topPos = Math.random() * 75; // 0 to 75vh
        const opacity = 0.3 + Math.random() * 0.6;
        const speed = 50 + Math.random() * 120; // slow drift 50s to 170s
        
        // Proportions 
        const baseWidth = 120 + Math.random() * 180; 
        const baseHeight = baseWidth / 2.5; 
        
        cloud.style.width = baseWidth + 'px';
        cloud.style.height = baseHeight + 'px';
        cloud.style.top = topPos + 'vh';
        
        // Random start time creates organic uneven spacing
        const delay = -Math.random() * speed; 
        
        cloud.style.animation = `floatCloud ${speed}s linear ${delay}s infinite`;
        cloud.style.transform = `scale(${scale})`; // preserve static scaling
        cloud.style.opacity = opacity;
        
        container.appendChild(cloud);
    }
}
window.addEventListener('load', generarNubesPrimavera);