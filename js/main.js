import { canvas, ctx, shadeCanvas, shadeCtx, viewCanvas, viewCtx, touch, fx } from "./core/canvas.js";
import { Map } from "./world/Map.js";
import { Player } from "./entities/Player.js";
import { Enemies } from "./entities/Enemies.js";
import { Sprite } from "./entities/Sprite.js";
import { imagenes } from "./core/assets.js";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
}

export const mapa = new Map(ctx);
export const player = new Player(
    mapa.tamCelda * 5,
    mapa.tamCelda * 1.5,
    mapa, ctx
);

export const enemie1 = new Enemies(
    mapa.tamCelda * (mapa.anchM - 2),
    mapa.tamCelda * 1.5,
    mapa.tamCelda * (mapa.anchM - 2),
    mapa.tamCelda * 1.5,
    mapa, ctx, 1 * (Math.random() + 1)
);
export const enemie2 = new Enemies(
    mapa.tamCelda * 3.5,
    mapa.tamCelda * 7,
    mapa.tamCelda * 3.5,
    mapa.tamCelda * 7,
    mapa, ctx, 1 * (Math.random() + 1)
);

export const enemies = [enemie1, enemie2];

function renderFrameInicial() {
    mapa.renderFondo();
    player.lanzarRayos();
    player.renderArma();

    viewCtx.clearRect(0, 0, canvas.width, canvas.height);
    viewCtx.drawImage(canvas, 0, 0);
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

const INTERVALO_RECALCULO_RUTA = 120;
let frameCount = 0;

function gameLoop(tiempoActual) {
    requestAnimationFrame(gameLoop);
    const delta = tiempoActual - ultimoTiempo;
    if (delta < frameDuration) return;
    ultimoTiempo = tiempoActual - (delta % frameDuration);

    if (player.avanzando !== 0 || player.girando !== 0 || touch.girandoCamara) {
        shadeCtx.clearRect(0, 0, canvas.width, canvas.height);
        mapa.renderFondo();

        if (player.avanzando !== 0) {
            fx.bobTiempo += delta;
            fx.moveCamara = Math.floor(Math.sin(fx.bobTiempo / 100) * player.avanzando * 8);
        }
        // console.log(fx.bobTiempo, fx.moveCamara);


        player.moverPersonaje();
        // player.lanzarRayos();

        viewCtx.clearRect(0, 0, canvas.width, canvas.height);
        viewCtx.drawImage(canvas, 0, 0);
        ctx.drawImage(viewCanvas, 0, 0);
    } else {
        fx.bobTiempo = 0;
        fx.moveCamara = 0;
        ctx.drawImage(viewCanvas, 0, 0);
    }
    player.comprobarDisparo();

    const debeRecalcularRuta = frameCount % INTERVALO_RECALCULO_RUTA === 0;
    frameCount++;

    [...enemies]
        .sort((a, b) => b.sprite.distancia - a.sprite.distancia)
        .forEach(e => {
            e.sprite.dibuja()
            if (debeRecalcularRuta) e.actualizarRuta();
            e.moverse();
            // e.renderizarEnemie2d();
            // e.lanzarRayo();
        });
    // mapa.renderMap();
    // player.lanzarRayos();
    // player.renderPlayer2d();
    player.renderArma();
    mapa.renderMiniMap();
    mapa.renderEntitieInMinimap(player, player.posXPlayer, player.posYPlayer, '#0d5a0d');
    mapa.renderEntitieInMinimap(enemie1, enemie1.posX, enemie1.posY, '#6b1212');
    mapa.renderEntitieInMinimap(enemie2, enemie2.posX, enemie2.posY, '#6b1212');
}

document.querySelector('button[onclick="jugar()"]').addEventListener('pointerdown', () => {
    requestAnimationFrame(gameLoop);
});