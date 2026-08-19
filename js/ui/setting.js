import { reproducirSiguiente } from "../core/audio.js";
import { despausar, pausar } from "../main.js";

const expandirPantalla = document.getElementById('expandirPantalla');
const canvas = document.querySelector('canvas');
const pantallaStart = document.querySelector('.container-start');
const containerButtons = document.querySelector('.container-buttons');
const configSection = document.querySelector('.container-config');
const estadisticas = document.getElementById('estadisticas');

const inputMusica = document.getElementById('musica');
const inputEfectos = document.getElementById('efectos');
const inputs = [inputMusica, inputEfectos];

const elementos = document.querySelectorAll('.hidden');

var configOpen = false;
async function jugar() {
    document.activeElement.blur();
    reproducirSiguiente();
    elementos.forEach(el => {
        el.classList.remove('hidden');
    });
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        containerButtons.removeAttribute('hidden');
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
    if (configOpen) {
        configSection.style.opacity = 1;
        configSection.style.display = 'grid';
        pausar();
    }
    else {
        configSection.style.opacity = 0;
        configSection.style.display = 'none';
        despausar();
    }
}

function ampliar() {
    if (document.fullscreenElement != null) {
        document.exitFullscreen();
    }
    else {
        document.documentElement.requestFullscreen();
    }
}

function rotar() {
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

