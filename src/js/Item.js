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