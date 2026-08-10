export const imgArma = new Image();
imgArma.src = 'img/armas/imgArmaTrue.webp';

export const explosionArma = new Image();
explosionArma.src = 'img/armas/explosionArma.png';

export const imgPared3 = new Image();
imgPared3.src = 'img/paredesFuturistas/abstract-geometric-lite.webp';

export const imgPared2 = new Image();
imgPared2.src = 'img/paredesFuturistas/istockphoto-lite.webp';

export const imgPared1 = new Image();
imgPared1.src = 'img/paredesFuturistas/futuristic-geometric-metal-wall-lite.webp';

export const imgPared4 = new Image();
imgPared4.src = 'img/paredesFuturistas/photo-wall-texture-lite.webp';

export const imagenes = [imgArma, imgPared1, imgPared2, imgPared3, imgPared4];

export const sprite1 = new Image();
sprite1.src = 'img/enemigos/niñaEsfeluznante.png';

export const sprite2 = new Image();
sprite2.src = 'img/enemigos/enemie2.webp';

export const sprites = [sprite1, sprite2];



const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};

const worker = new Worker(new URL('../workers/worker.js', import.meta.url));

worker.onmessage = async (e) => {
    const { nombre, arrayBuffer, ok } = e.data;
    if (!ok) return;
    buffers[nombre] = await audioCtx.decodeAudioData(arrayBuffer);
};

function cargarSonido(nombre, url) {
    const urlAbsoluta = new URL(url, document.baseURI).href;
    worker.postMessage({ nombre, url: urlAbsoluta });
}

export function reproducirSonido(nombre) {
    if (!buffers[nombre]) return;
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[nombre];
    source.connect(audioCtx.destination);
    source.start(0);
}

cargarSonido('disparoAcierto', 'audio/DisparoComun (1).mp3');
cargarSonido('disparo', 'audio/disparoAcierto.mp3');

// iOS/Android exigen un gesto del usuario para desbloquear el audio
document.addEventListener('touchstart', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

