var client;
var IS_SERVER = false;
var socket;

$(function () {
	client = new Client();

	var update = function () {
		client.display.render();
	}
	requestAnimationFrame(update);

	$("#canvas").click(function (e) {
		var x = e.pageX - $(this).offset().left;
		var y = e.pageY - $(this).offset().top;

		client.click(x, y);
	});

	$.ajaxSetup({
		beforeSend: function (xhr) {
			var token = localStorage.getItem("token");
			if (token) {
				xhr.setRequestHeader('Authorization', token);
			}
		}
	});
});