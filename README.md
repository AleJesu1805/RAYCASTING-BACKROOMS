# DySToPHy — RAYCASTING-BACKROOMS

FPS 2.5D construido desde cero en **JavaScript vanilla** (ES Modules) sobre la **API de Canvas 2D de HTML5**, sin motores ni frameworks. Usa la técnica de **raycasting** clásica de `Wolfenstein 3D` y `DOOM (1993)` para simular un mundo 3D a partir de un mapa 2D en forma de matriz.

El objetivo es sobrevivir el mayor tiempo posible: los enemigos persiguen al jugador con pathfinding A* y, al ser abatidos, no mueren — se teletransportan a otro punto del mapa y vuelven a la caza. La partida es, en teoría, infinita.

Pensado y optimizado para correr fluido en **mobile de gama baja** (probado específicamente en un Motorola G04), además de PC.

## Índice

- [Motor de raycasting](#motor-de-raycasting)
- [Renderizado de paredes](#renderizado-de-paredes)
- [Sprites y oclusión (Z-buffer)](#sprites-y-oclusión-z-buffer)
- [IA de enemigos: A* + waypoints](#ia-de-enemigos-a--waypoints)
- [Optimizaciones de rendimiento](#optimizaciones-de-rendimiento)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Controles](#controles)
- [Cómo correrlo localmente](#cómo-correrlo-localmente)
- [Tecnologías](#tecnologías)
- [Créditos](#créditos)

## Motor de raycasting

Cada columna vertical de la pantalla se resuelve lanzando un rayo desde la posición del jugador (`Rayo.cast()`). En vez del DDA "puro" de una sola pasada, el algoritmo sigue el enfoque clásico de **intersecciones horizontales y verticales por separado**:

1. Se calcula dónde cruza el rayo la primera línea de rejilla **horizontal** (`yIntercept`) y se avanza en pasos (`xStep`, `yStep`) celda por celda hasta chocar con una pared.
2. Se repite el mismo proceso para las líneas de rejilla **verticales**.
3. Se comparan ambas distancias (`distanciaHorizontal` vs `distanciaVertical`) y se queda con el impacto más cercano — así siempre se detecta la primera superficie sólida en el camino del rayo.

```js
if (distanciaHorizontal < distanciaVertical) {
    this.wallHitX = this.wallHitXHorizontal;
    this.distancia = distanciaHorizontal;
} else {
    this.wallHitX = this.wallHitXVertical;
    this.distancia = distanciaVertical;
}
```

**Corrección de ojo de pez:** la distancia de cada rayo se multiplica por el coseno del ángulo entre el rayo y la dirección de la cámara, para que las paredes no se vean curvadas al acercarse a los bordes del FOV:

```js
this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));
```

**Mapeo de textura:** el punto exacto de impacto dentro de la celda (`pixelTextura`) se usa para elegir qué columna de píxeles de la textura de la pared dibujar, dando el efecto de textura continua en vez de una pared de color plano.

FOV = 60°, y en lugar de lanzar un rayo por cada píxel de ancho, se lanza uno cada `resolucionRayos = 3` píxeles (ver [optimizaciones](#optimizaciones-de-rendimiento)).

## Renderizado de paredes

Con la distancia corregida de cada rayo, `Rayo.renderPared()` proyecta la altura de la pared en pantalla usando la fórmula estándar de proyección en perspectiva:

```js
let distanciaPlanoProyeccion = (canvas.width / 2) / Math.tan(FOV / 2);
let altoMuro = altoTile / this.distancia * distanciaPlanoProyeccion;
```

Cuanto más lejos está la pared, más pequeño es `altoMuro`; cuanto más cerca, más domina la pantalla. Cada franja se dibuja con un único `drawImage` que recorta una tira de **1 px de ancho** de la textura original (`this.pixelTextura`) y la estira verticalmente a `altoMuro`, con `imageSmoothingEnabled = false` para mantener el aspecto pixelado sin que el navegador suavice los bordes.

La distancia final de cada columna se guarda en un **Z-buffer** (`zBuffer[columna]`), que es la pieza clave para que los sprites (enemigos) sepan si están tapados por una pared.

## Sprites y oclusión (Z-buffer)

Los enemigos son sprites 2D que se posicionan como si fueran "billboards" siempre de cara a la cámara (`Sprite.dibuja()`):

- Se calcula el ángulo del sprite respecto al jugador y se descarta si cae fuera del FOV (culling temprano, evita trabajo innecesario).
- Se escala con **la misma fórmula de proyección que las paredes** (`altoTile / distancia * distanciaPlanoProyeccion`), para que un enemigo a la misma distancia que una pared se vea del mismo tamaño relativo — coherencia visual entre geometría "3D" y sprites 2D.
- En vez de recorrer la imagen columna nativa por columna nativa (costoso para un sprite ancho), se avanza en pantalla de `resolucionRayos` en `resolucionRayos` píxeles — igual que el motor ya hace para las paredes — y por cada franja se muestrea el **rango** correspondiente de píxeles fuente en lugar de una sola columna estirada, evitando aliasing y huecos por transparencia.
- Antes de dibujar cada franja se compara contra el `zBuffer` de esa columna: si hay una pared más cerca, esa franja del sprite simplemente no se dibuja.

```js
if (zBuffer[columnaRayo] <= this.distancia) continue; // hay una pared más cerca, no se dibuja
```

Los enemigos se ordenan por distancia (de más lejano a más cercano) antes de dibujarse cada frame, como un painter's algorithm sencillo.

## IA de enemigos: A* + waypoints

Cada enemigo (`Enemies.js`) navega el mapa con **A\*** sobre la cuadrícula de celdas del mapa, con heurística de distancia Manhattan:

```js
heuristica(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
```

El camino resultante se sigue como una lista de **waypoints**: el enemigo avanza en línea recta hacia el centro de la siguiente celda del camino y, al llegar, pasa a la siguiente — sin depender de recalcular la ruta en cada frame.

Al recibir un disparo, el enemigo no desaparece: se teletransporta a una celda libre elegida al azar a una distancia mínima de 10 celdas del jugador, se le limpia la ruta actual y se le asigna una nueva velocidad aleatoria, de forma que vuelva a perseguir desde una posición distinta.

## Optimizaciones de rendimiento

El renderizado por raycasting (5 enemigos + una pasada de rayos por columna de pantalla) es, con diferencia, lo más caro de cada frame en un dispositivo de gama baja. Las optimizaciones principales:

- **Render condicional al movimiento.** Si el jugador está completamente quieto (no avanza, no gira, no está rotando la cámara por touch), el juego *no vuelve a lanzar rayos ni redibujar la escena*. En su lugar reutiliza el último frame, que quedó guardado en un `viewCanvas` off-screen, y simplemente lo vuelve a pintar. Es la optimización más importante del proyecto: evita repetir el trabajo más costoso (raycasting completo) cuando no hay nada que haya cambiado visualmente.
- **Resolución de rayos reducida.** En lugar de lanzar un rayo por cada píxel de ancho del canvas, se lanza uno cada `resolucionRayos = 3` píxeles, dibujando franjas de 3px en vez de columnas de 1px. Esto reduce a un tercio la cantidad de rayos, colisiones DDA y llamadas a `drawImage` por frame, con una pérdida de definición prácticamente imperceptible.
- **Bucle a FPS fijo.** El `gameLoop` corre sobre `requestAnimationFrame` pero acumula el delta de tiempo y descarta frames hasta completar `1000/60` ms, desacoplando la lógica del refresco real del dispositivo y evitando trabajo de más en pantallas de alta tasa de refresco.
- **Recalculo de rutas A\* limitado.** Cada enemigo solo vuelve a correr A* completo cada `120` frames (`INTERVALO_RECALCULO_RUTA`), no en cada frame; entre medio simplemente sigue el camino ya calculado. Buscar rutas es la segunda operación más cara del juego tras el raycasting, y no hace falta recalcularla constantemente para que la persecución se vea fluida.
- **Z-buffer compartido.** El mismo arreglo de distancias por columna que generan las paredes se reutiliza para decidir la oclusión de los sprites, evitando un segundo sistema de raycasting solo para enemigos.
- **Carga de assets con verificación previa.** El primer frame no se renderiza hasta confirmar que todas las imágenes (`imagenes.every(img => img.complete)`) terminaron de cargar, evitando dibujar texturas a medio cargar o relanzar el primer render varias veces.
- **Precarga de audio en un Web Worker aparte** (`workers/worker.js`), para que la descarga de los archivos de audio no bloquee el hilo principal mientras el juego ya está corriendo.
- **Service Worker con caché *network-first* + reconstrucción manual de `Range` requests.** Cachea automáticamente cualquier archivo que el navegador pida (sin necesidad de mantener una lista manual), sirviendo siempre la versión de red más reciente cuando hay conexión y cayendo a caché offline cuando no la hay. Como la Cache API no admite guardar respuestas `206 Partial Content`, los audios pedidos por rangos de bytes se resuelven descargando el archivo completo una sola vez, cacheándolo entero, y recortando a mano el rango pedido — necesario para que el reproductor de audio funcione igual con y sin conexión.

## Estructura del proyecto

```
RAYCASTING-BACKROOMS/
├── index.html              # Pantalla de bienvenida
├── sw.js                   # Service Worker (caché offline + Range requests)
├── GAME/
│   ├── index.html          # Punto de entrada del juego
│   └── js/
│       ├── main.js         # Game loop, instancias de jugador/enemigos
│       ├── core/
│       │   ├── canvas.js   # Canvas, FOV, resolucionRayos, zBuffer, estado touch
│       │   ├── assets.js   # Carga de texturas y sprites
│       │   ├── audio.js    # Sistema de audio
│       │   └── utils.js    # Helpers (ángulos, distancias, colisión)
│       ├── world/
│       │   ├── Rayo.js     # Motor de raycasting y renderizado de paredes
│       │   └── Map.js      # Matriz del mapa, minimapa, colisiones
│       ├── entities/
│       │   ├── Player.js   # Movimiento, disparo, lanzamiento de rayos
│       │   ├── Enemies.js  # IA, A*, ataque, teletransporte
│       │   └── Sprite.js   # Renderizado de sprites con Z-buffer
│       ├── controls/       # Input de PC (teclado) y Android (touch)
│       ├── ui/              # Panel de configuración
│       └── workers/         # Web Worker de precarga de audio
```

## Controles

**PC (teclado):**
- `W` / `R` — avanzar
- `S` — retroceder
- `A` / `D` — girar cámara
- `Q` / `E` — giro rápido
- `Espacio` — disparar

**Móvil (touch):** joystick virtual para movimiento + botones táctiles para disparar y girar la cámara.

## Cómo correrlo localmente

El proyecto usa ES Modules y un Service Worker, así que necesita servirse por HTTP (no funciona abriendo el `.html` directo con `file://`):

```bash
git clone https://github.com/AleJesu1805/RAYCASTING-BACKROOMS.git
cd RAYCASTING-BACKROOMS
npx serve .
# o: python -m http.server
```

Y abrir la URL que indique el servidor local.

## Tecnologías

- JavaScript vanilla (ES Modules), sin frameworks ni librerías de terceros
- HTML5 Canvas 2D API
- CSS
- Service Worker API (caché offline / soporte PWA)
- Web App Manifest

## Créditos

La lógica base del raycasting (proyección de rayos y renderizado de paredes) parte del prototipo de [javiermunizyt](https://github.com/javiermunizyt/raycasting-html5). El resto del juego —mapa, IA de enemigos con A*, sistema de disparo y teletransporte, sprites con oclusión por Z-buffer, minimapa, audio, controles táctiles, Service Worker y todas las optimizaciones de rendimiento— fue desarrollado sobre esa base.
