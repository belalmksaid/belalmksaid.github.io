$( window ).on('resize load', function() {
	background.width = background.offsetWidth;
	background.height = background.offsetHeight;
	$(realbody).css('height', (window.innerHeight - ($('#navbar').length > 0 ? 33 : 0)) + 'px');
});

ctx = 0;

$( window ).on('load', function() {
	ctx = background.getContext('2d');
	createStars();
});

var stars = new Array();
var white = new color(255, 255, 255);
var createBlackHole = false;

function star() {
	this.position = Disque.randomV(0, background.offsetWidth, 0, background.offsetHeight);
	this.speed =  Disque.randomV(-0.8, 0.8, -0.8, 0.8);
	this.oSpeed = Disque.random(0.0001, .04);
	this.radius = Disque.random(0.1, 2.6);
	this.op = Disque.random(0, 1);
	this.update = function() {
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
}

function clear() {
	ctx.clearRect(0, 0, background.width, background.height);
}

setInterval(function() {
	clear();
	if(!createBlackHole)
		for(var i = 0; i < stars.length; i++) {
			stars[i].update();
			stars[i].draw(ctx);
		}	
	}, 60);