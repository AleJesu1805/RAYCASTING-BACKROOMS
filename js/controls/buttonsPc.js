import { canvas, fx } from "../core/canvas.js";
import { player } from "../main.js";

document.addEventListener('keydown', (tecla) => {
    switch (tecla.keyCode) {
        case 87:
        case 82:
            player.avanzando = 1;
            fx.moveCamara = 0;
            break;
        case 83:
            player.avanzando = -1;
            fx.moveCamara = 0;
            break;
        case 68:
            player.girando = 0.5;
            break;
        case 65:
            player.girando = -0.5;
            break;
        case 69:
            player.girando = 1.5;
            break;
        case 81:
            player.girando = -1.5;
            break;
    }
});

document.addEventListener('keydown', (tecla) => {
    if (tecla.repeat) return;
    if (tecla.keyCode === 32) {
        player.disparando = true;
    }
});

document.addEventListener('keyup', (tecla) => {
    switch (tecla.keyCode) {
        case 87:
            player.avanzando = 0;
            break;
        case 83:
            player.avanzando = 0;
            break;
        case 68:
            player.girando = 0;
            break;
        case 65:
            player.girando = 0;
            break;
        case 69:
            player.girando = 0;
            break;
        case 81:
            player.girando = 0;
            break;
    }
});