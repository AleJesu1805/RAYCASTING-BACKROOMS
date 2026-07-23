document.addEventListener('keydown', (tecla) => {
    switch (tecla.keyCode) {
        case 38:
            player.arriba();
            break;
        case 40:
            player.abajo();
            break;
        case 39:
            player.derecha();
            break;
        case 37:
            player.izquierda();
            break;
    }
});

document.addEventListener('keyup', (tecla) => {
    switch (tecla.keyCode) {
        case 38:
            player.stopAvance();
            break;
        case 40:
            player.stopAvance();
            break;
        case 39:
            player.stopGiro();
            break;
        case 37:
            player.stopGiro();
            break;
    }
    moveCamara = 0;
});