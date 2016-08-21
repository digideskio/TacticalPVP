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
	if(this.room){
		
	}
}