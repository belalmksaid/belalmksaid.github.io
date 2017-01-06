var PACBOT = {
	CONSTANTS : {
		Width: 300,
		Height: 350,
		FrameRate: 1000/60,
		Cells: 15,
		CellWidth: 300 / 15,
		PixelpInch: 300 / 15 / 7,
		InchpPixel: 1 / (300 / 15 / 7)
	},
	MainMap : 
	[ [110,1,1,1,1,1,1,0,1,1,1,1,1,1,440],
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
	  [220,1,1,1,1,1,1,0,1,1,1,1,1,1,330]],
	MAP : {
		Wall : 0,
		Empty: 1,
		BlockColor: new color(0, 0, 0),
		PelletColor: new color(0, 0, 0),
		Pellet: 6
	},
	Ghosts: {
		Red: 11,
		Orange: 44,
		Pink: 33,
		Cyan: 22
	},
	PacBot : 55,
	Directions: {
		Left: -1,
		Right: 1,
		Up: -2,
		Down: 2,
		Array: [-1, 1, -2, 2]
	},
	States: {
		Scatter: 0,
		Chase: 1,
		Escape: 2
	},
	WallPunishment: -1,
	DeathPunishment: -200,
	PelletReward: 10,
	ScatterTime: 1000 * 7
}

