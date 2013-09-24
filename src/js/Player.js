function Player(x, y, player) {
	this.x = x;
	this.y = y;
	this.player = player;
	this.currentViewPort = player;
	this.speed = 100;
	this.angle = 0;	
	this.path = null;
	this.currentNode = 0;
	this.follow = false;
	this.width = 32;
	this.height = 32;
	this.findInterval = Math.floor((Math.random()*20)+1);
	this.focus = false;
	this.fireDelay = false;
	this.fireCounter = 0;
	this.fireRate = 50;
	this.checkAngle = 0;
	this.sight = 240;
	this.currentAnimation = 0;
	this.currentFrame = 0;
	this.frameCounter = 0;
	this.equipped = new Item('weapon', 'pistol');
	this.inventory = new Array();
	this.inventory.push(new Item('ammo', 'pistol'));
	this.ai = false;
}

Player.prototype.draw = function(context, spriteSheet, animations) {
	context.save();
	context.translate(this.x, this.y);
	context.translate(this.width / 2, this.height / 2);
	context.rotate(this.angle); 	
	context.drawImage(spriteSheet, animations[this.currentAnimation].frames[this.currentFrame].imgX, (animations[this.currentAnimation].frames[this.currentFrame].imgY + 32) * this.player, animations[this.currentAnimation].frames[this.currentFrame].width, animations[this.currentAnimation].frames[this.currentFrame].height, -this.width / 2, -this.height / 2, 32, 32);	
	context.restore();
}

Player.prototype.setPath = function(path) {
	this.path = path;
	this.currentNode = 0;
}

Player.prototype.controlUpdate = function(step, viewport, map) {
	this.angle = Math.atan2((controls.mouseY + viewport.y) - this.y - (this.height / 2), (controls.mouseX + viewport.x) - this.x - (this.width / 2));

	this.angle = this.angle * (180/Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI/180);	

	var oldX = this.x;
	var oldY = this.y;

	if (!controls.left && !controls.right && !controls.up && !controls.down && !controls.space && !this.fireDelay) {
		this.setAnimation(0);
	}

	var b = false;
	if (controls.space) { b = this.shoot(); }

	if (!this.fireDelay) {

		if(controls.left) {
			this.x -= this.speed * step;
			this.setAnimation(1);
		}
		
		if(controls.right) {
			this.x += this.speed * step;
			this.setAnimation(1);
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
			this.setAnimation(1);
		}
		if(controls.down) {		
			this.y += this.speed * step;  
			this.setAnimation(1);		
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
			this.setPath(pathFinder.findPath(this, mainViewPort.focus));				

			if (this.path != null && !this.fireDelay) {
				for (var p = 0; p < this.currentViewPort; p++) {
					this.path.pop(this.path.length - 1);
				}

				this.faceCurrentNode();
				this.walkForwards(step);
			} else {
				if (this.fireDelay) {
					this.setAnimation(2);
				} else {
					this.setAnimation(0);
				}
			}	
		}

		if (this.ai && this.equipped.ammo > 0 && !this.fireDelay) {
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


Player.prototype.faceCurrentNode = function() {
	if (this.path.length != 0) {
		this.angle = Math.atan2((this.path[this.currentNode].y * 32) - this.y, (this.path[this.currentNode].x * 32) - this.x);
		this.angle = this.angle * (180/Math.PI); 
		this.angle -= 90;
		this.angle = this.angle * (Math.PI/180);	
	}
}

Player.prototype.walkForwards = function(step) {
	if (this.path.length != 0) { 
		this.setAnimation(1);		
		this.x += (Math.cos(this.angle + 1.57079633) * step * this.speed);
		this.y += (Math.sin(this.angle + 1.57079633) * step * this.speed);		
		if (this.x >= ((this.path[this.currentNode].x * 32) + 16) && this.x <= ((this.path[this.currentNode].x * 32) + 16) && this.y >= ((this.path[this.currentNode].y * 32) + 16) && this.y <= ((this.path[this.currentNode].y * 32) + 16)) {
			this.currentNode++;
			if (this.currentNode > this.path.length - 1) {
				this.path = [];
			}
		} 
	} else {
		this.setAnimation(0);
	}
}

Player.prototype.AIShoot = function(monsters, map) {
	var m = this.findClosestMonster(monsters);
	if (m != null) {		
		//if (this.canSeeMonster(monsters, map)) {
			this.faceMonster(monsters[m].x, monsters[m].y);
			return this.shoot();
		//}
	}

	return false;
}

Player.prototype.canSeeMonster = function(monsters, map) {
	
	for (var a = 0; a < 360; a++) {
		//var dirX = Math.cos(a + this.angle + 1.57079633); 
		//var dirY = Math.sin(a + this.angle + 1.57079633);
		var dirX = Math.cos(a); 
		var dirY = Math.sin(a);

		var posX = this.x;
		var posY = this.y;

		var see = false;

		for (var s = 0; s < this.sight; s++) {
			posX += dirX;
			posY += dirY;

			for (var m = 0; m < monsters.length; m++) {
				if (posX > monsters[m].x && posX < monsters[m].x + monsters[m].width) {
					if (posY > monsters[m].y && posY < monsters[m].y + monsters[m].height) {
						return true;
					}
				}
			}

			for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
				for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
				 		
			 		var tile = map.dynamicMap[ay][ax];

			 		switch(tile) {		 			
			 			case 3:	
			 				if (posX > ax * 32 && posX < (ax * 32) + 32) {
			 					if (posY > ay * 32 && posY < (ay * 32) + 32) { 									 								 								 								 				
			 						return false;
			 					}		 								 					
			 				}	 			
				 			break;
				 	}
				}
			}
		}
	}

	return false;
}

Player.prototype.shoot = function() {	
	if (!this.fireDelay) {
		if (this.equipped.itemType == 'weapon') {
			if (this.equipped.itemName == 'pistol') {
				if (this.equipped.ammo > 0) {
					this.fireDelay = true;
					this.fireCounter = 0;
					this.setAnimation(3);
					this.equipped.ammo--;
					return true;
				}
			}
		}
	}

	this.setAnimation(2);
	return false
}

Player.prototype.findClosestMonster = function(monsters) {
	var h = 100000;
	var c = 0;

	if (monsters.length != 0) {
		for (var m = 0; m < monsters.length; m++) {
			var hX = (this.x - monsters[m].x);
	    	if (hX < 0) { hX = -hX; }

	    	var hY = (this.y - monsters[m].y);
	    	if (hY < 0) { hY = -hY; }

	    	if (hX + hY < h) {
	    		h = hX + hY;
	    		c = m;
	    	}
		}
	}

	if (h < this.sight) {
		return c;
	}

	return null;
}


Player.prototype.faceMonster = function(x, y) {
	this.setAnimation(2);
	this.angle = Math.atan2(y - this.y, x - this.x);
	this.angle = this.angle * (180/Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI/180);	
}

Player.prototype.setAnimation = function(animation) {
	if (animation != this.currentAnimation) {
		this.currentAnimation = animation;
		this.currentFrame = 0;
	}
}



