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

function NeuralNetwork() {
	this.numInputs = 4;
	this.numOutputs = 2;
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
	this.mutationRate = 0.3;
	this.crossOverRate = 0.8;
	this.radiationRate = 0.005;
	this.generation = 0;
	this.mutate = function(w) {
		for(var i = 0; i < w.length; i++) {
			if(random(0, 1) <= this.mutationRate) {
				w[i] += random(-1.0, 1.0) * 0.3;
			}
			if(random(0, 1) <= this.radiationRate) {
				w[i] = random(-1.0, 1.0);
			}
		}
	}
	this.breed = function(p1, p2, c1, c2) {
		if(random(0, 1) > this.crossOverRate) {
			union(c1, p1);
			union(c2, p2)
			return;
		}
		var cp = Math.floor(random(0.1, 0.9) * p1.length);
		for(var i = 0; i < cp; i++) {
			c1.push(p1[i]);
			c2.push(p2[i]);
		}
		for(var i = cp; i < p1.length; i++) {
			c1.push(p2[i]);
			c2.push(p1[i]);
		}
	}

	this.averageFitness = function() {
		var avg = 0;
		for(var i = 0; i < this.genes.length; i++) {
			avg += this.genes[i].fitness * (1.0 / this.genes.length);
		}
		return avg;
	}

	this.epoch = function(elite) {
		var old = this.genes.splice(0);
		this.genes.length = 0;
		var avg = this.averageFitness();
		for(var i = 0; i < old.length ; i++) {
			if(old[i].fitness > avg) {
				this.genes.push(old[i].clone());
				this.genes[this.genes.length - 1].fitness = 0;
			}
		}
		old.sort(function(a, b) {
		if(a.fitness > b.fitness)
			return 1;
		else if(a.fitness < b.fitness)
			return -1;
		return 0;
		});
		if(this.genes.length < 2 && old.length < 2) {
			this.genes.push(this.genes[0].clone());
		}
		else if(this.genes.length < 2) {
			this.genes.push(new gene(old[old.length - 2].weights.splice(0), 0));
		}

		if(this.genes.length < old.length && this.genes.length % != 0) {
			this.genes.push(old[old.length - 1].clone());
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
}