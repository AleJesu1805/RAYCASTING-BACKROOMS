import { canvas, ctx, fx, shadeCanvas, shadeCtx } from "./core/canvas.js";
import { Map } from "./world/Map.js";
import { Player } from "./entities/Player.js";

canvas.width = 1280;
canvas.height = 720;
export const mapa = new Map(ctx);

export const player = new Player(
    (mapa.anchM - 2) * mapa.tamCelda + mapa.tamCelda / 2,
    mapa.tamCelda + mapa.tamCelda / 2,
    mapa, ctx
);

const fps = 70;
const frameDuration = 1000 / fps;
let ultimoTiempo = 0;
function gameLoop(tiempoActual) {
    requestAnimationFrame(gameLoop);
    const delta = tiempoActual - ultimoTiempo;
    if (delta < frameDuration) return;
    ultimoTiempo = tiempoActual - (delta % frameDuration);

    shadeCtx.clearRect(0, 0, shadeCanvas.width, shadeCanvas.height);
    if (player.avanzando !== 0) {
        fx.bobTiempo += delta;
        fx.moveCamara = Math.floor(Math.sin(fx.bobTiempo / 100) * 10);
    } else {
        fx.bobTiempo = 0;
        fx.moveCamara = 0;
    }

    mapa.renderFondo();
    player.renderPlayer();
    mapa.renderMiniMap();
}

requestAnimationFrame(gameLoop);