const canvas = document.querySelector('canvas');
const span = document.querySelector('span');
const ctx = canvas.getContext('2d');

const shadeCanvas = document.createElement('canvas');
const shadeCtx = shadeCanvas.getContext('2d');

var hue = 0;
var moveCamara = 0;
var bobTiempo = 0;


const imgPared = new Image();
imgPared.src = 'img/backrooms-textures-v0-3b0m6yqrjhk91.webp';

const tamArma = 250;
const imgArma = new Image();
imgArma.src = 'img/Background.png';



const FOV = 60;

const matriz = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

class Map {
    constructor(ctx, player) {
        this.anchM = matriz[0].length;
        this.altM = matriz.length;
        //this.anchCelda = canvas.width / this.anchM;
        //this.altCelda = canvas.height / this.altM;
        this.tamCelda = Math.min(canvas.width / this.anchM, canvas.height / this.altM);
        this.colorPared = `hsl(55, 66%, 25%)`;
        this.colorEspacio = '#572020';
        this.ctx = ctx;
        this.miniCelda = this.tamCelda - 20;
        this.player = player;
    }
    renderMap() {
        //this.anchCelda = canvas.width / this.anchM;
        //this.altCelda = canvas.height / this.altM;
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                if (matriz[y][x] === 1) {
                    ctx.fillStyle = this.colorPared;
                } else {
                    ctx.fillStyle = this.colorEspacio;
                }
                //ctx.strokeRect(x * this.anchCelda, y * this.altCelda, this.anchCelda, this.altCelda);
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
                //ctx.strokeRect(x * this.anchCelda, y * this.altCelda, this.anchCelda, this.altCelda);
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

        this.ctx.fillStyle = '#054408';
        this.ctx.fillRect(miniX - 2, miniY - 2, 4, 4);

        ctx.drawImage(imgArma, canvas.width / 2 - tamArma/2, canvas.height - tamArma/1.5+20+moveCamara, tamArma, tamArma/1.5);
    }

