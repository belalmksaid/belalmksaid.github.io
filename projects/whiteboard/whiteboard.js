

class whiteboard {
    constructor(ctx, can) {
        this.pixels = new Array();
        this.canvas = can;
        this.context = ctx;
        this.mode = 'pen';
        this.penColor = new color(255, 0, 0);
        this.eraserColor = new color(255, 255, 255);
        this.penRadius = 7;
        this.eraserRadius = 28;
        this.mousePos = v(0, 0);
        this.ismousedown = false;
        this.canvasLog = new Array();
        this.lock = false;
    }

    add(i) {
        this.lock = true;
        this.canvasLog.push(i);
        this.lock = false;
    }

    mousedown() {
        if(this.mode == 'pen') {
            this.context.lineWidth = this.penRadius * 2.0;
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.strokeStyle = this.penColor.tostring(); 
            circleF(this.context, this.mousePos.x, this.mousePos.y, this.penRadius, this.penColor);
        }
        if(this.mode == 'eraser') {
            this.context.lineWidth = this.eraserRadius * 2.0;
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.strokeStyle = this.eraserColor.tostring();
        }
        this.ismousedown = true;
        this.context.beginPath();
        this.context.moveTo(this.mousePos.x, this.mousePos.y);
        this.add({t : 0, x : this.mousePos.x, y : this.mousePos.y});
    }

    mouseup() {
        this.ismousedown = false;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.add({t : 2, x : this.mousePos.x, y : this.mousePos.y});
    }

    update() {
        while(this.lock) {
        }
        if(this.canvasLog.length <= 0) return;
        let clone = this.canvasLog.slice(0);
        $.ajax({
            url: 'http://api.belalsaid.com/whiteboard/', 
            type: 'POST', 
            contentType: 'application/json', 
            data: JSON.stringify(clone),
            success: function(data) {
            }
        });
        this.canvasLog.length = 0;
    }

    draw() {
        if(this.ismousedown) {
            this.context.lineTo(this.mousePos.x, this.mousePos.y);
            this.context.stroke();
            this.add({t : 1, x : this.mousePos.x, y : this.mousePos.y});
        }
    }
}