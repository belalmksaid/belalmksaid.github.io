var GOF = {
	LAYERS: 1,
	NPL: 6,
	RADIUS: 20,
	MAXSPEED: 2,
	FOODCOLOR: new color(255, 110, 100),
	FOODVALUE: 10,
	BIRTH: 200
}

function sprite(w) {
	this.type = "sprite";
	this.brain = new NeuralNetwork(12, 6, GOF.LAYERS, GOF.NPL);
	if(w == null) {
		this.brain.create();
	}
	else {
		this.brain.putWeights(w);
	}
	this.gene = new gene(this.brain.getWeights(), 0);
	this.memory = [0, 0, 0, 0];
	this.position = v(40, 40);
	this.radius = GOF.RADIUS;
	this.orientation = 0;
	this.speed = 1;
	this.health = GOF.BIRTH;
	this.vertices = [];
	this.geneType = 0;
	this.setShape = function() {
		this.vertices = [];
		for(var i = 0; i < this.gene.weights.length; i += Math.floor(this.gene.weights.length / 6)) {
			this.vertices.push(v(this.gene.weights[i] * this.radius, this.gene.weights[i + 1] * this.radius));
		}
		this.geneType = (this.gene.weights[1] + this.gene.weights[2] + this.gene.weights[3]) / 3.0;
	}
	this.setShape();
	this.update = function(a, b, c, d, e) {
		this.position.x += this.speed * Math.cos(this.orientation);
		this.position.y += this.speed * Math.sin(this.orientation);
		var op = this.brain.update([this.speed, this.orientation, this.health, a, b, c, d, e, this.memory[0], this.memory[1], this.memory[2], this.memory[3]]);
		this.orientation += op[0] - op[1];
		this.speed = (op[0] + op[1]);
		this.memory = op.splice(2, 4);
		this.health -= 0.1 * this.speed;
		this.gene.fitness = this.health;

	}
	this.draw = function(c) {
		drawPolyB(c, this.position.x, this.position.y, this.vertices, this.orientation);
		circleB(c, this.position.x, this.position.y, this.radius);
	}
}

function food() {
	this.type = "food";
	this.radius = GOF.RADIUS * 0.25;
	this.position = v(0, 0);
	this.health = GOF.FOODVALUE;
	this.draw = function(c) {
		circleF(c, this.position.x, this.position.y, this.radius, GOF.FOODCOLOR);
	}
	this.update = function() {		
	}
}

function Camera(s, z) {
	this.center = s;
	this.zoom = z;
}

function intersect(a, b) {
	return Math.sqrt((a.position.x - b.position.x) * (a.position.x - b.position.x) + (a.position.y - b.position.y) * (a.position.y - b.position.y)) < (a.radius + b.radius);
}

