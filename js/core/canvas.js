"use strict";
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

export const shadeCanvas = document.createElement('canvas');
export const shadeCtx = shadeCanvas.getContext('2d');

// VARIABLES PARA LOS EFECTOS DE FEEDBACK

let hue = 0;
let moveCamara = 0;
let bobTiempo = 0;

// VARIABLES PARA LA DETECCION DE EVENTOS EN MOVILES

const rangoDePresion = document.querySelector('.container-buttons');
const joystick = document.getElementById('joystick');
const ballJoystick = document.getElementById('ballJoystick');

let inicioXDedo = 0;
let inicioYDedo = 0;

let actXDedo = 0;
let actYDedo = 0;

let desplazadoXDedo = 0;
let desplazadoYDedo = 0;

const resolucionRayos = 4;

const imgPared = new Image();
imgPared.src = '../img/backrooms-textures-v0-3b0m6yqrjhk91.webp';

const tamArma = 350;
const imgArma = new Image();
imgArma.src = '../img/backrooms-textures-v0-3b0m6yqrjhk911111111111.webp';

const FOV = 60;

shadeCanvas.width = canvas.width;
shadeCanvas.height = canvas.height;

const fps = 70;
const frameDuration = 1000 / fps;
let ultimoTiempo = 0;
function gameLoop(tiempoActual) {
    requestAnimationFrame(gameLoop);
    const delta = tiempoActual - ultimoTiempo;
    if (delta < frameDuration) return;
    ultimoTiempo = tiempoActual - (delta % frameDuration);

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    shadeCtx.clearRect(0, 0, shadeCanvas.width, shadeCanvas.height);
    if (player.avanzando !== 0) {
        bobTiempo += delta;
        moveCamara = Math.floor(Math.sin(bobTiempo / 100) * 10);
    } else {
        bobTiempo = 0;
        moveCamara = 0;
    }

    mapa.renderFondo();
    // mapa.renderMap();
    player.renderPlayer();
    mapa.renderMiniMap();

}
requestAnimationFrame(gameLoop);