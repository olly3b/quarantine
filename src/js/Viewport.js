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
    if(this.focus.x + 16 - this.x  + this.deadZoneX > this.width)
        this.x = this.focus.x + 16 - (this.width - this.deadZoneX);
    else if(this.focus.x + 16  - this.deadZoneX < this.x)
        this.x = this.focus.x + 16  - this.deadZoneX;
    
    // moves camera on vertical axis based on followed object position
    if(this.focus.y + 16 - this.y + this.deadZoneY > this.height)
        this.y = this.focus.y + 16 - (this.height - this.deadZoneY);
    else if(this.focus.y + 16 - this.deadZoneY < this.y)
        this.y = this.focus.y + 16 - this.deadZoneY;

	if (this.x < 0)
		this.x = 0;
	if (this.y < 0)
		this.y = 0;
	if (this.x > map.width - this.width)
		this.x = map.width - this.width;
	if (this.y > map.height - this.height)
		this.y = map.height - this.height;
}