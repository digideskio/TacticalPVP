var Client = function(){
	this.pid;
	this.room = null;
	this.display = new Display(this);
}

Client.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Client.prototype.update = function(){
}

Client.prototype.click = function(x, y){
	x = Math.floor(x / this.display.tilesize);
	y = Math.floor(y / this.display.tilesize);

	if(this.room.placement){
		socket.emit("placement", {x:x, y:y});
	}
}