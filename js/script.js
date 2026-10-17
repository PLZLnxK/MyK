// --- 1. CURSOR DE VELA ---
const candleCursor = document.getElementById('candle-cursor');
const hasMouse = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let mouseX = -100, mouseY = -100;
let cursorX = -100, cursorY = -100;

if (hasMouse && candleCursor) {
    document.body.classList.add('has-cursor');
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    (function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.35;
        cursorY += (mouseY - cursorY) * 0.35;
        candleCursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    })();
}

// --- 2. LÁPIDA: DÍAS JUNTOS ---
function updateCounter() {
    const startDate = new Date("2024-07-21T00:00:00");
    const days = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
    const counterEl = document.getElementById('counter-value');
    if (counterEl) counterEl.innerText = days;
}
updateCounter();

// --- 3. APARICIÓN AL HACER SCROLL ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// En pantallas angostas, encuadra el paisaje sobre la casa embrujada
const landscape = document.querySelector('.landscape');
if (landscape && window.innerWidth < 700) {
    landscape.setAttribute('preserveAspectRatio', 'xMaxYMax slice');
}

// --- 4. MURCIÉLAGOS ---
(function spawnBats() {
    const sky = document.getElementById('bats');
    if (!sky || reduceMotion) return;

    const batSvg = '<svg viewBox="0 0 64 32"><path fill="currentColor" d="M32 10c-2 0-3 2-3 2s-1-3-2-3c0 2 1 4 1 4C22 8 10 4 0 10c6 0 10 4 11 9 3-3 7-3 9 0 2-2 6-2 8 2 1-1 2-2 4-2s3 1 4 2c2-4 6-4 8-2 2-3 6-3 9 0 1-5 5-9 11-9-10-6-22-2-28 3 0 0 1-2 1-4-1 0-2 3-2 3s-1-2-3-2z"/></svg>';
    const count = window.innerWidth < 700 ? 4 : 7;

    for (let i = 0; i < count; i++) {
        const bat = document.createElement('div');
        bat.className = 'bat';
        bat.innerHTML = batSvg;
        bat.style.top = `${6 + Math.random() * 40}%`;
        bat.style.width = `${24 + Math.random() * 30}px`;
        bat.style.animationDuration = `${12 + Math.random() * 14}s`;
        bat.style.animationDelay = `${-Math.random() * 20}s`;
        sky.appendChild(bat);
    }
})();

// --- 5. LINTERNA EN EL MURO DE RECUERDOS ---
(function flashlight() {
    const wall = document.getElementById('recuerdos');
    if (!wall || !hasMouse) return;

    wall.addEventListener('mousemove', (e) => {
        const rect = wall.getBoundingClientRect();
        wall.style.setProperty('--x', `${e.clientX - rect.left}px`);
        wall.style.setProperty('--y', `${e.clientY - rect.top}px`);
        wall.classList.add('lit');
    });
    wall.addEventListener('mouseleave', () => wall.classList.remove('lit'));
})();

// --- 6. MÚSICA ---
function toggleMusica() {
    const musica = document.getElementById('miMusica');
    const icono = document.getElementById('music-icon');
    const player = document.getElementById('music-player');

    if (musica.paused) {
        musica.play().then(() => {
            icono.innerText = 'Sonando';
            player.classList.add('playing');
            player.setAttribute('aria-label', 'Pausar música');
        }).catch(() => console.log("Esperando interacción del usuario..."));
    } else {
        musica.pause();
        icono.innerText = 'Pausa';
        player.classList.remove('playing');
        player.setAttribute('aria-label', 'Reproducir música');
    }
}

// "Entra si te atreves" también enciende la música
const enterBtn = document.getElementById('enter-btn');
if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        const musica = document.getElementById('miMusica');
        if (musica && musica.paused) toggleMusica();
    });
}
