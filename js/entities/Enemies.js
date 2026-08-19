import { canvas, shadeCanvas, viewCtx, resolucionRayos, shadeCtx, FOV } from "../core/canvas.js";
import { convierteRadianes, normalizaAngulo, colision } from "../core/utils.js";
import { enemie1, player } from "../main.js";
import { Rayo } from "../world/Rayo.js";
import { Player } from "./Player.js";
import { Sprite } from "./Sprite.js";
import { sprite1 } from "../core/assets.js";
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

        // Guarda la última ruta calculada por A* para que moverse() la reutilice
        // entre recálculos (ver actualizarRuta()).
        this.ruta = null;

        // Índice del PRÓXIMO waypoint (casilla) de this.ruta hacia el que se está
        // moviendo el enemigo. Antes moverse() siempre apuntaba a ruta[1] fijo;
        // ahora avanza este índice a medida que se alcanza cada casilla, para
        // recorrer TODA la ruta (no solo el primer paso) entre recálculos.
        this.rutaIndex = 1;

        // Guarda el último ángulo de movimiento válido. Se usa como fallback
        // en moverse() cuando ya se recorrió toda la ruta disponible (o nunca
        // hubo una), para que el enemigo siga avanzando en línea recta en esa
        // dirección en vez de quedarse trabado esperando el próximo recálculo.
        this.ultimoAngulo = undefined;
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

    // Recalcula la ruta hacia el jugador con A* y la guarda en this.ruta.
    // Es la parte costosa (recorre el grafo de casillas), por eso en main.js
    // se llama solo cada N frames en lugar de en cada frame.
    actualizarRuta() {
        const casillaActual = this.aCasilla(this.posX, this.posY);
        const casillaObjetivo = this.aCasilla(player.posXPlayer, player.posYPlayer);

        const rutaCalculada = this.calcularRutaAEstrella(casillaActual, casillaObjetivo);

        // Si A* no encuentra camino (p. ej. el objetivo queda momentáneamente
        // inalcanzable), NO sobreescribimos this.ruta con null: conservamos la
        // última ruta válida para que moverse() pueda seguir usándola/usando
        // su dirección en vez de trabarse.
        if (rutaCalculada) {
            this.ruta = rutaCalculada;
            this.rutaIndex = 1; // ruta[0] es la casilla actual; el primer objetivo es ruta[1]
        }
    }

    // Aplica el movimiento (cos/sin * velocidad) en el ángulo actual,
    // respetando colisiones en X e Y por separado (permite "deslizar" sobre paredes).
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
        // ACTUALIZACIÓN DE MOVIMIENTO: avanza usando la última ruta calculada
        // por actualizarRuta() (this.ruta), sin volver a ejecutar A* aquí.
        // ruta[0] es la casilla donde ya está el enemigo; this.rutaIndex apunta
        // al PRÓXIMO waypoint objetivo dentro de la ruta (empieza en 1).
        //
        // Antes esto siempre apuntaba a ruta[1] fijo: al llegar a esa casilla
        // (mucho antes del siguiente recálculo, porque cruzar una celda es más
        // rápido que 60 frames) el enemigo se pasaba de largo del punto cada
        // frame, invirtiendo el ángulo una y otra vez -> oscilación adelante/atrás.
        // Ahora se avanza this.rutaIndex al llegar a cada waypoint, recorriendo
        // TODA la ruta calculada en vez de quedarse pegado al primer paso.
        if (this.ruta && this.rutaIndex < this.ruta.length) {
            const siguienteCasilla = this.ruta[this.rutaIndex];

            const destinoX = siguienteCasilla.x * this.escenario.tamCelda + this.escenario.tamCelda / 2;
            const destinoY = siguienteCasilla.y * this.escenario.tamCelda + this.escenario.tamCelda / 2;

            const dx = destinoX - this.posX;
            const dy = destinoY - this.posY;
            const distanciaAlDestino = Math.hypot(dx, dy);

            if (distanciaAlDestino <= this.velocidad) {
                // Ya estamos a un paso o menos del centro de la casilla: nos
                // "enganchamos" a ese punto exacto y pasamos al siguiente
                // waypoint, en vez de seguir persiguiéndolo y pasarnos de largo
                // (eso era lo que causaba el vaivén adelante/atrás).
                this.posX = destinoX;
                this.posY = destinoY;
                this.rutaIndex++;
            } else {
                this.angulo = normalizaAngulo(Math.atan2(dy, dx));
                this.ultimoAngulo = this.angulo;
                this.avanzarEnAngulo();
            }
        } else if (this.ultimoAngulo !== undefined) {
            // Ya recorrimos todos los waypoints de la ruta calculada (o nunca
            // hubo una) y todavía no toca recalcular. En vez de quedarnos
            // trabados, seguimos avanzando en línea recta en la última
            // dirección conocida hasta el próximo recálculo.
            this.angulo = this.ultimoAngulo;
            this.avanzarEnAngulo();
        }
        // Si no hay ruta ni ultimoAngulo (antes del primer recálculo), el
        // enemigo simplemente no se mueve todavía: no hay hacia dónde ir.

        this.sprite.x = this.posX;
        this.sprite.y = this.posY;
    }

    atacar(player, enemie) {
        const distancia = Math.hypot(
            player.posXPlayer - enemie.posX,
            player.posYPlayer - enemie.posY
        );

        const rangoAtaque = enemie.radio + player.radio;

        if (distancia <= rangoAtaque) {
            player.vida -= 10 + Math.round(Math.random() * 5);
            valorSalud.textContent = Math.round(player.vida / 10) + '%';
        }
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