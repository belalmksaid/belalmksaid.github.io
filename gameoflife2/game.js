var GOF = {
	LAYERS: 1,
	NPL: 6,
	RADIUS: 20,
	MAXSPEED: 2
}

function sprite(r, w) {
	this.brain = new NeuralNetwork(6, 6, GOF.LAYERS, GOF.NPL);
	if(w == null) {
		this.brain.create();
	}
	else {
		this.brain.putWeights(w);
	}
	this.gene = new gene(this.brain.getWeights(), 0);
	this.memory = [0, 0, 0, 0];
	this.position = v(40, 40);
	this.radius = r;
	this.orientation = 0;
	this.speed = 1;
	this.vertices = [];
	this.setShape = function() {
		for(var i = 0; i < this.gene.weights.length; i += Math.floor(this.gene.weights.length / 6)) {
			this.vertices.push(v(this.gene.weights[i] * this.radius, this.gene.weights[i + 1] * this.radius));
		}
	}
	this.setShape();
	this.update = function() {
		this.position.x += this.speed * Math.cos(this.orientation);
		this.position.y += this.speed * Math.sin(this.orientation);
		var op = this.brain.update([this.speed, this.orientation, this.memory[0], this.memory[1], this.memory[2], this.memory[3]]);
		this.orientation += op[0] - op[1];
		this.speed = (op[0] + op[1]);
		this.memory = op.splice(2, 4);
	}
	this.draw = function(c) {
		drawPolyB(c, this.position.x, this.position.y, this.vertices, this.orientation);
	}
}

function Camera(s, z) {
	this.center = s;
	this.zoom = z;
}

function World(canvas, w, h, n) {
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.width = w;
	this.height = h;
	this.sprites = [];
	this.n = n;
	this.reset = function() {
		this.sprites = [];
		for(var i = 0; i < this.n; i++) {
			this.sprites.push(new sprite(GOF.RADIUS));
			this.sprites[this.sprites.length - 1].position = v(Disque.random(0, this.width), Disque.random(0, this.height));
		}
	}
	this.reset();
	this.clearRect = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	this.update = function() {
		for(var i = 0; i < this.sprites.length; i++) {
			this.sprites[i].update();
		}
	}
	this.draw = function() {
		this.clearRect();
		for(var i = 0; i < this.sprites.length; i++) {
			this.sprites[i].draw(this.context);
		}
	}
}