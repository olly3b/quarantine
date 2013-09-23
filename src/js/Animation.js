function Animation(looping) {
	this.frames = new Array();
	this.looping = looping;
}

Animation.prototype.addFrame = function(imgX, imgY, width, height, length) {
	this.frames.push(new Frame(imgX, imgY, width, height, length));
}

function Frame(imgX, imgY, width, height, length) {
	this.imgX = imgX;
	this.imgY = imgY;
	this.width = width;
	this.height = height;
	this.length = length;
}