
const moveTo = 0;
const lineTo = 1;
const clear = 2;


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
        this.guid = -1;
    }

    init(data) {
        let arr = JSON.parse(data);
        for (let i = 0; i < arr.length; i++) {
            this.guid = arr[i].id;
            if(arr[i].t == 4) {
                this.penRadius = arr[i].rr;
                this.penColor = new color(arr[i].r, arr[i].g, arr[i].b);
                this.context.lineWidth = this.penRadius * 2.0;
                this.context.lineJoin = 'round';
                this.context.lineCap = 'round';
                this.context.strokeStyle = this.penColor.tostring();
            }
            else if(arr[i].t == 3) {
                this.context.lineWidth = this.eraserRadius * 2.0;
                this.context.lineJoin = 'round';
                this.context.lineCap = 'round';
                this.context.strokeStyle = this.eraserColor.tostring();
            }
            else if (arr[i].t == moveTo) {
                circleF(this.context, arr[i].x, arr[i].y, this.penRadius, this.penColor);
                this.context.beginPath();
                this.context.moveTo(arr[i].x, arr[i].y);
            }
            else if (arr[i].t == lineTo) {
                this.context.lineTo(arr[i].x, arr[i].y);
                this.context.stroke();
            }
            else if (arr[i].t == clear) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    add(i) {
        this.lock = true;
        this.canvasLog.push(i);
        this.lock = false;
    }

    mousedown() {
        if (this.mode == 'pen') {
            this.context.lineWidth = this.penRadius * 2.0;
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.strokeStyle = this.penColor.tostring();
            circleF(this.context, this.mousePos.x, this.mousePos.y, this.penRadius, this.penColor);
            this.add({id: -1, t: 4, r: this.penColor.r, g: this.penColor.g, b: this.penColor.b, rr: this.penRadius });
        }
        if (this.mode == 'eraser') {
            this.context.lineWidth = this.eraserRadius * 2.0;
            this.context.lineJoin = 'round';
            this.context.lineCap = 'round';
            this.context.strokeStyle = this.eraserColor.tostring();
            this.add({id: -1, t: 3, r: this.eraserColor.r, g: this.eraserColor.g, b: this.eraserColor.b, rr: this.eraserRadius });
        }
        this.ismousedown = true;
        this.context.beginPath();
        this.context.moveTo(this.mousePos.x, this.mousePos.y);
        
        this.add({ id: -1, t: 0, x: this.mousePos.x, y: this.mousePos.y });
    }

    mouseup() {
        this.ismousedown = false;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.add({ id: -1, t: 2, x: this.mousePos.x, y: this.mousePos.y });
    }

    update() {
        while (this.lock) {
        }
        if (this.canvasLog.length <= 0) return;
        let clone = this.canvasLog.slice(0);
        $.ajax({
            url: 'http://api.belalsaid.com/whiteboard/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(clone),
            success: function (data) {
            }
        });
        this.canvasLog.length = 0;
    }

    draw() {
        if (this.ismousedown) {
            this.context.lineTo(this.mousePos.x, this.mousePos.y);
            this.context.stroke();
            this.add({ id: -1, t: 1, x: this.mousePos.x, y: this.mousePos.y });
        }
    }
}