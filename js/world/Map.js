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

export class Map {
    constructor(ctx) {
        this.anchM = matriz[0].length;
        this.altM = matriz.length;
        this.tamCelda = Math.floor(Math.min(canvas.width / this.anchM, canvas.height / this.altM));
        this.color1 = '#1c1f42';
        this.color2 = '#601f5f';
        this.color3 = '#c1dcc8';
        this.color4 = '#0a0c0c';
        this.color0 = '#4b2348';
        this.ctx = ctx;
        this.tamMiniMap = 200;
        this.miniCelda = Math.floor(Math.min(this.tamMiniMap / this.anchM, this.tamMiniMap / this.altM));

        // NUEVO: caché del minimapa
        this.miniMapCache = document.createElement('canvas');
        this.miniMapCache.width = this.anchM * this.miniCelda;
        this.miniMapCache.height = this.altM * this.miniCelda;
        this.miniMapCacheCtx = this.miniMapCache.getContext('2d');
        this.dibujarMiniMapCache();
    }

    dibujarMiniMapCache() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                const color = this[`color${matriz[y][x]}`];
                this.miniMapCacheCtx.fillStyle = color || this.color0;
                this.miniMapCacheCtx.fillRect(x * this.miniCelda, y * this.miniCelda, this.miniCelda, this.miniCelda);
            }
        }
    }

    renderMap() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                const color = this[`color${matriz[y][x]}`];
                this.ctx.fillStyle = color || this.color0;
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
        var escala = this.miniCelda / this.tamCelda;
        var miniX = x * escala;
        var miniY = y * escala;

        var xDestino = miniX + Math.cos(entitie.angulo) * (20 * escala);
        var yDestino = miniY + Math.sin(entitie.angulo) * (20 * escala);

        this.ctx.beginPath();
        this.ctx.moveTo(miniX, miniY);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();

        this.ctx.fillStyle = color;
        this.ctx.fillRect(miniX - 2, miniY - 2, 4, 4);
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
