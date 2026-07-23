"use strict";
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const shadeCanvas = document.createElement('canvas');
const shadeCtx = shadeCanvas.getContext('2d');

// VARIABLES PARA LOS EFECTOS DE FEEDBACK

let hue = 0;
let moveCamara = 0;
let bobTiempo = 0;

// VARIABLES PARA LA DETECCION DE EVENTOS EN MOVILES

const rangoDePresion = document.querySelector('.container-buttons');
const ballJoystick = document.getElementById('ballJoystick');

let inicioXDedo = 0;
let inicioYDedo = 0;

let actXDedo = 0;
let actYDedo = 0;

let desplazadoXDedo = 0;
let desplazadoYDedo = 0;

const resolucionRayos = 10;

const imgPared = new Image();
imgPared.src = 'img/backrooms-textures-v0-3b0m6yqrjhk91.webp';

const tamArma = 350;
const imgArma = new Image();
imgArma.src = 'img/backrooms-textures-v0-3b0m6yqrjhk911111111111.webp';

const FOV = 60;


const matriz = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

class Map {
    constructor(ctx, player) {
        this.anchM = matriz[0].length;
        this.altM = matriz.length;
        this.tamCelda = Math.floor(Math.min(canvas.width / this.anchM, canvas.height / this.altM));
        this.colorPared = `hsl(55, 66%, 25%)`;
        this.colorEspacio = '#572020';
        this.ctx = ctx;
        this.miniCelda = this.tamCelda - 10;
        this.player = player;
    }
    renderMap() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                if (matriz[y][x] === 1) {
                    ctx.fillStyle = this.colorPared;
                } else {
                    ctx.fillStyle = this.colorEspacio;
                }
                ctx.fillRect(x * this.tamCelda, y * this.tamCelda, this.tamCelda, this.tamCelda);
            }
        }
    }

    renderMiniMap() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                if (matriz[y][x] === 1) {
                    ctx.fillStyle = this.colorPared;
                } else {
                    ctx.fillStyle = this.colorEspacio;
                }
                ctx.fillRect(x * this.miniCelda, y * this.miniCelda, this.miniCelda, this.miniCelda);
            }
        }
        var escala = this.miniCelda / this.tamCelda;
        var miniX = player.posXPlayer * escala;
        var miniY = player.posYPlayer * escala;

        var xDestino = miniX + Math.cos(player.angulo) * (50 * escala);
        var yDestino = miniY + Math.sin(player.angulo) * (50 * escala);

        this.ctx.beginPath();
        this.ctx.moveTo(miniX, miniY);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();

        this.ctx.fillStyle = '#1a551e';
        this.ctx.fillRect(miniX - 2, miniY - 2, 4, 4);

        ctx.drawImage(imgArma, canvas.width / 2 - tamArma / 2, canvas.height - tamArma / 1.69 + moveCamara, tamArma, tamArma / 1.5);

        ctx.beginPath();
        ctx.arc(canvas.width / 2 - this.miniCelda / 1, canvas.height / 2, this.miniCelda, 0, Math.PI * 2);
        ctx.strokeStyle = '#a20606';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    renderFondo() {
        // SUELO
        this.ctx.fillStyle = '#5c5836';
        this.ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        // TECHO
        this.ctx.fillStyle = '#b4b236';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    }

    colision(x, y) {
        if (y < 0 || y >= this.altM || x < 0 || x >= this.anchM) {
            return true;
        }
        var choca = false;
        if (matriz[y][x] != 0)
            choca = true;
        return choca;
    }
}

function normalizaAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);
    if (angulo < 0) {
        angulo = (2 * Math.PI) + angulo;
    }
    return angulo;
}

