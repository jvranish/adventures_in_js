"use strict";

function Inputs(doc, canvas, coordConverter) {
  //this.currentlyPressedKeys = {};
  //this.currentlyPressedMouseButtons = {};
  this.keyEvents = {};
  this.mouseEvents = {};
  //this.mousePos = null;
  this.coordConverter = coordConverter
  this.time = window.performance.now();

  var obj = this;
  // doc.onkeydown = function (event) { obj.keyDownHandler(event); };
  // doc.onkeyup = function (event) { obj.keyUpHandler(event); };
  // canvas.onmousedown = function (event) { obj.mouseDownHandler(canvas, event); };
  // canvas.onmouseup = function (event) { obj.mouseUpHandler(canvas, event); };
  doc.oncontextmenu = function (event) { return false; };
  canvas.oncontextmenu = function (event) { obj.rightClickHandler(canvas, event); };
}

Inputs.prototype.updateTime = function(currentTime) {
  var dt = (currentTime - this.time);
  this.time = currentTime;
  return dt;
}

Inputs.prototype.getInputs = function() {
  var rtn = {
    mouseEvents: this.mouseEvents,
    keyEvents: this.keyEvents,
    time: this.time
  };

  this.mouseEvents = {};
  this.keyEvents = {};

  return rtn;
}

Inputs.prototype.mouseToCanvas = function(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  return new Vector2d(x, y);
}

// Inputs.setupHandlers = function (doc, canvas) {
//   return new Inputs().setupHandlers(doc, canvas);
// };

// Inputs.prototype.setupHandlers = function (doc, canvas) {
  
//   return obj;
// };

Inputs.prototype.keyDownHandler = function (event) {
  // if (!this.currentlyPressedKeys[event.keyCode]) {
  //   this.keyPressEvents[event.keyCode] = true;
  // }
  // this.currentlyPressedKeys[event.keyCode] = true;
};

Inputs.prototype.keyUpHandler = function (event) {
  // this.currentlyPressedKeys[event.keyCode] = false;
};

Inputs.prototype.handleEvents = function (f) {
  // f(this);
  // this.mousePos = null;
  // this.keyPressEvents = {};
  // this.mouseButtonPressEvents = {};
};

Inputs.prototype.mouseDownHandler = function (canvas, event) {
  // var canvasPos = this.mouseToCanvas(canvas, event);
  // if (!this.currentlyPressedMouseButtons[event.button]) {
  //   this.mouseButtonPressEvents[event.button] = canvasPos;
  // }
  // this.currentlyPressedMouseButtons[event.button] = canvasPos;
};

Inputs.prototype.mouseUpHandler = function (canvas, event) {
  // this.currentlyPressedMouseButtons[event.button] = null;
};


//
// mousein
// mouseout
// mousemove

Inputs.prototype.rightClickHandler = function (canvas, event) {
  //var mapPosition = this.mouseToCanvas(canvas, event)
  var mapPosition = this.coordConverter.mouseToWorld(new Vector2d(event.clientX, event.clientY));
  this.mouseEvents['rightClick'] = {
    mapPosition: mapPosition
  }
  return false;
};
