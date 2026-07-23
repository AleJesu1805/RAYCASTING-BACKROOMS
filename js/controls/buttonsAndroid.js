function girarEnMovil(x, y, rect) {
    if (y < rect.height / 2) { player.arriba() }
    else if (y > rect.height / 2) { player.abajo() }

    // if (x <rect.width/2) {player.izquierda()}
    // else if (x>rect.width/2) {player.derecha()}
}

joystick.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = joystick.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    ballJoystick.style.left = `${x}px`;
    ballJoystick.style.top = `${y}px`;

    girarEnMovil(x, y, rect);
});

joystick.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = joystick.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    if (x < rect.width && x > 0) {
        ballJoystick.style.left = `${x}px`;
    }
    if (y < rect.height && y > 0) {
        ballJoystick.style.top = `${y}px`;
    }
    girarEnMovil(x, y, rect);
});

joystick.addEventListener('touchend', (e) => {
    e.preventDefault();
    ballJoystick.style.left = `50%`;
    ballJoystick.style.top = `50%`;
    player.stopAvance();
});

rangoDePresion.addEventListener('touchstart', (e) => {
    e.preventDefault();
    inicioXDedo = e.touches[0].pageX;
}, { passive: false });

rangoDePresion.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (inicioXDedo > canvas.width / 4) {
        actXDedo = e.touches[0].pageX;
        desplazadoXDedo = actXDedo - inicioXDedo;
        player.angulo += desplazadoXDedo * 0.0025;
        inicioXDedo = actXDedo;
    }
}, { passive: false });

rangoDePresion.addEventListener('touchend', () => {
    desplazadoXDedo = 0;
}, { passive: false });