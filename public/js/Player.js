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

	this.x = position[position.length - 1].x;
	this.y = position[position.length - 1].y;

	this.characteristics.MP -= position.length;

	for(var i in this.room.players){
		Utils.msgTo(this.room.players[i].socket, "placement", [{id:this.id, x:this.x, y:this.y}]);
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

Player.prototype.addSpell = function(spell){
	if(this.fighting){
		return;
	}

	var found = false;

	for(var i in this.spells){
		if(this.spells[i].id == spell.id){
			found = true;
			break;
		}
	}

	if(!found){
		this.spells.push(spell);
	}
}

Player.prototype.removeSpell = function(spell){
	if(this.fighting){
		return;
	}

	for(var i in this.spells){
		if(this.spells[i].id == spell.id){
			this.spells.splice(i, 1);
		}
	}
}

Player.prototype.addItem = function(item){
	if(!this.fighting || this.room == null){
		return;
	}

	var found = false;

	for(var i in this.items){
		if(this.items[i].id == item.id){
			found = true;
			break;
		}
	}

	if(!found){
		this.items.push(item);
	}
}

Player.prototype.removeItem = function(item){
	if(this.fighting){
		return;
	}
	
	for(var i in this.items){
		if(this.items[i].id == item.id){
			this.items.splice(i, 1);
		}
	}
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