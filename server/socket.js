io.on('connection', function (socket) {
	socket.emit("login");

	socket.emit("nbPlayers", game.nbPlayers());

	socket.on("login", function (data) {
		MysqlManager.user.getUserByToken(data.token, function (err, res) {
			if (res.length == 1) {
				var p = res[0];
				var player = new Player({
					id: p.id_u,
					pseudo: p.login,
					socket: socket.id
				});

				socket.emit("playerID", p.id_u);
				game.addPlayer(player);
			}
		});
	});

	socket.on("matchmaking", function () {
		var player = game.getPlayerBySocket(socket.id);
		if (!player) {
			return;
		}

		if (player.fighting) {
			socket.emit({ error: "Already in fight." });
			return;
		}

		var res = game.matchmaking.addPlayer(player);
		if (res) {
			socket.emit({ success: "In queue." });
		} else {
			socket.emit({ success: "Already in queue." });
		}
	});

	socket.on("placement", function (data) {
		var player = game.getPlayerBySocket(socket.id);
		if (!player) {
			return;
		}

		player.action({
			type: "placement",
			x: data.x,
			y: data.y
		});
	});

	socket.on("disconnect", function () {
		var player = game.getPlayerBySocket(socket.id);
		if (player) {
			game.removePlayer(player);
			playerIdGenerator.free(player.id);
		}
	});
});