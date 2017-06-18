$( window ).on('resize load', function() {
    if(sandbox.offsetWidth > sandbox.width) {
        sandbox.width = sandbox.offsetWidth;
	    sandbox.height = sandbox.width;
    }
});

class sweeper {
    constructor(pos, or, spd) {
        this.position = pos;
        this.orientation = or;
        this.speed = spd;
        this.brain = new NeuralNetwork();
    }

    reset() {

    }

    update() {

    }

    draw(c) {

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