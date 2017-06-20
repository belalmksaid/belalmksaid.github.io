function vector(x, y) {
	this.x = x;
	this.y = y;
	this.add = function(b) {
		this.x += b.x;
		this.y += b.y;
		return this;
	}
	this.scale = function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	this.sub = function(b) {
		this.x -= b.x;
		this.y -= b.y;
		return this;
	}
	this.clone = function() {
		return v(this.x, this.y);
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

function circleF(c, x, y, rad, col) {
	c.beginPath();
	c.arc(x, y, rad, 0, 2 * Math.PI, false);
	c.fillStyle = "rgb(" + col.r +"," + col.g + "," + col.b + ")";
	c.fill();
	c.closePath();
}

function circleB(c, x, y, rad) {
	c.beginPath();
	c.arc(x, y, rad, 0, 2 * Math.PI, false);
	c.closePath();
	c.stroke();
}

function circleFl(c, x, y, rad, orie, col) {
	c.beginPath();
	c.arc(x, y, rad, 0, 2 * Math.PI, false);
	c.fillStyle = "rgb(" + col.r +"," + col.g + "," + col.b + ")";
	c.fill();
	c.closePath();
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x + rad * Math.cos(orie), y + rad * Math.sin(orie));
	c.lineWidth = 1;
	c.stroke();
}

function rectangleB(c, x, y, w, h) {
	c.beginPath();
	c.rect(x - w, y - h, w * 2, h * 2);
	c.stroke();
}

function drawPolyB(c, x, y, pnts, orie) {
	c.save();
	c.translate(x, y);
	c.rotate(orie);
	c.translate(-x, -y);
	c.beginPath();
	c.moveTo(pnts[0].x + x, pnts[0].y + y);
	for(var i = 1; i < pnts.length; i++) {
		c.lineTo(pnts[i].x + x, pnts[i].y + y);
	}
	c.closePath();
	c.stroke();
	c.restore();
}

var Disque = {
	random: function(min, max) {
		return (Math.random() * (max - min) + min);
	},
	sign: function(s) {
		if(s > 0) return 1;
		if(s < 0) return -1;
		return 0;
	},
	dot: function(a, b) {
		return a.x * b.x + a.y * b.y;
	},
	randomV: function(xmn, xmx, ymn, ymx) {
		return v(Disque.random(xmn, xmx), Disque.random(ymn, ymx));
	},
	distance: function(a, b) {
		return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
	},
	lengthSqrd: function(a, b) {
		return ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
	},
	intersect: function(a, b, r1, r2) {
		return (Disque.lengthSqrd(a, b) < (r1 + r2) * (r1 + r2));
	},
	clamp: function(a,b,c) {
		return Math.max(b,Math.min(c,a)) 
	},
	epsilon: 1
};