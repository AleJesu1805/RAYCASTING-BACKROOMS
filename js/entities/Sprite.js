import { canvas, FOV, resolucionRayos, zBuffer, fx, altoTile } from "../core/canvas.js";
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
    }

    calculaDistancia() {
        this.distancia = distanciaEntrePuntos(player.posXPlayer, player.posYPlayer, this.x, this.y);
    }

    dibuja() {
        this.calculaAngulo();
        this.calculaDistancia();
        if (!this.visible) return;

        // ============================================================
        // ESCALA VERTICAL — misma fórmula que Rayo.renderPared(), para
        // que un sprite mida lo mismo que un muro a su misma distancia
        // (es exactamente el cálculo de raycasting.js: altoTile / distancia * distanciaPlanoProyeccion)
        // ============================================================
        // const altoTile = 500; // debe coincidir con el altoTile usado en Rayo.renderPared()
        const distanciaPlanoProyeccion = (canvas.width / 2) / Math.tan(FOV / 2); // OJO: igual que en Rayo.js, FOV NO se convierte a radianes aquí (a propósito, para que cuadre con los muros)
        const alturaSprite = (altoTile / this.distancia) * distanciaPlanoProyeccion;

        const y0 = Math.trunc(canvas.height / 2) - Math.trunc(alturaSprite / 2) + fx.moveCamara;
        const y1 = y0 + alturaSprite;
        const alturaFinal = y0 - y1; // = "alturaTextura" en raycasting.js (el signo se autocorrige solo, igual que en el original)

        // ============================================================
        // ÚNICA ADAPTACIÓN REAL frente al original: en raycasting.js
        // se asume sprite cuadrado ("LOS SPRITES SON CUADRADOS"), por
        // eso allí anchuraTextura = alturaTextura. Tu imagen no es
        // cuadrada (249x527), así que en vez de forzar ancho = alto
        // (lo que la deformaría), respeto su proporción real.
        // ============================================================
        const anchoTextura = this.imagen.width;
        const altoTextura = this.imagen.height;
        const anchuraFinal = alturaFinal * (anchoTextura / altoTextura);

        // ============================================================
        // COORDENADA X — misma fórmula que raycasting.js:
        // x0 = tan(anguloSprite) * viewDist
        // x  = centroPantalla + x0 - anchura/2
        // ============================================================
        const dx = this.x - player.posXPlayer;
        const dy = this.y - player.posYPlayer;
        const anguloSprite = Math.atan2(dy, dx) - player.angulo;
        const viewDist = canvas.width; // en raycasting.js está puesto como "500", que es literalmente canvasAncho
        const x0 = Math.tan(anguloSprite) * viewDist;
        const xIzquierda = canvas.width / 2 + x0 - anchuraFinal / 2;

        // ============================================================
        // DIBUJADO COLUMNA A COLUMNA comparando contra el zBuffer, igual
        // que raycasting.js (para que las paredes puedan tapar al sprite).
        // Única diferencia de implementación: en vez de recorrer columna
        // por columna NATIVA de la imagen (lo que en tu motor, con un
        // sprite de 249px de ancho, sería carísimo por sprite y por
        // frame), avanzo de "resolucionRayos" en "resolucionRayos" px de
        // pantalla, igual que ya hace tu motor para las paredes. La
        // lógica de qué se dibuja y qué se tapa es idéntica.
        // ============================================================
        // this.ctx.imageSmoothingEnabled = false;

        for (let x1 = Math.round(xIzquierda); x1 < xIzquierda + anchuraFinal; x1 += resolucionRayos) {
            if (x1 < 0 || x1 >= canvas.width) continue;

            const columnaRayo = Math.floor(x1 / resolucionRayos);
            if (zBuffer[columnaRayo] === undefined) continue;
            if (zBuffer[columnaRayo] <= this.distancia) continue; // hay un muro más cerca en esa columna: no se dibuja

            const proporcion = (x1 - xIzquierda) / anchuraFinal;
            const columnaTextura = Math.trunc(proporcion * anchoTextura);

            this.ctx.drawImage(
                this.imagen,
                columnaTextura,
                0,
                1,
                altoTextura,
                x1,
                y1,
                resolucionRayos,
                alturaFinal
            );
        }
    }
}