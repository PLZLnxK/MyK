// --- 1. ANIMACIONES DE SCROLL (Intersection Observer) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Una vez animado, dejamos de observar para mejorar rendimiento
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Seleccionar elementos a animar (fotos y textos principales)
const hiddenElements = document.querySelectorAll('.polaroid, .main-container h1, .main-container p');
hiddenElements.forEach((el) => observer.observe(el));

// --- 2. CONFIGURACIÓN Y FRASES ---
const frasesDeFondo = [
    // 1-20: Romances Épicos y Fantasía
    "Incluso si el mundo entero se pusiera en nuestra contra, no me importaría, siempre y cuando estés a mi lado. - Pokémon",
    "Si pudiera pedir un deseo al universo, pediría que nuestras almas se encuentren en todas las vidas que tengamos. - Your Name",
    "Eres la razón por la que entiendo la palabra 'eternidad'. - Violet Evergarden",
    "Aunque el mundo se desmorone, mi amor por ti seguirá brillando más que cualquier estrella. - Sailor Moon",
    "Dicen que las estrellas son los ojos del universo cuidando a los amantes. Si es así, estamos muy protegidos. - Cardcaptor Sakura",
    "Nuestras almas fueron hechas de la misma materia estelar. - Sailor Moon",
    "No importa cuántas reencarnaciones pasen, siempre te encontraré. - Inuyasha",
    "Tu amor es la única constante en este universo caótico. - Inuyasha",
    "Aunque estemos en mundos diferentes, nuestros corazones laten al mismo ritmo. - Your Name",
    "Quiero ver el amanecer contigo en mil mundos diferentes. - Fruits Basket",
    "Eres la luna que ilumina mis noches oscuras. - Inuyasha",
    "El amor es la fuerza más poderosa del universo, y yo la siento por ti. - Sailor Moon",
    "Tú eres mi destino, mi principio y mi fin. - Naruto",
    "Contigo, el tiempo se detiene y el universo cobra sentido. - Fruits Basket",
    "Eres la estrella más brillante en mi cielo personal. - Cardcaptor Sakura",
    "Nuestro amor es una obra de arte pintada en el lienzo del cielo. - Sailor Moon",
    "Contigo, cada día es una nueva aventura cósmica. - Dragon Ball",
    "Eres mi refugio seguro en medio de la tormenta espacial. - Macross",
    "La distancia no importa cuando dos corazones están unidos. - Naruto",
    "Eres la luz que disipa mi oscuridad. - Inuyasha",

    // 21-40: Intensas y Dramáticas
    "Te amaré hasta que la última estrella se apague. - Violet Evergarden",
    "Eres la persona que le da color a mi mundo en blanco y negro. - Your Lie in April",
    "No puedo imaginar un futuro donde tú no estés. - Clannad",
    "Tu sonrisa es mi motor, tu mirada mi guía. - Naruto",
    "Eres la pieza que le faltaba a mi rompecabezas. - Evangelion",
    "Contigo, la vida es bella, incluso en los momentos difíciles. - Clannad",
    "Eres mi pensamiento favorito, mi sueño más dulce. - Kaichou wa Maid-sama!",
    "Te quiero más allá de la razón, más allá de la lógica. - Steins;Gate",
    "Eres la casualidad más bonita que me ha pasado. - Toradora!",
    "Nuestro amor es un fuego que nunca se apaga. - Inuyasha",
    "Te elegiría a ti una y mil veces más. - Clannad",
    "Tu voz es la melodía que calma mi alma. - Kimi ni Todoke",
    "Eres mi refugio en la tormenta, mi calma en el caos. - Naruto",
    "No te quiero para mí, te quiero conmigo. - Toradora!",
    "Eres la magia que necesitaba mi vida. - Cardcaptor Sakura",
    "Cada momento contigo es un tesoro. - Fruits Basket",
    "Tu amor me hace volar, me hace sentir invencible. - Dragon Ball",
    "Eres la casualidad más bonita que llegó a mi vida. - Clannad",
    "Nuestro amor es un sueño hecho realidad. - Sailor Moon",
    "Eres mi alma gemela, mi complemento perfecto. - Fruits Basket",

    // 41-60: Aventura y Lealtad
    "Juntos por siempre, incluso si tenemos que robar corazones en el camino. - Pokémon",
    "Eres mi compañero de aventuras, mi cómplice en todo. - Inuyasha",
    "Tú eres mi meta. Voy a seguir esforzándome para ser una mejor versión de mí misma. - Pokémon",
    "Contigo, el mundo es más divertido, más emocionante. - Dragon Ball",
    "Eres la energía que necesito para ganar todas mis batallas. - Naruto",
    "Juntos somos invencibles. - Sailor Moon",
    "Eres la chispa que ilumina mi vida. - Pokémon",
    "Contigo, cada día es una nueva misión por cumplir. - Sword Art Online",
    "Eres mi tesoro legendario, único y especial. - One Piece",
    "Siempre a tu lado, pase lo que pase. - Inuyasha",
    "Eres la aventura más grande de mi vida. - Dragon Ball",
    "Contigo, no tengo miedo de explorar lo desconocido. - Sword Art Online",
    "Eres la guía favorita, la que me ayuda a ser mejor. - Naruto",
    "Juntos hasta el fin del mundo. - Sailor Moon",
    "Eres la fuerza que me impulsa a seguir adelante. - Dragon Ball",
    "Contigo, cada obstáculo es una oportunidad para crecer. - Naruto",
    "Eres mi amuleto de la suerte, el que me protege. - Cardcaptor Sakura",
    "Juntos contra viento y marea. - One Piece",
    "Eres la razón por la que valió la pena esperar. - Violet Evergarden",
    "Contigo, el futuro es brillante y emocionante. - Dragon Ball",

    // 61-80: Cortas y Directas
    "Te amo. - Clannad",
    "Eres mi todo. - Fruits Basket",
    "Contigo soy feliz. - Toradora!",
    "Eres mi sol. - Sailor Moon",
    "Mi vida eres tú. - Naruto",
    "Te adoro. - Cardcaptor Sakura",
    "Eres mi sueño. - Inuyasha",
    "Siempre juntos. - Sword Art Online",
    "Eres especial. - Fruits Basket",
    "Te necesito. - Evangelion",
    "Eres mi refugio. - Naruto",
    "Mi amor eres tú. - Kimi ni Todoke",
    "Eres mi magia. - Cardcaptor Sakura",
    "Contigo todo. - Dragon Ball",
    "Eres mi vida. - Violet Evergarden",
    "Te quiero. - Clannad",
    "Eres mi paz. - Fruits Basket",
    "Siempre tuyo. - Inuyasha",
    "Eres mi cielo. - Sailor Moon",
    "Contigo, amor. - Naruto",

    // 81-100: Destino y Conexión
    "Nuestras almas están entrelazadas por el destino. - Fruits Basket",
    "Somos dos mitades de un mismo corazón. - Sailor Moon",
    "Nuestro amor estaba escrito en las estrellas. - Cardcaptor Sakura",
    "Estamos destinados a estar juntos. - Inuyasha",
    "Nuestro amor es un viaje eterno. - Violet Evergarden",
    "Somos dos almas gemelas destinadas a encontrarse. - Naruto",
    "Nuestro amor es un lazo que nunca se romperá. - Fruits Basket",
    "Estamos unidos por el hilo rojo del destino. - Naruto",
    "Nuestro amor es una historia sin fin. - Inuyasha",
    "Estamos hechos el uno para el otro. - Clannad",
    "Nuestro amor es un regalo del universo. - Sailor Moon",
    "Estamos destinados a brillar juntos. - Dragon Ball",
    "Nuestro amor es un pacto eterno. - Inuyasha",
    "Estamos unidos por el amor verdadero. - Violet Evergarden",
    "Nuestro amor es un milagro. - Clannad",
    "Estamos destinados a ser felices. - Fruits Basket",
    "Nuestro amor es un tesoro. - One Piece",
    "Estamos unidos por la eternidad. - Naruto",
    "Nuestro amor es un sueño eterno. - Sailor Moon",
    "Estamos destinados a amarnos siempre. - Fruits Basket"
];

