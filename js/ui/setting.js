const expandirPantalla = document.getElementById('expandirPantalla');
const canvas = document.querySelector('canvas');
const pantallaStart = document.querySelector('.container-start');
const containerButtons = document.querySelector('.container-buttons');
const configSection = document.querySelector('.container-config');
var configOpen = false;

function jugar() {
    canvas.removeAttribute('hidden');
    pantallaStart.style.display = "none";
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        containerButtons.removeAttribute('hidden');
    }
    try {
        document.documentElement.requestFullscreen();
        expandirPantalla.innerHTML = 'MINIMIZAR PANTALLA';
        screen.orientation.lock('landscape');
    } catch (error) {
        console.error('Error al intentar rotar o entrar en pantalla completa:', error);
    }
}

function abrirConfig() {
    configOpen = !configOpen;
    if (configOpen) {
        configSection.style.display = 'grid';
    }
    else {
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

if (document.fullscreenElement != null) {
    expandirPantalla.innerHTML = 'MAXIMIZAR PANTALLA';
}
else {
    expandirPantalla.innerHTML = 'MINIMIZAR PANTALLA';
}

