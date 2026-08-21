export const musics = {
    1: '../audio/GRINDCORE/Days Spent - _Best Wishes_(MP3_160K).mp3',
    5: '../audio/GRINDCORE/SPEED - NOT THAT NICE (OFFICIAL MOVIE)(MP3_160K).mp3',
    2: '../audio/GRINDCORE/Scowl - Bloodhound (Official Music Video)(MP3_160K).mp3',
    3: '../audio/GRINDCORE/Scar The Martyr - Blood Host [OFFICIAL VIDEO](MP3_160K).mp3',
    4: '../audio/GRINDCORE/Befouled Tongue - Between The Realms - feat. CJ McCreery (Official Video)(MP3_160K).mp3',
}
const arrMusic = [];

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

cargarSonido('disparoAcierto', '../audio/DisparoComun.mp3');
cargarSonido('disparo', '../audio/disparoAcierto.mp3');
cargarSonido('boton', '../audio/boton.mp3');
cargarSonido('daño', '../audio/hitHurt.wav');

document.addEventListener('touchstart', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });

for (const [sound, src] of Object.entries(musics)) {
    const music = new Audio();
    music.src = src;
    arrMusic.push(music);
}

let indice = 0;

export function reproducirSiguiente() {
    if (indice >= arrMusic.length) return;
    const audio = arrMusic[indice];
    audio.currentTime = 0;
    audio.onended = () => {
        indice++;
        reproducirSiguiente();
    };
    audio.play();
    audio.volume = 0.2;
}