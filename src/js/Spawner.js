function Spawner(x, y) {
	this.x = x;
	this.y = y;

	this.counter = 0;
	this.frequency = 180;
	this.amount = 10;
}

Spawner.prototype.update = function() {
	this.counter++;
	if (this.counter >= this.frequency) {
		this.counter = 0;
		this.amount--;
		return true;
	}

	return false;
}