function drawCircle(c, x, y, rad, orie, col) {
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

function getNearbyEmpty(x, y, map) {
	var wall = PACBOT.MAP.Wall;
	if(map[y][x] == wall) {
		throw "This is a wall you idiot.";
	}
	var r = new Array();
	if(typeof map[y - 1] != 'undefined' && map[y - 1][x] != wall) {
		r.push(v(x, y - 1));
	}
	if(typeof map[y + 1] != 'undefined' && map[y + 1][x] != wall) {
		r.push(v(x, y + 1));
	}
	if(typeof map[y][x - 1] != 'undefined' && map[y][x - 1] != wall) {
		r.push(v(x - 1, y));
	}
	if(typeof map[y][x + 1] != 'undefined' && map[y][x + 1] != wall) {
		r.push(v(x + 1, y));
	}
	return r;
}

function getNearbyWalls(x, y, map) {
	var wall = PACBOT.MAP.Wall;
	if(map[y][x] == wall) {
		throw "This is a wall you idiot.";
	}
	var r = new Array();
	for(var i = -1; i <= 1; i++) {
		for(var j = -1; j <= 1; j++) {
			if(typeof map[y + i] != 'undefined' && typeof map[y + i][x + j] && map[y + i][x + j] == wall) {
				r.push(v(x + j, y + i));
			}
		}
	}
	return r;
}

function getClosestWallsSorted(x, y, map) {
	var wall = PACBOT.MAP.Wall;
	var cw = PACBOT.CONSTANTS.Width / PACBOT.CONSTANTS.Cells;
	var r = new Array();
	for(var i = 0; i < map.length; i++) {
		for(var j = 0; j < map.length; j++) {
			if(map[i][j] == wall) {
				var ce = v(j * cw + cw / 2, i * cw + cw / 2);
				r.push({ pos : ce, width: cw, d: (ce.x - x) * (ce.x - x) + (ce.y - y) * (ce.y - y) });
			}
		}
	}
	r.sort(function(a, b) { return a.d - b.d; });
	return r;
}

function getDirection(v1, v2) {
	var dy = v2.y - v1.y;
	var dx = v2.x - v1.x;
	if(Math.abs(dy) > 0) {
		return dy > 0 ? PACBOT.Directions.Down : PACBOT.Directions.Up;
	}
	if(Math.abs(dx) > 0) {
		return dx > 0 ? PACBOT.Directions.Right : PACBOT.Directions.Left;
	}
}

function createPelletMap(map) {
	var pmap = new Array();
	for(var i = 0; i < map.length; i++) {
		pmap.push(map[i].slice(0));
		for(var j = 0; j < map[i].length; j++) {
			if(pmap[i][j] == 1) {
				pmap[i][j] = 6;
			}
		}
	}
	return pmap;
}

function getNextWall(x, y, direction, map) {
	if(Math.abs(direction) == 1) {
		if(x == 0 && Disque.sign(direction) == -1 || x == PACBOT.CONSTANTS.Cells - 1 && Disque.sign(direction) == 1) return -1; 
		if(map[y][x + Disque.sign(direction)] == PACBOT.MAP.Wall) {
			return v(x + Disque.sign(direction), y);
		}
		else return getNextWall(x + Disque.sign(direction), y, direction, map);
	}
	else {
		if(y == 0 && Disque.sign(direction) == -1 || y == PACBOT.CONSTANTS.Cells - 1 && Disque.sign(direction) == 1) return -1; 
		if(map[y  + Disque.sign(direction)][x] == PACBOT.MAP.Wall) {
			return v(x, y + Disque.sign(direction));
		}
		else return getNextWall(x, y + Disque.sign(direction), direction, map);
	}
}

function isEmpty(x, y, direction, map) {
	if(Math.abs(direction) == 1) {
		if(x == 0 && Disque.sign(direction) == -1 || x == PACBOT.CONSTANTS.Cells - 1 && Disque.sign(direction) == 1) return false; 
		if(map[y][x + Disque.sign(direction)] != PACBOT.MAP.Wall) {
			return [true, v(x + Disque.sign(direction), y)];
		}
		return false;
	}
	else {
		if(y == 0 && Disque.sign(direction) == -1 || y == PACBOT.CONSTANTS.Cells - 1 && Disque.sign(direction) == 1) return false; 
		if(map[y  + Disque.sign(direction)][x] != PACBOT.MAP.Wall) {
			return [true, v(x, y + Disque.sign(direction))];
		}
		return false;
	}

}

function getDistance(v, w) {
	w.x = (w.x + 0.5) * PACBOT.CONSTANTS.CellWidth;
	w.y =  (w.y + 0.5) * PACBOT.CONSTANTS.CellWidth;
	return Math.sqrt((w.x - v.x) * (w.x - v.x) + (w.y - v.y) * (w.y - v.y)) - PACBOT.CONSTANTS.CellWidth / 2;
}

function getDistanceFromEdge(c, direction) {
	if(direction == PACBOT.Directions.Left) {
		return getDistance(c, v(-1, v.y));
	}
	else if(direction == PACBOT.Directions.Right) {
		return getDistance(c, v(PACBOT.CONSTANTS.Cells, v.y));
	}
	if(direction == PACBOT.Directions.Up) {
		return getDistance(c, v(v.x, -1));
	}
	return getDistance(c, v(v.x, PACBOT.CONSTANTS.Cells));
}

function getPerpendicular(direction) {
	if(Math.abs(direction) == 1)
		return Math.sign(direction) * 2;
	else 
		return -Math.sign(direction);
}

function getOrientation(direction) {
	if(direction == PACBOT.Directions.Right) return 0;
	if(direction == PACBOT.Directions.Left) return Math.PI;
	if(direction == PACBOT.Directions.Up) return Math.PI * 3 / 2;
	if(direction == PACBOT.Directions.Down) return Math.PI / 2;
}

function PacBot() {
	this.position = v(0, 0);
	this.radius = PACBOT.CONSTANTS.Width / (PACBOT.CONSTANTS.Cells * 7) * (2.5);
	this.orientation = 0;
	this.color = new color(255, 255, 0);
	this.speed = 0;
	this.initialPosition = v(0, 0);
	this.memory = [0, 0, 0, 0];
	this.target = v(0, 0);
	this.direction = PACBOT.Directions.Right;
	this.resolveWallCollisions = function(p) {
		var walls = getClosestWallsSorted(this.position.x, this.position.y, p.map), x, y, w = PACBOT.CONSTANTS.Width / PACBOT.CONSTANTS.Cells;
		var hasCollision = false;
		for(var i = 0; i < 10; i++) {
			x = walls[i].pos.x;
			y = walls[i].pos.y;
			var r = w / 2 + this.radius;
			if (Math.abs(x - this.position.x) < r && Math.abs(y - this.position.y) < r) {
				hasCollision = true;
				var cv = v(0, 0);
				cv.x = (r - Math.abs(x - this.position.x)) * Disque.sign(x - this.position.x);
				cv.y = (r - Math.abs(y - this.position.y)) * Disque.sign(y - this.position.y);
				//var or = v(Math.cos(this.orientation), Math.sin(this.orientation));
				//var res = Disque.dot(cv, or) / (or.length() * or.length());
				//console.log(res);
				//or = or.normalize().scale(-res);
				//console.log(or);
				//console.log("-----");
				this.position.x += cv.x * -1;
				this.position.y += cv.y * -1;
			}
		}
		if(this.position.x < this.radius) {
			this.position.x = this.radius;
			hasCollision = true;
		}
		if(this.position.y < this.radius) {
			this.position.y = this.radius;
			hasCollision = true;
		}
		if(this.position.x > (PACBOT.CONSTANTS.Width - this.radius)) {
			this.position.x = (PACBOT.CONSTANTS.Width - this.radius);
			hasCollision = true;
		}
		if(this.position.y > (PACBOT.CONSTANTS.Width - this.radius)) {
			this.position.y = (PACBOT.CONSTANTS.Width - this.radius);
			hasCollision = true;
		}
		if(hasCollision)
			p.fitness += PACBOT.WallPunishment;
	}
	this.reset = function() {
		this.position = this.initialPosition.clone();
		this.orientation = 0;
	}
	/*this.update = function(p) {
		var c = p.context;	
		var input = this.memory.slice(0);
		var bc = getBlockCoor(this.position.x, this.position.y);
		for(var i = 0; i < p.ghosts.length; i++) {
			var rb = getBlockCoor(p.ghosts[i].position.x, p.ghosts[i].position.y);
			input.push(rb.x);
			input.push(rb.y);
			if(bc.x == rb.x && bc.y == rb.y) {
				p.lives--;
				p.fitness += PACBOT.DeathPunishment;
				p.reset();
				return;
			}
		}
		input.push(0);
		input.push(0);
		input.push(0);
		input.push(0);
		input.push(this.speed / (PACBOT.CONSTANTS.Width/(PACBOT.CONSTANTS.Cells * 7)));
		input.push(this.orientation);
		input.push(p.ghostState);
		input.push(p.dt);
		var op = p.brain.update(input);
		this.speed = op[0] * 100;
		this.orientation = op[1] * 2 * Math.PI;
		this.memory = op.splice(2, 4);
		this.position.x += this.speed * (p.dt / 1000.0) * Math.cos(this.orientation);
		this.position.y += this.speed * (p.dt / 1000.0) * Math.sin(this.orientation);
		this.resolveWallCollisions(p);
		if(p.pelletMap[bc.y][bc.x] == PACBOT.MAP.Pellet) {
			p.pelletMap[bc.y][bc.x] = PACBOT.MAP.Empty;
			p.fitness += PACBOT.PelletReward;
			p.drawMap();
		}
	}*/
	this.turn = function(bc, direction, map, pos) {
		var options = getNearbyEmpty(bc.x, bc.y, map);
		var center = v((bc.x + 0.5) * PACBOT.CONSTANTS.CellWidth, (bc.y + 0.5) * PACBOT.CONSTANTS.CellWidth);
		for(var i = 0; i < options.length; i++) {
			if(getDirection(bc, options[i]) == direction) {
				this.orientation = getOrientation(direction);
				this.direction = direction;
				return options[i];
			}
		}

		this.fitness += PACBOT.WallPunishment;
	}
	this.move = function(p) {
		this.position.x += this.speed * (p.dt / 1000.0) * Math.cos(this.orientation);
		this.position.y += this.speed * (p.dt / 1000.0) * Math.sin(this.orientation);
	}
	this.update = function(p) {
		var c = p.context;	
		var input = this.memory.slice(0);
		var bc = getBlockCoor(this.position.x, this.position.y);
		var center = v((bc.x + 0.5) * PACBOT.CONSTANTS.CellWidth, (bc.y + 0.5) * PACBOT.CONSTANTS.CellWidth);
		for(var i = 0; i < p.ghosts.length; i++) {
			var rb = getBlockCoor(p.ghosts[i].position.x, p.ghosts[i].position.y);
			input.push(rb.x);
			input.push(rb.y);
			if(bc.x == rb.x && bc.y == rb.y) {
				p.lives--;
				p.fitness += PACBOT.DeathPunishment;
				p.reset();
				return;
			}
		}
		var frontWall = getNextWall(bc.x, bc.y, this.direction, p.map);
		frontWall = frontWall == -1 ? getDistanceFromEdge(this.position, this.direction) : getDistance(this.position, frontWall);
		frontWall -= this.radius;

		var backWall = getNextWall(bc.x, bc.y, -this.direction, p.map);
		backWall = backWall == -1 ? getDistanceFromEdge(this.position, -this.direction) : getDistance(this.position, backWall);
		backWall -= this.radius;

		var right = getPerpendicular(this.direction);
		var rightWall = getNextWall(bc.x, bc.y, right, p.map);
		rightWall = rightWall == -1 ? getDistanceFromEdge(this.position, right) : getDistance(this.position, rightWall);
		rightWall -= this.radius;

		var leftWall = getNextWall(bc.x, bc.y, -right, p.map);
		leftWall = leftWall == -1 ? getDistanceFromEdge(this.position, -right) : getDistance(this.position, leftWall);
		leftWall -= this.radius;

		input.push(frontWall * PACBOT.CONSTANTS.InchpPixel);
		input.push(backWall * PACBOT.CONSTANTS.InchpPixel);
		input.push(rightWall * PACBOT.CONSTANTS.InchpPixel);
		input.push(leftWall * PACBOT.CONSTANTS.InchpPixel);

		input.push(this.speed / (PACBOT.CONSTANTS.Width/(PACBOT.CONSTANTS.Cells * 7)));
		input.push(this.orientation);
		input.push(p.ghostState);
		input.push(p.dt);

		var op = p.brain.update(input);
		this.memory = op.splice(2, 4);
		//console.log(PACBOT.Directions.Array[Math.floor(op[0] * 4)]);
		
		this.speed = op[1] * 100;
		var emp = isEmpty(bc.x, bc.y, this.direction, p.map);
		if(emp[0]) 
			this.target = v((emp[1].x + 0.5) * PACBOT.CONSTANTS.CellWidth, (emp[1].y + 0.5) * PACBOT.CONSTANTS.CellWidth);
		if(Math.abs(this.position.x - this.target.x) > Disque.epsilon || Math.abs(this.position.y - this.target.y) > Disque.epsilon)
			this.move(p);
		else
			this.turn(bc, PACBOT.Directions.Array[Math.floor(op[0] * 4)], p.map, this.position);

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
	this.orientation = 0;
	this.color = c;
	this.mode = PACBOT.States.Scatter;
	this.targetPosition = null;
	this.scatterTimer = PACBOT.ScatterTime;
	this.originaltarget = v(0, 0);
	this.target = v(0, 0);
	this.speed = PACBOT.CONSTANTS.Width / (PACBOT.CONSTANTS.Cells * 7) * 12.0;
	this.direction = PACBOT.Directions.Right;
	this.reset = function() {
		this.position = this.initialPosition.clone();
		this.target = this.originaltarget.clone();
		this.targetPosition = null;
		this.orientation = 0;
		this.scatterTimer = PACBOT.ScatterTime;
	}
	this.update = function(p) {
		var c = p.context;
		if(this.scatterTimer > 0) {
			this.scatterTimer -= p.dt;
		}
		else {
			this.mode = PACBOT.States.Chase;

			if(this.marker == PACBOT.Ghosts.Red || true) {
				this.target = getBlockCoor(p.pacBot.position.x, p.pacBot.position.y);
			}
			else if(this.marker == PACBOT.Ghosts.Pink) {
			}
		}
		if(this.targetPosition == null || Math.abs(this.position.x - this.targetPosition.x) < Disque.epsilon && Math.abs(this.position.y - this.targetPosition.y) < Disque.epsilon) {
			if(this.mode == PACBOT.States.Scatter || this.mode == PACBOT.States.Chase) {
				var bc = getBlockCoor(this.position.x, this.position.y);
				var options = getNearbyEmpty(bc.x, bc.y, p.map);
				for(var i = 0; i < options.length && options.length > 1; i++) {
					if(getDirection(bc, options[i]) == -this.direction) {
						options.splice(i, 1);
					}
				}
				var tb = options[Math.floor(Disque.random(0, options.length))];
				var d = 1000000;
				var bt = this.target;
				for(var i = 0; i < options.length && options.length > 1; i++) {
					var nd = (bt.x - options[i].x) * (bt.x - options[i].x) + (bt.y - options[i].y) * (bt.y - options[i].y);
					if(nd < d) {
						tb = options[i];
						d = nd;
					}
				}
				this.direction = getDirection(bc, tb);
				var cw = PACBOT.CONSTANTS.Width / PACBOT.CONSTANTS.Cells;
				this.targetPosition = v(0, 0);
				this.targetPosition.x = tb.x * cw + cw / 2;
				this.targetPosition.y = tb.y * cw + cw / 2;
			}
		}
		this.orientation = Math.atan2(this.targetPosition.y - this.position.y, this.targetPosition.x - this.position.x);
		this.position.x += this.speed * (p.dt / 1000.0) * Math.cos(this.orientation);
		this.position.y += this.speed * (p.dt / 1000.0) * Math.sin(this.orientation);
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
		drawRectangle(p.backContext, this.start.x, this.start.y, this.width, this.height, color);
	}
}

function drawPellet(c, x, y) {
	c.beginPath();
	c.arc(x, y, PACBOT.CONSTANTS.CellWidth * 0.15, 0, 2 * Math.PI, false);
	c.fillStyle = "rgb(" + PACBOT.MAP.PelletColor.r +"," + PACBOT.MAP.PelletColor.g + "," + PACBOT.MAP.PelletColor.b + ")";
	c.fill();
	c.closePath();	
}

function Pellet(x, y, map) {
	this.x = x;
	this.y = y;
	this.xp = this.x * PACBOT.CONSTANTS.CellWidth + PACBOT.CONSTANTS.CellWidth / 2;
	this.yp = this.y * PACBOT.CONSTANTS.CellWidth + PACBOT.CONSTANTS.CellWidth / 2;
	this.map = map;
	this.draw = function(p) {
		if(this.map[this.y][this.x] == PACBOT.MAP.Pellet) {
			drawPellet(p.backContext, this.xp, this.yp);
		}
	}
}

function getPelletMap(map) {
	var pmap = new Array();
	for(var i = 0; i < map.length; i++) {
		pmap.push(map[i].slice(0));
		for(var j = 0; j < map[i].length; j++) {
			if(map[i][j] != PACBOT.MAP.Wall) {
				pmap[i][j] = PACBOT.MAP.Pellet;
			}
		}
	}
	return pmap;
}

function PacBotGame(start, brain, map, back, front) {
	this.now = 0;
	this.dt = PACBOT.CONSTANTS.FrameRate;
	this.context = front.getContext('2d');
	this.backContext = back.getContext('2d');
	this.state = 1;
	this.start = start;
	this.brain = brain;
	this.fitness = 0;
	this.lives = 3;
	this.map = map;
	this.hasDraw = true;
	this.pelletMap = getPelletMap(map);
	this.ghostState = 0;
	this.pacBot = new PacBot();
	this.ghosts = [new GhostBot(PACBOT.Ghosts.Red, new color(255, 0, 0)), new GhostBot(2, new color(0, 255, 255)), new GhostBot(3, new color(255, 105, 180)), new GhostBot(44, new color(255, 165, 0))];
	this.blocks = new Array();
	this.rate = 1;
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
			else if(this.map[i][j] == PACBOT.Ghosts.Red * 10) {
				this.ghosts[0].originaltarget = v(j, i);
			}
			else if(this.map[i][j] == PACBOT.Ghosts.Pink * 10) {
				this.ghosts[2].originaltarget = v(j, i);
			}
			else if(this.map[i][j] == PACBOT.Ghosts.Orange * 10) {
				this.ghosts[3].originaltarget = v(j, i);
			}
			else if(this.map[i][j] == PACBOT.Ghosts.Cyan * 10) {
				this.ghosts[1].originaltarget = v(j, i);
			}
			if(this.map[i][j] != PACBOT.MAP.Wall) {
				this.blocks.push(new Pellet(j, i, this.pelletMap));
			}
		}
	}
	this.reset = function() {
		this.pacBot.reset();
		for(var i = 0; i < this.ghosts.length; i++) {
			this.ghosts[i].reset();
		}
		this.drawMap();
	}
	this.resetAll = function() {
		this.reset();
		this.lives = 3;
		for(var i = 0; i < this.pelletMap.length; i++) {
			for(var j = 0; j < this.pelletMap[i].length; j++) {
				if(this.pelletMap[i][j] == PACBOT.MAP.Empty) {
					this.pelletMap[i][j] = PACBOT.MAP.Pellet;
				}
			}
		}
	}
	this.drawBorder = function() {
		this.backContext.strokeRect(0,0, PACBOT.CONSTANTS.Width, PACBOT.CONSTANTS.Width);
	}
	this.drawMap = function() {
		this.backContext.clearRect(this.start.x, this.start.y, PACBOT.CONSTANTS.Width, PACBOT.CONSTANTS.Width);
		this.drawBorder();
		for(var i = 0; i < this.blocks.length; i++) {
			this.blocks[i].draw(this);
		}
	}
	this.reset();
	this.pause = function() {
		this.state = 0;
		this.now = 0;
	}
	this.play = function() {
		this.state = 1;
	}
	this.update = function() {
		if(this.state == 1 &&  this.lives > 0) {
			/*var nnow = Date.now();
			if(this.now == 0) {
				this.now = nnow - PACBOT.CONSTANTS.FrameRate * this.rate;
			}
			this.dt = (nnow - this.now) * this.rate;
			this.now = nnow;
			//console.log(this.dt);*/
			this.dt = PACBOT.CONSTANTS.FrameRate * this.rate;
			this.pacBot.update(this);
			this.ghosts[0].update(this);
			this.ghosts[1].update(this);
			this.ghosts[2].update(this);
			this.ghosts[3].update(this);
			if(this.hasDraw) { 
				this.draw(this.context);
			}
		}
		else {
			this.now = 0;
		}
	}
	this.draw = function(c) {
		c.clearRect(this.start.x, this.start.y, PACBOT.CONSTANTS.Width, PACBOT.CONSTANTS.Width);
		//c.drawImage(m_canvas, 0, 0)
		this.pacBot.draw(c, this.start);
		for(var i = 0; i < this.ghosts.length; i++) {
			this.ghosts[i].draw(c, this.start);
		}
	}

}