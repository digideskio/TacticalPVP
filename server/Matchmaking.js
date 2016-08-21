var Matchmaking = function(game){
	this.game = game;
	this.queue = [];
}

Matchmaking.prototype.addPlayer = function(player){
	if(!this.isInQueue()){
		this.queue.push({player:player, time:Date.now(), found:false});
		return true;
	}
	return false;
}

Matchmaking.prototype.isInQueue = function(player){
	for(var i in this.queue){
		if(this.queue[i].player.id == player.id){
			return true;
		}
	}
	return false;
}

Matchmaking.prototype.removePlayer = function(player){
	for(var i in this.queue){
		if(this.queue[i].player.id == player.id){
			this.queue.splice(i, 1);
			return true;
			break;
		}
	}
	return false;
}

Matchmaking.prototype.update = function(){
	var matchs = [];
	for(var i in this.queue){
		if(!this.queue[i].found){
			for(var j in this.queue){
				if(this.queue[i].player.id != this.queue[j].player.id){
					if(!this.queue[j].found && this.isMatching(this.queue[i], this.queue[j])){
						this.queue[i].found = true;
						this.queue[j].found = true;
						matchs.push([this.queue[i].player, this.queue[j].player]);
						break;
					}
				}
			}
		}
	}

	var q = this.queue;
	for(var i in q){
		if(q[i].found){
			this.removePlayer(q[i].player);
		}
	}
	return matchs;
}

Matchmaking.prototype.isMatching = function(p1, p2){
	return true;
}