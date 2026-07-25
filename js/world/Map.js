import { canvas, ctx, fx } from "../core/canvas.js";
import { imgArma } from "../core/assets.js";

const matriz = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 3, 3, 3, 3, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 4, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 3, 3, 3, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 3, 3, 3, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 4, 4, 4, 4, 4, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


// const matriz = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 1, 1, 0, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 1, 1, 0, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];

export class Map {
    constructor(ctx) {
        this.anchM = matriz[0].length;
        this.altM = matriz.length;
        this.tamCelda = Math.floor(Math.min(canvas.width / this.anchM, canvas.height / this.altM));
        this.color1 = '#907b15';
        this.color2 = '#778a0b';
        this.color3 = '#4d8c5e';
        this.color4 = '#799592';
        this.color0 = '#695b28';
        this.ctx = ctx;
        this.tamMiniMap = 200;
        this.miniCelda = Math.floor(Math.min(this.tamMiniMap / this.anchM, this.tamMiniMap / this.altM));
    }

    renderMap() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                if (matriz[y][x] === 1) {
                    this.ctx.fillStyle = this.colorPared;
                } else {
                    this.ctx.fillStyle = this.colorEspacio;
                }
                this.ctx.fillRect(x * this.tamCelda, y * this.tamCelda, this.tamCelda, this.tamCelda);
            }
        }
    }

    saberCasilla(x, y) {
        var casillaX = parseInt(x / this.tamCelda);
        var casillaY = parseInt(y / this.tamCelda);
        return (matriz[casillaY][casillaX]);
    }

    renderPlayerInMinimap(player) {
        var escala = this.miniCelda / this.tamCelda;
        var miniX = player.posXPlayer * escala;
        var miniY = player.posYPlayer * escala;

        var xDestino = miniX + Math.cos(player.angulo) * (20 * escala);
        var yDestino = miniY + Math.sin(player.angulo) * (20 * escala);

        this.ctx.beginPath();
        this.ctx.moveTo(miniX, miniY);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();

        this.ctx.fillStyle = '#1a551e';
        this.ctx.fillRect(miniX - 2, miniY - 2, 4, 4);
    }

    renderMiniMap() {
        for (let y = 0; y < this.altM; y++) {
            for (let x = 0; x < this.anchM; x++) {
                const color = this[`color${matriz[y][x]}`];
                this.ctx.fillStyle = color || this.color0;
                this.ctx.fillRect(x * this.miniCelda, y * this.miniCelda, this.miniCelda, this.miniCelda);
            }
        }
    }

    renderFondo() {
        // SUELO
        this.ctx.fillStyle = this.color0;
        this.ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        // TECHO
        this.ctx.fillStyle = '#5c5601';
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