function distanciaEntrePuntos(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function convierteRadianes(angulo) {
    angulo = angulo * (Math.PI / 180);
    return angulo;
}

class Rayo {
    constructor(ctx, escenario, x, y, angulo, incrementoAngulo, columna) {
        this.ctx = ctx;
        this.escenario = escenario;
        this.x = x;
        this.y = y;
        this.angulo = angulo;
        this.incrementoAngulo = incrementoAngulo;
        this.columna = columna;
        this.distancia = 0;

        this.wallHitX = 0;
        this.wallHitY = 0;

        this.wallHitXHorizontal = 0;
        this.wallHitYHorizontal = 0;

        this.wallHitXVertical = 0;
        this.wallHitYVertical = 0;

        this.pixelTextura = 0;
    }

    setAngulo(angulo) {
        this.anguloJugador = angulo;
        this.angulo = normalizaAngulo(angulo + this.incrementoAngulo);
    }

    cast() {
        this.xIntercept = 0;
        this.yIntercept = 0;

        this.abajo = false;
        this.izquierda = false;

        if (this.angulo < Math.PI) this.abajo = true;
        if (this.angulo > Math.PI / 2 && this.angulo < 3 * Math.PI / 2) this.izquierda = true;

        // COLISIONES DEL RAYO

        //HORIZONTAL
        let colisionHorizontal = false;

        this.yIntercept = Math.floor(this.y / this.escenario.tamCelda) * this.escenario.tamCelda;
        if (this.abajo) this.yIntercept += this.escenario.tamCelda;

        let catetoAdyacente = (this.yIntercept - this.y) / Math.tan(this.angulo);
        this.xIntercept = this.x + catetoAdyacente;

        var siguienteXHorizontal = this.xIntercept;
        var siguienteYHorizontal = this.yIntercept;

        this.yStep = this.escenario.tamCelda;
        this.xStep = this.yStep / Math.tan(this.angulo);

        if (!this.abajo) this.yStep = -this.yStep;
        if ((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0)) this.xStep = -this.xStep;
        if (!this.abajo) siguienteYHorizontal--;

        while (!colisionHorizontal && siguienteXHorizontal >= 0 && siguienteXHorizontal < canvas.width && siguienteYHorizontal >= 0 && siguienteYHorizontal < canvas.height) {
            let casillaX = Math.floor(siguienteXHorizontal / this.escenario.tamCelda);
            let casillaY = Math.floor(siguienteYHorizontal / this.escenario.tamCelda);

            if (this.escenario.colision(casillaX, casillaY)) {
                colisionHorizontal = true;
                this.wallHitXHorizontal = siguienteXHorizontal;
                this.wallHitYHorizontal = siguienteYHorizontal;
            } else {
                siguienteXHorizontal += this.xStep;
                siguienteYHorizontal += this.yStep;
            }
        }

        //VERTICAL
        var colisionVertical = false;

        this.xIntercept = Math.floor(this.x / this.escenario.tamCelda) * this.escenario.tamCelda;

        if (!this.izquierda) this.xIntercept += this.escenario.tamCelda;

        let catetoOpuesto = (this.xIntercept - this.x) * Math.tan(this.angulo);
        this.yIntercept = this.y + catetoOpuesto;

        var siguienteXVertical = this.xIntercept;
        var siguienteYVertical = this.yIntercept;

        this.xStep = this.escenario.tamCelda;
        this.yStep = this.escenario.tamCelda * Math.tan(this.angulo);

        if (this.izquierda) this.xStep = -this.xStep;
        if ((!this.abajo && this.yStep > 0) || (this.abajo && this.yStep < 0)) this.yStep = -this.yStep;
        if (this.izquierda) siguienteXVertical--;

        while (!colisionVertical && siguienteXVertical >= 0 && siguienteXVertical < canvas.width && siguienteYVertical >= 0 && siguienteYVertical < canvas.height) {

            let casillaX = Math.floor(siguienteXVertical / this.escenario.tamCelda);
            let casillaY = Math.floor(siguienteYVertical / this.escenario.tamCelda);

            if (this.escenario.colision(casillaX, casillaY)) {
                colisionVertical = true;
                this.wallHitXVertical = siguienteXVertical;
                this.wallHitYVertical = siguienteYVertical;
            }

            else {
                siguienteXVertical += this.xStep;
                siguienteYVertical += this.yStep;
            }
        }

        var distanciaHorizontal = 9999;
        var distanciaVertical = 9999;

        if (colisionHorizontal) {
            distanciaHorizontal = distanciaEntrePuntos(this.x, this.y, this.wallHitXHorizontal, this.wallHitYHorizontal);
        }

        if (colisionVertical) {
            distanciaVertical = distanciaEntrePuntos(this.x, this.y, this.wallHitXVertical, this.wallHitYVertical);
        }

        if (distanciaHorizontal < distanciaVertical) {
            this.wallHitX = this.wallHitXHorizontal;
            this.wallHitY = this.wallHitYHorizontal;
            this.distancia = distanciaHorizontal;

            this.pixelTextura = this.wallHitX - Math.floor(this.wallHitX / mapa.tamCelda) * mapa.tamCelda;
        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
            this.distancia = distanciaVertical;

            this.pixelTextura = this.wallHitY - Math.floor(this.wallHitY / mapa.tamCelda) * mapa.tamCelda;
        }

        this.pixelTextura = Math.floor((this.pixelTextura / mapa.tamCelda) * imgPared.width);

        // CORRECCION OJO DE PEZ
        this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));
    }

    renderPared() {
        // PARED
        this.cast();
        let altoTile = 200;
        let distanciaPlanoProyeccion = (canvas.width / 2) / Math.tan(FOV / 2);
        let altoMuro = altoTile / this.distancia * distanciaPlanoProyeccion;
        var y0 = canvas.height / 2 - altoMuro / 2 + moveCamara;
        var y1 = y0 + altoMuro;
        var x = this.columna * resolucionRayos;

        this.ctx.drawImage(
            imgPared,
            this.pixelTextura,
            0,
            1,
            imgPared.height,
            x,
            y0,
            resolucionRayos,
            y1 - y0,
        );
        shadeCtx.fillStyle = `hsl(60, ${hue}%, 40%)`;
        shadeCtx.fillRect(x, y0, resolucionRayos, altoMuro);
        hue = parseInt(-altoMuro / 10);
    }

    renderRayo() {
        this.cast();

        var xDestino = this.wallHitX;
        var yDestino = this.wallHitY;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStyle = "#368190";
        this.ctx.stroke();
    }
}

