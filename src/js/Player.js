function Player(name, x, y, player) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.angle = 0;	

	this.health = 100;
	this.speed = 100;
	this.sight = 240;
	this.findInterval = Math.floor((Math.random()*20)+1);

	this.player = player; // wtf?
	this.currentViewPort = player; // ok?
	this.path = null;
	this.currentNode = 0;
	this.follow = false;
	this.focus = false;
	this.ai = false;

	this.fireDelay = false;
	this.fireCounter = 0;
	this.fireRate = 50;
	this.checkAngle = 0;
	
	this.currentAnimation = 0;
	this.currentFrame = 0;
	this.frameCounter = 0;

	this.equipped = new Item('weapon', 'pistol');
	this.inventory = new Array();
	this.inventory.push(new Item('ammo', 'pistol'));
	this.inventory.push(new Item('ammo', 'pistol'));
	this.inventory.push(new Item('ammo', 'pistol'));
}

Player.prototype.controlUpdate = function(step, viewport, map) {
	this.angle = Math.atan2((controls.mouseY + viewport.y) - this.y - (this.height / 2), (controls.mouseX + viewport.x) - this.x - (this.width / 2));

	this.angle = this.angle * (180 / Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI / 180);	

	var oldX = this.x;
	var oldY = this.y;

	//if (!controls.left && !controls.right && !controls.up && !controls.down && !controls.space && !this.fireDelay) {
	if (!controls.left && !controls.right && !controls.up && !controls.down && !this.fireDelay) {
		this.setAnimation(0);
	}

	var b = false;
	if (!this.fireDelay) {
		if (controls.space) { b = this.shoot(); }
	}

	if (!this.fireDelay) {
		if(controls.left) {
			this.x -= this.speed * step;
			if (this.currentAnimation != 1) {
				this.setAnimation(1);
			}
		}
		
		if(controls.right) {
			this.x += this.speed * step;
			if (this.currentAnimation != 1) {
				this.setAnimation(1);
			}
		}
	}
	
	for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
		for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
		 		
	 		var tile = map.dynamicMap[ay][ax];

	 		switch(tile) {		 			
	 			case 1:
	 			case 2:
	 			case 3:	
	 				if (this.x + 30 > ax * 32 && this.x < (ax * 32) + 30) {
	 					if (this.y + 30 > ay * 32 && this.y < (ay * 32) + 30) {		 									 								 								 								 				
	 						this.x = oldX;
	 					}		 								 					
	 				}	 			
		 			break;
		 	}
		}
	}

	if (!this.fireDelay) {

		if(controls.up) {
			this.y -= this.speed * step;
			if (this.currentAnimation != 1) {
				this.setAnimation(1);
			}
		}
		if(controls.down) {		
			this.y += this.speed * step;  
			if (this.currentAnimation != 1) {
				this.setAnimation(1);		
			}
		}
	}

	for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
		for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
		 		
	 		var tile = map.dynamicMap[ay][ax];

	 		switch(tile) {	
	 			case 1:
	 			case 2:	 			
	 			case 3:	
	 				if (this.x  + 30 > ax * 32 && this.x < (ax * 32) + 30) {
	 					if (this.y + 30 > ay * 32 && this.y < (ay * 32) + 30) {		 				 									 								 								 								 				
	 						this.y = oldY;
	 					}		 								 					
	 				}	 			
		 			break;
		 	}
		}
	}
	
	return b;
}

