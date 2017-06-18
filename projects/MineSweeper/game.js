$( window ).on('resize load', function() {
	sandbox.width = sandbox.offsetWidth;
	sandbox.height = sandbox.offsetHeight;
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