function World(canvas, w, h, n) {
	this.canvas = canvas;
	this.context = canvas.getContext('2d');
	this.width = w;
	this.height = h;
	this.sprites = [];
	this.foodSprites = [];
	this.genePool = new GenePool();
	this.n = n;
	this.reset = function() {
		this.sprites = [];
		for(var i = 0; i < this.n; i++) {
			this.sprites.push(new sprite());
			this.sprites[this.sprites.length - 1].position = v(Disque.random(0, this.width), Disque.random(0, this.height));
			this.genePool.genes.push(this.sprites[this.sprites.length - 1].gene);
			if(i % 3 == 0) {
				this.foodSprites.push(new food());
				this.foodSprites[this.foodSprites.length - 1].position = v(Disque.random(0, this.width), Disque.random(0, this.height));
			}
		}
	}
	this.reset();
	this.clearRect = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	this.bottleNeck = function() {
		this.genePool.epoch2(this.n);
		this.sprites = [];
		for(var i = 0; i < this.genePool.genes.length; i++) {
			this.sprites.push(new sprite());
			this.sprites[this.sprites.length - 1].position = v(Disque.random(0, this.width), Disque.random(0, this.height));
			this.sprites[this.sprites.length - 1].gene = this.genePool.genes[i];
			this.sprites[this.sprites.length - 1].brain.putWeights(this.genePool.genes[i].weights);
			this.sprites[this.sprites.length - 1].setShape();
		}
	}
	this.resolveInteraction = function(a, b, i, j) {
		if(b.type == "food") {
			a.health += b.health;
			b.position = v(Disque.random(0, this.width), Disque.random(0, this.height));
		}
		else {
			if(Math.abs(a.geneType - b.geneType) < this.genePool.elite / 8 && (a.health > 2 * GOF.BIRTH && b.health > 2 * GOF.BIRTH)) {
				var child1 = new sprite(), child2 = new sprite();
				var gene1 = new Array();
				var gene2 = new Array();
				this.genePool.breed(a.gene.weights, b.gene.weights, gene1, gene2);
				child1.gene.weights = gene1;
				child2.gene.weights = gene2;
				child1.brain.putWeights(gene1);
				child2.brain.putWeights(gene2);
				a.health -= GOF.BIRTH;
				b.health -= GOF.BIRTH;
				child1.health = child2.health = GOF.BIRTH;
				child1.position = v(Disque.random(0, this.width), Disque.random(0, this.height));
				child2.position = v(Disque.random(0, this.width), Disque.random(0, this.height));
				this.genePool.genes.push(child1.gene);
				this.genePool.genes.push(child2.gene);
				child1.setShape();
				child2.setShape();
				this.sprites.push(child1);
				this.sprites.push(child2);
				console.log("Children!");
			}
			else if(Math.abs(a.geneType - b.geneType) > this.genePool.elite * 3) {
				if(a.geneType > b.geneType) {
					a.health += b.health;
					this.sprites.splice(j, 1);
					this.genePool.genes.splice(j, 1);
					console.log("KO!");
					return 1;
				}
				else {
					b.health += a.health;
					this.sprites.splice(i, 1);
					this.genePool.genes.splice(i, 1);
					console.log("KO!");
					return 2;
				}
			}
		}
		return 0;
	}
	this.update = function() {
		for(var i = 0; i < this.sprites.length; i++) {
			var d = 100000;
			var ind = 0;
			var a = this.sprites[i];
			var ind2 = 0;
			var d2 = 100000;
			for(var j = 0; j < this.foodSprites.length; j++) {
				if(intersect(this.sprites[i], this.foodSprites[j])) { 
					var n = this.resolveInteraction(this.sprites[i], this.foodSprites[j], i, j);
				}
			}
			for(var j = 0; j < this.foodSprites.length; j++) {
				var b = this.foodSprites[j];
				var t = (a.position.x - b.position.x) * (a.position.x - b.position.x) + (a.position.y - b.position.y) * (a.position.y - b.position.y);
				if(t < d2) {
					ind2 = j;
				}
			}
			for(var j = i + 1; j < this.sprites.length; j++) {
				if(intersect(this.sprites[i], this.sprites[j])) {
					var n = this.resolveInteraction(this.sprites[i], this.sprites[j]);
				}
			}
			for(var j = i + 1; j < this.sprites.length; j++) {
				var b = this.sprites[j];
				var t = (a.position.x - b.position.x) * (a.position.x - b.position.x) + (a.position.y - b.position.y) * (a.position.y - b.position.y);
				if(t < d) {
					ind = j;
				}
			}
			if(this.sprites.length < this.n * this.genePool.elite) {
				this.bottleNeck();
				console.log("Forced Breeding!")
				break;
			}
			this.sprites[i].update(a.position.x - this.sprites[ind].position.x, a.position.y - this.sprites[ind].position.y, this.sprites[ind].geneType, a.position.x - this.foodSprites[ind2].position.x, a.position.y - this.foodSprites[ind2].position.y);
			if(this.sprites[i].health <= 0) {
				if(this.sprites.length > this.n * this.genePool.elite) {
					this.sprites.splice(i, 1);
					this.genePool.genes.splice(i, 1);
					console.log("Death!");
					//i--;
				}
				else {
					this.bottleNeck();
					console.log("Forced Breeding!")
					break;
				}
			}
		}
	}
	this.draw = function() {
		this.clearRect();
		for(var i = 0; i < this.sprites.length; i++) {
			this.sprites[i].draw(this.context);
		}
		for(var i = 0; i < this.foodSprites.length; i++) {
			this.foodSprites[i].draw(this.context);
		}
	}
}