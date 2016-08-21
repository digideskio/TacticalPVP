var client;
var IS_SERVER = false;
var vue;
var socket;

$(function(){
	client = new Client();

	setInterval(function(){
		client.display.render();
	}, 1000/30)

	vue = new Vue({
		el:"#app",
		data:{
			pseudo:localStorage.getItem("pseudo") || "",
			connected:false
		},
		methods:{
			connection:function(){
				socket.emit("login", {pseudo:this.pseudo});
				localStorage.setItem("pseudo", this.pseudo);
			}
		}
	});


	window.onresize = function(){
		if(client){
			client.display.windowResize();
		}
	}

});