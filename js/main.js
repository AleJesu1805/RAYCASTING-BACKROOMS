import { canvas, ctx, shadeCanvas, shadeCtx, viewCanvas, viewCtx, fx, touch } from "./core/canvas.js";
import { Map } from "./world/Map.js";
import { Player } from "./entities/Player.js";
import { Enemies } from "./entities/Enemies.js";
import { Sprite } from "./entities/Sprite.js";
import { imagenes } from "./core/assets.js";

export const mapa = new Map(ctx);
export const player = new Player(
    mapa.tamCelda * 5,
    mapa.tamCelda * 1.5,
    mapa, ctx
);

export const enemie1 = new Enemies(
    mapa.tamCelda * 6,
    mapa.tamCelda * 1.5,
    mapa, ctx
);
export const enemie2 = new Enemies(
    mapa.tamCelda * 4,
    mapa.tamCelda * 10,
    mapa, ctx
);

export const enemies = [enemie1, enemie2];

function renderFrameInicial() {
    mapa.renderFondo();
    player.lanzarRayos();
    player.renderArma();

    viewCtx.clearRect(0, 0, canvas.width, canvas.height);
    viewCtx.drawImage(canvas, 0, 0);
    // viewCtx.globalAlpha = 0.6;
    // viewCtx.drawImage(shadeCanvas, 0, 0);
    // viewCtx.globalAlpha = 1;
    ctx.drawImage(viewCanvas, 0, 0);
    mapa.renderMiniMap();
}

function iniciarRecursos() {
    let cargadas = 0;

    if (imagenes.every((img) => img.complete)) {
        renderFrameInicial();
        return;
    }

    imagenes.forEach((img) => {
        if (img.complete) {
            cargadas++;
            if (cargadas === imagenes.length) {
                renderFrameInicial();
            }
            return;
        }

        img.onload = () => {
            cargadas++;
            if (cargadas === imagenes.length) {
                renderFrameInicial();
            }
        };
    });
}
iniciarRecursos();

const fps = 60;
const frameDuration = 1000 / fps;
let ultimoTiempo = 0;

function gameLoop(tiempoActual) {
    requestAnimationFrame(gameLoop);
    const delta = tiempoActual - ultimoTiempo;
    if (delta < frameDuration) return;
    ultimoTiempo = tiempoActual - (delta % frameDuration);

    if (player.avanzando !== 0 || player.girando !== 0 || touch.girandoCamara) {
        shadeCtx.clearRect(0, 0, canvas.width, canvas.height);
        mapa.renderFondo();

        fx.bobTiempo += delta;
        fx.moveCamara = Math.floor(Math.sin(fx.bobTiempo / 100) * 6);
        // console.log(fx.bobTiempo, fx.moveCamara);


        player.moverPersonaje();
        // player.lanzarRayos();

        viewCtx.clearRect(0, 0, canvas.width, canvas.height);
        viewCtx.drawImage(canvas, 0, 0);
        // viewCtx.globalAlpha = 0.6;
        // viewCtx.drawImage(shadeCanvas, 0, 0);
        // viewCtx.globalAlpha = 1;
        ctx.drawImage(viewCanvas, 0, 0);
    } else {
        fx.bobTiempo = 0;
        fx.moveCamara = 0;
        ctx.drawImage(viewCanvas, 0, 0);
    }
    player.comprobarDisparo();

    [...enemies]
        // .map(e => { e.sprite.calculaDistancia(); return e; })
        .sort((a, b) => b.sprite.distancia - a.sprite.distancia)
        .forEach(e => e.sprite.dibuja());
    // mapa.renderMap();
    // player.lanzarRayos();
    // player.renderPlayer2d();
    enemies.forEach((enemie) => {
        // enemie.renderizarEnemie2d();
        // enemie.lanzarRayo();
        enemie.moverse();
    });
    player.renderArma();
    mapa.renderMiniMap();
    mapa.renderEntitieInMinimap(player, player.posXPlayer, player.posYPlayer, '#0d5a0d');
    mapa.renderEntitieInMinimap(enemie1, enemie1.posX, enemie1.posY, '#6b1212');
    mapa.renderEntitieInMinimap(enemie2, enemie2.posX, enemie2.posY, '#6b1212');
}
requestAnimationFrame(gameLoop);