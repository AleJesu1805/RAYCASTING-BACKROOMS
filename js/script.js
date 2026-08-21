if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};

async function cargarSonido(nombre, url) {
    try {
        const urlAbsoluta = new URL(url, document.baseURI).href;
        const respuesta = await fetch(urlAbsoluta);

        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar el sonido: ${respuesta.status}`);
        }

        const arrayBuffer = await respuesta.arrayBuffer();
        buffers[nombre] = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (error) {
        console.error(`Error cargando el sonido "${nombre}":`, error);
    }
}

function reproducirSonido(nombre) {
    const buffer = buffers[nombre];

    if (!buffer) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
}
cargarSonido('boton', 'audio/boton.mp3');

document.addEventListener('touchstart', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });

document.querySelector('#linkGame').addEventListener('pointerdown', () => {
    screen.orientation.lock('landscape');
    document.documentElement.requestFullscreen();
});