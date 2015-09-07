"use strict";

function KeyHandler() {
    this.currentlyPressedKeys = {};
}

KeyHandler.setupHandlers = function(doc) {
  return (new KeyHandler()).setupHandlers(doc);
}

KeyHandler.prototype = {
  setupHandlers : function (doc) {
    var obj = this;
    doc.onkeydown = function(event) { obj.keyDownHandler(event) };
    doc.onkeyup = function(event) { obj.keyUpHandler(event) };
    return obj;
  },
  keyDownHandler : function (event) {
    this.currentlyPressedKeys[event.keyCode] = true;
  },
  keyUpHandler : function (event) {
    this.currentlyPressedKeys[event.keyCode] = false;
  },
  handleKeys : function (f) {
    f(this.currentlyPressedKeys);
  }
}

