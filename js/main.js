import { canvas, ctx, shadeCanvas, shadeCtx, viewCanvas, viewCtx, fx } from "./core/canvas.js";
import { Map } from "./world/Map.js";
import { Player } from "./entities/Player.js";

export const mapa = new Map(ctx);
export const player = new Player(
    (mapa.anchM - 2) * mapa.tamCelda + mapa.tamCelda / 2,
    mapa.tamCelda + mapa.tamCelda / 2,
    mapa, ctx
);

player.lanzarRayos();
mapa.renderFondo();
viewCtx.clearRect(0, 0, canvas.width, canvas.height);
viewCtx.drawImage(canvas, 0, 0);
viewCtx.drawImage(shadeCanvas, 0, 0);
ctx.drawImage(viewCanvas, 0, 0);

const fps = 50;
const frameDuration = 1000 / fps;
let ultimoTiempo = 0;

function gameLoop(tiempoActual) {
    requestAnimationFrame(gameLoop);
    const delta = tiempoActual - ultimoTiempo;
    if (delta < frameDuration) return;
    ultimoTiempo = tiempoActual - (delta % frameDuration);

    // shadeCtx.clearRect(0, mapa.tamMiniMap, shadeCanvas.width, shadeCanvas.height-mapa.tamMiniMap);
    // shadeCtx.clearRect(mapa.tamMiniMap, 0, shadeCanvas.width-mapa.tamMiniMap, shadeCanvas.height);

    shadeCtx.clearRect(0, 0, canvas.width, canvas.height);
    mapa.renderFondo();
    // mapa.renderMap();

    if (player.avanzando !== 0 || player.girando !== 0) {
        fx.bobTiempo += delta;
        fx.moveCamara = Math.floor(Math.sin(fx.bobTiempo / 100) * 6);
        player.renderPlayer();

        viewCtx.clearRect(0, 0, canvas.width, canvas.height);
        viewCtx.drawImage(canvas, 0, 0);
        viewCtx.drawImage(shadeCanvas, 0, 0);
    } else {
        fx.bobTiempo = 0;
        fx.moveCamara = 0;
        ctx.drawImage(viewCanvas, 0, 0);
    }
    // mapa.renderMiniMap();
    // mapa.renderPlayerInMinimap(player);
    player.renderArma();
}
requestAnimationFrame(gameLoop);