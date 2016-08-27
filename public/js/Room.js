var Room = function(json){
	this.id = 0;
	this.players = {};

	this.units = [];
	this.unitTurn = null;

	this.map;

	this.placement = true;

	this.turn = 0;

	this.timeleft = Date.now();

	this.timer;

	this.init(json);
}

Room.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Room.prototype.start = function(){
	this.map = new Map();
	this.map.generate(10, 10, Math.floor(Math.random() * 3 + 3), Math.floor(Math.random() * 3 + 3), 3);
	this.placement = true;

	this.units = this.getPlayersByInitiative();

	this.initPlayersPlacement();

	var cdPlacement = 30 * 1000;
	this.timeleft = cdPlacement + Date.now();

	var _this = this;
	this.timer = setTimeout(function(){
		_this.fight();
	}, cdPlacement);

	for(var i in this.players){
		Utils.msgTo(this.players[i].socket, "init", this.getInitInformations(this.players[i]));
	}
}

Room.prototype.fight = function(){
	this.placement = false;

	var datas = [];

	for(var i in this.units){
		datas.push({
			id:this.units[i].id, 
			x:this.units[i].x, 
			y:this.units[i].y 
		});
	}

	for(var i in this.players){
		Utils.msgTo(this.players[i].socket, "placement", datas);
	}

	this.nextTurn();
}

Room.prototype.nextTurn = function(){
	if(this.unitTurn == null){
		this.unitTurn = 0;
	}else{
		this.unitTurn = (this.unitTurn + 1)%this.units.length;
		if(this.unitTurn == 0){
			this.turn++;
		}
	}

	var turnTime = 30 * 1000;
	this.timeleft = Date.now() + turnTime;

	for(var i in this.players){
		Utils.msgTo(this.players[i].socket, "turn", {unit:this.unitTurn, timeleft:turnTime});
	}

	var _this = this;
	this.timer = setTimeout(function(){
		_this.nextTurn();
	}, turnTime);
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
			this.players[i].x = parseInt(cell.x);
			this.players[i].y = parseInt(cell.y);
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
		units:[],
		timeleft:this.timeleft - Date.now()
	}

	for(var i in this.units){
		if(player && this.units[i].id == player.id){
			data.units.push(this.units[i].getAllInformations());
		}else{
			var pData = this.units[i].getPublicInformations();
			if(this.placement && this.units[i].team != player.team){
				pData.x = -1;
				pData.y = -1;
			}
			data.units.push(pData);
		}
	}

	return data;
}