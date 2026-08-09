import { canvas, shadeCanvas, viewCtx, resolucionRayos, shadeCtx, FOV } from "../core/canvas.js";
import { convierteRadianes, normalizaAngulo, colision } from "../core/utils.js";
import { enemie1, player } from "../main.js";
import { Rayo } from "../world/Rayo.js";
import { Player } from "./Player.js";
import { Sprite } from "./Sprite.js";
import { sprite1 } from "../core/assets.js";

export class Enemies {
    constructor(x, y, escenario, ctx, velocidad) {
        this.posX = x;
        this.posY = y;
        this.escenario = escenario;
        this.ctx = ctx;
        this.radio = escenario.tamCelda / 3;

        this.min = Math.ceil(Math.PI / 2);
        this.max = Math.floor(Math.PI);

        this.angulo = Math.PI / 2;
        this.velocidad = velocidad;

        this.rayo = new Rayo(this.ctx, this.escenario, this.posX, this.posY, this.angulo, 0, 0);
        this.sprite = new Sprite(this.posX, this.posY, sprite1, this.ctx);
    }

    lanzarRayo() {
        this.rayo.x = this.posX;
        this.rayo.y = this.posY;
        this.rayo.setAngulo(this.angulo);
        this.rayo.renderRayo();
    }

    // Convierte una posición en píxeles a coordenadas de casilla del mapa (fila/columna de la matriz)
    aCasilla(x, y) {
        return {
            x: Math.floor(x / this.escenario.tamCelda),
            y: Math.floor(y / this.escenario.tamCelda)
        };
    }

    // Heurística de distancia Manhattan usada por A* (coincide con el movimiento en 4 direcciones)
    heuristica(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    // Devuelve las casillas vecinas (arriba, abajo, izquierda, derecha) que no son pared
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

    // Algoritmo A*: devuelve el arreglo de casillas (de inicio a objetivo) del camino más corto,
    // o null si no existe un camino posible entre ambas casillas
    calcularRutaAEstrella(inicio, objetivo) {
        const clave = (c) => `${c.x},${c.y}`;

        const abiertos = [inicio];
        const vieneDe = new Map();

        const costeG = new Map([[clave(inicio), 0]]);
        const costeF = new Map([[clave(inicio), this.heuristica(inicio, objetivo)]]);

        while (abiertos.length > 0) {
            // Busca en la lista de abiertos la casilla con menor costeF (f = g + h)
            let indiceActual = 0;
            for (let i = 1; i < abiertos.length; i++) {
                if (costeF.get(clave(abiertos[i])) < costeF.get(clave(abiertos[indiceActual]))) {
                    indiceActual = i;
                }
            }
            const actual = abiertos[indiceActual];

            // Si llegamos a la casilla objetivo, reconstruimos el camino recorriendo vieneDe hacia atrás
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

    moverse() {
        // PERSEGUIR AL JUGADOR USANDO A*
        const casillaActual = this.aCasilla(this.posX, this.posY);
        const casillaObjetivo = this.aCasilla(player.posXPlayer, player.posYPlayer);

        const ruta = this.calcularRutaAEstrella(casillaActual, casillaObjetivo);

        // ruta[0] es la casilla donde ya está el enemigo, ruta[1] es el siguiente paso a dar
        if (ruta && ruta.length > 1) {
            const siguienteCasilla = ruta[1];

            // Centro en píxeles de la siguiente casilla del camino
            const destinoX = siguienteCasilla.x * this.escenario.tamCelda + this.escenario.tamCelda / 2;
            const destinoY = siguienteCasilla.y * this.escenario.tamCelda + this.escenario.tamCelda / 2;

            this.angulo = normalizaAngulo(Math.atan2(destinoY - this.posY, destinoX - this.posX));

            let movimientoX = Math.cos(this.angulo) * this.velocidad;
            let movimientoY = Math.sin(this.angulo) * this.velocidad;

            let nuevaX = this.posX + movimientoX;
            if (!colision(nuevaX, this.posY, this.radio)) {
                this.posX = nuevaX;
            }

            let nuevaY = this.posY + movimientoY;
            if (!colision(this.posX, nuevaY, this.radio)) {
                this.posY = nuevaY;
            }
        }

        this.sprite.x = this.posX;
        this.sprite.y = this.posY;
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