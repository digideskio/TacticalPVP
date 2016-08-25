var Map = function(){
	this.tiles = [];
}

Map.prototype.generate = function(width, height, wall, hole, positions){
	/* TILE
		TYPE : 0, 1, 2
		PLAYER : 1, 2
		SPRITES : []
	*/

	var map = [];
	for(var i = 0; i < width; i++){
		map[i] = [];
		for(var j = 0; j < height; j++){
			map[i][j] = {type:0};
		}
	}

	var i = 0;
	while(i < wall){
		var x = Math.floor(Math.random() * width);
		var y = Math.floor(Math.random() * height);
		if(map[x][y].type == 0){
			map[x][y].type = 1;
			map[width - 1 - x][height - 1 - y].type = 1;
			i++;
		}
	}

	var i = 0;
	while(i < hole){
		var x = Math.floor(Math.random() * width);
		var y = Math.floor(Math.random() * height);
		if(map[x][y].type == 0){
			map[x][y].type = 2;
			map[width - 1 - x][height - 1 - y].type = 2;
			i++;
		}
	}

	var i = 0;
	while(i < positions){
		var x = Math.floor(Math.random() * width);
		var y = Math.floor(Math.random() * height);
		if(map[x][y].type == 0){
			map[x][y].player = 1;
			map[width - 1 - x][height - 1 - y].player = 2;
			i++;
		}
	}

	this.tiles = map;
	return map;
}

Map.prototype.getInformations = function(){
	return {
		tiles:this.tiles
	}
}