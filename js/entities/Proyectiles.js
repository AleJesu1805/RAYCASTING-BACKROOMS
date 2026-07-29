import { player } from "../main.js";
import { Player } from "./Player.js";

export class Proyectiles {
    constructor(xPartida, yPartida, anguloActual, ctx) {
        this.xPartida = xPartida;
        this.yPartida = yPartida;
        this.angulo = anguloActual;
        this.ctx = ctx;
        this.velAvance = 6;
    }
    moverBala() {

    }
    renderBala() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.xPartida, this.yPartida, 100, 100);
    }
}