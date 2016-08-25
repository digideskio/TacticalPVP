var client;
var IS_SERVER = false;
var vue;
var socket;

$(function(){
	client = new Client();

	vue = new Vue({
		el:"#app",
		data:{
			matchmaking:function(){
				socket.emit("matchmaking");
			}
		},
		methods:{
		}
	});


	window.onresize = function(){
	}

});