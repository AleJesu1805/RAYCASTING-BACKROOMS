import { canvas, resolucionRayos, shadeCtx, FOV, valorAsesinatos, arma, puntero } from "../core/canvas.js";
import { convierteRadianes, normalizaAngulo, colision, distanciaEntrePuntos } from "../core/utils.js";
import { Rayo } from "../world/Rayo.js";
import { reproducirSonido } from "../core/audio.js";
import { enemies } from "../main.js";

export class Player {
    constructor(x, y, escenario, ctx) {
        this.xInicial = x;
        this.yInicial = y;

        this.posXPlayer = x;
        this.posYPlayer = y;
        this.escenario = escenario;
        this.ctx = ctx;
        this.vida = 100;
        this.asesinatos = 0;

        this.radio = this.escenario.tamCelda / 4;

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
        this.acertaste = false;
        arma.src = 'img/armas/armaDisparada.webp'
        setTimeout(() => {
            arma.src = 'img/armas/arma.webp'
        }, 100);
        enemies.forEach((enemigo) => {
            const dist = distanciaEntrePuntos(this.posXPlayer, this.posYPlayer, enemigo.posX, enemigo.posY);
            if (dist > alcance) return;

            const tolerancia = Math.atan2(enemigo.radio, dist);
            const anguloEnemigo = Math.atan2(enemigo.posY - this.posYPlayer, enemigo.posX - this.posXPlayer);
            const diferencia = normalizaAngulo(anguloEnemigo - rayo.angulo);

            if (Math.abs(diferencia) < tolerancia || Math.abs(diferencia) > 2 * Math.PI - tolerancia) {
                const distRayo = rayo.distancia;
                if (dist < distRayo || distRayo === Infinity) {
                    reproducirSonido('disparoAcierto');
                    enemigo.posX = enemigo.xInicial;
                    enemigo.posY = enemigo.yInicial;
                    enemigo.velocidad = 1 * (Math.random() + 1);
                    this.acertaste = true;
                    this.asesinatos += 1;
                    puntero.style.backgroundColor = '#100dec';
                    puntero.style.padding = '1%';
                    setTimeout(() => {
                        puntero.style.padding = '0.5%';
                        puntero.style.backgroundColor = '#b11010';
                    }, 300);
                    valorAsesinatos.textContent = this.asesinatos;
                }
            }
        });
        if (!this.acertaste) {
            reproducirSonido('disparo');
        }
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

    reiniciar() {
        this.posXPlayer = this.xInicial;
        this.posYPlayer = this.yInicial;
        this.vida = 100;
        this.asesinatos = 0;
        valorAsesinatos.textContent = this.asesinatos;
        this.angulo = 0;
        this.avanzando = 0;
        this.girando = 0;
        this.disparando = false;
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