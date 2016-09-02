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

	this.characteristics = {
		HP:0,
		HPMAX:0,
		erodedHP:0,
		AP:0,
		MP:0,
		range:0,
		initiative:0,
		CH:0,
		power:0,
		damage:0,
		heal:0,
		damheal:0,
		resistance:0,
		damresistance:0,
		APloss:0,
		MPloss:0,
		APresistance:0,
		MPresistance:0,
		lock:0,
		dodgle:0,
		erosion:0
	}

	this.defaultCharacteristics = {
		HP:60,
		AP:6,
		MP:3,
		erosion:10
	}

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

	for(var i in this.items){
		for(var j in this.items[i].characteristics){
			if(!this.characteristics[j]){
				this.characteristics[j] = 0;
			}
			this.characteristics[j] += this.items[i].characteristics[j];
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
	return {
		id:this.id,
		pseudo:this.pseudo,	
		x:this.x,
		y:this.y,
		team:this.team,
		spells:this.spells,
		characteristics:{
			life:this.characteristics.life,
			maxlife:this.characteristics.maxlife,
			erodedlife:this.characteristics.erodedlife,
			AP:this.characteristics.AP,
			MP:this.characteristics.MP,
			wisdom:this.characteristics.wisdom,
			tackle:this.characteristics.tackle,
			resmagic:this.characteristics.resmagic,
			resphysic:this.characteristics.resphysic,
			resdommagic:this.characteristics.resdommagic,
			resdomphysic:this.characteristics.resdomphysic
		},
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