function random(min, max) {
	return Math.random() * (max - min) + min;
}

function union(a, b) {
	for(var i = 0; i < b.length; i++) {
		a.push(b[i]);
	}
}

function Neuron(n) {
	this.weights = new Array();
	for(var i = 0; i < n + 1; i++) {
		this.weights[i] = random(-1.0, 1.0);
	}
}

function NeuronLayer(s, n) {
	this.neurons = new Array();
	for(var i = 0; i < s; i++) {
		this.neurons[i] = new Neuron(n);
	}
}

function NeuralNetwork(noi = 4, noo = 2) {
	this.numInputs = noi;
	this.numOutputs = noo;
	this.numHiddenLayers = 1;
	this.NPR = 6;
	this.layers = new Array();
	this.create = function() {
		if(this.numHiddenLayers > 0) {
			this.layers.push(new NeuronLayer(this.NPR, this.numInputs));
			for(var i = 0; i < this.numHiddenLayers - 1; i++) {
				this.layers.push(new NeuronLayer(this.NPR, this.NPR));
			}
			this.layers.push(new NeuronLayer(this.numOutputs, this.NPR));
		}
		else {
			this.layers.push(new NeuronLayer(this.numOutputs, this.numInputs));
		}		
	}
	this.getWeights = function() {
		var weights = new Array();
		for(var i = 0; i < this.numHiddenLayers + 1; i++) {
			for(var j = 0; j < this.layers[i].neurons.length; j++) {
				for(var k = 0; k < this.layers[i].neurons[j].weights.length; k++) {
					weights.push(this.layers[i].neurons[j].weights[k]);
				}
			}
		}
		return weights;
	}
	this.getNoW = function() {
		var weights = 0;
		for(var i = 0; i < this.numHiddenLayers + 1; i++) {
			for(var j = 0; j < this.layers[i].neurons.length; j++) {
				for(var k = 0; k < this.layers[i].neurons[j].weights.length; k++) {
					weights++;
				}
			}
		}
		return weights;
	}
	this.putWeights = function(weights) {
		var cWeight = 0;
		//for each layer
		for (var i=0; i<this.numHiddenLayers + 1; ++i)
		{
			for (var j=0; j<this.layers[i].neurons.length; ++j)
				for (var k=0; k<this.layers[i].neurons[j].weights.length; ++k)
				{
					this.layers[i].neurons[j].weights[k] = weights[cWeight++];
				}
		}
	}
	this.sigmoid = function(n, r) {
		return (1.0 / (1.0 + Math.exp(-n / r)));
	}
	this.update = function(inputs) {
		var op = new Array();
		var cweight = 0;
		if(inputs.length != this.numInputs) {
			return op;
		}

		for(var i = 0; i < this.numHiddenLayers + 1; ++i) {
			if(i > 0) {
				inputs = op.slice(0);
			}
			op.length = 0;
			cweight = 0;
			for (var j = 0; j < this.layers[i].neurons.length; ++j)
			{
				var netinput = 0;
				var	NumInputs = this.layers[i].neurons[j].weights.length;
				for (var k = 0; k < NumInputs - 1; ++k)
				{
					netinput += this.layers[i].neurons[j].weights[k] * inputs[cweight];
					cweight++;
				}
				netinput += this.layers[i].neurons[j].weights[NumInputs - 1] * -1.0;
				op.push(this.sigmoid(netinput, 1.0));

				cweight = 0;
			}
		}
		return op;
	}
}

function gene(w, f) {
	this.weights = w;
	this.fitness = f;
	this.clone = function() {
		return new gene(this.weights.slice(0), this.fitness + 0);
	}
	this.compare = function(a, b) {
		if(a.fitness > b.fitness)
			return 1;
		else if(a.fitness < b.fitness)
			return -1;
		return 0;
	}
}

