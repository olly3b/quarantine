function Bullet(player, vx, vy) {
	this.x = player.x + player.width / 2;
	this.y = player.y + player.height / 2;
	this.vx = vx;
	this.vy = vy;
	this.speed = 600;
	this.alive = true;
	this.size = 1;
	this.damage = 1;
}

Bullet.prototype.update = function(monsters, step, map) {

	if (this.alive) {

		this.x += this.vx * this.speed * step;
		this.y += this.vy * this.speed * step;

		for (var m = 0; m < monsters.length; m++) {
			if (this.x > monsters[m].x && this.x < monsters[m].x + monsters[m].width) {
				if (this.y > monsters[m].y && this.y < monsters[m].y + monsters[m].height) {
					monsters[m].alive = false;
					this.alive = false;
				}
			}
		}


	for(var ay = 0; ay < map.dynamicMap.length ; ay++) {
		for(var ax = 0; ax < map.dynamicMap[ay].length; ax++) {
		 		
	 		var tile = map.dynamicMap[ay][ax];

	 		switch(tile) {		 			
	 			case 3:	
	 				if (this.x > ax * 32 && this.x < (ax * 32) + 32) {
	 					if (this.y > ay * 32 && this.y < (ay * 32) + 32) { // + this.size /2) {		 									 								 								 								 				
	 						this.alive = false;
	 					}		 								 					
	 				}	 			
		 			break;
		 	}
		}
	}
	}
}

Bullet.prototype.draw = function(context, map) {
	if (this.alive) {
		context.fillStyle = '#000000';
    	context.fillRect(this.x, this.y, this.size, this.size);
	}

	if (this.x < 0 || this.y < 0 || this.x > map.sizeX || this.y > map.sizeY) {
		this.alive = false;
	}
}