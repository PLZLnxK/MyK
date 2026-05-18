// --- 1. PREMIUM CUSTOM CURSOR ---
const cursor = document.getElementById('premium-cursor');
const follower = document.getElementById('premium-cursor-follower');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Fast follow
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    
    // Slow follow
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    if (follower) follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    
    requestAnimationFrame(animateCursor);
}

// Only enable custom cursor if device has a pointer (mouse)
if (window.matchMedia("(pointer: fine)").matches) {
    animateCursor();
    
    // Hover effects for images and buttons
    const interactives = document.querySelectorAll('img, #music-player');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-active'));
    });
}

// --- 2. MINIMALIST COUNTER ---
function updateCounter() {
    const startDate = new Date("2024-07-21T00:00:00");
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const counterEl = document.getElementById('counter-value');
    if(counterEl) {
        counterEl.innerText = `${days} días de luz`;
    }
}
updateCounter();

// --- 3. INTERSECTION OBSERVER FOR FADE-IN ---
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: document.querySelector('.horizontal-scroll-container'),
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of slide is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find .fade-in elements inside the visible slide
                const fadeElements = entry.target.querySelectorAll('.fade-in');
                fadeElements.forEach(el => el.classList.add('is-visible'));
            } else {
                // Optional: remove class when out of view so it animates again
                // const fadeElements = entry.target.querySelectorAll('.fade-in');
                // fadeElements.forEach(el => el.classList.remove('is-visible'));
            }
        });
    }, observerOptions);

    // Observe all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        observer.observe(slide);
    });
});

// --- 2. MUSIC PLAYER ---
function toggleMusica() {
    const musica = document.getElementById('miMusica');
    const icono = document.getElementById('music-icon');
    const player = document.getElementById('music-player');

    if (musica.paused) {
        musica.play().then(() => {
            icono.innerText = '🎵 Playing';
            player.style.background = 'rgba(140, 154, 142, 0.2)'; // Sage green tint
            player.style.borderColor = 'rgba(140, 154, 142, 0.8)';
        }).catch(e => console.log("Waiting for user interaction..."));
    } else {
        musica.pause();
        icono.innerText = '🎵 Paused';
        player.style.background = 'rgba(248, 245, 242, 0.8)';
        player.style.borderColor = 'rgba(45, 48, 46, 0.2)';
    }
}