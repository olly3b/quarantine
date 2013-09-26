function Monster(x, y, image) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.angle = 0;

	this.image = new Image();
	this.image.src = image;

	this.path = new Array();
	this.currentNode = 0;

	this.alive = true;
	this.health = 3;
	this.speed = 50;
	this.staggerResist = 5; // Percentage
	this.findInterval = Math.floor((Math.random() * 20) + 1);

	this.currentAnimation = 4;
	this.currentFrame = 0;
	this.frameCounter = 0;

	this.staggerCounter = 0;
	this.staggered = false;
	
	this.playerTarget = 0; // temp
}

Monster.prototype.update = function(step, players, pathFinder, animations, sounds) {
	if (this.isAlive()) {		
		this.updatePath(players, pathFinder);
		this.move(step);
		this.updateStagger();
		if (this.isRandomMoan()) { this.randomMoan(sounds); }
	} 
	this.updateAnimation(animations);
}

Monster.prototype.isAlive = function() {
	return this.alive;
}

Monster.prototype.updatePath = function(players,  pathFinder) {
	if (this.isRandomChanceOfNewPath()) {
		this.setClosestPlayerIndex(players);
		this.setNewPath(pathFinder.findPath(this, players[this.playerTarget]));
	}
}

Monster.prototype.move = function(step) {
	if (this.isPathAndNotStaggered()) {
		this.faceCurrentNode();
		this.walkForwards(step);
	}
}

Monster.prototype.isRandomChanceOfNewPath = function() {
	return this.findInterval == Math.floor((Math.random() * 20) + 1)
}

Monster.prototype.setClosestPlayerIndex = function(players) {
	this.playerTarget = this.findClosestPlayer(players);
}

Monster.prototype.isPathAndNotStaggered = function() {
	return this.path != null && !this.staggered;
}

Monster.prototype.updateAnimation = function(animations) {
	this.increaseFrameCounter();
	if (this.isEndOfCurrentFrame(animations)) {
		this.resetFrameCounter();
		this.increaseCurrentFrame();
		if (this.isEndOfCurrentAnimation(animations)) {
			if (this.isCurrentAnimationLooping(animations)) {
				this.resetCurrentFrame();
			} else {
				if (this.isAlive()) {
					this.setAnimation(4);
					this.resetCurrentFrame();
				} else {
					this.resetFrameCounter();
					this.currentFrame = animations[this.currentAnimation].frames.length -1;
				}
			}
		}
	}
}

Monster.prototype.increaseFrameCounter = function() {
	this.frameCounter++;
}

Monster.prototype.isEndOfCurrentFrame = function(animations) {
	return this.frameCounter > animations[this.currentAnimation].frames[this.currentFrame].length;
}

Monster.prototype.resetFrameCounter = function() {
	this.frameCounter = 0;
}

Monster.prototype.increaseCurrentFrame = function() {
	this.currentFrame++;
}

Monster.prototype.isEndOfCurrentAnimation = function(animations) {
	return this.currentFrame >= animations[this.currentAnimation].frames.length;
}

Monster.prototype.isCurrentAnimationLooping = function(animations) {
	return animations[this.currentAnimation].looping;
}

Monster.prototype.resetCurrentFrame = function() {
	this.currentFrame = 0;
}

Monster.prototype.updateStagger = function() {
	if (this.isStaggered()) {
		this.decreaseStaggerCounter();
		if (this.isStaggerFinished()) {
			this.endStagger();
		}
	}
}

Monster.prototype.isStaggered = function() {
	return this.staggered;
}

Monster.prototype.decreaseStaggerCounter = function() {
	this.staggerCounter--;
}

Monster.prototype.isStaggerFinished = function() {
	return this.staggerCounter < 0;
}

Monster.prototype.endStagger = function() {
	this.staggered = false;
}
Monster.prototype.isRandomMoan = function() {
	return Math.floor((Math.random() * 600) + 1) == 1;
}

Monster.prototype.randomMoan = function(sounds) {
	sounds[Math.floor((Math.random() * sounds.length - 1) + 1)].play();
}

Monster.prototype.faceCurrentNode = function() {
	if (this.isNodesMoreThan0()) {
		this.setAngleToCurrentNode();
	}
}

Monster.prototype.isNodesMoreThan0 = function() {
	return this.path.length != 0;
}

Monster.prototype.setAngleToCurrentNode = function() {
	this.angle = Math.atan2((this.path[this.currentNode].y * 32) - this.y, (this.path[this.currentNode].x * 32) - this.x);

	// Offset angle by 90 because fuck you
	this.angle = this.angle * (180/Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI/180);	
}

