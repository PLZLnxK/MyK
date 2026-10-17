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

// =========================================================
// EASTER EGGS
// =========================================================

// --- 7. HECHIZO DEL NOMBRE ---
// Si escribe su nombre (o lo susurra tocando la casa), la casa se ilumina.
const HECHIZO_NOMBRE = "Mariana";
const HECHIZO_MENSAJE = "MENSAJE OCULTO";

const secretOverlay = document.getElementById('secret-overlay');
const secretContent = document.getElementById('secret-content');

function abrirSecreto(html) {
    secretContent.innerHTML = html;
    secretOverlay.hidden = false;
}

function cerrarSecreto() {
    secretOverlay.hidden = true;
    secretContent.innerHTML = '';
}

if (secretOverlay) {
    document.getElementById('secret-close').addEventListener('click', cerrarSecreto);
    secretOverlay.addEventListener('click', (e) => { if (e.target === secretOverlay) cerrarSecreto(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !secretOverlay.hidden) cerrarSecreto(); });
}

// Quita acentos y espacios para que "Sofía" y "sofia" valgan igual
function normalizar(texto) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ]/gi, '').toLowerCase();
}

function lanzarHechizo() {
    const portal = document.querySelector('.portal');
    if (portal) portal.classList.add('spelled');
    abrirSecreto(`
        <div class="spell-card">
            <p class="eyebrow">El hechizo funcionó</p>
            <h3>${HECHIZO_NOMBRE}</h3>
            <p class="quote">"${HECHIZO_MENSAJE}"</p>
        </div>`);
}

(function hechizoNombre() {
    const palabra = normalizar(HECHIZO_NOMBRE);
    let buffer = '';

    document.addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea') || e.key.length !== 1) return;
        buffer = (buffer + normalizar(e.key)).slice(-palabra.length);
        if (buffer === palabra) {
            buffer = '';
            lanzarHechizo();
        }
    });

    // En el celular no hay teclado: tocar la casa abre un susurro
    const house = document.getElementById('house');
    if (!house) return;
    house.addEventListener('click', () => {
        abrirSecreto(`
            <div class="spell-card" id="spell-ask">
                <p class="eyebrow">La casa embrujada te escucha</p>
                <h3>Susurra el hechizo</h3>
                <form id="spell-form">
                    <input id="spell-input" type="text" autocomplete="off" placeholder="..." aria-label="Hechizo">
                    <button type="submit">✨</button>
                </form>
            </div>`);
        const input = document.getElementById('spell-input');
        input.focus();
        document.getElementById('spell-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (normalizar(input.value) === palabra) {
                lanzarHechizo();
            } else {
                const card = document.getElementById('spell-ask');
                card.classList.remove('wrong');
                void card.offsetWidth;
                card.classList.add('wrong');
                input.value = '';
            }
        });
    });
})();

// --- 8. FANTASMA TÍMIDO ---
// 3 toques y se quita la sábana: debajo estamos nosotros.
(function fantasmaTimido() {
    const ghost = document.getElementById('ghost');
    if (!ghost) return;
    let toques = 0;

    ghost.addEventListener('click', () => {
        toques++;
        if (toques < 3) {
            ghost.classList.remove('shy');
            void ghost.offsetWidth;
            ghost.classList.add('shy');
            return;
        }
        ghost.classList.add('gone');
        setTimeout(() => {
            abrirSecreto(`
                <figure class="polaroid">
                    <img src="img/foto-fantasma.jpg" alt="Nosotros, debajo de la sábana">
                    <figcaption><span class="num">Nº 00 · secreto</span>¡Me descubriste! Debajo de la sábana siempre fuimos nosotros</figcaption>
                </figure>`);
        }, 900);
        // El fantasma regresa después, por si quiere volver a asustarlo
        setTimeout(() => { ghost.classList.remove('gone', 'shy'); toques = 0; }, 4000);
    });
})();

// --- 9. LUNA ROJA ---
// 7 clics en la luna: se vuelve corazón y caen pétalos.
(function lunaRoja() {
    const moon = document.getElementById('moon');
    if (!moon) return;
    let clics = 0;

    moon.addEventListener('click', () => {
        moon.classList.add('tap');
        setTimeout(() => moon.classList.remove('tap'), 150);
        clics++;
        if (clics === 7) {
            moon.classList.add('blood');
            document.querySelector('.portal').classList.add('blood-night');
            lluviaDePetalos();
        } else if (clics > 7) {
            lluviaDePetalos();
        }
    });

    function lluviaDePetalos() {
        const petals = document.getElementById('petals');
        if (!petals || reduceMotion) return;
        for (let i = 0; i < 45; i++) {
            const p = document.createElement('span');
            p.className = 'petal';
            p.style.left = `${Math.random() * 100}vw`;
            p.style.animationDuration = `${5 + Math.random() * 5}s`;
            p.style.animationDelay = `${Math.random() * 3}s`;
            p.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
            p.style.setProperty('--spin', `${300 + Math.random() * 500}deg`);
            p.style.scale = `${0.7 + Math.random() * 0.7}`;
            p.addEventListener('animationend', () => p.remove());
            petals.appendChild(p);
        }
    }
})();

// --- 10. LÁPIDA DEL 21/07 ---
// Solo el día de nuestro aniversario la lápida guarda un poema.
// (Para verlo cualquier otro día: abrir la página con ?aniversario)
(function lapidaAniversario() {
    const hoy = new Date();
    const esAniversario = hoy.getMonth() === 6 && hoy.getDate() === 21;
    if (!esAniversario && !new URLSearchParams(location.search).has('aniversario')) return;

    const tomb = document.getElementById('tombstone');
    const poem = document.getElementById('tomb-poem');
    if (!tomb || !poem) return;

    const anios = Math.max(1, hoy.getFullYear() - 2024);
    document.getElementById('anniv-years').innerText = `${anios} ${anios === 1 ? 'año' : 'años'}`;
    tomb.classList.add('anniversary');
    poem.hidden = false;
})();
