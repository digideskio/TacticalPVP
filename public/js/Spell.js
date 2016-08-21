var Spells = function(json){
	this.id = 0;
	this.name = "Spell";
	this.description = "Spell description";

	this.AP = 0;
	this.minRange = 0;
	this.maxRange = 0;
	this.modifiableRange = false;
	this.sight = true;
	this.countdown = 0;
	this.turnUse = 0;
	this.freeCell = false;
	this.cs = 0;
	this.AOE = [[1]];
	this.axis = "all";
	this.effect = "";
	this.cseffect = "";
	this.initCountdown = 0;

	this.lastUse = 0;
	this.turnUsed = 0;

	this.init(json);
}

Spells.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}

	this.lastUse = this.countdown - this.initCountdown;
}

Spell.prototype.use = function(room, player, x, y){
	if(!this.checkAP(player)){
		return false;
	}

	if(!this.checkRange(player, x, y)){
		return false;
	}

	if(!this.checkAxis(player, x, y)){
		return false;
	}

	if(!this.checkCountdown(room)){
		return false;
	}

	if(!this.checkCell(room, x, y)){
		return false;
	}

	if(!this.checkSight(player, x, y, room)){
		return false;
	}
	
}

Spell.prototype.checkAP = function(player){
	if(player.characteristics.AP < this.AP){
		return false;
	}
	return true;
}

Spell.prototype.checkRange = function(player, x, y){
	var maxRange = this.maxRange;
	if(this.modifiableRange){
		maxRange += player.characteristics.range;
		if(maxRange < this.minRange){
			maxRange = this.minRange;
		}
	}
	var range = Math.abs(player.x - x) +Math.abs(player.y - y);
	if(range < this.minRange || range > maxRange){
		return false;
	}
	return true;
}

Spell.prototype.checkAxis = function(player, x, y){
	switch(this.axis){
		case "line":
		return (player.x == x || player.y == y);
		break;
		case "diagonal":
		return (Math.abs(player.x - x) == Math.abs(player.y - y));
		break;
		default:
		return true;
	}
}

Spell.prototype.checkCountdown = function(room){
	var currentTurn = room.turn;
	if(currentTurn - this.lastUse < this.countdown){
		return false;
	}

	if(this.turnUse > 0 && this.turnUsed >= this.turnUse){
		return false;
	}
	return true;
}

Spell.prototype.checkCell = function(room, x, y){
	if(room.map.tiles[x][y].type != 0){
		return false;
	}

	if(this.freeCell){
		for(var i in room.units){
			if(room.units[i].x == x && room.units[i].y == y){
				return false;
			}
		}
	}

	return true;
}

Spell.prototype.checkSight = function(player, destx, desty, room){
	var map = [];

	for(var i in room.map.tiles){
		map[i] = [];
		for(var j in room.map.tiles[i]){
			map[i][j] = 0;
			if(room.map.tiles[i][j].type == 1){
				map[i][j] = 1;
			}
		}
	}

	for(var i in room.units){
		map[room.units[i].x][room.units[i].y] = 1;
	}

	var isObstacle = function(cx, cy){
		if(player.x == cx && player.y == cy){
			return false;
		}

		if(destx == cx && desty == cy){
			return false;
		}

		return (map[cx][cy] == 1);
	}

	var x = player.x;
	var y = player.y;

	var dx = destx - player.x;
	var dy = desty - player.y;

	var xstep = 1;
	var ystep = 1;

	if(dx < 0){
		xstep = -1;
		dx = -dx;
	}

	if(dy < 0){
		ystep = -1;
		dy = -dy;
	}

	var ddx = 2 * dx;
	var ddy = 2 * dy;

	if(ddx >= ddy){
		var errorprev = dx;
		var error = dx;
		for(var i = 0; i < dx; i++){
			x += xstep;
			error += ddy;
			if(error > ddx){
				y += ystep;
				error -= ddx;
				if(error + errorprev < ddx){
					if(isObstacle(x, y - ystep)){
						return false;
					}
				}else if(error + errorprev > ddx){
					if(isObstacle(x - xstep, y)){
						return false;
					}
				}
			}
			if(isObstacle(x, y)){
				return false;
			}
			errorprev = error;
		}
	}else{
		errorprev = dy;
		error = dy;
		for(var i = 0; i < dy; i++){
			y += ystep;
			error += ddx;
			if(error > ddy){
				x += xstep;
				error -= ddy;
				if(error + errorprev < ddy){
					if(isObstacle(x - xstep, y)){
						return false;
					}
				}else if(error + errorprev > ddy){
					if(isObstacle(x, y - ystep)){
						return false;
					}
				}
			}
			if(isObstacle(x, y)){
				return false;
			}
			errorprev = error;
		}
	}
	return true;
}