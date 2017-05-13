var center = 0;

$( window ).on('resize load', function() {
	background.width = background.offsetWidth;
	background.height = background.offsetHeight;
	$(realbody).css('height', (window.innerHeight - ($('#navbar').length > 0 ? 33 : 0)) + 'px');
	if(center != 0) {
		center.position.x = profile.getBoundingClientRect().left + 80;
		center.position.y = profile.getBoundingClientRect().top + 80;
	}
});

ctx = 0;

$( window ).on('load', function() {
	ctx = background.getContext('2d');
	createStars();
});

var stars = new Array();
var white = new color(255, 255, 255);
var cBlackHole = false;


function dist(a, b) {
	return Disque.lengthSqrd(a, b);
}

function star() {
	this.position = Disque.randomV(0, background.offsetWidth, 0, background.offsetHeight);
	this.speed =  Disque.randomV(-0.8, 0.8, -0.8, 0.8);
	this.oSpeed = Disque.random(0.0001, .04);
	this.radius = Disque.random(0.1, 2.6);
	this.angle = 'w';
	this.op = Disque.random(0, 1);
	this.distance = 0;
	this.update = function() {
		if(cBlackHole) {
			if(this.op < 0) {
				return;
			}
			if(this.angle == 'w') {
				this.angle = Math.atan2(this.position.y - center.position.y, this.position.x - center.position.x);
				this.distance = Math.sqrt(dist(this.position, center.position));
				this.op = Math.max(0, Math.min(1, 40000 / dist(this.position, center.position)));
				this.speed = 2.5 / this.distance;
			}			
			this.angle += this.speed;
			this.position.x = Math.cos(this.angle) * this.distance + center.position.x;
			this.position.y = Math.sin(this.angle) * this.distance + center.position.y;
		}
		else {
			this.position.add(this.speed);
			if(this.position.x > background.offsetWidth) {
				this.position.x = 1;
			}
			if(this.position.x < 0) {
				this.position.x = background.offsetWidth - 1;
			}
			if(this.position.y > background.offsetHeight)
				this.position.y = 1;
			if(this.position.y < 0) {
				this.position.y = background.offsetHeight - 1;
			}
			this.op = this.op + this.oSpeed;
			if(this.op > 1 || this.op < 0) {
				this.oSpeed = -this.oSpeed;
				this.op += this.oSpeed;
			}
		}
	}
	this.draw = function(ctx) {
		ctx.globalAlpha = this.op;
		circleF(ctx, this.position.x, this.position.y, this.radius, white);
		this.globalAlpha = 1.0;
	}
}

function createStars() {
	for(var i = 0; i < 100; i++) {
		stars.push(new star());
	}
	center = new star();
	center.radius = 80;
	center.position.x = profile.getBoundingClientRect().left + 80;
	center.position.y = profile.getBoundingClientRect().top + 80;
	center.op = 1;
}

function createMoreStars() {
	for(var i = 0; i < 1000; i++) {
		stars.push(new star());
	}
}

function clear() {
	ctx.clearRect(0, 0, background.width, background.height);
}

setInterval(function() {
	clear();
	for(var i = 0; i < stars.length; i++) {
		stars[i].update();
		stars[i].draw(ctx);
	}
}, 60);

function createBlackHole() {
	cBlackHole = true;
	if(stars.length < 400) {
		createMoreStars();
	}
}