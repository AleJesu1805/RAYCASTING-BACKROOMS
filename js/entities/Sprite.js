import { canvas, FOV, resolucionRayos, zBuffer } from "../core/canvas.js";
import { convierteRadianes, distanciaEntrePuntos } from "../core/utils.js";
import { player } from "../main.js";

const FOV_medio = convierteRadianes(FOV / 2);

export class Sprite {
    constructor(x, y, imagen, ctx) {
        this.x = x;
        this.y = y;
        this.imagen = imagen;
        this.ctx = ctx;
        this.distancia = 0;
        this.visible = false;
    }

    calculaAngulo() {
        let vectX = this.x - player.posXPlayer;
        let vectY = this.y - player.posYPlayer;
        let anguloObjeto = Math.atan2(vectY, vectX);
        let diferencia = player.angulo - anguloObjeto;

        if (diferencia < -Math.PI) diferencia += 2 * Math.PI;
        if (diferencia > Math.PI) diferencia -= 2 * Math.PI;

        this.visible = Math.abs(diferencia) < FOV_medio;
        this.anguloRelativo = anguloObjeto - player.angulo;
    }

    calculaDistancia() {
        this.distancia = distanciaEntrePuntos(player.posXPlayer, player.posYPlayer, this.x, this.y);
    }

    dibuja() {
        this.calculaAngulo();
        this.calculaDistancia();
        if (!this.visible) return;

        let distancia = distanciaEntrePuntos(this.x, this.y, player.posXPlayer, player.posYPlayer);
        const distPlano = (canvas.width / 2) / Math.tan(convierteRadianes(FOV) / 2);
        const alturaSprite = canvas.height / 1.5 - distancia;

        const y0 = canvas.height / 2 - alturaSprite / 2;

        const dx = this.x - player.posXPlayer;
        const dy = this.y - player.posYPlayer;


        const anguloSprite = Math.atan2(dy, dx) - player.angulo;
        const xCentro = canvas.width / 2 + Math.tan(anguloSprite) * distPlano;

        const anchoTextura = 512;
        const xInicio = xCentro - alturaSprite / 2;

        for (let x = xInicio; x < xInicio + alturaSprite; x += resolucionRayos) {
            const col = Math.floor(x / resolucionRayos);
            if (col < 0 || col >= zBuffer.length) continue;

            if (zBuffer[col] > this.distancia) {
                const pixelTextura = Math.floor(((x - xInicio) / alturaSprite) * anchoTextura);
                this.ctx.drawImage(
                    this.imagen,
                    pixelTextura, // xImg
                    0, // yImg
                    this.imagen.width * 2, // wImg
                    this.imagen.height, // hImg
                    x, // xCtx
                    y0, // yCtx
                    alturaSprite, // wCtx
                    alturaSprite // hCtx
                );
            }
        }
    }
}