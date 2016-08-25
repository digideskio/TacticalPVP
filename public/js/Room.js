var Room = function(json){
	this.id = 0;
	this.players = {};

	this.units = [];
	this.unitTurn = 0;

	this.map;

	this.placement = true;

	this.turn = 0;

	this.init(json);
}

Room.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Room.prototype.start = function(){
	this.map = new Map();
	this.map.generate();
	this.placement = true;

	this.units = this.getPlayersByInitiative();

	this.initPlayersPlacement();

	for(var i in this.players){
		Utils.msgTo(this.players[i].socket, "init", this.getInitInformations(this.players[i]));
	}
}

Room.prototype.addPlayer = function(player, team){
	player.room = this;
	player.fighting = true;

	player.x = -1;
	player.y = -1;

	player.buffs = [];

	if(team){
		player.team = team;
	}
	this.players[player.id] = player;
}

Room.prototype.getPlayersByInitiative = function(){
	var ps = [];
	for(var i in this.players){
		for(var j = 0; j < ps.length; j++){
			if(this.players[i].characteristics.initiative > ps[j].characteristics.initiative){
				break;
			}else if(this.players[i].characteristics.initiative == ps[j].characteristics.initiative){
				//if same => random
				if(Math.random() > 0.5){
					break;
				}
			}
		}
		ps.splice(j, 0, this.players[i]);
	}
	return ps;
}

Room.prototype.initPlayersPlacement = function(){
	var that = this;
	var getCell = function(player){
		for(var x in that.map.tiles){
			for(var y in that.map.tiles[x]){
				var cell = that.map.tiles[x][y];
				if(cell.player && cell.player == player.team){
					var isOK = true;
					for(var i in that.players){
						if(that.players[i].x == x && that.players[i].y == y){
							isOK = false;
							break;
						}
					}
					if(isOK){
						return {x:x, y:y};
					}
				}
			}
		}
		return false;
	}

	for(var i in this.players){
		var cell = getCell(this.players[i]);
		if(cell){
			this.players[i].x = cell.x;
			this.players[i].y = cell.y;
		}
	}
}


Room.prototype.getInitInformations = function(player){
	var data = {
		id:this.id,
		placement:this.placement,
		turn:this.turn,
		unitTurn:this.unitTurn,
		map:this.map.getInformations(),
		units:[]
	}

	for(var i in this.units){
		if(player && this.units[i].id == player.id){
			data.units.push(this.units[i].getAllInformations());
		}else{
			data.units.push(this.units[i].getPublicInformations());
		}
	}

	return data;
}