import { canvas, ctx, shadeCanvas, shadeCtx, viewCanvas, viewCtx, fx } from "./core/canvas.js";
import { Map } from "./world/Map.js";
import { Player } from "./entities/Player.js";
import { imagenes } from "./core/assets.js";

export const mapa = new Map(ctx);
export const player = new Player(
    mapa.tamCelda * 27,
    mapa.tamCelda * 5,
    mapa, ctx
);

player.arriba();
player.renderPlayer();
setTimeout(() => player.stopAvance(), 200);

// function renderFrameInicial() {

//     mapa.renderFondo();
//     player.lanzarRayos();
//     viewCtx.clearRect(0, 0, canvas.width, canvas.height);
//     viewCtx.drawImage(canvas, 0, 0);
//     viewCtx.globalAlpha = 0.6;
//     viewCtx.drawImage(shadeCanvas, 0, 0);
//     viewCtx.globalAlpha = 1;
//     ctx.drawImage(viewCanvas, 0, 0);
//     mapa.renderMiniMap();
//     mapa.renderPlayerInMinimap(player);
// }

// function iniciarRecursos() {
//     let cargadas = 0;

//     if (imagenes.every((img) => img.complete)) {
//         renderFrameInicial();
//         return;
//     }

//     imagenes.forEach((img) => {
//         if (img.complete) {
//             cargadas++;
//             if (cargadas === imagenes.length) {
//                 renderFrameInicial();
//             }
//             return;
//         }

//         img.onload = () => {
//             cargadas++;
//             if (cargadas === imagenes.length) {
//                 renderFrameInicial();
//             }
//         };
//     });
// }
// iniciarRecursos();


const fps = 60;
const frameDuration = 1000 / fps;
let ultimoTiempo = 0;

function gameLoop(tiempoActual) {
    requestAnimationFrame(gameLoop);
    const delta = tiempoActual - ultimoTiempo;
    if (delta < frameDuration) return;
    ultimoTiempo = tiempoActual - (delta % frameDuration);

    // shadeCtx.clearRect(0, mapa.tamMiniMap, shadeCanvas.width, shadeCanvas.height-mapa.tamMiniMap);
    // shadeCtx.clearRect(mapa.tamMiniMap, 0, shadeCanvas.width-mapa.tamMiniMap, shadeCanvas.height);

    // shadeCtx.clearRect(0, 0, canvas.width, canvas.height);
    mapa.renderFondo();
    // mapa.renderMap();

    if (player.avanzando !== 0 || player.girando !== 0) {
        shadeCtx.clearRect(0, 0, canvas.width, canvas.height);
        // mapa.renderFondo();

        fx.bobTiempo += delta;
        fx.moveCamara = Math.floor(Math.sin(fx.bobTiempo / 100) * 6);
        player.renderPlayer();

        viewCtx.clearRect(0, 0, canvas.width, canvas.height);
        viewCtx.drawImage(canvas, 0, 0);
        // viewCtx.drawImage(shadeCanvas, 0, 0);
    } else {
        fx.bobTiempo = 0;
        fx.moveCamara = 0;
        ctx.drawImage(viewCanvas, 0, 0);
    }
    player.renderArma();
    mapa.renderMiniMap();
    mapa.renderPlayerInMinimap(player);
}
requestAnimationFrame(gameLoop);