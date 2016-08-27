$(function(){
	socket = io();

	socket.on("login", function(){
		socket.emit("login", {pseudo:"Player-"+Math.floor(Math.random() * 1000)});
	});

	socket.on("init", function(data){
		data.timeleft += Date.now();
		var room = new Room(data);
		client.room = room;
	});

	socket.on("placement", function(datas){
		for(var i in datas){
			for(var j in client.room.units){
				if(datas[i].id == client.room.units[j].id){
					client.room.units[j].x = datas[i].x; 
					client.room.units[j].y = datas[i].y; 
				}
			}
		}
	});
});