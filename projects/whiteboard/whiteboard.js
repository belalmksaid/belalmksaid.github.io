

class whiteboard {
    constructor(ctx, can) {
        this.pixels = new Array();
        this.canvas = can;
        this.context = ctx;
        this.mode = 'pen';
        this.penColor = new color(255, 0, 0);
        this.penRadius = 7;
        this.mousePos = v(0, 0);
    }

    update() {

    }

    draw() {
        circleF(this.context, this.mousePos.x, this.mousePos.y, this.penRadius, this.penColor);
    }
}