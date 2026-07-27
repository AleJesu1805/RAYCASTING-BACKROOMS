import { canvas, shadeCanvas, viewCtx, resolucionRayos, shadeCtx, FOV } from "../core/canvas.js";
import { convierteRadianes, normalizaAngulo, colision } from "../core/utils.js";
import { enemie, player } from "../main.js";
import { Rayo } from "../world/Rayo.js";
import { Player } from "./Player.js";

export class Enemies {
    constructor(x, y, escenario, ctx) {
        this.posX = x;
        this.posY = y;
        this.escenario = escenario;
        this.ctx = ctx;
        this.radio = 10;

        this.min = Math.ceil(Math.PI / 2);
        this.max = Math.floor(Math.PI);

        this.angulo = Math.PI / 2;
        this.velocidad = 2;

        this.rayo = new Rayo(this.ctx, this.escenario, this.posX, this.posY, this.angulo, 0, 0);
    }

    lanzarRayo() {
        this.rayo.x = this.posX;
        this.rayo.y = this.posY;
        this.rayo.setAngulo(this.angulo);
        this.rayo.renderRayo();
    }

    moverse() {
        // CAMINAR SIN RUMBO POR EL MAPA
        let movimientoX = Math.cos(this.angulo) * this.velocidad;
        let movimientoY = Math.sin(this.angulo) * this.velocidad;
        let nuevaX = this.posX + movimientoX;

        if (!colision(nuevaX, this.posY, this.radio / 2)) {
            this.posX = nuevaX;
        } else {
            this.angulo += Math.random() * (this.max - this.min) + this.min;
        }

        let nuevaY = this.posY + movimientoY;
        if (!colision(this.posX, nuevaY, this.radio / 2)) {
            this.posY = nuevaY;
        } else {
            this.angulo += Math.random() * (this.max - this.min) + this.min;
        }
        this.angulo = normalizaAngulo(this.angulo);

        // PERSEGUIR AL JUGADOR
        if (this.rayo.wallHitX === player.posXPlayer) {

        } else if (this.rayo.wallHitY === player.posYPlayer) {

        }
    }
    atacar() {

    }
    renderizarEnemie2d() {
        var xDestino = this.posX + Math.cos(this.angulo) * (20);
        var yDestino = this.posY + Math.sin(this.angulo) * (20);

        // this.ctx.beginPath();
        // this.ctx.moveTo(this.posX, this.posY);
        // this.ctx.lineTo(xDestino, yDestino);
        // this.ctx.strokeStyle = '#000';
        // this.ctx.stroke();

        this.ctx.fillStyle = '#96290b';
        this.ctx.fillRect(this.posX - 5, this.posY - 5, 10, 10);

    }
}