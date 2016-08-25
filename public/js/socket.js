$(function(){
	socket = io();

	socket.on("login", function(){
		socket.emit("login", {pseudo:"Player-"+Math.floor(Math.random() * 1000)});
	});
});