var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var IS_SERVER = true;

eval(fs.readFileSync('./server/UniqueNumber.js')+'');
eval(fs.readFileSync('./server/Utils.js')+'');
eval(fs.readFileSync('./server/Game.js')+'');
eval(fs.readFileSync('./server/Matchmaking.js')+'');
eval(fs.readFileSync('./public/js/Room.js')+'');
eval(fs.readFileSync('./public/js/Map.js')+'');
eval(fs.readFileSync('./public/js/Player.js')+'');

var playerIdGenerator = new UniqueNumber(1);
var roomIdGenerator = new UniqueNumber(1);
var game = new Game();

setInterval(function(){
	game.updateMatchmaking();
}, 5 * 1000);

eval(fs.readFileSync('./server/socket.js')+'');

app.use(express.static("public"));



http.listen(3000);
