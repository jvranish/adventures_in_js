"use strict";

function KeyHandler() 
{
    this.currentlyPressedKeys = {};
}

KeyHandler.prototype.player = null;
KeyHandler.prototype.canvas = null;

KeyHandler.setupHandlers = function(doc, canvas, player)
{
  return new KeyHandler().setupHandlers(doc, canvas, player);
}

KeyHandler.prototype.setupHandlers = function (doc, canvas, player) 
{
  this.player = player;
  this.canvas = canvas;
  var obj = this;
  doc.onkeydown = function(event) { obj.keyDownHandler(event) };
  doc.onkeyup = function(event) { obj.keyUpHandler(event) };
  doc.oncontextmenu = function(event) { return false; };
  canvas.oncontextmenu = function(event) { obj.rightClickHandler(event) };
  return obj;
}

KeyHandler.prototype.keyDownHandler = function (event) 
{
  this.currentlyPressedKeys[event.keyCode] = true;
}

KeyHandler.prototype.keyUpHandler = function (event) 
{
  this.currentlyPressedKeys[event.keyCode] = false;
}

KeyHandler.prototype.handleKeys = function (f) 
{
  f(this.currentlyPressedKeys);
}

KeyHandler.prototype.rightClickHandler = function(event) 
{
  console.log(event);
  var rect = this.canvas.getBoundingClientRect();
  
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var canvasSize = updateCanvasSize(document, this.canvas)
  var coordConverter = new CoordinateConverter(this.player.playerPos, new Vector2d(canvasSize.x, canvasSize.y));
  return false;
}

