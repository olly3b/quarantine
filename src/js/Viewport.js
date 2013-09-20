function Viewport(posX, posY, width, height) {
	this.width = width;
	this.height = height;
	this.x = 0;
	this.y = 0;		
	this.posX = posX;
	this.posY = posY;
	this.deadZoneX = this.width / 2;
	this.deadZoneY = this.height / 2;
	this.focus = new Object();
}

Viewport.prototype.update = function(map) {	
	// moves camera on horizontal axis based on followed object position
    if(this.focus.x - this.x  + this.deadZoneX > this.width)
        this.x = this.focus.x - (this.width - this.deadZoneX);
    else if(this.focus.x  - this.deadZoneX < this.x)
        this.x = this.focus.x  - this.deadZoneX;
    
    // moves camera on vertical axis based on followed object position
    if(this.focus.y - this.y + this.deadZoneY > this.height)
        this.y = this.focus.y - (this.height - this.deadZoneY);
    else if(this.focus.y - this.deadZoneY < this.y)
        this.y = this.focus.y - this.deadZoneY;

	if (this.x < 0)
		this.x = 0;
	if (this.y < 0)
		this.y = 0;
	if (this.x > map.sizeX - this.width)
		this.x = map.sizeX - this.width;
	if (this.y > map.sizeY - this.height)
		this.y = map.sizeY - this.height;
}