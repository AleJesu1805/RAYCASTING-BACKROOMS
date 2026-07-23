// js/core/utils.js
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