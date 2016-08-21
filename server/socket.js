io.on('connection', function(socket){
	socket.emit("login");

	socket.emit("nbPlayers", game.nbPlayers());

	socket.on("login", function(data){
		if(game.getPlayerBySocket(socket.id) != null){
			return;
		}
		var id = playerIdGenerator.get();
		var player = new Player({
			id:id,
			pseudo:data.pseudo,
			socket:socket.id
		});

		socket.emit("playerID", id);
		game.addPlayer(player);

		var room = game.getAccessibleRoom();
		room.addPlayer(player);
	});

	socket.on("respawn", function(data){

	});

	socket.on("inputs", function(data){

	});

	socket.on("disconnect", function(){
		var player = game.getPlayerBySocket(socket.id);
		if(player){
			if(player.room){
				player.room.removePlayer(player);
			}
			game.removePlayer(player);
			playerIdGenerator.free(player.id);
		}
	});
});