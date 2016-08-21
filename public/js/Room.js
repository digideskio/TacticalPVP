var Room = function(json){
	this.id = 0;
	this.players = {};

	this.units = [];

	this.map = new Map();

	this.turn = 0;

	this.init(json);
}

Room.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

