export class Rayo {
    constructor(ctx, escenario, x, y, angulo, incrementoAngulo, columna) {
        this.ctx = ctx;
        this.escenario = escenario;
        this.x = x;
        this.y = y;
        this.angulo = angulo;
        this.incrementoAngulo = incrementoAngulo;
        this.columna = columna;
        this.distancia = 0;

        this.wallHitX = 0;
        this.wallHitY = 0;

        this.wallHitXHorizontal = 0;
        this.wallHitYHorizontal = 0;

        this.wallHitXVertical = 0;
        this.wallHitYVertical = 0;

        this.pixelTextura = 0;
    }

    setAngulo(angulo) {
        this.anguloJugador = angulo;
        this.angulo = normalizaAngulo(angulo + this.incrementoAngulo);
    }

    cast() {
        this.xIntercept = 0;
        this.yIntercept = 0;

        this.abajo = false;
        this.izquierda = false;

        if (this.angulo < Math.PI) this.abajo = true;
        if (this.angulo > Math.PI / 2 && this.angulo < 3 * Math.PI / 2) this.izquierda = true;

        // COLISIONES DEL RAYO

        //HORIZONTAL
        let colisionHorizontal = false;

        this.yIntercept = Math.floor(this.y / this.escenario.tamCelda) * this.escenario.tamCelda;
        if (this.abajo) this.yIntercept += this.escenario.tamCelda;

        let catetoAdyacente = (this.yIntercept - this.y) / Math.tan(this.angulo);
        this.xIntercept = this.x + catetoAdyacente;

        var siguienteXHorizontal = this.xIntercept;
        var siguienteYHorizontal = this.yIntercept;

        this.yStep = this.escenario.tamCelda;
        this.xStep = this.yStep / Math.tan(this.angulo);

        if (!this.abajo) this.yStep = -this.yStep;
        if ((this.izquierda && this.xStep > 0) || (!this.izquierda && this.xStep < 0)) this.xStep = -this.xStep;
        if (!this.abajo) siguienteYHorizontal--;

        while (!colisionHorizontal && siguienteXHorizontal >= 0 && siguienteXHorizontal < canvas.width && siguienteYHorizontal >= 0 && siguienteYHorizontal < canvas.height) {
            let casillaX = Math.floor(siguienteXHorizontal / this.escenario.tamCelda);
            let casillaY = Math.floor(siguienteYHorizontal / this.escenario.tamCelda);

            if (this.escenario.colision(casillaX, casillaY)) {
                colisionHorizontal = true;
                this.wallHitXHorizontal = siguienteXHorizontal;
                this.wallHitYHorizontal = siguienteYHorizontal;
            } else {
                siguienteXHorizontal += this.xStep;
                siguienteYHorizontal += this.yStep;
            }
        }

        //VERTICAL
        var colisionVertical = false;

        this.xIntercept = Math.floor(this.x / this.escenario.tamCelda) * this.escenario.tamCelda;

        if (!this.izquierda) this.xIntercept += this.escenario.tamCelda;

        let catetoOpuesto = (this.xIntercept - this.x) * Math.tan(this.angulo);
        this.yIntercept = this.y + catetoOpuesto;

        var siguienteXVertical = this.xIntercept;
        var siguienteYVertical = this.yIntercept;

        this.xStep = this.escenario.tamCelda;
        this.yStep = this.escenario.tamCelda * Math.tan(this.angulo);

        if (this.izquierda) this.xStep = -this.xStep;
        if ((!this.abajo && this.yStep > 0) || (this.abajo && this.yStep < 0)) this.yStep = -this.yStep;
        if (this.izquierda) siguienteXVertical--;

        while (!colisionVertical && siguienteXVertical >= 0 && siguienteXVertical < canvas.width && siguienteYVertical >= 0 && siguienteYVertical < canvas.height) {

            let casillaX = Math.floor(siguienteXVertical / this.escenario.tamCelda);
            let casillaY = Math.floor(siguienteYVertical / this.escenario.tamCelda);

            if (this.escenario.colision(casillaX, casillaY)) {
                colisionVertical = true;
                this.wallHitXVertical = siguienteXVertical;
                this.wallHitYVertical = siguienteYVertical;
            }

            else {
                siguienteXVertical += this.xStep;
                siguienteYVertical += this.yStep;
            }
        }

        var distanciaHorizontal = 9999;
        var distanciaVertical = 9999;

        if (colisionHorizontal) {
            distanciaHorizontal = distanciaEntrePuntos(this.x, this.y, this.wallHitXHorizontal, this.wallHitYHorizontal);
        }

        if (colisionVertical) {
            distanciaVertical = distanciaEntrePuntos(this.x, this.y, this.wallHitXVertical, this.wallHitYVertical);
        }

        if (distanciaHorizontal < distanciaVertical) {
            this.wallHitX = this.wallHitXHorizontal;
            this.wallHitY = this.wallHitYHorizontal;
            this.distancia = distanciaHorizontal;

            this.pixelTextura = this.wallHitX - Math.floor(this.wallHitX / mapa.tamCelda) * mapa.tamCelda;
        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
            this.distancia = distanciaVertical;

            this.pixelTextura = this.wallHitY - Math.floor(this.wallHitY / mapa.tamCelda) * mapa.tamCelda;
        }

        this.pixelTextura = Math.floor((this.pixelTextura / mapa.tamCelda) * imgPared.width);

        // CORRECCION OJO DE PEZ
        this.distancia = this.distancia * (Math.cos(this.anguloJugador - this.angulo));
    }

    renderPared() {
        // PARED
        this.cast();
        let altoTile = 200;
        let distanciaPlanoProyeccion = (canvas.width / 2) / Math.tan(FOV / 2);
        let altoMuro = altoTile / this.distancia * distanciaPlanoProyeccion;
        var y0 = canvas.height / 2 - altoMuro / 2 + moveCamara;
        var y1 = y0 + altoMuro;
        var x = this.columna * resolucionRayos;

        this.ctx.drawImage(
            imgPared,
            this.pixelTextura,
            0,
            1,
            imgPared.height,
            x,
            y0,
            resolucionRayos,
            y1 - y0,
        );
        shadeCtx.fillStyle = `hsl(60, ${hue}%, 40%)`;
        shadeCtx.fillRect(x, y0, resolucionRayos, altoMuro);
        hue = parseInt(-altoMuro / 10);
    }

    renderRayo() {
        this.cast();

        var xDestino = this.wallHitX;
        var yDestino = this.wallHitY;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(xDestino, yDestino);
        this.ctx.strokeStyle = "#368190";
        this.ctx.stroke();
    }
}