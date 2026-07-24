import { player } from "../main.js";
import { canvas, joystick, ballJoystick, rangoDePresion, touch } from "../core/canvas.js";

function girarEnMovil(x, y, rect) {
    if (y < rect.height / 2) { player.arriba() }
    else if (y > rect.height / 2) { player.abajo() }

    // if (x <rect.width/2) {player.izquierda()}
    // else if (x>rect.width/2) {player.derecha()}
}

joystick.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = joystick.getBoundingClientRect();
    const x = e.changedTouches[0].clientX - rect.left;
    const y = e.changedTouches[0].clientY - rect.top;

    // ballJoystick.style.left = `${x}px`;
    ballJoystick.style.top = `${y}px`;

    girarEnMovil(x, y, rect);
});

joystick.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = joystick.getBoundingClientRect();
    const x = e.targetTouches[0].clientX - rect.left;
    const y = e.targetTouches[0].clientY - rect.top;

        if (!e.targetTouches[0]) {
        player.stopAvance();
        return;
    }

    // if (x < rect.width && x > 0) {
    //     ballJoystick.style.left = `${x}px`;
    // }
    if (y < rect.height && y > 0) {
        ballJoystick.style.top = `${y}px`;
    }
    girarEnMovil(x, y, rect);
});

joystick.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (e.targetTouches.length === 0) {
        ballJoystick.style.left = `50%`;
        ballJoystick.style.top = `50%`;
        player.stopAvance();
    }
});

rangoDePresion.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touch.inicioXDedo = e.changedTouches[0].pageX;
}, { passive: false });

rangoDePresion.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!e.targetTouches[0]) return;
    if (touch.inicioXDedo > canvas.width / 4) {
        touch.actXDedo = e.targetTouches[0].pageX;
        touch.desplazadoXDedo = touch.actXDedo - touch.inicioXDedo;
        player.angulo += touch.desplazadoXDedo * 0.0025;
        touch.inicioXDedo = touch.actXDedo;
    }
}, { passive: false });

rangoDePresion.addEventListener('touchend', () => {
    touch.desplazadoXDedo = 0;
}, { passive: false });