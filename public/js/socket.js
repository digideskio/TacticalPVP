$(function(){
	socket = io();

	socket.on("login", function(){
		socket.emit("login", {token:localStorage.getItem("token")});
	});

	socket.on("playerID", function(id){
		client.pid = parseInt(id);
	});

	socket.on("init", function(data){
		data.timeleft += Date.now();
		var room = new Room(data);
		client.room = room;
		console.log(data);
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

	socket.on("turn", function(data){
		data.timeleft += Date.now();
		client.room.init(data);
		client.room.placement = false;


	});
});