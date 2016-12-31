C = 0; W = 800;  H = 640;
function circle(p, r, c) {
	this.center = p;
	this.radius = r;
	this.color = c;
	this.render = function() {
		C.beginPath();
		C.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
		C.fillStyle = "rgb(" + this.color.r +"," + this.color.g + "," + this.color.b + ")";
		C.fill();
		C.closePath();
	}
}

MAXHUNTERSPEED = 2;
function Hunter() {
	this.position = v(Disque.random(0, W), Disque.random(0, H));
	this.body = new circle(this.position, 4, new color(255,0,0));
	this.speed = 0.5;
	this.brain = new NeuralNetwork();
	this.orient = Disque.random(0, Math.PI * 2.0);
	this.brain.numInputs = 4;
	this.brain.numOutputs = 2;
	this.brain.NPR = 6;
	this.brain.numHiddenLayers = 1;
	this.brain.create();
	this.gene = new gene(this.brain.getWeights().slice(0), 0);
	this.update = function(tx, ty) {
		this.gene.fitness -= Math.abs(this.speed) * 0.005;
		this.position.x += this.speed * MAXHUNTERSPEED * Math.cos(this.orient);
		this.position.y += this.speed * MAXHUNTERSPEED * Math.sin(this.orient);
		/*if(this.position.x <= this.body.radius) this.position.x = W - this.body.radius - 1;
		else if(this.position.x >= W - this.body.radius) this.position.x = this.body.radius + 1;
		if(this.position.y <= this.body.radius) this.position.y	 = H - this.body.radius - 1;
		else if(this.position.y >= H - this.body.radius) this.position.y = this.body.radius + 1;*/
		this.position.x = Math.max(this.position.x, this.body.radius);
		this.position.y = Math.max(this.position.y, this.body.radius);
		this.position.x = Math.min(this.position.x, W - this.body.radius);
		this.position.y = Math.min(this.position.y, H - this.body.radius);
		var op = this.brain.update(new Array(tx - this.position.x, ty - this.position.y, Math.cos(this.orient), Math.sin(this.orient)));
		this.orient = (op[0]) * Math.PI * 2;
		this.speed =  op[1];
		/*this.speed = Math.min(1, this.speed);
		this.speed = Math.max(-1, this.speed);*/
		var r = 0;
		var g = 0;
		var b = 0;
		for(var i = 0; i < this.gene.weights.length / 2; i++) {
			r += Math.abs(this.gene.weights[i]) / (this.gene.weights.length / 2);
		}
		for(var i = Math.floor(this.gene.weights.length / 2); i < this.gene.weights.length; i++) {
			g += Math.abs(this.gene.weights[i]) / (this.gene.weights.length / 2);
		}
		this.body.color = new color(Math.floor(r * 255), 255 - Math.floor(g * 255),Math.floor(g * 255));
	}
	this.render = function() {
		this.body.render();
	}
}
MAXFOODSPEED = 2.5;
function Food() {
	this.position = v(Disque.random(0, W), Disque.random(0, H));
	this.body = new circle(this.position, 5, new color(0,0,0));
	this.speed = Disque.random(-1, 1);
	this.orient = Disque.random(0, Math.PI * 2.0);
	this.brain = new NeuralNetwork();
	this.brain.numInputs = 6;
	this.brain.numOutputs = 2;
	this.brain.NPR = 6;
	this.brain.numHiddenLayers = 1;
	this.brain.create();
	this.gene = new gene(this.brain.getWeights().slice(0), 0);
	this.update = function(tx, ty, t2x, t2y, t3x, t3y) {
		this.position.x += this.speed * MAXFOODSPEED * Math.cos(this.orient);
		this.position.y += this.speed * MAXFOODSPEED * Math.sin(this.orient);
		this.position.x = Math.max(this.position.x, this.body.radius);
		this.position.y = Math.max(this.position.y, this.body.radius);
		this.position.x = Math.min(this.position.x, W - this.body.radius);
		this.position.y = Math.min(this.position.y, H - this.body.radius);
		var op = this.brain.update(new Array(tx - this.position.x, ty - this.position.y, t2x - this.position.x, t2y - this.position.y, Math.cos(this.orient), Math.sin(this.orient)));
		//clearInterval(a);
		this.orient = (op[0]) * Math.PI * 2;
		this.speed =  op[1];
	}
	this.render = function() {
		this.body.render();
	}
}