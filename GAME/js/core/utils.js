// js/core/utils.js
import { mapa } from "../main.js";
import { Map } from "../world/Map.js"

export function normalizaAngulo(angulo) {
    angulo = angulo % (2 * Math.PI);
    if (angulo < 0) {
        angulo = (2 * Math.PI) + angulo;
    }
    return angulo;
}

export function distanciaEntrePuntos(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export function convierteRadianes(angulo) {
    angulo = angulo * (Math.PI / 180);
    return angulo;
}

export function colision(x, y, radio) {
    const puntos = [
        [x, y],
        [x + radio, y],
        [x - radio, y],
        [x, y + radio],
        [x, y - radio],
    ];

    for (const [px, py] of puntos) {
        let casillaX = Math.floor(px / mapa.tamCelda);
        let casillaY = Math.floor(py / mapa.tamCelda);
        if (mapa.colision(casillaX, casillaY)) {
            return true;
        }
    }
    return false;
}