Monster.prototype.walkForwards = function(step) {
	if (this.isNodesMoreThan0()) { 
		this.setAnimation(5);
		this.setNewPosition(step);
		if (this.isCurrentNodeReached()) {
			this.increaseCurrentNode();
			if (this.isPathFinished()) {
				this.clearPath();
			}
		} 
	}	
}

Monster.prototype.setNewPosition = function(step) {
	this.x += (Math.cos(this.angle + 1.57079633) * step * this.speed);
	this.y += (Math.sin(this.angle + 1.57079633) * step * this.speed);
}

Monster.prototype.isCurrentNodeReached = function() {
	return this.x >= (this.path[this.currentNode].x * 32) - 11 && this.x <= (this.path[this.currentNode].x * 32) + 21 && this.y >= (this.path[this.currentNode].y * 32) - 11 && this.y <= (this.path[this.currentNode].y * 32) + 21;
}

Monster.prototype.increaseCurrentNode = function() {
	this.currentNode++;
}

Monster.prototype.isPathFinished = function() {
	return this.currentNode > this.path.length - 1;
}

Monster.prototype.clearPath = function() {
	this.path = [];
}

Monster.prototype.findClosestPlayer = function(players) {
	var lowest = 100000;
	var closestPlayer = 0;

	for (var p = 0; p < players.length; p++) {
		if (this.isPlayerClosest(players[p], lowest)) {
			lowest = this.getManhattanValue(players[p].x, players[p].y);
			closestPlayer = p;
		}
	}

	return closestPlayer;
}

Monster.prototype.isPlayerClosest = function(player, lowest) {
	return this.getManhattanValue(player.x, player.y) < lowest;
}

Monster.prototype.getManhattanValue = function(x, y) {
	var hX = (this.x - x);
	if (hX < 0) { hX = -hX; }

	var hY = (this.y - y);
	if (hY < 0) { hY = -hY; }

	return hX + hY;
}

Monster.prototype.takeDamage = function(damage, crit) {
	if (this.isCrit(crit)) {
		this.critHit(damage);
		this.setAnimation(7);
		if (this.isHealth0()) { 
			this.die(); 
			this.setAnimation(9);
		}	
	} else {
		this.normalHit(damage);
		this.setAnimation(6);
		if (this.isHealth0()) { 
			this.die(); 
			this.setAnimation(8);
		}
	}
	this.stagger();	
}

Monster.prototype.isCrit = function(crit) {
	return Math.floor((Math.random() * 100) + 1) <= crit;
}

Monster.prototype.critHit = function(damage) {
	this.health -= damage * 2;
}

Monster.prototype.normalHit = function(damage) {
	this.health -= damage;
}

Monster.prototype.isHealth0 = function() {
	return this.health <= 0;
}

Monster.prototype.die = function() {
	this.alive = false;
	this.setAnimation(8);
}

Monster.prototype.stagger = function() {
	this.staggered = true;
	this.setStaggerCounter();
}

Monster.prototype.setStaggerCounter = function() {
	this.staggerCounter = Math.floor((Math.random() * 90) + 1);
}

Monster.prototype.setNewPath = function(path) {
	this.path = path;
	this.currentNode = 0;
}


Monster.prototype.setAnimation = function(animation) {
	if (animation != this.currentAnimation) {
		this.currentAnimation = animation;
		this.currentFrame = 0;
		this.frameCounter = 0;
	}
}

Monster.prototype.draw = function(context, spriteSheet, animations) {
	//if (this.isAlive()) {
		context.save();
		context.translate(this.x, this.y);
		context.translate(this.width / 2, this.height / 2);
		context.rotate(this.angle); 	
		context.drawImage(spriteSheet, animations[this.currentAnimation].frames[this.currentFrame].imgX, animations[this.currentAnimation].frames[this.currentFrame].imgY, animations[this.currentAnimation].frames[this.currentFrame].width, animations[this.currentAnimation].frames[this.currentFrame].height, -this.width / 2, -this.height / 2, 32, 32);	
		context.restore();
	// } else {
	// 	context.save();
	// 	context.translate(this.x, this.y);
	// 	context.translate(this.width / 2, this.height / 2);
	// 	context.rotate(this.angle); 	
	// 	context.drawImage(spriteSheet, 288, 96, animations[this.currentAnimation].frames[this.currentFrame].width, animations[this.currentAnimation].frames[this.currentFrame].height, -this.width / 2, -this.height / 2, 32, 32);	
	// 	context.restore();
	// }
}
