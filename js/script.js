// =========================================================
// FOTOS: para agregar una foto nueva, súbela a img/ y añade
// una línea aquí con su archivo y su frase.
// =========================================================
const FOTOS = [
    { src: 'img/foto 1.jpg',  texto: '1er Jaripeo Plazuela juntos' },
    { src: 'img/foto 2.jpg',  texto: 'Lo mejor no es Galvan Grill, lo mejor eres tú!' },
    { src: 'img/foto 3.jpg',  texto: 'El sol solo ilumina mas tu belleza' },
    { src: 'img/foto 4.jpg',  texto: 'Si tengo los ojos chiquitos es porque me haces feliz' },
    { src: 'img/foto 5.jpg',  texto: 'Coleccionando momentos (y comida)' },
    { src: 'img/foto 6.jpg',  texto: 'Hay amor en los tacos de Beto' },
    { src: 'img/foto 7.jpg',  texto: 'Fererio y collares del amor' },
    { src: 'img/foto 8.jpg',  texto: 'El arte de coincidir contigo' },
    { src: 'img/foto 9.jpg',  texto: 'Aventuras de dos locos sueltos' },
    { src: 'img/foto 10.jpg', texto: 'Simplemente nosotros' },
    { src: 'img/foto 11.jpg', texto: 'Capítulo: Tú y Yo' },
    { src: 'img/foto 12.jpg', texto: 'Nuestra primer Posada juntos' },
    { src: 'img/foto 13.jpg', texto: 'Un año en 13 suspiros' },
    { src: 'img/foto 14.jpg', texto: 'Ninguna lucecita brilla como tú' },
    { src: 'img/foto 15.jpg', texto: 'Dando vueltas, pero siempre de regreso a ti' },
    { src: 'img/foto 16.jpg', texto: 'Mi lugar favorito: a tu lado' },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isNarrow = window.innerWidth < 700;

// --- 1. NIEVE ---
(function nevar() {
    const snow = document.getElementById('snow');
    if (!snow || reduceMotion) return;
    const count = isNarrow ? 40 : 80;
    for (let i = 0; i < count; i++) {
        const f = document.createElement('span');
        f.className = 'flake';
        const size = 2 + Math.random() * 5;
        f.style.width = f.style.height = `${size}px`;
        f.style.left = `${Math.random() * 100}vw`;
        f.style.opacity = `${0.35 + Math.random() * 0.6}`;
        f.style.animationDuration = `${9 + Math.random() * 12}s, ${3 + Math.random() * 4}s`;
        f.style.animationDelay = `${-Math.random() * 20}s, ${-Math.random() * 5}s`;
        snow.appendChild(f);
    }
})();

// --- 2. ESFERA: DÍAS JUNTOS Y CUENTA REGRESIVA ---
(function contador() {
    const hoy = new Date();
    const dia = 1000 * 60 * 60 * 24;
    const inicio = new Date('2024-07-21T00:00:00');
    document.getElementById('counter-value').innerText = Math.floor((hoy - inicio) / dia);

    const el = document.getElementById('countdown');
    const medianoche = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    let navidad = new Date(hoy.getFullYear(), 11, 25);
    if (hoy.getMonth() === 11 && hoy.getDate() === 25) {
        el.innerHTML = '🎄 ¡Hoy es Navidad! 🎄';
        return;
    }
    if (hoy.getMonth() === 11 && hoy.getDate() === 24) {
        el.innerHTML = '✨ Hoy es Nochebuena: esta noche es nuestra ✨';
        return;
    }
    if (medianoche > navidad) navidad = new Date(hoy.getFullYear() + 1, 11, 25);
    const faltan = Math.round((navidad - medianoche) / dia);
    el.innerHTML = `Faltan <strong>${faltan}</strong> ${faltan === 1 ? 'día' : 'días'} para nuestra Navidad`;
})();

// --- 3. FOTOS COLGADAS ---
(function colgarFotos() {
    const cont = document.getElementById('polaroids');
    if (!cont) return;
    FOTOS.forEach((foto, i) => {
        const fig = document.createElement('figure');
        fig.className = 'polaroid reveal';
        fig.style.setProperty('--d', `${(i % 4) * 0.08}s`);
        const num = String(i + 1).padStart(2, '0');
        fig.innerHTML = `
            <span class="wire" aria-hidden="true"></span>
            <span class="bulb l${(i % 4) + 1}" aria-hidden="true"></span>
            <span class="clip" aria-hidden="true"></span>
            <img src="${foto.src}" alt="${foto.texto}" loading="lazy">
            <figcaption><span class="num">Nº ${num}</span>${foto.texto}</figcaption>`;
        cont.appendChild(fig);
    });
    const contador = document.getElementById('photo-count');
    if (contador) contador.innerText = FOTOS.length;
})();

// --- 4. APARICIÓN AL HACER SCROLL ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// En pantallas angostas, encuadra el paisaje sobre la cabaña y el árbol
const landscape = document.querySelector('.landscape');
if (landscape && isNarrow) landscape.setAttribute('preserveAspectRatio', 'xMaxYMax slice');

// --- 5. MÚSICA ---
const musica = document.getElementById('miMusica');
const player = document.getElementById('music-player');

function toggleMusica() {
    const icono = document.getElementById('music-icon');
    if (musica.paused) {
        musica.play().then(() => {
            icono.innerText = 'Sonando';
            player.classList.add('playing');
            player.setAttribute('aria-label', 'Pausar música');
        }).catch(() => console.log('Esperando interacción del usuario...'));
    } else {
        musica.pause();
        icono.innerText = 'Pausa';
        player.classList.remove('playing');
        player.setAttribute('aria-label', 'Reproducir música');
    }
}
player.addEventListener('click', toggleMusica);

// "Abre tu regalo" también enciende la música
document.getElementById('enter-btn').addEventListener('click', () => {
    if (musica.paused) toggleMusica();
});

// =========================================================
// EASTER EGGS DE NAVIDAD
// =========================================================
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
document.getElementById('secret-close').addEventListener('click', cerrarSecreto);
secretOverlay.addEventListener('click', (e) => { if (e.target === secretOverlay) cerrarSecreto(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !secretOverlay.hidden) cerrarSecreto(); });

// Permite activar con Enter/Espacio los elementos SVG con role="button"
function alActivar(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
}

// --- 6. EL REGALO BAJO EL ÁRBOL ---
// 5 toques: se sacude, y al quinto se abre. Dentro estamos nosotros.
(function regalo() {
    const gift = document.getElementById('gift');
    if (!gift) return;
    let toques = 0;
    alActivar(gift, () => {
        toques++;
        if (toques < 5) {
            gift.classList.remove('shake');
            void gift.getBoundingClientRect();
            gift.classList.add('shake');
            return;
        }
        gift.classList.add('open');
        setTimeout(() => {
            abrirSecreto(`
                <figure class="polaroid gift-photo">
                    <img src="img/foto-regalo.jpg" alt="Nosotros, el mejor regalo">
                    <figcaption><span class="num">Nº 00 · regalo</span>Lo abriste antes de tiempo... pero el mejor regalo siempre fuimos nosotros</figcaption>
                </figure>`);
        }, 700);
        setTimeout(() => { gift.classList.remove('open', 'shake'); toques = 0; }, 4000);
    });
})();

// --- 7. EL MUÉRDAGO ---
// Tocarlo deja caer corazones y un vale por un beso.
(function muerdago() {
    const mistletoe = document.getElementById('mistletoe');
    if (!mistletoe) return;
    mistletoe.addEventListener('click', () => {
        mistletoe.classList.add('kissed');
        lluviaDeCorazones();
        setTimeout(() => {
            abrirSecreto(`
                <div class="coupon">
                    <p class="eyebrow">Estás bajo el muérdago</p>
                    <h3>Vale por un beso</h3>
                    <p class="quote">"Las reglas son las reglas: quien se para bajo el muérdago, se lleva un beso."</p>
                    <dl>
                        <div><dt>Para</dt><dd>Mariana</dd></div>
                        <div><dt>Válido</dt><dd>siempre</dd></div>
                        <div><dt>Canjes</dt><dd>ilimitados</dd></div>
                    </dl>
                </div>`);
        }, 900);
    });

    function lluviaDeCorazones() {
        const hearts = document.getElementById('hearts');
        if (!hearts || reduceMotion) return;
        const simbolos = ['❤', '♥', '❤', '✦'];
        for (let i = 0; i < 40; i++) {
            const h = document.createElement('span');
            h.className = 'heart';
            h.textContent = simbolos[i % simbolos.length];
            h.style.left = `${Math.random() * 100}vw`;
            h.style.fontSize = `${14 + Math.random() * 18}px`;
            h.style.animationDuration = `${4 + Math.random() * 4}s`;
            h.style.animationDelay = `${Math.random() * 2.5}s`;
            h.style.setProperty('--drift', `${-80 + Math.random() * 160}px`);
            h.addEventListener('animationend', () => h.remove());
            hearts.appendChild(h);
        }
    }
})();

// --- 8. LA CARTA A SANTA ---
// Escondida en la bota del centro.
(function cartaASanta() {
    const letter = document.getElementById('letter');
    if (!letter) return;
    letter.addEventListener('click', () => {
        abrirSecreto(`
            <div class="santa-letter">
                <p class="letter-head">Polo Norte · Diciembre</p>
                <h3>Querido Santa:</h3>
                <p>Este año me porté bien (casi siempre). No te voy a pedir nada,
                porque lo que más quería me lo diste antes de tiempo, y se llama Mariana.</p>
                <p>Solo te pido que la cuides, que nunca le falten risas, tacos de Beto
                ni abrazos míos. Y si te sobra espacio en el trineo, tráenos muchos
                días más como los nuestros.</p>
                <p class="letter-sign">Atentamente,<br>el niño más afortunado del mundo</p>
            </div>`);
    });
})();
