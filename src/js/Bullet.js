function Bullet(player, vx, vy) {
	this.x = player.x + player.width / 2;
	this.y = player.y + player.height / 2;
	this.vx = vx;
	this.vy = vy;
	this.speed = 600;
	this.alive = true;
	this.size = 1;
	this.damage = 1;
	this.crit = 20; // Percentage
	this.stagger = 75; // Percentage
}

Bullet.prototype.update = function(monsters, step, map) {
	if (this.isAlive()) {
		this.move(step);
		if (this.checkCollisionWithMonster(monsters) || this.checkCollisionWithMap(map)) { return true; }
		if (this.isBoundaryReached(map)) { this.killBullet(); }
	}

	return false;
}

Bullet.prototype.isAlive = function() {
	return this.alive;
}

Bullet.prototype.checkCollisionWithMonster = function(monsters) {
	for (var m = 0; m < monsters.length; m++) {
		if (this.isIntersectObject(monsters[m])) {
			if (this.isAlive() && monsters[m].isAlive()) {
				monsters[m].takeDamage(this.damage, this.crit);
				this.killBullet();
			}
		}
	}
}

Bullet.prototype.isIntersectObject = function(thing) {
	if (this.x > thing.x && this.x < thing.x + thing.width) {
		if (this.y > thing.y && this.y < thing.y + thing.height) {
			return true;
		}
	}

	return false;
}

Bullet.prototype.isIntersect = function(x, y, w, h) {
	if (this.x > x && this.x < x + w) {
		if (this.y > y && this.y < y + h) {
			return true;
		}
	}

	return false;
}


Bullet.prototype.killBullet = function() {
	this.alive = false;
}

Bullet.prototype.checkCollisionWithMap = function(map) {
	for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
		for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
	 		switch(map.dynamicMap[ay][ax]) {		 			
	 			case 3:	
	 				if (this.isIntersect(ax * 32, ay * 32, 32, 32)) {
	 					this.killBullet();
	 				}
	 							
		 			break;
		 	}
		}
	}
}

Bullet.prototype.move = function(step) {
	this.x += this.vx * this.speed * step;
	this.y += this.vy * this.speed * step;
}

Bullet.prototype.draw = function(context, map) {
	if (this.isAlive()) {
		context.fillStyle = '#000000';
    	context.fillRect(this.x, this.y, this.size, this.size);
	}	
}

Bullet.prototype.isBoundaryReached = function(map) {
	if (this.x < 0 || this.y < 0 || this.x > map.sizeX || this.y > map.sizeY) {
		return true;
	}

	return false;
}