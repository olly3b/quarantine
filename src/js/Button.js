function Button(x, y, width, height, image) {
	this.on = false;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.images = new Array();
	this.image = new Image();
	//this.image.src = image;
	this.state = 'Off No'
}

Button.prototype.update = function(mouseX, mouseY) {
	if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
		if (!this.on) {
			this.state = 'Off Yes';
		} else {
			this.state = 'On Yes';
		}
	} else {
		if (!this.on) {
			this.state = 'Off No';
		} else {
			this.state = 'On No';
		}
	}
}

Button.prototype.clicked = function() {	
	if (this.on) {
		this.on = false;
	} else {
		this.on = true;
	}
}

Button.prototype.draw = function(context) {
	if (this.state == 'Off No') {
		context.fillStyle = '#0000FF';
		context.fillRect(this.x, this.y, this.width, this.height);
		//context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);	
	}
	if (this.state == 'Off Yes') {
		context.fillStyle = '#000099';
		context.fillRect(this.x, this.y, this.width, this.height);
		//context.drawImage(this.image, 0, this.height, this.width, this.height, this.x, this.y, this.width, this.height);	
	}
	if (this.state == 'On No') {
		context.fillStyle = '#FF0000';
		context.fillRect(this.x, this.y, this.width, this.height);		
		//context.drawImage(this.image, 0, 0, this.height * 2, this.height, this.x, this.y, this.width, this.height);	
	}
	if (this.state == 'On Yes') {
		context.fillStyle = '#990000';
		context.fillRect(this.x, this.y, this.width, this.height);		
		//context.drawImage(this.image, 0, 0, this.height * 3, this.height, this.x, this.y, this.width, this.height);	
	}
}