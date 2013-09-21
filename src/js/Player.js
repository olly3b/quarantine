function Player(x, y, image) {
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.image.src = image;
	this.speed = 200;
	this.angle = 0;	
	this.path = null;
	this.currentNode = 0;
	this.follow = false;
	this.width = 32;
	this.height = 32;
	this.findInterval = Math.floor((Math.random()*10)+1);
	this.focus = false;
	this.fireDelay = false;
	this.fireCounter = 0;
	this.fireRate = 20;
	this.sight = 400;
}

Player.prototype.draw = function(context) {
	context.save();
	context.translate(this.x, this.y);
	context.translate(this.width / 2, this.height / 2);
	context.rotate(this.angle); 	
	context.drawImage(this.image, -this.width / 2, -this.height / 2, 32, 32);	
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

	var b = false;
	if (controls.space) { b = this.shoot(); }

	if(controls.left)
		this.x -= this.speed * step;
	
	if(controls.right)
		this.x += this.speed * step;
	
	for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
		for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
		 		
	 		var tile = map.dynamicMap[ay][ax];

	 		switch(tile) {		 			
	 			case 1:	
	 				if (this.x + 32 > ax * 32 && this.x < (ax * 32) + 32) {
	 					if (this.y + 32 > ay * 32 && this.y < (ay * 32) + 32) {		 									 								 								 								 				
	 						this.x = oldX;
	 					}		 								 					
	 				}	 			
		 			break;
		 	}
		}
	}

	if(controls.up)
		this.y -= this.speed * step;
	if(controls.down)
		this.y += this.speed * step;  

	for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
		for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
		 		
	 		var tile = map.dynamicMap[ay][ax];

	 		switch(tile) {		 			
	 			case 1:	
	 				if (this.x  + 32 > ax * 32 && this.x < (ax * 32) + 32) {
	 					if (this.y + 32 > ay * 32 && this.y < (ay * 32) + 32) {		 				 									 								 								 								 				
	 						this.y = oldY;
	 					}		 								 					
	 				}	 			
		 			break;
		 	}
		}
	}
	
	return b;
}

Player.prototype.update = function(step, mainViewPort, pathFinder, monsters) {
	if (!this.focus) {
		if (this.follow) {
			this.setPath(pathFinder.findPath(this, mainViewPort.focus));
			this.faceCurrentNode();
			this.walkForwards(step);
		}	

		if (this.AIShoot(monsters)) {
			return true;
		}
	}

	this.fireCounter++;
	if (this.fireCounter >= this.fireRate) {		
		this.fireDelay = false;
	}

}


Player.prototype.faceCurrentNode = function() {
	if (this.path.length != 0) {
		this.angle = Math.atan2(((this.path[this.currentNode].y * 32) - this.y) + 16, ((this.path[this.currentNode].x * 32) - this.x) + 16);

		this.angle = this.angle * (180/Math.PI); 
		this.angle -= 90;
		this.angle = this.angle * (Math.PI/180);	
	}
}

Player.prototype.walkForwards = function(step) {
	if (this.path.length != 0) { 

		this.x += (Math.cos(this.angle + 1.5) * step * this.speed);
		this.y += (Math.sin(this.angle + 1.5) * step * this.speed);

		if (this.x >= (this.path[this.currentNode].x * 32) - 11 && this.x <= (this.path[this.currentNode].x * 32) + 21 && this.y >= (this.path[this.currentNode].y * 32) - 11 && this.y <= (this.path[this.currentNode].y * 32) + 21) {
			this.currentNode++;
			if (this.currentNode > this.path.length - 1) {
				this.path = [];
			}
		} 
	}
}

Player.prototype.AIShoot = function(monsters) {
	var m = this.findClosestMonster(monsters);
	if (m != null) {
		this.faceMonster(monsters[m].x, monsters[m].y);

		return this.shoot();
	}

	return false;
}

Player.prototype.shoot = function() {	
	if (!this.fireDelay) {
		this.fireDelay = true;
		this.fireCounter = 0;
		return true;
	}

	
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
	//this.angle = Math.atan2((y - this.y) - this.height / 2, (x - this.x) - this.width / 2);
	this.angle = Math.atan2(y - (this.y + this.height / 2), x - (this.x + this.width / 2));
	//this.angle = Math.atan2((y - this.y), (x - this.x));

	this.angle = this.angle * (180/Math.PI); 
	this.angle -= 90;
	this.angle = this.angle * (Math.PI/180);	
}