    renderFondo() {
        // SUELO
        this.ctx.fillStyle = '#514d1f';
        this.ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        // TECHO
        this.ctx.fillStyle = '#ab9f1d';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height/2);
    }

    colision(x, y) {
        // Si la casilla cae fuera de la matriz, la tratamos como pared
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

        //this.xStep = 0;
        //this.yStep = 0;

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
            let casillaX = parseInt(siguienteXHorizontal / this.escenario.tamCelda);
            let casillaY = parseInt(siguienteYHorizontal / this.escenario.tamCelda);

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

            var casillaX = parseInt(siguienteXVertical / this.escenario.tamCelda);
            var casillaY = parseInt(siguienteYVertical / this.escenario.tamCelda);

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

            this.pixelTextura = this.wallHitX - parseInt(this.wallHitX / mapa.tamCelda) * mapa.tamCelda;
        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
            this.distancia = distanciaVertical;

            this.pixelTextura = this.wallHitY - parseInt(this.wallHitY / mapa.tamCelda) * mapa.tamCelda;
        }

        this.pixelTextura = parseInt((this.pixelTextura / mapa.tamCelda) * imgPared.width);

        // CORRECCION OJO DE PEZ
        this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));
    }

    renderPared() {
        // PARED
        this.cast();
        let altoTile = 300;
        let distanciaPlanoProyeccion = (canvas.width / 2) / Math.tan(FOV / 2);
        let altoMuro = altoTile / this.distancia * distanciaPlanoProyeccion;
        var y0 = canvas.height / 2 - altoMuro / 2 + moveCamara;
        var y1 = y0 + altoMuro;
        var x = this.columna;

        this.ctx.drawImage(
            imgPared,
            this.pixelTextura,
            0,
            1,
            imgPared.height,
            x,
            y0,
            1,
            y1 - y0,
        );
        shadeCtx.fillStyle = `hsl(60, ${hue}%, 20%)`;
        shadeCtx.fillRect(x, y0, 1, altoMuro);
        hue = parseInt(-altoMuro / 3.5);

        // // this.ctx.fillStyle = `rgb(121, 115, 18)`;
        // this.ctx.fillStyle = `hsl(55, ${hue}%, 35%, 50%)`;
        // this.ctx.fillStyle = `hsl(55, 50%, 35%, ${hue}%)`;
        // this.ctx.fillRect(x, y0, 1, altoMuro);
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
        //this.anchPlayer = canvas.width / matriz[0].length / 3;
        //this.altPlayer = canvas.height / matriz.length / 3;
        this.escenario = escenario;
        this.ctx = ctx;

        this.tamPlayer = this.escenario.tamCelda / 2;

        this.avanzando = 0;
        this.girando = 0;

        this.angulo = 0;

        this.velAvance = 3;
        this.velGiro = 3 * (Math.PI / 180);

        //this.rayo = new Rayo(this.ctx, this.escenario, this.posXPlayer, this.posYPlayer, this.angulo, 0);
        this.numRayos = canvas.width;
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
        let casillaX = parseInt(x / this.escenario.tamCelda);
        let casillaY = parseInt(y / this.escenario.tamCelda);

        if (this.escenario.colision(casillaX, casillaY)) {
            choca = true;
        }

        return choca;
    }

    moverPersonaje() {
        var nuevaX = this.posXPlayer + (this.avanzando * Math.cos(this.angulo) * this.velAvance);

        var nuevaY = this.posYPlayer + (this.avanzando * Math.sin(this.angulo) * this.velAvance);

        if (!this.colision(nuevaX, nuevaY)) {
            this.posXPlayer = nuevaX;
            this.posYPlayer = nuevaY;
        }

        this.angulo += this.girando * this.velGiro;
        this.angulo = normalizaAngulo(this.angulo);
        // this.rayo.setAngulo(this.angulo);
        // this.rayo.x = this.posXPlayer;
        // this.rayo.y = this.posYPlayer;
        //this.rayo.renderRayo();

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i].x = this.posXPlayer;
            this.rayos[i].y = this.posYPlayer;
            this.rayos[i].setAngulo(this.angulo);
        }
    }

    renderPlayer() {
        // this.anchPlayer = canvas.width / matriz[0].length;
        // this.altPlayer = canvas.height / matriz.length;
        this.moverPersonaje();
        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i].renderRayo();
            // this.rayos[i].renderPared();
        }

        this.ctx.globalAlpha = 0.6;
        this.ctx.drawImage(shadeCanvas, 0, 0);
        this.ctx.globalAlpha = 1;

        var xDestino = this.posXPlayer + Math.cos(this.angulo) * 50;
        var yDestino = this.posYPlayer + Math.sin(this.angulo) * 50;

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.posXPlayer, this.posYPlayer);
        // this.ctx.lineTo(xDestino, yDestino);
        // this.ctx.strokeStyle = '#000';
        // this.ctx.stroke();

        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.posXPlayer - this.tamPlayer / 2, this.posYPlayer - this.tamPlayer / 2, this.tamPlayer, this.tamPlayer);
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

    if (moveCamara < 10) {
        moveCamara++;
    } else {
        moveCamara = -moveCamara;
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

// const botones = [
//     { id: 'arribaBoton', start: () => player.arriba(), stop: () => player.stopAvance() },
//     { id: 'abajoBoton', start: () => player.abajo(), stop: () => player.stopAvance() },
//     { id: 'derechaBoton', start: () => player.derecha(), stop: () => player.stopGiro() },
//     { id: 'izquierdaBoton', start: () => player.izquierda(), stop: () => player.stopGiro() },
// ];

// botones.forEach(({ id, start, stop }) => {
//     const boton = document.getElementById(id);
//     boton.addEventListener('touchstart', start);
//     boton.addEventListener('touchend', stop);
//     boton.addEventListener('touchcancel', stop);
// });

// canvas.width = mapa.anchM * mapa.tamCelda;  // anchM * tamCelda
// canvas.height = mapa.altM * mapa.tamCelda;    // altM * tamCelda



canvas.width = 1000;  // anchM * tamCelda
canvas.height = 550;    // altM * tamCelda

const mapa = new Map(ctx);

const player = new Player(mapa.tamCelda + 5, mapa.tamCelda + 5, mapa, ctx);

const fps = 70;
const frameDuration = 1000 / fps;
let ultimoTiempo = 0;
function gameLoop(tiempoActual) {
    requestAnimationFrame(gameLoop);
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    shadeCanvas.width = canvas.width;
    shadeCanvas.height = canvas.height;

    
    const delta = tiempoActual - ultimoTiempo;
    if (delta < frameDuration) return;
    ultimoTiempo = tiempoActual - (delta % frameDuration);
    
    if (player.avanzando !== 0) {
        bobTiempo += delta;
        moveCamara = parseInt(Math.sin(bobTiempo / 100) * 10);
    } else {
        bobTiempo = 0;
        moveCamara = 0;
    }
    
    mapa.renderFondo();
    mapa.renderMap();
    player.renderPlayer();
    // mapa.renderMiniMap();
}
requestAnimationFrame(gameLoop);