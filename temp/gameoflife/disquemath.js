function vector(x, y) {
	this.x = x;
	this.y = y;
	this.add = function(b) {
		return addv(this, b);
	}
	this.scale = function(s) {
		return scalev(this, s);
	}
	this.subt = function(b) {
		return addv(this, b.scale(-1));
	}
	this.clone = function() {
		return v(this.x, this. y);
	}
	this.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	this.normalize = function() {
		var l = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x = this.x/l;
		this.y = this.y/l;
		return this;
	}
}

function color(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function v(x, y) {
	return new vector(x, y);
}

function addv(a, b) {
	return new vector(a.x + b.x, a.y + b.y);
}

function scalev(a, s) {
	return new vector(a.x * s, a.y * s);
}

function subtv(a, b) {
	return a.subt(b);
}

function ZERO() {
	return new vector(0, 0);
}

var Disque = {
	random: function(min, max) {
		return (Math.random() * (max - min) + min);
	}
};