Player.prototype.update = function(step, mainViewPort, pathFinder, monsters, player, animations, map) {
	if (!this.focus) {		
		if (this.follow) {
			this.setNewPath(pathFinder.findPath(this, mainViewPort.focus));				

			if (this.path != null && !this.fireDelay) {
				for (var p = 0; p < this.currentViewPort; p++) {
					this.path.pop(this.path.length - 1);
				}
				this.faceCurrentNode();
				this.walkForwards(step);
			} else {
				if (this.fireDelay) {
					this.setAnimation(2);
				} 
			}	
		} else {
			if (this.fireDelay) {
				this.setAnimation(2);
			} else {
				this.setAnimation(0);
			}
		}

		if (this.ai && !this.fireDelay) {
			if (this.AIShoot(monsters, map)) {
				return true;
			}
		}
	}

	this.fireCounter++;
	if (this.fireCounter >= this.fireRate) {		
		this.fireDelay = false;
	}

	this.frameCounter++;
	if (this.frameCounter > animations[this.currentAnimation].frames[this.currentFrame].length) {
		this.frameCounter = 0;
		this.currentFrame++;
		if (this.currentFrame >= animations[this.currentAnimation].frames.length) {
			if (animations[this.currentAnimation].looping) {
				this.currentFrame = 0;
			} else {
				this.currentAnimation = 0;
				this.currentFrame = 0;
			}
		}
	}
}



Player.prototype.AIShoot = function(monsters, map) {
	var m = this.findClosestMonster(monsters);
	if (m != null) {		
		//if (this.canSeeMonster(monsters, map)) {
			this.aimAt(monsters[m]);
			return this.shoot();
		//}
	}

	return false;
}

// Player.prototype.canSeeMonster = function(monsters, map) {
	
// 	for (var a = 0; a < 360; a++) {
// 		//var dirX = Math.cos(a + this.angle + 1.57079633); 
// 		//var dirY = Math.sin(a + this.angle + 1.57079633);
// 		var dirX = Math.cos(a); 
// 		var dirY = Math.sin(a);

// 		var posX = this.x;
// 		var posY = this.y;

// 		var see = false;

// 		for (var s = 0; s < this.sight; s++) {
// 			posX += dirX;
// 			posY += dirY;

// 			for (var m = 0; m < monsters.length; m++) {
// 				if (posX > monsters[m].x && posX < monsters[m].x + monsters[m].width) {
// 					if (posY > monsters[m].y && posY < monsters[m].y + monsters[m].height) {
// 						return true;
// 					}
// 				}
// 			}

// 			for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
// 				for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
				 		
// 			 		var tile = map.dynamicMap[ay][ax];

// 			 		switch(tile) {		 			
// 			 			case 3:	
// 			 				if (posX > ax * 32 && posX < (ax * 32) + 32) {
// 			 					if (posY > ay * 32 && posY < (ay * 32) + 32) { 									 								 								 								 				
// 			 						return false;
// 			 					}		 								 					
// 			 				}	 			
// 				 			break;
// 				 	}
// 				}
// 			}
// 		}
// 	}

// 	return false;
// }

Player.prototype.shoot = function() {	
	if (this.isCanShoot()) {
		if (this.equipped.itemName == 'pistol') {
				this.startShotStun();
				this.forceSetAnimation(3);
				this.useAmmo();

				return true; // Return true to create a bullet
		}
	} 

	if (!this.isWeaponLoaded() && !this.focus) {
		for (var i = 0; i < this.inventory.length; i++) {
			if (this.inventory[i] != null) {
				if (this.inventory[i].itemType == 'ammo') {
					if (this.inventory[i].itemName == this.equipped.itemName) {
						if (this.inventory[i].ammo > this.equipped.clipSize) {
							this.equipped.ammo += this.equipped.clipSize;
							this.inventory[i].ammo -= this.equipped.clipSize;
						} else {
							this.equipped.ammo = this.inventory[i].ammo;
							this.inventory[i].ammo -= this.equipped.clipSize;
						}
						if (this.inventory[i].ammo <= 0) {
							this.inventory[i] = null;
						}					
						//this.setAnimation(2); //Change to new reloading animation
						return false;
					}
				}
			}
		}
	}

	return false;
}

Player.prototype.isCanShoot = function() {
	return this.isWeaponLoaded() && !this.isShotStunOn() && this.isWeaponEquipped();
}

Player.prototype.isWeaponLoaded = function() {
	return this.equipped.ammo > 0;
}

Player.prototype.isShotStunOn = function() {
	return this.fireDelay
}

Player.prototype.isWeaponEquipped = function() {
	return this.equipped.itemType == 'weapon';
}

