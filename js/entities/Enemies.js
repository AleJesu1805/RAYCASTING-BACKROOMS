import { canvas, shadeCanvas, viewCtx, resolucionRayos, shadeCtx, FOV } from "../core/canvas.js";
import { convierteRadianes, normalizaAngulo, colision } from "../core/utils.js";
import { enemie1, player } from "../main.js";
import { Rayo } from "../world/Rayo.js";
import { Player } from "./Player.js";
import { Sprite } from "./Sprite.js";
import { sprite1 } from "../core/assets.js";
import { reproducirSonido } from "../core/audio.js";
const valorSalud = document.getElementById('valorSalud');

export class Enemies {
    constructor(x, y, xInicial, yInicial, escenario, ctx, velocidad) {
        this.posX = x;
        this.posY = y;
        this.xInicial = xInicial;
        this.yInicial = yInicial;
        this.escenario = escenario;
        this.ctx = ctx;
        this.radio = escenario.tamCelda / 4;

        this.min = Math.ceil(Math.PI / 2);
        this.max = Math.floor(Math.PI);

        this.angulo = Math.PI / 2;
        this.velocidad = velocidad;

        this.rayo = new Rayo(this.ctx, this.escenario, this.posX, this.posY, this.angulo, 0, 0);
        this.sprite = new Sprite(this.posX, this.posY, sprite1, this.ctx);

        this.ruta = null;

        this.rutaIndex = 1;

        this.ultimoAngulo = undefined;
    }

    lanzarRayo() {
        this.rayo.x = this.posX;
        this.rayo.y = this.posY;
        this.rayo.setAngulo(this.angulo);
        this.rayo.renderRayo();
    }

    aCasilla(x, y) {
        return {
            x: Math.floor(x / this.escenario.tamCelda),
            y: Math.floor(y / this.escenario.tamCelda)
        };
    }

    heuristica(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    obtenerVecinos(casilla) {
        const direcciones = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
        ];

        const vecinos = [];
        for (const dir of direcciones) {
            const nx = casilla.x + dir.x;
            const ny = casilla.y + dir.y;
            if (!this.escenario.colision(nx, ny)) {
                vecinos.push({ x: nx, y: ny });
            }
        }
        return vecinos;
    }

    calcularRutaAEstrella(inicio, objetivo) {
        const clave = (c) => `${c.x},${c.y}`;

        const abiertos = [inicio];
        const vieneDe = new Map();

        const costeG = new Map([[clave(inicio), 0]]);
        const costeF = new Map([[clave(inicio), this.heuristica(inicio, objetivo)]]);

        while (abiertos.length > 0) {
            let indiceActual = 0;
            for (let i = 1; i < abiertos.length; i++) {
                if (costeF.get(clave(abiertos[i])) < costeF.get(clave(abiertos[indiceActual]))) {
                    indiceActual = i;
                }
            }
            const actual = abiertos[indiceActual];

            if (actual.x === objetivo.x && actual.y === objetivo.y) {
                const camino = [actual];
                let claveActual = clave(actual);
                while (vieneDe.has(claveActual)) {
                    const previo = vieneDe.get(claveActual);
                    camino.unshift(previo);
                    claveActual = clave(previo);
                }
                return camino;
            }

            abiertos.splice(indiceActual, 1);

            for (const vecino of this.obtenerVecinos(actual)) {
                const claveVecino = clave(vecino);
                const gTentativo = costeG.get(clave(actual)) + 1;

                if (gTentativo < (costeG.get(claveVecino) ?? Infinity)) {
                    vieneDe.set(claveVecino, actual);
                    costeG.set(claveVecino, gTentativo);
                    costeF.set(claveVecino, gTentativo + this.heuristica(vecino, objetivo));

                    if (!abiertos.some(c => c.x === vecino.x && c.y === vecino.y)) {
                        abiertos.push(vecino);
                    }
                }
            }
        }

        return null;
    }

    actualizarRuta() {
        const casillaActual = this.aCasilla(this.posX, this.posY);
        const casillaObjetivo = this.aCasilla(player.posXPlayer, player.posYPlayer);

        const rutaCalculada = this.calcularRutaAEstrella(casillaActual, casillaObjetivo);

        if (rutaCalculada) {
            this.ruta = rutaCalculada;
            this.rutaIndex = 1;
        }
    }

    avanzarEnAngulo() {
        const movimientoX = Math.cos(this.angulo) * this.velocidad;
        const movimientoY = Math.sin(this.angulo) * this.velocidad;

        const nuevaX = this.posX + movimientoX;
        if (!colision(nuevaX, this.posY, this.radio)) {
            this.posX = nuevaX;
        }

        const nuevaY = this.posY + movimientoY;
        if (!colision(this.posX, nuevaY, this.radio)) {
            this.posY = nuevaY;
        }
    }

    moverse() {
        if (this.ruta && this.rutaIndex < this.ruta.length) {
            const siguienteCasilla = this.ruta[this.rutaIndex];

            const destinoX = siguienteCasilla.x * this.escenario.tamCelda + this.escenario.tamCelda / 2;
            const destinoY = siguienteCasilla.y * this.escenario.tamCelda + this.escenario.tamCelda / 2;

            const dx = destinoX - this.posX;
            const dy = destinoY - this.posY;
            const distanciaAlDestino = Math.hypot(dx, dy);

            if (distanciaAlDestino <= this.velocidad) {
                this.posX = destinoX;
                this.posY = destinoY;
                this.rutaIndex++;
            } else {
                this.angulo = normalizaAngulo(Math.atan2(dy, dx));
                this.ultimoAngulo = this.angulo;
                this.avanzarEnAngulo();
            }
        } else if (this.ultimoAngulo !== undefined) {
            this.angulo = this.ultimoAngulo;
            this.avanzarEnAngulo();
        }
        this.sprite.x = this.posX;
        this.sprite.y = this.posY;
    }

    atacar(player, enemie) {
        const distancia = Math.hypot(
            player.posXPlayer - enemie.posX,
            player.posYPlayer - enemie.posY
        );

        const rangoAtaque = enemie.radio + player.radio;

        if (distancia > rangoAtaque) {
            this.atacando = false;
            return;
        }

        if (this.atacando) return;

        this.atacando = true;

        reproducirSonido('daño');
        player.vida -= 5 + (Math.random() * 5);
        valorSalud.textContent = Math.round(player.vida) + '%';
    }

    reiniciar() {
        this.posX = this.xInicial;
        this.posY = this.yInicial;
        this.angulo = Math.PI / 2;
        this.ruta = null;
        this.rutaIndex = 1;
        this.ultimoAngulo = undefined;

        this.sprite.x = this.posX;
        this.sprite.y = this.posY;
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