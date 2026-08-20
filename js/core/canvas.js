export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

export const shadeCanvas = document.createElement('canvas');
export const shadeCtx = shadeCanvas.getContext('2d');

export const viewCanvas = document.createElement('canvas');
export const viewCtx = viewCanvas.getContext('2d');

export const fx = { hue: 0, moveCamara: 0, bobTiempo: 0 };

// VARIABLES Y OBJETOS PARA LA DETECCION DE EVENTOS EN MOVILES

export const containerButtons = document.querySelector('.container-buttons');
export const joystick = document.getElementById('joystick');
export const ballJoystick = document.getElementById('ballJoystick');
export const zonaDeslice = document.querySelectorAll('.zonaDeslice');
export const disparadores = document.querySelectorAll('.disparador');

export const containerGameover = document.querySelector('.container-gameover');

export const valorSalud = document.getElementById('valorSalud');
export const valorAsesinatos = document.getElementById('valorAsesinatos');

export const touch = {
    inicioXDedo: 0,
    inicioYDedo: 0,
    actXDedo: 0,
    actYDedo: 0,
    desplazadoXDedo: 0,
    desplazadoYDedo: 0,
    girandoCamara: false,
};

export const resolucionRayos = 7;
export const FOV = 60;
export const altoTile = 200;
export const zBuffer = new Array(Math.floor(canvas.width / resolucionRayos)).fill(Infinity);

canvas.width = 700;
canvas.height = 700;

shadeCanvas.width = canvas.width;
shadeCanvas.height = canvas.height;

viewCanvas.width = canvas.width;
viewCanvas.height = canvas.height;
