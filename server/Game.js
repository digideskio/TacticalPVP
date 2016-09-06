var Game = function(json){
	this.players = {};
	this.rooms = {};

	this.matchmaking = new Matchmaking();

	this.init(json);
}

Game.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Game.prototype.updateMatchmaking = function(){
	var matchs = this.matchmaking.update();
	for(var i in matchs){
		var r = new Room();
		var teams = [1, 2];
		for(var j in matchs[i]){
			var p = matchs[i][j];
			r.addPlayer(p, teams[j%2]);
		}
		async.each(matchs[i], function(p, callback){
			async.parallel({
				items:function(cb){
					MysqlManager.items.getEquipedUserItems(p.id, function(err, res){
						if(err){
							cb(null, []);
							return;
						}
						cb(null, res);
					});
				},
				spells:function(cb){
					MysqlManager.spells.getEquipedUserSpells(p.id, function(err, res){
						if(err){
							cb(null, []);
							return;
						}
						cb(null, res);
					});
				}
			}, function(err, results){
				p.items = results.items;
				callback();
			});
		}, function(err){
			r.start();
		});
	}
}

Game.prototype.addPlayer = function(player){
	this.players[player.socket] = player;
}

Game.prototype.removePlayer = function(player){
	delete this.players[player.socket];
}

Game.prototype.getPlayerBySocket = function(socket){
	if(this.players[socket]){
		return this.players[socket];
	}
	return null;
}

Game.prototype.getPlayerById = function(id){
	for(var i in this.players){
		if(this.players[i].id == id){
			return this.players[i];
		}
	}
	return null;
}

Game.prototype.getRoom = function(id){
	if(this.rooms[id]){
		return this.rooms[i];
	}
	return null;
}

Game.prototype.nbPlayers = function(){
	return Object.keys(this.players).length;
}