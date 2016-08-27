var client;
var IS_SERVER = false;
var vue;
var socket;

$(function(){
	client = new Client();

	setInterval(function(){
		client.display.render();
	}, 1000/30);

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

	$("#canvas").click(function(e){
		var x = e.pageX - $(this).offset().left;
		var y = e.pageY - $(this).offset().top;

		client.click(x, y);
	});


	window.onresize = function(){
	}

});