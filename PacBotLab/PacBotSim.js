var PACBOT = {
	CONSTANTS : {
		Width: 300,
		Height: 350,
		FrameRate: 1000/60,
		Cells: 15
	},
	MainMap : 
	[ [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
	  [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
	  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	  [1,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
	  [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
	  [1,1,1,0,1,0,0,11,0,0,1,0,1,1,1],
	  [0,0,1,0,1,0,22,33,44,0,1,0,1,0,0],
	  [0,0,1,1,1,0,0,0,0,0,1,1,1,0,0],
	  [0,0,1,0,1,1,1,55,1,1,1,0,1,0,0],
	  [1,1,1,0,1,0,0,0,0,0,1,0,1,1,1],
	  [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
	  [1,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
	  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	  [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
	  [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1]],
	MAP : {
		Wall : 0,
		Empty: 1,
		BlockColor: new color(0, 0, 0)
	},
	Ghosts: {
		Red: 11,
		Orange: 44,
		Pink: 33,
		Cyan: 22
	},
	PacBot : 55,
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

function drawRectangle(c, x, y, w, h, col) {
	c.fillStyle = "rgb(" + col.r +"," + col.g + "," + col.b + ")";
	c.fillRect(x, y, w, h);
}

var MAP = Array();

function getBlockCoor(_x, _y) {
	return {
		x : Math.floor(_x / (PACBOT.CONSTANTS.Width / PACBOT.CONSTANTS.Cells)),
		y : Math.floor(_y / (PACBOT.CONSTANTS.Width / PACBOT.CONSTANTS.Cells))
	}
}

function PacBot() {
	this.position = v(0, 0);
	this.radius = PACBOT.CONSTANTS.Width / (PACBOT.CONSTANTS.Cells * 7) * (2.5);
	this.orientation = Disque.random(0, Math.PI);
	this.color = new color(255, 255, 0);
	this.speed = 0;
	this.initialPosition = v(0, 0);
	this.update = function(p) {
		var c = p.context;
		
	}
	this.draw = function(c, s) {
		drawCircle(c, this.position.x + s.x, this.position.y + s.y, this.radius, this.orientation, this.color);
	}

}

function GhostBot(n, c) {
	this.marker = n;
	this.initialPosition = v(0, 0);
	this.position = v(0, 0);
	this.radius =  PACBOT.CONSTANTS.Width / (PACBOT.CONSTANTS.Cells * 7) * (2.5);
	this.orientation = Disque.random(0, Math.PI);
	this.color = c;
	this.speed = PACBOT.CONSTANTS.Width / (PACBOT.CONSTANTS.Cells * 7) * 12.0;
	this.update = function(p) {
		var c = p.context;
		//this.position.x += this.speed * (p.dt / 1000.0) * Math.cos(this.orientation);
		//this.position.y += this.speed * (p.dt / 1000.0) * Math.sin(this.orientation);
	}
	this.draw = function(c, s) {
		drawCircle(c, this.position.x + s.x, this.position.y + s.y, this.radius, this.orientation, this.color);
	}
}

function Block(start, w, h, color) {
	this.start = start;
	this.width = w;
	this.height = h;
	this.color = color;
	this.draw = function(p) {
		drawRectangle(p.context, this.start.x, this.start.y, this.width, this.height, color);
	}
}

function PacBotGame(context, start, brain, map) {
	this.now = 0;
	this.dt = PACBOT.CONSTANTS.FrameRate;
	this.context = context;
	this.start = start;
	this.brain = brain;
	this.fitness = 0;
	this.lives = 3;
	this.map = map;
	this.pacBot = new PacBot();
	this.ghosts = [new GhostBot(1, new color(255, 0, 0)), new GhostBot(2, new color(0, 255, 255)), new GhostBot(3, new color(255, 105, 180)), new GhostBot(4, new color(255, 165, 0))];
	this.blocks = new Array();
	var cw = PACBOT.CONSTANTS.Width / PACBOT.CONSTANTS.Cells;
	for(var i = 0; i < this.map.length; i++) {
		for(var j = 0; j < this.map[i].length; j++) {
			if(this.map[i][j] == PACBOT.MAP.Wall) {
				this.blocks.push(new Block(v(cw * j, cw * i), cw, cw, PACBOT.MAP.BlockColor));
			}
			else if(this.map[i][j] == PACBOT.Ghosts.Red) {
				this.ghosts[0].initialPosition = v(j * cw + cw / 2, i * cw + cw/2);
			}
			else if(this.map[i][j] == PACBOT.Ghosts.Pink) {
				this.ghosts[2].initialPosition = v(j * cw + cw / 2, i * cw + cw/2);
			}
			else if(this.map[i][j] == PACBOT.Ghosts.Orange) {
				this.ghosts[3].initialPosition = v(j * cw + cw / 2, i * cw + cw/2);
			}
			else if(this.map[i][j] == PACBOT.Ghosts.Cyan) {
				this.ghosts[1].initialPosition = v(j * cw + cw / 2, i * cw + cw/2);
			}
			else if(this.map[i][j] == PACBOT.PacBot) {
				this.pacBot.initialPosition = v(j * cw + cw / 2, i * cw + cw/2);
			}
		}
	}
	this.reset = function() {
		this.lives = 3;
		this.pacBot.position = this.pacBot.initialPosition;
		for(var i = 0; i < this.ghosts.length; i++) {
			this.ghosts[i].position = this.ghosts[i].initialPosition;
		}
	}
	this.reset();
	this.drawBorder = function() {
		this.context.strokeRect(0,0, PACBOT.CONSTANTS.Width, PACBOT.CONSTANTS.Width);
	}
	this.drawMap = function() {
		this.drawBorder();
		for(var  i = 0; i < this.blocks.length; i++) {
			this.blocks[i].draw(this);
		}	
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
		c.clearRect(this.start.x, this.start.y, PACBOT.CONSTANTS.Width, PACBOT.CONSTANTS.Width);
		this.drawMap();
		this.pacBot.draw(c, this.start);
		for(var i = 0; i < this.ghosts.length; i++) {
			this.ghosts[i].draw(c, this.start);
		}
	}

}