function GenePool() {
	this.genes = new Array();
	this.mutationRate = 0.1;
	this.crossOverRate = 0.7;
	this.generation = 0;
	this.avgFitness = 0;
	this.worstFitness = 10000000;
	this.bstFitness = 0;
	this.fittest = -1;
	this.totalFitness = 0;
	this.mutate = function(w) {
		for(var i = 0; i < w.length; i++) {
			if(random(0, 1) <= this.mutationRate) {
				w[i] += random(-1.0, 1.0) * 0.3;
			}
		}
	}
	this.breed = function(p1, p2, c1, c2) {
		if(random(0, 1) > this.crossOverRate) {
			union(c1, p1);
			union(c2, p2)
			return;
		}
		var cp = Math.floor(random(0, 1) * (p1.length - 1));
		for(var i = 0; i < cp; i++) {
			c1.push(p1[i]);
			c2.push(p2[i]);
		}
		for(var i = cp; i < p1.length; i++) {
			c1.push(p2[i]);
			c2.push(p1[i]);
		}
	}
	this.epoch = function(elite) {
		var old = this.genes.splice(0);
		this.genes.length = 0;
		old.sort(function(a, b) {
		if(a.fitness > b.fitness)
			return 1;
		else if(a.fitness < b.fitness)
			return -1;
		return 0;
		});
		var midway = Math.floor(old.length * elite);
		midway -= midway % 2;
		if(midway < 2) midway = 2;
		midway = old.length - midway;

		for(var i = midway; i < old.length; i++) {
			this.genes.push(old[i].clone());
			this.genes[this.genes.length - 1].fitness = 0;
		}
		var original = this.genes.length;
		while(this.genes.length != old.length) {
			var c1 = new Array(), c2 = new Array();
			var p1 = this.genes[Math.floor(random(0, original))].weights;
			var p2 = this.genes[Math.floor(random(0, original))].weights;
			this.breed(p1, p2, c1, c2);
			this.mutate(c1);
			this.mutate(c2);
			this.genes.push(new gene(c1, 0));
			this.genes.push(new gene(c2, 0));
		}
		this.generation++;
	}

	this.epoch2 = function(elite) {
		//let old = this.genes.splice(0);
		this.reset();
		this.genes.sort(function(a, b) {
			if(a.fitness > b.fitness)
				return 1;
			else if(a.fitness < b.fitness)
				return -1;
			return 0;
		});

		this.calc();

		var temp = new Array();

		if(!(elite * this.genes.length % 2)) {
			this.grab(this.genes.length * elite, 1, temp);
		}
		
		while(temp.length < this.genes.length) {
			let mum = this.getRoulette();
			let dad = this.getRoulette();

			let b1 = new Array(), b2 = new Array();

			this.breed(mum.weights, dad.weights, b1, b2);

			this.mutate(b1);
			this.mutate(b2);

			temp.push(new gene(b1, 0));
			temp.push(new gene(b2, 0));
		}
		this.genes = temp;
	}
	this.averageFitness = function() {
		return this.totalFitness / this.genes.length;
	}
	this.bestFitness = function() {
		return this.bstFitness;
	}

	this.getRoulette = function() {
		let slice = Disque.random(0, 1) * this.totalFitness;
		let fsf = 0;
		let cone = 0;
		for(let i = 0; i < this.genes.length; i++) {
			fsf += this.genes[i].fitness;
			if(fsf >= slice) {
				cone = this.genes[i];
				break;
			}
		}
		return cone;
	}

	this.grab = function(n, nc, pop) {
		for(let i = n; n > 0; i--) {
			for(let j = 0; j < nc; j++) {
				pop.push(this.genes[(this.genes.length - 1) - i]);
			}
		}
	}

	this.calc = function() {
		this.totalFitness = 0;
		let hsf = 0, lsf = 999999;

		for(let i = 0; i < this.genes.length; i++) {
			if(this.genes[i].fitness > hsf) {
				hsf = this.genes[i].fitness;
				this.fittest = i;
				this.bestFitness = hsf;
			}

			if(this.genes[i].fitness < lsf) {
				lsf = this.genes[i].fitness;
				this.worstFitness = lsf;
			}

			this.totalFitness += this.genes[i].fitness;
		}

		this.avgFitness = this.totalFitness / this.genes.length;
	}

	this.reset = function() {
		this.totalFitness = 0;
		this.bstFitness = 0;
		this.worstFitness = 9999999;
		this.avgFitness = 0;
	}
}