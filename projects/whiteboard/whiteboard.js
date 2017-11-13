

class whiteboard {
    constructor(ctx, can) {
        this.pixels = new Array();
        this.canvas = can;
        this.context = ctx;
        this.mode = 'pen';
        this.penColor = new color(255, 0, 0);
        this.eraserColor = new color(255, 255, 255);
        this.penRadius = 7;
        this.mousePos = v(0, 0);
        this.ismousedown = false;
    }

    mousedown() {
        if(this.mode == 'pen') {
            this.context.lineWidth = this.penRadius * 2.0;
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.strokeStyle = this.penColor.tostring();
        }
        this.ismousedown = true;
        this.context.beginPath();
        this.context.moveTo(this.mousePos.x, this.mousePos.y);
    }

    update() {

    }

    draw() {
        this.context.moveTo(this.mousePos.x, this.mousePos.y);
        this.context.stroke();
    }
}