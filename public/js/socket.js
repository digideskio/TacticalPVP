$(function(){
	socket = io();

	socket.on("login", function(){
		socket.emit("login", {token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJ2aW5jZW50IiwicGFzc3dvcmQiOiIxMjMiLCJpYXQiOjE0NzI5MzY5MTZ9.-pPrqRTBJUMuI7t9mPLjch4yi-Tr_Wk5s7BDkZT2HfA"});
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

	socket.on("turn", function(data){
		data.timeleft += Date.now();
		client.room.init(data);
		client.room.placement = false;
	});
});