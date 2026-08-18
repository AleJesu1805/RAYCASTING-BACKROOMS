import { canvas, shadeCanvas, viewCtx, resolucionRayos, shadeCtx, FOV, fx } from "../core/canvas.js";
import { convierteRadianes, normalizaAngulo, colision, distanciaEntrePuntos } from "../core/utils.js";
import { Rayo } from "../world/Rayo.js";
import { reproducirSonido } from "../core/audio.js";
import { enemies, mapa } from "../main.js";

const explosion = document.getElementById('explosionArma');

export class Player {
    constructor(x, y, escenario, ctx) {
        this.posXPlayer = x;
        this.posYPlayer = y;
        this.escenario = escenario;
        this.ctx = ctx;
        this.vida = 1000;

        this.radio = this.escenario.tamCelda / 3;

        this.avanzando = 0;
        this.girando = 0;

        this.angulo = 0;

        this.velAvance = 1.5;
        this.velGiro = 3 * (Math.PI / 180);

        this.numRayos = canvas.width / resolucionRayos;
        this.rayos = [];

        var incrementoAngulo = convierteRadianes(FOV / this.numRayos);
        var anguloInicial = convierteRadianes(this.angulo - FOV / 2);
        var anguloRayo = anguloInicial;

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i] = new Rayo(this.ctx, this.escenario, this.posXPlayer, this.posYPlayer, this.angulo, anguloRayo, i);
            anguloRayo += incrementoAngulo;
        }

        this.acertaste = false;
    }

    lanzarRayos() {
        shadeCtx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i].x = this.posXPlayer;
            this.rayos[i].y = this.posYPlayer;
            this.rayos[i].setAngulo(this.angulo);
            // this.rayos[i].renderRayo();
            this.rayos[i].renderPared();
        }

        this.comprobarDisparo();
    }

    comprobarDisparo() {
        if (this.disparando) {
            const rayoCentral = this.rayos[Math.floor(this.numRayos / 2)];
            this.disparar(rayoCentral);
            this.disparando = false;
        }
    }

    disparar(rayo) {
        const alcance = 500;
        explosion.style.opacity = 1;
        setTimeout(() => {
            explosion.style.opacity = 0;
        }, 100);
        reproducirSonido('disparo');
        enemies.forEach((enemigo) => {
            const dist = distanciaEntrePuntos(this.posXPlayer, this.posYPlayer, enemigo.posX, enemigo.posY);
            if (dist > alcance) return;

            const tolerancia = Math.atan2(enemigo.radio, dist);
            const anguloEnemigo = Math.atan2(enemigo.posY - this.posYPlayer, enemigo.posX - this.posXPlayer);
            const diferencia = normalizaAngulo(anguloEnemigo - rayo.angulo);

            if (Math.abs(diferencia) < tolerancia || Math.abs(diferencia) > 2 * Math.PI - tolerancia) {
                const distRayo = rayo.distancia;
                if (dist < distRayo || distRayo === Infinity) {
                    enemigo.posX = enemigo.xInicial;
                    enemigo.posY = enemigo.yInicial;
                    enemigo.velocidad = 1 * Math.random();
                    this.acertaste = true;
                    reproducirSonido('disparoAcierto');
                }
            }
        });
    }

    moverPersonaje() {
        this.lanzarRayos();

        let movimientoX = this.avanzando * Math.cos(this.angulo) * this.velAvance;
        let nuevaX = this.posXPlayer + movimientoX;
        if (!colision(nuevaX, this.posYPlayer, 4)) {
            this.posXPlayer = nuevaX;
        }

        let movimientoY = this.avanzando * Math.sin(this.angulo) * this.velAvance;
        let nuevaY = this.posYPlayer + movimientoY;
        if (!colision(this.posXPlayer, nuevaY, 4)) {
            this.posYPlayer = nuevaY;
        }

        this.angulo += this.girando * this.velGiro;
        this.angulo = normalizaAngulo(this.angulo);
    }

    renderPlayer2d() {
        // this.moverPersonaje();
        let xDestino = this.posXPlayer + Math.cos(this.angulo) * (100);
        let yDestino = this.posYPlayer + Math.sin(this.angulo) * (100);

        this.ctx.beginPath();
        this.ctx.moveTo(this.posXPlayer, this.posYPlayer);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();

        this.ctx.fillStyle = '#1a551e';
        this.ctx.fillRect(this.posXPlayer - this.radio / 2, this.posYPlayer - this.radio / 2, this.radio, this.radio);
    }
}