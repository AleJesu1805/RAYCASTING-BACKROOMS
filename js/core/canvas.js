// js/core/canvas.js
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

export const shadeCanvas = document.createElement('canvas');
export const shadeCtx = shadeCanvas.getContext('2d');

// OBJETO PARA LOS EFECTOS DE FEEDBACK

export const fx = { hue: 0, moveCamara: 0, bobTiempo: 0 };

// VARIABLES Y OBJETOS PARA LA DETECCION DE EVENTOS EN MOVILES

export const rangoDePresion = document.querySelector('.container-buttons');
export const joystick = document.getElementById('joystick');
export const ballJoystick = document.getElementById('ballJoystick');
export const touch = {
    inicioXDedo: 0, 
    inicioYDedo: 0,
    actXDedo: 0, 
    actYDedo: 0,
    desplazadoXDedo: 0, 
    desplazadoYDedo: 0,
};

export const resolucionRayos = 4;

export const imgPared = new Image();
imgPared.src = 'img/backrooms-textures-v0-3b0m6yqrjhk91.webp';

export const tamArma = 350;
export const imgArma = new Image();
imgArma.src = 'img/backrooms-textures-v0-3b0m6yqrjhk911111111111.webp';

export const FOV = 60;
canvas.width = 1280;
canvas.height = 720;
shadeCanvas.width = canvas.width;
shadeCanvas.height = canvas.height;

