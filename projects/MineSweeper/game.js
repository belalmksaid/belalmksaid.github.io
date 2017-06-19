$( window ).on('resize load', function() {
    if(sandbox.offsetWidth > sandbox.width) {
        sandbox.width = sandbox.offsetWidth;
	    sandbox.height = sandbox.width;
    }
});

class world {
    constructor() {
        this.pellets = new Array();
        this.sweepers = new Array();
    }

    draw(c) {
        for(let i = 0; i < this.pellets.length; i++) {
           this.pellets[i].draw(C);
        }
        for(let i = 0; i < this.sweepers.length; i++) {
           this.sweepers[i].draw(C);
        }
    }
}

class sweeper {
    constructor(pos, or, spd, rad) {
        this.position = pos;
        this.orientation = or;
        this.speed = spd;
        this.brain = new NeuralNetwork();
        this.input = new Array();
        this.radius = rad;
    }

    reset() {

    }

    update() {
        this.position.x += this.speed * Math.cos(this.orientation);
        this.position.y += this.speed * Math.sin(this.orientation);
    }

    draw(c) {
        this.update();
        c.save();
	    c.translate(this.position.x, this.position.y);
	    c.rotate(this.orientation);
	    c.translate(-this.position.x, -this.position.y);
        rectangleB(c, this.position.x, this.position.y, this.radius, this.radius);
        rectangleB(c, this.position.x + 0.5 * this.radius, this.position.y, 1.5 * this.radius, 0.3333 * this.radius);
        c.restore();
    }
}

class pellet {
    constructor(pos, rad, col) {
        this.position = pos;
        this.radius = rad;
        this.color = col;
        this.visible = true;
    }

    draw(c) {
        if(this.visible) {
            circleF(c, this.position.x, this.position.y, this.radius, this.color);
        }
    }
}