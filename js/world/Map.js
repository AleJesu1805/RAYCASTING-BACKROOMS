import { canvas, ctx, fx } from "../core/canvas.js";
import { player } from "../main.js";
// import { ima } from "../core/assets.js";

const matriz = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 2, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 2, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 2, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 2, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 3, 3, 3, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3, 3, 3, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 3, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 3, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 3, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 3, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 4, 4, 4, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 4, 4, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 4, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 4, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 4, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 4, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 4, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 4, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 2, 0, 0, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 0, 0, 2, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 2, 0, 1, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1, 0, 2, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const colores = {
    0: '#ad9696',
    1: '#000000',
    2: '#a7cf42',
    3: '#c1dcc8',
    4: '#306161',
    5: '#4b2348',
}

export class Map {
    constructor(ctx) {
        this.anchM = matriz[0].length;
        this.altM = matriz.length;
        this.tamCelda = Math.floor(Math.min(canvas.width / this.anchM, canvas.height / this.altM));
        this.ctx = ctx;
        this.tamMiniMap = 200;
        this.miniCelda = Math.floor(Math.min(this.tamMiniMap / this.anchM, this.tamMiniMap / this.altM));

        this.miniMapCache = document.createElement('canvas');
        this.miniMapCache.width = this.anchM * this.miniCelda;
        this.miniMapCache.height = this.altM * this.miniCelda;
        this.miniMapCacheCtx = this.miniMapCache.getContext('2d');
        this.dibujarMiniMapCache();
    }

    dibujarMiniMapCache() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                const color = colores[matriz[y][x]];
                this.miniMapCacheCtx.fillStyle = color;
                this.miniMapCacheCtx.fillRect(x * this.miniCelda, y * this.miniCelda, this.miniCelda, this.miniCelda);
            }
        }
    }

    renderMap() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                const color = colores[matriz[x][y]];
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.tamCelda, y * this.tamCelda, this.tamCelda, this.tamCelda);
            }
        }
    }

    saberCasilla(x, y) {
        var casillaX = parseInt(x / this.tamCelda);
        var casillaY = parseInt(y / this.tamCelda);
        return (matriz[casillaY][casillaX]);
    }

    renderEntitieInMinimap(entitie, x, y, color) {
        const escala = this.miniCelda / this.tamCelda;
        const centroX = x * escala;
        const centroY = y * escala;
        const angulo = entitie.angulo;

        const cos = Math.cos(angulo);
        const sin = Math.sin(angulo);
        const largo = 17 * escala;
        const ancho = 3;

        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = '#070321';
        this.ctx.beginPath();
        this.ctx.moveTo(centroX + cos * largo, centroY + sin * largo);
        this.ctx.lineTo(centroX - cos * 4 - sin * ancho, centroY - sin * 4 + cos * ancho);
        this.ctx.lineTo(centroX - cos * 4 + sin * ancho, centroY - sin * 4 - cos * ancho);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    renderMiniMap() {
        this.ctx.drawImage(this.miniMapCache, 0, 0);
    }

    renderFondo() {
        // SUELO
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        // TECHO
        this.ctx.fillStyle = '#ffffff';
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
