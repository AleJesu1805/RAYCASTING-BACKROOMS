export class Player {
    constructor(x, y, escenario, ctx) {
        this.posXPlayer = x;
        this.posYPlayer = y;
        this.escenario = escenario;
        this.ctx = ctx;

        this.tamPlayer = this.escenario.tamCelda / 2;

        this.avanzando = 0;
        this.girando = 0;

        this.angulo = Math.PI;

        this.velAvance = 2;
        this.velGiro = 3 * (Math.PI / 180);

        this.numRayos = canvas.width / resolucionRayos;
        this.rayos = [];

        var incrementoAngulo = convierteRadianes(FOV / this.numRayos);
        var anguloInicial = convierteRadianes(this.angulo - 30);
        var anguloRayo = anguloInicial;

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i] = new Rayo(this.ctx, this.escenario, this.posXPlayer, this.posYPlayer, this.angulo, anguloRayo, i);
            anguloRayo += incrementoAngulo;
        }
    }

    arriba() {
        this.avanzando = 1;
    }
    abajo() {
        this.avanzando = -1;
    }
    derecha() {
        this.girando = 1;
    }
    izquierda() {
        this.girando = -1;
    }

    stopAvance() {
        this.avanzando = 0;
    }

    stopGiro() {
        this.girando = 0;
    }

    colision(x, y) {
        let choca = false;
        let casillaX = Math.floor(x / this.escenario.tamCelda);
        let casillaY = Math.floor(y / this.escenario.tamCelda);

        if (this.escenario.colision(casillaX, casillaY)) {
            choca = true;
        }

        return choca;
    }

    moverPersonaje() {
        let movimientoX = this.avanzando * Math.cos(this.angulo) * this.velAvance;
        let movimientoY = this.avanzando * Math.sin(this.angulo) * this.velAvance;

        let nuevaX = this.posXPlayer + movimientoX;
        if (!this.colision(nuevaX, this.posYPlayer)) {
            this.posXPlayer = nuevaX;
        }

        let nuevaY = this.posYPlayer + movimientoY;
        if (!this.colision(this.posXPlayer, nuevaY)) {
            this.posYPlayer = nuevaY;
        }
        this.angulo += this.girando * this.velGiro;
        this.angulo = normalizaAngulo(this.angulo);

        for (let i = 0; i < this.numRayos; i++) {
            this.rayos[i].x = this.posXPlayer;
            this.rayos[i].y = this.posYPlayer;
            this.rayos[i].setAngulo(this.angulo);
            this.rayos[i].renderPared();
        }
    }

    renderPlayer() {
        // for (let i = 0; i < this.numRayos; i++) {
        //     this.rayos[i].renderRayo();
        //     this.rayos[i].renderPared();
        // }
        this.moverPersonaje();
        this.ctx.globalAlpha = 0.6;
        this.ctx.drawImage(shadeCanvas, 0, 0);
        this.ctx.globalAlpha = 1;
        var xDestino = this.posXPlayer + Math.cos(this.angulo) * 50;
        var yDestino = this.posYPlayer + Math.sin(this.angulo) * 50;
    }
}