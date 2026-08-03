import { resolucionRayos } from "../core/canvas.js";

const expandirPantalla = document.getElementById('expandirPantalla');
const canvas = document.querySelector('canvas');
const pantallaStart = document.querySelector('.container-start');
const containerButtons = document.querySelector('.container-buttons');
const configSection = document.querySelector('.container-config');
const estadisticas = document.getElementById('estadisticas');

var configOpen = false;

function jugar() {
    canvas.style.display = 'block';
    pantallaStart.style.display = "none";
    estadisticas.removeAttribute('hidden');
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        containerButtons.removeAttribute('hidden');
    }
    try {
        document.documentElement.requestFullscreen();
        // expandirPantalla.innerHTML = 'MINIMIZAR PANTALLA';
        screen.orientation.lock('landscape');
    } catch (error) {
        console.error('Error al intentar rotar o entrar en pantalla completa:', error);
    }
}

function abrirConfig() {
    configOpen = !configOpen;
    if (configOpen) {
        configSection.style.opacity = 1;
        configSection.style.display = 'grid';
    }
    else {
        configSection.style.opacity = 0;
        configSection.style.display = 'none';
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

window.jugar = jugar;
window.abrirConfig = abrirConfig;
window.ampliar = ampliar;

