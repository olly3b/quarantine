function Spawner(x, y) {
	this.x = x;
	this.y = y;

	this.counter = 0;
	this.frequency = 120;
	this.amount = 5;
}

Spawner.prototype.update = function() {
	this.counter++;
	if (this.counter >= this.frequency) {
		this.counter = 0;
		if (this.amount > 0) {
			this.amount--;
			return true;
		}
	}

	return false;
}