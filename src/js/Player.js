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
}

Player.prototype.controlUpdate = function(step, viewport, map) {
	this.lookAtMouse(viewport);

	var oldX = this.x;
	var oldY = this.y;

	if (!controls.left && !controls.right && !controls.up && !controls.down && !this.fireDelay) {
		this.setAnimation(0);
	}

	var newBullet = false;

	if (!this.fireDelay) {
		if (this.isFirePressed()) { newBullet = this.shoot(); }
	}

	this.horizontalInputUpdate(step);
	this.checkHorizontalCollision(map, oldX);

	this.verticalInputUpdate(step);
	this.checkVerticalCollision(map, oldY);
	
	return newBullet;
}

Player.prototype.lookAtMouse = function(viewport) {
	this.angle = Math.atan2((controls.mouseY + viewport.y) - this.y - (this.height / 2), (controls.mouseX + viewport.x) - this.x - (this.width / 2));

	this.angle = this.angle * (180 / Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI / 180);	
}

Player.prototype.isFirePressed = function() {
	return controls.space;
}

Player.prototype.horizontalInputUpdate = function(step) {
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
}

Player.prototype.verticalInputUpdate = function(step) {
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
}

Player.prototype.checkHorizontalCollision = function(map, oldX) {		
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
}

Player.prototype.checkVerticalCollision = function(map, oldY) {
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
}

Player.prototype.update = function(step, mainViewPort, pathFinder, monsters, player, animations, map) {
	if (!this.isMainFocus()) {		
		if (this.isFollowing()) {
			this.setNewPath(pathFinder.findPath(this, mainViewPort.focus));				

			if (this.path != null && !this.fireDelay) {
				this.trimPath();
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

		if (this.isAIOn() && !this.fireDelay) {
			if (this.AIShoot(monsters, map)) {
				return true;
			}
		}
	}

	this.updateShotStun();
	this.updateAnimation(animations);
}

Player.prototype.isAIOn = function() {
	return this.ai;
}

Player.prototype.isFollowing = function() {
	return this.follow;
}

Player.prototype.trimPath = function() {
	for (var p = 0; p < this.currentViewPort; p++) {
		this.path.pop(this.path.length - 1);
	}
}

Player.prototype.updateShotStun = function() {
	this.increaseShotStunCounter();
	if (this.isShotStunFinished()) {		
		this.endShotStun();
	}
}

Player.prototype.increaseShotStunCounter = function() {
	this.fireCounter++;
}

Player.prototype.isShotStunFinished = function() {
	return this.fireCounter >= this.fireRate;
}

Player.prototype.endShotStun = function() {
	this.fireDelay = false;
}


Player.prototype.updateAnimation = function(animations) {
	this.increaseFrameCounter();
	if (this.isEndOfCurrentFrame(animations)) {
		this.resetFrameCounter();
		this.increaseCurrentFrame();
		if (this.isEndOfCurrentAnimation(animations)) {
			if (this.isCurrentAnimationLooping(animations)) {
				this.resetCurrentFrame();
			} else {
				this.setAnimation(4);
				this.resetCurrentFrame;
			}
		}
	}
}

Player.prototype.increaseFrameCounter = function() {
	this.frameCounter++;
}

Player.prototype.isEndOfCurrentFrame = function(animations) {
	return this.frameCounter > animations[this.currentAnimation].frames[this.currentFrame].length;
}

Player.prototype.resetFrameCounter = function() {
	this.frameCounter = 0;
}

Player.prototype.increaseCurrentFrame = function() {
	this.currentFrame++;
}

Player.prototype.isEndOfCurrentAnimation = function(animations) {
	return this.currentFrame >= animations[this.currentAnimation].frames.length;
}

Player.prototype.isCurrentAnimationLooping = function(animations) {
	return animations[this.currentAnimation].looping;
}

Player.prototype.resetCurrentFrame = function() {
	this.currentFrame = 0;
}

Player.prototype.AIShoot = function(monsters, map) {
	var m = this.findClosestMonster(monsters);
	if (this.isMonsterFound(m)) {		
		this.aimAt(monsters[m]);
		return this.shoot();
	}

	return false;
}

Player.prototype.isMonsterFound = function(m) {
	return m != null;
}

Player.prototype.shoot = function() {	
	if (this.isCanShoot()) {
		this.startShotStun();
		this.forceSetAnimation(3);
		this.useAmmo();

		return true; // Return true to create a bullet
	} 

	this.AIReload();

	return false;
}

Player.prototype.AIReload = function() {
	if (!this.isWeaponLoaded() && !this.focus) {
		for (var i = 0; i < this.inventory.length; i++) {
			if (this.isAmmoInInventory(this.inventory[i])) {
				if (this.isSameTypeAsEquipped(this.inventory[i])) {
					if (this.inventory[i].ammo > this.equipped.clipSize) {
						this.fillWeaponFromInventory(this.inventory[i]);
					} else {
						this.loadWeaponWithLastAmmo(this.inventory[i]);
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

	return false;
}

Player.prototype.fillWeaponFromInventory = function(item) {
	this.equipped.ammo += this.equipped.clipSize;
	this.inventory[i].ammo -= this.equipped.clipSize;
}

Player.prototype.isSpareAmmoMoreThanClipSize = function(item) {
	return item.ammo > this.equipped.clipSize;
}

Player.prototype.loadWeaponWithLastAmmo = function(item) {
	this.equipped.ammo = item.ammo;
	item.ammo -= this.equipped.clipSize;
}

Player.prototype.consumeAmmoReload = function(item) {
	if (this.isAmmoEmpty(item)) {
		item = null;
	}	
}

Player.prototype.isAmmoEmpty = function(item) {
	return item.ammo <= 0;
}

Player.prototype.isSameTypeAsEquipped = function(item) {
	return item.itemName == this.equipped.itemName;
}

Player.prototype.isAmmoInInventory = function(slot) {
	return !this.isInventorySlotEmpty(slot) && this.isItemAmmo(slot);
}

Player.prototype.isMainFocus = function() {
	return this.focus;
}

Player.prototype.isInventorySlotEmpty = function(slot) {
	return slot == null;
}

Player.prototype.isItemAmmo = function(item) {
	return item.itemType == 'ammo';
}

Player.prototype.isCanShoot = function() {
	return this.isWeaponLoaded() && !this.isShotStunOn() && this.isWeaponEquipped();
}

Player.prototype.isWeaponLoaded = function() {
	return this.equipped.ammo > 0;
}

Player.prototype.isShotStunOn = function() {
	return this.fireDelay;
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
		this.frameCounter = 0;
	}
}

Player.prototype.forceSetAnimation = function(animation) {
	this.currentAnimation = animation;
	this.currentFrame = 0;
	this.frameCounter = 0;
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


