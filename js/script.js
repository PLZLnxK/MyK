const frasesDeFondo = [
    "Andábamos sin buscarnos, pero sabiendo que andábamos para encontrarnos. — Cortázar",
    "Te amo como se aman ciertas cosas oscuras, en secreto. — Neruda",
    "Si tú fueras un sueño, no querría despertar jamás.",
    "Donde no puedas amar, no te demores. — Frida Kahlo",
    "Para mi corazón basta tu pecho, para tu libertad bastan mis alas. — Neruda",
    "Tú eres la respuesta a todas mis oraciones.",
    "Estábamos, estamos, estaremos juntos. — Cortázar",
    "Ven a dormir conmigo: no haremos el amor, él nos hará. — Cortázar",
    "Sé que voy a quererte sin preguntas.",
    "Tus ojos son el lugar donde quiero vivir.",
    "Eres mi hoy y todos mis mañanas.",
    "Te quiero no por quien eres, sino por quien soy cuando estoy contigo."
];

let rectsOcupados = [];

function cargarFrases() {
    const contenedor = document.getElementById('background-phrases');
    if(!contenedor) return;

    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;
    const esMovil = anchoPantalla < 600;

    const frasesAjustadas = esMovil ? frasesDeFondo.slice(0, 5) : frasesDeFondo;

    rectsOcupados = [];

    frasesAjustadas.forEach(texto => {
        const span = document.createElement('span');
        span.className = 'bg-phrase';
        span.innerText = texto;
        contenedor.appendChild(span);

        const anchoFrase = span.offsetWidth + (esMovil ? 30 : 40);
        const altoFrase = span.offsetHeight + (esMovil ? 30 : 40);

        let posValida = false;
        let intentos = 0;
        let x, y;

        const margenX = esMovil ? 0.35 : 0.25; 
        const margenY = esMovil ? 0.30 : 0.25;

        while (!posValida && intentos < 200) {
            x = Math.random() * (anchoPantalla - anchoFrase);
            y = Math.random() * (altoPantalla - altoFrase);

            const enCentroX = x > anchoPantalla * (0.5 - margenX) && x < anchoPantalla * (0.5 + margenX);
            const enCentroY = y > altoPantalla * (0.5 - margenY) && y < altoPantalla * (0.5 + margenY);

            if (!(enCentroX && enCentroY)) {
                const colision = rectsOcupados.some(r => {
                    return !(x + anchoFrase < r.x || x > r.x + r.w || y + altoFrase < r.y || y > r.y + r.h);
                });

                if (!colision) {
                    posValida = true;
                    rectsOcupados.push({ x: x, y: y, w: anchoFrase, h: altoFrase });
                }
            }
            intentos++;
        }

        if (posValida) {
            const rotacion = (Math.random() - 0.5) * (esMovil ? 10 : 20);
            span.dataset.rotation = rotacion;
            span.style.left = `${x}px`;
            span.style.top = `${y}px`;
            span.style.transform = `rotate(${rotacion}deg)`;
            span.style.opacity = "1";
        } else {
            span.remove(); 
        }
    });
}

// PARALLAX
document.addEventListener('mousemove', (e) => {
    moverFrases(e.pageX, e.pageY);
});

document.addEventListener('touchmove', (e) => {
    moverFrases(e.touches[0].pageX, e.touches[0].pageY);
});

function moverFrases(inputX, inputY) {
    const frases = document.querySelectorAll('.bg-phrase');
    const esMovil = window.innerWidth < 600;
    const divisor = esMovil ? 60 : 40; 

    const moveX = (window.innerWidth / 2 - inputX) / divisor;
    const moveY = (window.innerHeight / 2 - inputY) / divisor;

    frases.forEach((frase) => {
        const rot = frase.dataset.rotation || 0;
        frase.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rot}deg)`;
    });
}

// CORAZONES FONDO
function crearCorazon() {
    const corazon = document.createElement('div');
    corazon.innerHTML = '❤️';
    corazon.className = 'corazon-flotante';
    corazon.style.position = 'fixed';
    corazon.style.left = Math.random() * 100 + 'vw';
    corazon.style.top = '100vh';
    corazon.style.fontSize = (Math.random() * 15 + 10) + 'px';
    corazon.style.opacity = Math.random() * 0.4;
    corazon.style.zIndex = '0';
    corazon.style.pointerEvents = 'none';
    corazon.style.transition = 'transform 6s linear';
    
    document.body.appendChild(corazon);

    setTimeout(() => {
        corazon.style.transform = `translateY(-110vh) rotate(${Math.random() * 360}deg)`;
    }, 50);

    setTimeout(() => { corazon.remove(); }, 6000);
}

setInterval(crearCorazon, 800);

// MÚSICA
function toggleMusica() {
    const musica = document.getElementById('miMusica');
    const icono = document.getElementById('music-icon');
    const contenedor = document.getElementById('music-container');

    if (musica.paused) {
        musica.play().catch(e => console.log("Esperando interacción..."));
        icono.innerText = '🎵';
        contenedor.classList.add('playing');
    } else {
        musica.pause();
        icono.innerText = '🔇';
        contenedor.classList.remove('playing');
    }
}

// SCROLL FOTOS
function checkScroll() {
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach(p => {
        const rect = p.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            p.style.opacity = "1";
            p.style.transform = p.style.transform.replace('translateY(50px)', 'translateY(0)');
        }
    });
}

// CONTADOR
function actualizarContador() {
    const fechaInicio = new Date("2024-07-21T00:00:00"); // <--- AQUI LA FECHA
    const ahora = new Date();
    const dif = ahora - fechaInicio;

    const dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    const horas = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));

    const elemento = document.getElementById('tiempo-transcurrido');
    if(elemento) {
        elemento.innerText = `${dias}d ${horas}h ${minutos}m juntos ❤️`;
    }
}

// MODAL
function abrirCarta() { document.getElementById('modal-carta').style.display = 'flex'; }
function cerrarCarta() { document.getElementById('modal-carta').style.display = 'none'; }

// CLICK CORAZONES
document.addEventListener('click', (e) => {
    // Evitar corazones si se hace click en el boton de musica
    if(e.target.closest('.music-control')) return;

    const clickCorazon = document.createElement('div');
    clickCorazon.innerHTML = '❤️';
    clickCorazon.style.position = 'fixed';
    clickCorazon.style.left = (e.clientX - 10) + 'px';
    clickCorazon.style.top = (e.clientY - 10) + 'px';
    clickCorazon.style.fontSize = '20px';
    clickCorazon.style.pointerEvents = 'none';
    clickCorazon.style.zIndex = '9999';
    clickCorazon.style.animation = 'floatUp 1s ease-out forwards';
    document.body.appendChild(clickCorazon);
    
    setTimeout(() => clickCorazon.remove(), 1000);
});

// EVENTOS
window.addEventListener('scroll', checkScroll);
window.onload = () => {
    cargarFrases();
    checkScroll();
    actualizarContador();
    setInterval(actualizarContador, 1000); 

    setTimeout(() => {
        const loader = document.getElementById('preloader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 2000);
};

// LIGHTBOX FOTOS
document.querySelectorAll('.polaroid').forEach(item => {
    item.addEventListener('click', function() {
        const imgPath = this.querySelector('img').src;
        const captionText = this.querySelector('.caption').innerText;
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCap = document.getElementById('lightbox-caption');
        
        lightboxImg.src = imgPath;
        lightboxCap.innerText = captionText;
        lightbox.classList.add('active');
    });
});