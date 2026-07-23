import { canvas, ctx } from "./core/canvas.js";
import { Map } from "./world/Map.js";
import { Player } from "./entities/Player.js";

canvas.width = 1280;
canvas.height = 720;
const mapa = new Map(ctx);


const player = new Player(
    (mapa.anchM - 2) * mapa.tamCelda + mapa.tamCelda / 2,
    mapa.tamCelda + mapa.tamCelda / 2,
    mapa, ctx
);

function normalizaAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);
    if (angulo < 0) {
        angulo = (2 * Math.PI) + angulo;
    }
    return angulo;
}

function distanciaEntrePuntos(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function convierteRadianes(angulo) {
    angulo = angulo * (Math.PI / 180);
    return angulo;
}

requestAnimationFrame(gameLoop);