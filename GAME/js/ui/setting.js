import { reproducirSiguiente, reproducirSonido } from "../core/audio.js";
import { despausar, pausar, partidaTerminada } from "../main.js";
import { containerButtons, containerGameover } from "../core/canvas.js";

const configBoton = document.getElementById('configBoton');
const configSection = document.querySelector('.container-config');

const rotarBtn = document.getElementById('rotar');
const maximizarBtn = document.getElementById('maximizar');

if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    containerButtons.style.display = 'flex';
    screen.orientation.lock('landscape');
}
setTimeout(() => {
    reproducirSiguiente();
}, 500);

configBoton.addEventListener('pointerdown', () => {
    abrirConfig();
});

rotarBtn.addEventListener('pointerdown', () => {
    rotar();
});

maximizarBtn.addEventListener('pointerdown', () => {
    maximizar();
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

function maximizar() {
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
window.maximizar = maximizar;
window.rotar = rotar;

