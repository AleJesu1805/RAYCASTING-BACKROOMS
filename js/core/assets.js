export const imgArma = new Image();
imgArma.src = 'img/armas/imgArmaTrue.webp';

export const explosionArma = new Image();
explosionArma.src = 'img/armas/explosionArma.png';

export const imagenes = [];
export const srcImg = {
    1: 'img/paredesFuturistas/pared5.webp',
    5: 'img/paredesFuturistas/pared1.webp',
    2: 'img/paredesFuturistas/pared2.webp',
    3: 'img/paredesFuturistas/pared3.webp',
    4: 'img/paredesFuturistas/pared4.webp',
}

for (const [img, src] of Object.entries(srcImg)) {
    const imagen = new Image();
    imagen.src = src;
    imagenes.push(imagen);
}



export const sprite1 = new Image();
sprite1.src = 'img/enemigos/niñaEsfeluznante.png';

// export const sprite2 = new Image();
// sprite2.src = 'img/enemigos/enemie2.webp';

// export const sprites = [sprite1, sprite2];



