function Map(width, height, image) {
	this.width = width; // Must be a multiple of 32 (Tile width)
	this.height = height; // Must be a multiple of 32 (Tile height)
	this.image = new Image();
	this.image.src = image;
	this.tileSize = 32;
	this.tilesX = this.width / this.tileSize;
	this.tilesY = this.height / this.tileSize;
	this.dynamicMap = this.testDynamicMap();

	this.tiles = new Array();
	this.tiles.push(new Image()); // Blank
	this.tiles.push(new Image()); // Blank
	this.tiles.push(new Image()); // Blank
	this.tiles.push(new Image());
	this.tiles[this.tiles.length - 1].src = 'img/wall.png';
}

Map.prototype.draw = function(context) {
	 context.drawImage(this.image, 0, 0);

	 for(var y = 0; y < this.dynamicMap.length ; y++) {
	 	for(var x = 0; x < this.dynamicMap[y].length; x++) {
	 		
	 		var tile = this.dynamicMap[y][x];
	 		if (tile > 2) {  
	 			//context.drawImage(this.tiles[tile], x * 32, y * 32, 32, 32);
	 		}
	 	}
	 }
}

Map.prototype.testDynamicMap = function() {
	var dynamicMap = new Array();
	dynamicMap.push(new Array(3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,3,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,3,3,3,3,3,3,3,3,2,2,2,2,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,3,0,0,3,3,3,3,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,3,3,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,2,2,2,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,3,3,3,3,3,3,2,2,2,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));	
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3));
	dynamicMap.push(new Array(3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3));


	return dynamicMap;
}