class Player {
    constructor(x, y, escenario, ctx) {
        this.posXPlayer = x;
        this.posYPlayer = y;
        this.escenario = escenario;
        this.ctx = ctx;

        this.tamPlayer = this.escenario.tamCelda / 2;

        this.avanzando = 0;
        this.girando = 0;

        this.angulo = Math.PI;

        this.velAvance = 2;
        this.velGiro = 3 * (Math.PI / 180);

        this.numRayos = canvas.width / resolucionRayos;
        this.rayos = [];

        var incrementoAngulo = convierteRadianes(FOV / this.numRayos);
        var anguloInicial = convierteRadianes(this.angulo - 30);
        var anguloRayo = anguloInicial;

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i] = new Rayo(this.ctx, this.escenario, this.posXPlayer, this.posYPlayer, this.angulo, anguloRayo, i);
            anguloRayo += incrementoAngulo;
        }
    }

    arriba() {
        this.avanzando = 1;
    }
    abajo() {
        this.avanzando = -1;
    }
    derecha() {
        this.girando = 1;
    }
    izquierda() {
        this.girando = -1;
    }

    stopAvance() {
        this.avanzando = 0;
    }

    stopGiro() {
        this.girando = 0;
    }

    colision(x, y) {
        let choca = false;
        let casillaX = Math.floor(x / this.escenario.tamCelda);
        let casillaY = Math.floor(y / this.escenario.tamCelda);

        if (this.escenario.colision(casillaX, casillaY)) {
            choca = true;
        }

        return choca;
    }

    moverPersonaje() {
        let movimientoX = this.avanzando * Math.cos(this.angulo) * this.velAvance;
        let movimientoY = this.avanzando * Math.sin(this.angulo) * this.velAvance;

        let nuevaX = this.posXPlayer + movimientoX;
        if (!this.colision(nuevaX, this.posYPlayer)) {
            this.posXPlayer = nuevaX;
        }

        let nuevaY = this.posYPlayer + movimientoY;
        if (!this.colision(this.posXPlayer, nuevaY)) {
            this.posYPlayer = nuevaY;
        }
        this.angulo += this.girando * this.velGiro;
        this.angulo = normalizaAngulo(this.angulo);

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i].x = this.posXPlayer;
            this.rayos[i].y = this.posYPlayer;
            this.rayos[i].setAngulo(this.angulo);
            this.rayos[i].renderPared();
        }
    }

    renderPlayer() {
        // this.anchPlayer = canvas.width / matriz[0].length;
        // this.altPlayer = canvas.height / matriz.length;
        this.moverPersonaje();
        for (let i = 0; i < this.numRayos; i++) {
            // this.rayos[i].renderRayo();
            // this.rayos[i].renderPared();
        }

        this.ctx.globalAlpha = 0.6;
        this.ctx.drawImage(shadeCanvas, 0, 0);
        this.ctx.globalAlpha = 1;

        var xDestino = this.posXPlayer + Math.cos(this.angulo) * 50;
        var yDestino = this.posYPlayer + Math.sin(this.angulo) * 50;
    }
}

document.addEventListener('keydown', (tecla) => {
    switch (tecla.keyCode) {
        case 38:
            player.arriba();
            break;
        case 40:
            player.abajo();
            break;
        case 39:
            player.derecha();
            break;
        case 37:
            player.izquierda();
            break;
    }
});

document.addEventListener('keyup', (tecla) => {
    switch (tecla.keyCode) {
        case 38:
            player.stopAvance();
            break;
        case 40:
            player.stopAvance();
            break;
        case 39:
            player.stopGiro();
            break;
        case 37:
            player.stopGiro();
            break;
    }
    moveCamara = 0;
});

rangoDePresion.addEventListener('touchstart', (e) => {
    e.preventDefault();
    inicioXDedo = e.touches[0].pageX;
}, { passive: false });

rangoDePresion.addEventListener('touchmove', (e) => {
    e.preventDefault();
    actXDedo = e.touches[0].pageX;
    if (actXDedo >= canvas.width / 3) {
        desplazadoXDedo = actXDedo - inicioXDedo;
        console.log(desplazadoXDedo);
        if (desplazadoXDedo > 0) {
            player.derecha();
        } else if (desplazadoXDedo < 0) {
            player.izquierda();
        }
    }
}, { passive: false });

rangoDePresion.addEventListener('touchend', (e) => {
    player.stopGiro();
});



canvas.width = 1280;
canvas.height = 720;
shadeCanvas.width = canvas.width;
shadeCanvas.height = canvas.height;

const mapa = new Map(ctx);

const player = new Player(
    (mapa.anchM - 2) * mapa.tamCelda + mapa.tamCelda / 2,
    mapa.tamCelda + mapa.tamCelda / 2,
    mapa, ctx
);
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