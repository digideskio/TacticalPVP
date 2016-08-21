var Player = function(json){
	this.id = 0;
	this.pseudo = "";
	this.socket;

	this.room;

	this.x = 0;
	this.y = 0;

	this.fighting = false;

	this.characteristics = {
		life:0,
		erodedlife:0,
		maxlife:0,
		AP:0,
		maxAP:0,
		MP:0,
		maxMP:0,
		range:0,
		initiative:0,
		cs:0,
		magic:0,
		physic:0,
		heal:0,
		dommagic:0,
		domphysic:0,
		domheal:0,
		resmagic:0,
		resphysic:0,
		resdommagic:0,
		resdomphysic:0,
		wisdom:0,
		tackle:0,
		escape:0,
		erosion:0
	}

	this.defaultCharacteristics = {
		life:60,
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

Player.prototype.update = function(){
	
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
	if(this.fighting){
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