// --- 1. CUSTOM CURSOR & BLUR EFFECT ---
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Update mouse globally for cursor and constellations
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
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
    "«En todas las galaxias posibles, siempre elegiría orbitar a tu alrededor.»",
    "«Nuestras almas están hechas de la misma materia estelar.»",
    "«Si el universo es infinito, mi amor por ti es su medida.»",
    "«Eres mi constelación favorita en el inmenso cielo nocturno.»",
    "«Incluso si el sol se apagara, tu sonrisa seguiría iluminando mi mundo.»",
    "«Somos dos estrellas fugaces que tuvieron la suerte de colisionar.»",
    "«Cada uno de nuestros latidos es un eco en la inmensidad del espacio.»",
    "«Descubrí que la eternidad existe en el milisegundo en que te miro a los ojos.»",
    "«No importa las vidas o reencarnaciones, mi alma siempre reconocerá a la tuya.»",
    "«Contigo, el caos del universo de repente cobra perfecto sentido.»",
    "«Eres la gravedad que me mantiene con los pies en la tierra y el corazón en el cielo.»",
    "«Si la luz tarda años en viajar, mi amor llegó a ti antes de que las estrellas nacieran.»",
    "«Estar a tu lado es como descubrir un planeta nuevo: lleno de maravillas y sin explorar.»",
    "«Tus ojos tienen el brillo exacto de mil galaxias naciendo.»",
    "«Incluso en el vacío del espacio, sentiría el magnetismo de tu corazón.»",
    "«Tú y yo: un Big Bang de emociones que creó nuestro propio universo.»",
    "«De todas las casualidades del cosmos, encontrarte fue mi mejor destino.»",
    "«No necesito telescopios; toda la belleza del universo está frente a mí cuando sonríes.»",
    "«Eres la estrella polar que guía mi barco a puerto seguro.»",
    "«Nuestro amor es más antiguo que el polvo de estrellas del que estamos hechos.»"
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
    corazon.innerHTML = '✨'; // Corazones o brillos
    if (Math.random() > 0.5) corazon.innerHTML = '❤️';

    corazon.className = 'particle-heart';
    corazon.style.left = Math.random() * 100 + 'vw';

    const size = Math.random() * 10 + 5;
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

function abrirSobre() {
    const envelope = document.getElementById('envelope');
    const btnCerrar = document.getElementById('btn-cerrar-sobre');

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
            if (btnCerrar) btnCerrar.style.display = 'inline-flex';
        }, 1500);
    }
}

function cerrarSobre() {
    const envelope = document.getElementById('envelope');
    const btnCerrar = document.getElementById('btn-cerrar-sobre');

    // Reverse Steps
    envelope.classList.remove('read-mode');
    if (btnCerrar) btnCerrar.style.display = 'none';

    setTimeout(() => {
        envelope.classList.remove('open');
        isEnvelopeOpen = false;
    }, 800);
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

// --- 12. EASTER EGG (SECRET CODE "MI CIELO") ---
let secretCode = "micielo";
let inputBuffer = "";

window.addEventListener("keydown", (e) => {
    // Ignore typing in inputs if there were any
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Match only letters
    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        inputBuffer += e.key.toLowerCase();

        // Keep string length capped
        if (inputBuffer.length > secretCode.length) {
            inputBuffer = inputBuffer.substring(inputBuffer.length - secretCode.length);
        }

        // Match found!
        if (inputBuffer === secretCode) {
            triggerEasterEgg();
            inputBuffer = ""; // Reset limit
        }
    }
});

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
    overlay.innerHTML = "✨ ¡Hola Mi Cielo! ✨<br><span style='font-size:2rem; font-family: var(--font-heading)'>El universo conspiró para que nos encontraramos.</span>";
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