var PACBOT = {
	CONSTANTS : {
		Width: 300,
		Height: 350,
		FrameRate: 1000/60
	},
	MainMap : 
	[
		[]
	]
}

function drawCircle(c, x, y, rad, orie, col) {
	c.save();
	c.translate(x, y);
	c.rotate(orie);
	c.translate(-x, -y);
	c.beginPath();
	c.arc(x, y, rad, 0, 2 * Math.PI, false);
	c.fillStyle = "rgb(" + col.r +"," + col.g + "," + col.b + ")";
	c.fill();
	c.closePath();
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(x + rad, y);
	c.lineWidth = 1;
	c.stroke();
	c.restore();
}

var MAP = Array();

function Map(m, start) {
	this.start = start;
	this.draw = function(c) {
		var d = PACBOT.CONSTANTS.Width / 10.0;
		for(var i = 0; i < 11; i++) {
			c.beginPath();
			c.moveTo(i * d + this.start.x, this.start.y);
			c.lineTo(i * d + this.start.x, PACBOT.CONSTANTS.Width + this.start.y);
			c.lineWidth = 1;
			c.stroke();
		}
		for(var i = 0; i < 11; i++) {
			c.beginPath();
			c.moveTo(this.start.x, i * d + this.start.y);
			c.lineTo(this.start.x + PACBOT.CONSTANTS.Width, i * d + this.start.y);
			c.lineWidth = 1;
			c.stroke();
		}
	}

}

function PacBot() {
	this.position = v(0, 0);
	this.radius = PACBOT.CONSTANTS.Width / (70.0) * (2.5);
	this.orientation = Disque.random(0, Math.PI);
	this.color = new color(255, 255, 0);
	this.speed = 0;
	this.update = function(p) {
		var c = p.context;
		c.clearRect(this.position.x + p.start.x - this.radius, this.position.y + p.start.y - this.radius, this.radius * 2, this.radius * 2);
	}
	this.draw = function(c, s) {
		drawCircle(c, this.position.x + s.x, this.position.y + s.y, this.radius, this.orientation, this.color);
	}

}

function GhostBot(n, c) {
	this.marker = n;
	this.position = v(0, 0);
	this.radius = PACBOT.CONSTANTS.Width / (70.0) * (2.5);
	this.orientation = 0;
	this.color = c;
	this.speed = PACBOT.CONSTANTS.Width / 70.0 * 12.0;
	this.update = function(p) {
		var c = p.context;
		c.clearRect(this.position.x + p.start.x, this.position.y + p.start.y, this.radius, this.radius);
	}
	this.draw = function(c, s) {
		drawCircle(c, this.position.x + s.x, this.position.y + s.y, this.radius, this.orientation, this.color);
	}
}

function PacBotGame(context, start, brain, map) {
	this.now = 0;
	this.dt = PACBOT.CONSTANTS.FrameRate;
	this.context = context;
	this.start = start;
	this.brain = brain;
	this.lives = 3;
	this.map = new Map(map, start);
	this.map.draw(this.context);
	this.pacBot = new PacBot();
	this.ghosts = [new GhostBot(1, new color(255, 0, 0)), new GhostBot(2, new color(0, 255, 255)), new GhostBot(3, new color(255, 105, 180)), new GhostBot(4, new color(255, 165, 0))];
	this.reset = function() {
		this.lives = 3;
	}
	this.drawMap = function() {
		this.map.start = this.start;
		this.map.draw(this.context);
	}
	this.update = function() {
		var nnow = Date.now();
		if(this.now == 0) {
			this.now = nnow - PACBOT.CONSTANTS.FrameRate;
		}
		this.dt = nnow - this.now;
		this.now = nnow;

		this.pacBot.update(this);
		this.ghosts[0].update(this);
		this.ghosts[1].update(this);
		this.ghosts[2].update(this);
		this.ghosts[3].update(this);

		this.draw(this.context);
	}
	this.draw = function(c) {
		this.pacBot.draw(c, this.start);
		for(var i = 0; i < this.ghosts.length; i++) {
			this.ghosts[i].draw(c, this.start);
		}
	}

}