function Item(itemType, itemName) {	
	this.itemType = itemType;
	this.itemName = itemName;
	
	this.clipSize = 0;
	this.fireRate = 0;
	this.speed = 0;
	this.damage = 0;
	this.crit = 0;
	this.accuracy = 0;
	this.ammo = 0;
	this.imageX = 0;
	this.imageY = 0;
	this.x = 0;
	this.y = 0;
	this.width = 32;
	this.height = 32;
	this.angle = 0;

	this.initialise();
}

Item.prototype.initialise = function() {
	if (this.itemType == 'weapon') {
		if (this.itemName == 'pistol') {
			this.clipSize = 10;
			this.fireRate = 50;
			this.speed = 600;
			this.damage = 1;
			this.crit = 20;
			this.accuracy = 100;
			this.ammo = 10;
			this.imageX = 0;
			this.imageY = 128;
		}
	}

	if (this.itemType = 'ammo') {
		if (this.itemName == 'pistol') {
			this.ammo = 10;
			this.clipSize = 10;
			this.imageX = 32;
			this.imageY = 128;			
		}
	}
}

Item.prototype.draw = function(context, spriteSheet) {
	context.save();
	context.translate(this.x, this.y);
	context.translate(this.width / 2, this.height / 2);
	context.rotate(this.angle); 	
	context.drawImage(spriteSheet, this.imageX, this.imageY, this.width, this.height, -this.width / 2, -this.height / 2, 32, 32);	
	context.restore();
}