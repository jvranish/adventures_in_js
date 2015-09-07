function updateCanvas() {
	var width = document.body.clientWidth;
	var height = document.body.clientHeight;
	var canvas = document.getElementById("viewPort");
	canvas.width = width;
	canvas.height = height;
	console.log(canvas);
	var context = canvas.getContext("2d");
	context.fillStyle = "#FFFF00";
	context.fillRect(0,0,width,height);
}

function init() {
	
	updateCanvas();
}