Player.prototype.startShotStun = function() {
	this.fireDelay = true;
	this.fireCounter = 0;
}

Player.prototype.useAmmo = function() {
	this.equipped.ammo--;
}

Player.prototype.findClosestMonster = function(monsters) {
	var lowest = 100000;
	var closestMonster = 0;

	for (var m = 0;  m< monsters.length; m++) {
		if (this.isMonsterClosest(monsters[m], lowest)) {
			lowest = this.getManhattanValue(monsters[m].x, monsters[m].y);
			closestMonster = m;
		}
	}

	if (this.isWithInSight(lowest)) { return closestMonster; }

	return null;
}

Player.prototype.isMonsterClosest = function(monster, lowest) {
	return this.getManhattanValue(monster.x, monster.y) < lowest;
}

Player.prototype.getManhattanValue = function(x, y) {
	var hX = (this.x - x);
	if (hX < 0) { hX = -hX; }

	var hY = (this.y - y);
	if (hY < 0) { hY = -hY; }

	return hX + hY;
}

Player.prototype.isWithInSight = function(distance) {
	return distance < this.sight;
}


Player.prototype.aimAt = function(target) {
	this.setAnimation(2);
	this.angle = Math.atan2(target.y - this.y, target.x - this.x);

	// Offset angle by 90 because fuck you
	this.angle = this.angle * (180/Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI/180);	
}

Player.prototype.faceCurrentNode = function() {
	if (this.isNodesMoreThan0()) {
		this.setAngleToCurrentNode();
	}
}

Player.prototype.isNodesMoreThan0 = function() {
	return this.path.length != 0;
}

Player.prototype.setAngleToCurrentNode = function() {
	this.angle = Math.atan2((this.path[this.currentNode].y * 32) - this.y, (this.path[this.currentNode].x * 32) - this.x);

	// Offset angle by 90 because fuck you
	this.angle = this.angle * (180/Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI/180);	
}


Player.prototype.walkForwards = function(step) {
	if (this.isNodesMoreThan0()) { 
		this.setAnimation(1);
		this.setNewPosition(step);
		if (this.isCurrentNodeReached()) {
			this.increaseCurrentNode();
			if (this.isPathFinished()) {
				this.clearPath();
			}
		} 
	}	
}

Player.prototype.setNewPosition = function(step) {
	this.x += (Math.cos(this.angle + 1.57079633) * step * this.speed);
	this.y += (Math.sin(this.angle + 1.57079633) * step * this.speed);
}

Player.prototype.isCurrentNodeReached = function() {
	return this.x >= (this.path[this.currentNode].x * 32) - 11 && this.x <= (this.path[this.currentNode].x * 32) + 21 && this.y >= (this.path[this.currentNode].y * 32) - 11 && this.y <= (this.path[this.currentNode].y * 32) + 21;
}

Player.prototype.increaseCurrentNode = function() {
	this.currentNode++;
}

Player.prototype.isPathFinished = function() {
	return this.currentNode > this.path.length - 1;
}

Player.prototype.clearPath = function() {
	this.path = [];
}

Player.prototype.setAnimation = function(animation) {
	if (animation != this.currentAnimation) {
		this.currentAnimation = animation;
		this.currentFrame = 0;
	}
}

Player.prototype.forceSetAnimation = function(animation) {
	this.currentAnimation = animation;
	this.currentFrame = 0;
}

Player.prototype.setNewPath = function(path) {
	this.path = path;
	this.currentNode = 0;
}

Player.prototype.draw = function(context, spriteSheet, animations) {
	context.save();
	context.translate(this.x, this.y);
	context.translate(this.width / 2, this.height / 2);
	context.rotate(this.angle); 	
	context.drawImage(spriteSheet, animations[this.currentAnimation].frames[this.currentFrame].imgX, (animations[this.currentAnimation].frames[this.currentFrame].imgY + 32) * this.player, animations[this.currentAnimation].frames[this.currentFrame].width, animations[this.currentAnimation].frames[this.currentFrame].height, -this.width / 2, -this.height / 2, 32, 32);	
	context.restore();
}


