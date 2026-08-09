import { canvas, shadeCanvas, viewCtx, resolucionRayos, shadeCtx, FOV, fx } from "../core/canvas.js";
import { convierteRadianes, normalizaAngulo, colision, distanciaEntrePuntos } from "../core/utils.js";
import { Rayo } from "../world/Rayo.js";
import { imgArma, explosionArma, reproducirSonido } from "../core/assets.js";
import { enemies, mapa } from "../main.js";

export class Player {
    constructor(x, y, escenario, ctx) {
        this.posXPlayer = x;
        this.posYPlayer = y;
        this.escenario = escenario;
        this.ctx = ctx;
        this.vida = 100;
        this.balas = 50;

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
        const tolerancia = convierteRadianes(3);
        // const tolerancia = 0.1;
        reproducirSonido('disparo');
        this.ctx.drawImage(explosionArma, canvas.width / 2 - 85, canvas.height - 270, 150, 150);

        enemies.forEach((enemigo) => {
            const dist = distanciaEntrePuntos(this.posXPlayer, this.posYPlayer, enemigo.posX, enemigo.posY);
            if (dist > alcance) return;

            const anguloEnemigo = Math.atan2(enemigo.posY - this.posYPlayer, enemigo.posX - this.posXPlayer);
            const diferencia = normalizaAngulo(anguloEnemigo - rayo.angulo);

            if (Math.abs(diferencia) < tolerancia || Math.abs(diferencia) > 2 * Math.PI - tolerancia) {
                const distRayo = rayo.distancia;
                if (dist < distRayo || distRayo === Infinity) {
                    enemigo.posX = mapa.tamCelda * (mapa.anchM / 2);
                    enemigo.posY = mapa.tamCelda * (mapa.anchM / 2);
                    this.acertaste = true;
                    reproducirSonido('disparoAcierto');
                }
            }
        });
    }

    // arriba() {
    //     this.avanzando = 1;
    //     fx.moveCamara = 0;
    // }
    // abajo() {
    //     this.avanzando = -1;
    //     fx.moveCamara = 0;
    // }
    // derecha() {
    //     this.girando = 1;

    // }
    // izquierda() {
    //     this.girando = -1;
    // }

    // stopAvance() {
    //     this.avanzando = 0;
    // }

    // stopGiro() {
    //     this.girando = 0;
    // }

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

    renderArma() {
        const tamArma = 250;
        this.ctx.drawImage(imgArma, canvas.width / 2 - tamArma / 2, canvas.height - tamArma / 1.1 + fx.moveCamara, tamArma, tamArma);

        let tamañoPuntero = 5;
        if (this.acertaste) {
            tamañoPuntero = 1;
            setTimeout(() => {
                this.acertaste = false;
            }, 200)
        }
        this.ctx.beginPath();
        this.ctx.arc(canvas.width / 2 - tamañoPuntero / 2, canvas.height / 2, tamañoPuntero, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#a20606';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
}