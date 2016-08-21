var Utils = {};

Utils.msgTo = function(socket, type, message){
	if(io.sockets.connected[socket]){
		io.sockets.connected[socket].emit(type, message);
	}
}