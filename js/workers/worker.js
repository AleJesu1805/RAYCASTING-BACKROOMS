const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};

async function cargarSonido(nombre, url) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    buffers[nombre] = await audioCtx.decodeAudioData(arrayBuffer);
}

export function reproducirSonido(nombre) {
    if (!buffers[nombre]) return;
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[nombre];
    source.connect(audioCtx.destination);
    source.start(0);
}

addEventListener('message', (e) => {
    cargarSonido('disparoAcierto', 'audio/DisparoComun (1).mp3');
    cargarSonido('disparo', 'audio/disparoAcierto.mp3');
    console.log(e);
});