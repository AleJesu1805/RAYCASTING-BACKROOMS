import { reproducirSiguiente, reproducirSonido } from "../core/audio.js";
import { despausar, pausar, partidaTerminada } from "../main.js";
import { containerButtons, containerGameover } from "../core/canvas.js";

const configBoton = document.getElementById('configBoton');
const configSection = document.querySelector('.container-config');

if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    containerButtons.style.display = 'flex';
}
setTimeout(() => {
    reproducirSiguiente();
}, 500);

configBoton.addEventListener('pointerdown', () => {
    abrirConfig();
});

let configOpen = false;
function abrirConfig() {
    configOpen = !configOpen;
    reproducirSonido('boton');
    if (configOpen) {
        configSection.style.opacity = 1;
        configSection.style.display = 'grid';
        pausar();
    }
    else {
        configSection.style.opacity = 0;
        configSection.style.display = 'none';
        if (!partidaTerminada) {
            despausar();
        }
    }
}

function ampliar() {
    reproducirSonido('boton');
    if (document.fullscreenElement != null) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

function rotar() {
    reproducirSonido('boton');
    screen.orientation.lock('landscape');
}

window.abrirConfig = abrirConfig;
window.ampliar = ampliar;
window.rotar = rotar;