// --- 3. FUNCIONES DE CARGA Y GESTIÓN DE FRASES ---
function iniciarCicloFrases() {
    const contenedor = document.getElementById('background-phrases');
    if(!contenedor) return;

    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;
    const esMovil = anchoPantalla < 600;

    // Seleccionar 20 frases al azar de la lista total
    const frasesSeleccionadas = frasesDeFondo
        .sort(() => 0.5 - Math.random())
        .slice(0, 13);

    let rectsOcupados = [];

    // Crear y posicionar las 20 frases inicialmente
    frasesSeleccionadas.forEach(texto => {
        const span = document.createElement('span');
        span.className = 'bg-phrase';
        span.innerText = texto;
        contenedor.appendChild(span);

        // Ajustar tamaños según dispositivo
        const anchoFrase = span.offsetWidth + (esMovil ? 20 : 40);
        const altoFrase = span.offsetHeight + (esMovil ? 20 : 40);

        let posValida = false;
        let intentos = 0;
        let x, y;
        
        // Áreas seguras para no tapar el centro (más restrictivo)
        const margenX = esMovil ? 0.4 : 0.3; 
        const margenY = esMovil ? 0.35 : 0.25;

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
            span.style.left = `${x}px`;
            span.style.top = `${y}px`;
            span.style.transform = `rotate(${rotacion}deg)`;
            span.style.opacity = "1"; // Visibles inicialmente
        } else {
            span.remove(); 
        }
    });

    // Efecto de cambio automático cada 15 segundos
    setInterval(() => {
        const frasesActuales = contenedor.querySelectorAll('.bg-phrase');
        if (frasesActuales.length === 0) return;

        // Seleccionar una frase al azar para cambiar
        const indiceAleatorio = Math.floor(Math.random() * frasesActuales.length);
        const fraseAModificar = frasesActuales[indiceAleatorio];

        // Efecto desaparición (basado en transición CSS)
        fraseAModificar.style.opacity = "0";

        // Esperar a que desaparezca, cambiar texto y reaparecer
        setTimeout(() => {
            const nuevaFrase = frasesDeFondo[Math.floor(Math.random() * frasesDeFondo.length)];
            fraseAModificar.innerText = nuevaFrase;
            fraseAModificar.style.opacity = "1";
        }, 1000); // Duración de la transición de opacidad

    }, 10000); // 15 segundos
}

