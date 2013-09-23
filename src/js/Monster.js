function Monster(x, y, image) {
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.image.src = image;
	this.angle = 0;
	this.path = new Array();
	this.currentNode = 0;
	this.speed = 50;
	this.playerTarget = 0;
	this.width = 32;
	this.height = 32;
	this.alive = true;
	this.findInterval = Math.floor((Math.random()*20)+1);
	this.currentAnimation = 4;
	this.currentFrame = 0;
	this.frameCounter = 0;
}

Monster.prototype.update = function(step, players, pathFinder, animations) {

	if (this.alive) {
		// This function does not need to run every frame
		if (this.findInterval == Math.floor((Math.random()*20)+1)) {

			var c = this.findClosestPlayer(players);
			this.playerTarget = c;
			this.setPath(pathFinder.findPath(this, players[c]));
		}

		this.faceCurrentNode();
		this.walkForwards(step);

		this.frameCounter++;
		if (this.frameCounter > animations[this.currentAnimation].frames[this.currentFrame].length) {
			this.frameCounter = 0;
			this.currentFrame++;
			if (this.currentFrame >= animations[this.currentAnimation].frames.length) {
				if (animations[this.currentAnimation].looping) {
					this.currentFrame = 0;
				} else {
					this.currentAnimation = 4;
					this.currentFrame = 0;
				}
			}
		}
	}
}

Monster.prototype.faceCurrentNode = function() {
	if (this.path.length != 0) {
		this.angle = Math.atan2((this.path[this.currentNode].y * 32) - this.y, (this.path[this.currentNode].x * 32) - this.x);

		this.angle = this.angle * (180/Math.PI); 
		this.angle -= 90;
		this.angle = this.angle * (Math.PI/180);	
	}
}

Monster.prototype.walkForwards = function(step) {
	if (this.path.length != 0) { 
		this.setAnimation(5);

		this.x += (Math.cos(this.angle + 1.57079633) * step * this.speed);
		this.y += (Math.sin(this.angle + 1.57079633) * step * this.speed);

		if (this.x >= (this.path[this.currentNode].x * 32) - 11 && this.x <= (this.path[this.currentNode].x * 32) + 21 && this.y >= (this.path[this.currentNode].y * 32) - 11 && this.y <= (this.path[this.currentNode].y * 32) + 21) {
			this.currentNode++;
			if (this.currentNode > this.path.length - 1) {
				this.path = [];
			}
		} 
	}
}

Monster.prototype.findClosestPlayer = function(players) {
	var h = 100000;
	var c = 0;

	for (var p = 0; p < players.length; p++) {
		var hX = (this.x - players[p].x);
    	if (hX < 0) { hX = -hX; }

    	var hY = (this.y - players[p].y);
    	if (hY < 0) { hY = -hY; }

    	if (hX + hY < h) {
    		h = hX + hY;
    		c = p;
    	}
	}

	return c;
}

Monster.prototype.draw = function(context, spriteSheet, animations) {
	if (this.alive) {
		context.save();
		context.translate(this.x, this.y);
		context.translate(this.width / 2, this.height / 2);
		context.rotate(this.angle); 	
		context.drawImage(spriteSheet, animations[this.currentAnimation].frames[this.currentFrame].imgX, animations[this.currentAnimation].frames[this.currentFrame].imgY, animations[this.currentAnimation].frames[this.currentFrame].width, animations[this.currentAnimation].frames[this.currentFrame].height, -this.width / 2, -this.height / 2, 32, 32);	
		context.restore();
	}
}

Monster.prototype.setPath = function(path) {
	this.path = path;
	this.currentNode = 0;
}


Monster.prototype.setAnimation = function(animation) {
	if (animation != this.currentAnimation) {
		this.currentAnimation = animation;
		this.currentFrame = 0;
	}
}
