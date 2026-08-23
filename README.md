Este es un juego FPS (un juego de disparos en primera persona) en 2.5d hecho con la tecnica de raycasting que usan juegos como 'Wolfenstein 3d' y 'Doom 1993'.
El objetivo del juego es sobrevivir el mayor tiempo posible, debes asesinar a los enemigos disparandoles, sien embargo, los enemigos nunca mueren sino que reaparecen, asi que el juego es infinito completamente.
Las tecnologIas utilizadas son simplemente html, css, javascript y la api de canvas html.
La mayoria del juego esta hecho por mi, sin embargo, la logica del raycasting en si, viene del desarrollador javier muñiz, cuyo repositorio es https://github.com/javiermunizyt/raycasting-html5, a qui el hace un prototipo de la tecnica de raycasting en javascript
las cosas que añadí:
Enemigos inteligentes que calculan la ruta más corta hacia el jugador utilizando el algoritmo A*, estos ademas atacan.
El jugador puede dispararles a estos enemigos, los cuales nunca se destruyen, sino, que se teletransportan a otro lugar del mapa donde volveran a perseguirlo.
Ademas hay una optimizacion importante, el jugador simplemente lanza rayos cuando se mueve, si esta totalmente quieto lo que vera son las paredes del ultimo frame, el cual no se borro sino que se guardo en un viewCanvas para mostrarlo si el jugador no se esta moviendo.