// --- 4. CORAZONES FONDO (Lluvia) ---
function crearCorazon() {
    // Límite de corazones para no saturar la CPU
    if (document.querySelectorAll('.corazon-flotante').length > 50) return;

    const corazon = document.createElement('div');
    corazon.innerHTML = '❤️';
    corazon.className = 'corazon-flotante';
    
    // Posición inicial: aleatoria en ancho, justo arriba de la pantalla
    corazon.style.left = Math.random() * 100 + 'vw';
    corazon.style.top = '-5vh';
    
    // Tamaño aleatorio para dar profundidad
    corazon.style.fontSize = (Math.random() * 15 + 10) + 'px';
    
    // Duración de caída aleatoria (entre 8s y 15s)
    const duracion = Math.random() * 7 + 8;
    corazon.style.animationDuration = duracion + 's';
    
    document.body.appendChild(corazon);

    // Eliminar el elemento después de que termine la animación
    setTimeout(() => {
        corazon.remove();
    }, duracion * 1000);
}

// Crear un corazón nuevo cada 400ms
setInterval(crearCorazon, 400);

// --- 5. MÚSICA Y MODAL ---
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

// MODAL CON CONFETI
function abrirCarta() {
    document.getElementById('modal-carta').style.display = 'flex';

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 }, // Ajustamos el origen un poco más arriba
        colors: ['#ff4d4d', '#c9184a', '#ffb3b3'],
        shapes: ['heart'],
        scalar: 1.5,
        zIndex: 10000 // Forzamos z-index aquí también por seguridad
    });
}

function cerrarCarta() { document.getElementById('modal-carta').style.display = 'none'; }

// --- 6. CONTADOR DE TIEMPO ---
function actualizarContador() {
    const fechaInicio = new Date("2024-07-21T00:00:00");
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

// --- 7. CLICK CORAZONES ---
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

// --- 8. INICIALIZACIÓN ---
window.onload = () => {
    iniciarCicloFrases(); // <--- LLAMADA MODIFICADA
    actualizarContador();
    setInterval(actualizarContador, 1000); 

    // Ocultar preloader
    setTimeout(() => {
        const loader = document.getElementById('preloader');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 2000);
};

// --- 9. LIGHTBOX FOTOS ---
document.querySelectorAll('.polaroid').forEach(item => {
    item.addEventListener('click', function() {
        const imgPath = this.querySelector('img').src;
        const captionText = this.querySelector('.caption').innerText;
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCap = document.getElementById('lightbox-caption');
        
        if(lightbox && lightboxImg && lightboxCap) {
            lightboxImg.src = imgPath;
            lightboxCap.innerText = captionText;
            lightbox.classList.add('active');
        }
    });
});

// Cerrar lightbox al hacer clic en él
document.getElementById('lightbox')?.addEventListener('click', function() {
    this.classList.remove('active');
});