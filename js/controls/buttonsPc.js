import { canvas } from "../core/canvas.js";
import { player } from "../main.js";

document.addEventListener('keydown', (tecla) => {
    switch (tecla.keyCode) {
        case 87:
        case 69:
            player.arriba();
            break;
        case 83:
            player.abajo();
            break;
        case 68:
            player.derecha();
            break;
        case 65:
            player.izquierda();
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
            player.stopAvance();
            break;
        case 83:
            player.stopAvance();
            break;
        case 68:
            player.stopGiro();
            break;
        case 65:
            player.stopGiro();
            break;
    }
});