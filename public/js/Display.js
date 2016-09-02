var Display = function(client){
	this.client = client;

	this.canvas = document.querySelector("#canvas");
	this.ctx = this.canvas.getContext("2d");

	this.tilesize = 0;
}

Display.prototype.render = function(){
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	if(this.client.room == null){
		return;
	}

	var tiles = this.client.room.map.tiles;
	this.tilesize = this.canvas.width/tiles.length;
	for(var x in tiles){
		for(var y in tiles[x]){

			if(tiles[x][y].type != 0){
				if(tiles[x][y].type == 1){
					this.ctx.fillStyle = "black";
				}
				if(tiles[x][y].type == 2){
					this.ctx.fillStyle = "#777777";
				}
				this.ctx.fillRect(x * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
			}
			if(this.client.room.placement){
				if(tiles[x][y].player){
					if(tiles[x][y].player == 1){
						this.ctx.fillStyle = "blue";
					}
					if(tiles[x][y].player == 2){
						this.ctx.fillStyle = "red";
					}
					this.ctx.fillRect(x * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
				}
			}
			

			this.ctx.strokeRect(x * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
		}
	}

	for(var i in this.client.room.units){
		this.ctx.beginPath();
		this.ctx.arc(this.client.room.units[i].x * this.tilesize + this.tilesize/2, this.client.room.units[i].y * this.tilesize + this.tilesize/2, this.tilesize/3, 0, 2 * Math.PI, false);
		if(this.client.room.units[i].team == 1){
			this.ctx.fillStyle = 'blue';
		}else{
			this.ctx.fillStyle = 'red';
		}
		this.ctx.fill();
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = 'black';
		this.ctx.stroke();
	}
}