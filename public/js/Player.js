var Player = function(json){
	this.id = 0;
	this.pseudo = "";
	this.socket;

	this.room;

	this.x = -1;
	this.y = -1;

	this.fighting = false;

	this.isReady = false;

	this.team = 0;

	this.characteristics = JSON.parse(JSON.stringify(CHARACTERISTICS));

	this.defaultCharacteristics = JSON.parse(JSON.stringify(DEFAULT_CHARACTERISTICS));

	this.items = [];
	this.spells = [];
	this.buffs = [];


	this.init(json);
}

Player.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Player.prototype.action = function(action){
	if(this.fighting == false || this.room == null){
		return;
	}

	switch(action.type){
		case "move":
		if(this.room.placement == false){
			if(this.room.units[this.room.unitTurn].id && this.room.units[this.room.unitTurn].id == this.id){
				this.move(action.x, action.y);
			}
		}
		break;
		case "placement":
		if(this.room.placement == true){
			this.placement(action.x, action.y);
		}
		break;
		default:
	}
}

Player.prototype.move = function(position){
	if(position.length > this.characteristics.MP){
		return;
	}

	var mapMatrix = this.room.getAllObstacles();

	var dx = this.x;
	var dy = this.y;

	for(var i in position){
		if((Math.abs(position[i].x - dx) + Math.abs(position[i].y - dy)) != 1){
			//jump cell
			return;
		}
		dx = position[i].x;
		dy = position[i].y;

		if(!(mapMatrix[dx] && mapMatrix[dx][dy] && mapMatrix[dx][dy].type == 0 && (!mapMatrix[dx][dy].unit))){
			//obstacle on way
			return;
		}
	}

	var path = [];

	var dx = this.x;
	var dy = this.y;

	for(var i in position){
		var neighbors = this.room.map.getNeighborsCells(dx, dy);
		var proba = [];
		for(var cell of neighbors){
			if(cell.unit && cell.unit.team != this.team){
				proba.push(this.getDodgeProbability(cell.unit));
			}
		}

		var APLoss = 0;
		var MPLoss = 0;

		if(proba.length > 0){
			var probaproduct = proba.reduce(function(a,b){return a*b});
			APLoss = Math.ceil(1 - this.characteristics.AP * probaproduct); 
			MPLoss = Math.ceil(1 - this.characteristics.MP * probaproduct); 
		}

		this.characteristics.AP -= APLoss;
		this.characteristics.MP -= 1;
		this.characteristics.MP -= MPLoss;

		if(this.characteristics.MP <= 0){
			continue;
		}

		dx = position[i].x;
		dy = position[i].y;

		path.push({x:dx, y:dy, APLoss:APLoss, MPLoss:MPLoss});
	}

	this.x = dx;
	this.y = dy;

	for(var i in this.room.players){
		Utils.msgTo(this.room.players[i].socket, "move", [{id:this.id, path:path}]);
	}
}

Player.prototype.placement = function(x, y){
	var tiles = this.room.map.tiles;

	if(tiles[x] && tiles[x][y] && tiles[x][y].player == this.team){
		var freeCell = true;
		for(var i in this.room.units){
			if(this.room.units[i].x == x && this.room.units[i].y == y){
				freeCell = false;
				break;
			}
		}
		if(freeCell){
			this.x = parseInt(x);
			this.y = parseInt(y);

			for(var i in this.room.players){
				if(this.room.players[i].team == this.team){
					Utils.msgTo(this.room.players[i].socket, "placement", [{id:this.id, x:this.x, y:this.y}]);
				}
			}
		}
	}
}

Player.prototype.updateCharacteristics = function(){
	for(var i in this.defaultCharacteristics){
		if(!this.characteristics[i]){
			this.characteristics[i] = 0;
		}
		this.characteristics[i] += this.defaultCharacteristics[i];
	}

	var uselessData = ["id_i", "name", "level", "id_ui", "id_u", "equiped", "position"];
	for(var i in this.items){
		for(var j in this.items[i]){
			if(uselessData.indexOf(j) != -1){
				continue;
			}
			if(!this.characteristics[j]){
				this.characteristics[j] = 0;
			}
			this.characteristics[j] += parseInt(this.items[i][j]);
		}
	}
}


Player.prototype.getDodgeProbability = function(unit){
	var pDodge = this.characteristics.dodge || 0;
	var uLock = unit.characteristics.lock || 0;
	return (pDodge + 2) / (2 * (uLock + 2));
}

Player.prototype.getMoves = function(){
	var _this = this;
	
	var obstacles = _this.room.getAllObstacles();

	var cells = {};
	var mp = this.characteristics.MP || 0;

	var list = {};
	list[this.x+"-"+this.y] = {distance:0};

	while(Object.keys(list).length > 0){
		for(var i in list){
			var positions = i.split("-");
			var neighbors = _this.room.map.getNeighborsCells(positions[0], positions[1]);
			for(var neighbor of neighbors){
				if(list[i].distance+1 > mp){
					continue;
				}

				if(obstacles[neighbor.x][neighbor.y].type != 0 || obstacles[neighbor.x][neighbor.y].unit){
					continue;
				}

				if(!cells[neighbor.x+"-"+neighbor.y]){
					cells[neighbor.x+"-"+neighbor.y] = {fathers:[], x:neighbor.x, y:neighbor.y};
					list[neighbor.x+"-"+neighbor.y] = {distance:list[i].distance+1};
				}
				cells[neighbor.x+"-"+neighbor.y].fathers.push({cell:i, distance:list[i].distance+1});
			}
			delete list[i];
		}
	}
	return cells;
}


Player.prototype.getPublicInformations = function(){
	var stats = JSON.parse(JSON.stringify(this.characteristics));

	delete stats.power;
	delete stats.damage;
	delete stats.range;
	delete stats.initiative;
	delete stats.CH;
	delete stats.heal;
	delete stats.damheal;

	return {
		id:this.id,
		pseudo:this.pseudo,	
		x:this.x,
		y:this.y,
		team:this.team,
		spells:this.spells,
		characteristics:stats,
		buffs:this.buffs
	}
}

Player.prototype.getAllInformations = function(){
	return {
		id:this.id,
		pseudo:this.pseudo,	
		x:this.x,
		y:this.y,
		team:this.team,
		spells:this.spells,
		characteristics:this.characteristics,
		buffs:this.buffs
	}
}