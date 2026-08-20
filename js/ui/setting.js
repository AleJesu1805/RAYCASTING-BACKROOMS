import { reproducirSiguiente, reproducirSonido } from "../core/audio.js";
import { despausar, pausar, partidaTerminada } from "../main.js";
import { containerButtons, containerGameover } from "../core/canvas.js";

const expandirPantalla = document.getElementById('expandirPantalla');
const canvas = document.querySelector('canvas');
const pantallaStart = document.querySelector('.container-start');
const configSection = document.querySelector('.container-config');

const inputMusica = document.getElementById('musica');
const inputEfectos = document.getElementById('efectos');
export const inputs = [inputMusica, inputEfectos];

const elementos = document.querySelectorAll('.hidden');

let configOpen = false;
let inGame = false;
async function jugar() {
    inGame = true;
    document.activeElement.blur();
    reproducirSonido('boton');
    containerGameover.style.display = 'none';
    setTimeout(() => {
        reproducirSiguiente();
    }, 500);
    elementos.forEach(el => {
        el.classList.remove('hidden');
    });
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        containerButtons.style.display = 'flex';
        document.documentElement.requestFullscreen();
    }
    try {
        await screen.orientation.lock('landscape');
    } catch (error) {
        console.error('Error al intentar rotar o entrar en pantalla completa:', error);
    }
}

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
        if (inGame && (partidaTerminada)) {
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

inputs.forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    const text = label.textContent;
    label.textContent = `${text} ${input.value}%`;
    input.addEventListener('input', () => {
        label.textContent = `${text} ${input.value}%`;
    });
});

window.jugar = jugar;
window.abrirConfig = abrirConfig;
window.ampliar = ampliar;
window.rotar = rotar;

