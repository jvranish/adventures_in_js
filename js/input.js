"use strict";

function KeyHandler() {
  this.currentlyPressedKeys = {};
  this.currentlyPressedMouseButtons = {};
  this.keyPressEvents = {};
  this.mouseButtonPressEvents = {};
  this.mousePos = null;
}

function mouseToCanvas(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  return new Vector2d(x, y);
}

KeyHandler.setupHandlers = function (doc, canvas) {
  return new KeyHandler().setupHandlers(doc, canvas);
};

KeyHandler.prototype.setupHandlers = function (doc, canvas) {
  var obj = this;
  doc.onkeydown = function (event) { obj.keyDownHandler(event); };
  doc.onkeyup = function (event) { obj.keyUpHandler(event); };
  canvas.onmousedown = function (event) { obj.mouseDownHandler(canvas, event); };
  canvas.onmouseup = function (event) { obj.mouseUpHandler(canvas, event); };
  doc.oncontextmenu = function (event) { return false; };
  canvas.oncontextmenu = function (event) { obj.rightClickHandler(canvas, event); };
  return obj;
};

KeyHandler.prototype.keyDownHandler = function (event) {
  if (!this.currentlyPressedKeys[event.keyCode]) {
    this.keyPressEvents[event.keyCode] = true;
  }
  this.currentlyPressedKeys[event.keyCode] = true;
};

KeyHandler.prototype.keyUpHandler = function (event) {
  this.currentlyPressedKeys[event.keyCode] = false;
};

KeyHandler.prototype.handleEvents = function (f) {
  f(this);
  this.mousePos = null;
  this.keyPressEvents = {};
  this.mouseButtonPressEvents = {};
};

KeyHandler.prototype.mouseDownHandler = function (canvas, event) {
  var canvasPos = mouseToCanvas(canvas, event);
  if (!this.currentlyPressedMouseButtons[event.button]) {
    this.mouseButtonPressEvents[event.button] = canvasPos;
  }
  this.currentlyPressedMouseButtons[event.button] = canvasPos;
};

KeyHandler.prototype.mouseUpHandler = function (canvas, event) {
  this.currentlyPressedMouseButtons[event.button] = null;
};


//
// mousein
// mouseout
// mousemove

KeyHandler.prototype.rightClickHandler = function (canvas, event) {
  return false;
};
