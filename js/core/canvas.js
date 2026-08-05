// import { mapa } from "./js/main.js";

// js/core/canvas.js
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

export const shadeCanvas = document.createElement('canvas');
export const shadeCtx = shadeCanvas.getContext('2d');

export const viewCanvas = document.createElement('canvas');
export const viewCtx = viewCanvas.getContext('2d');

export const fx = { hue: 0, moveCamara: 0, bobTiempo: 0 };

// VARIABLES Y OBJETOS PARA LA DETECCION DE EVENTOS EN MOVILES

export const rangoDePresion = document.querySelector('.container-buttons');
export const joystick = document.getElementById('joystick');
export const ballJoystick = document.getElementById('ballJoystick');
export const zonaDeslice = document.getElementById('zonaDeslice');
export const disparador = document.querySelector('.disparador');

export const touch = {
    inicioXDedo: 0,
    inicioYDedo: 0,
    actXDedo: 0,
    actYDedo: 0,
    desplazadoXDedo: 0,
    desplazadoYDedo: 0,
    girandoCamara: false,
};

export const resolucionRayos = 2;
export const FOV = 60;
export const altoTile = 200;
export const zBuffer = new Array(Math.floor(canvas.width / resolucionRayos)).fill(Infinity);

canvas.width = 700;
canvas.height = 700;

shadeCanvas.width = canvas.width;
shadeCanvas.height = canvas.height;

viewCanvas.width = canvas.width;
viewCanvas.height = canvas.height;
