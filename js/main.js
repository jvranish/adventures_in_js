"use strict";
function updateCanvasSize(doc, canvas) {
  var canvasSize = new Vector2d(doc.body.clientWidth,
                                doc.body.clientHeight);
  canvas.width = canvasSize.x;
  canvas.height = canvasSize.y;
  return canvasSize;
}

function randomMap(width, height) {
  var map = new Array();
  for (var x = 0; x < width; x++) {
    map[x] = new Array();
    for (var y = 0; y < height; y++) {
      map[x][y] = getRandomInt(0, 1);
    }
  }
  return map;
}


var mapSizeTiles = new Vector2d(100, 100);

Vector2d.fromTorusVector2d  = function(v) {
  return new Vector2d(v.x, v.y);
}
function TorusVector2d(x, y) {
  var mapSize = mapSizeTiles.scale(32);
  this.x = mod(x, mapSize.x);
  this.y = mod(y, mapSize.y);
}
TorusVector2d.fromVector2d  = function(v) {
  return new TorusVector2d(v.x, v.y);
}

Vector2d.setupPrototype(TorusVector2d);

function MapVector2d(x, y) {
  this.x = mod(x, mapSizeTiles.x);
  this.y = mod(y, mapSizeTiles.y);
}
MapVector2d.fromVector2d  = function(v) {
  return new MapVector2d(v.x, v.y);
}
Vector2d.setupPrototype(MapVector2d);

function TimeTracker() {
  this.last = window.performance.now();
}
TimeTracker.prototype.deltaTime = function() {
  var now = window.performance.now();
  var dt = (now - this.last) / 1000;
  this.last = now;
  return dt;
}

function main() {
  var canvas = document.getElementById("viewPort");
  var context = canvas.getContext("2d");

  var keyHandler = KeyHandler.setupHandlers(document);
  var map = randomMap(mapSizeTiles.x, mapSizeTiles.y);

  var playerPos = new TorusVector2d(0, 0);
  var LEFT = new Vector2d(-1, 0);
  var RIGHT = new Vector2d(1, 0);
  var UP = new Vector2d(0, -1);
  var DOWN = new Vector2d(0, 1);

  var image = new Image();
  image.src = './images/warrior.base.152.png';
  var evergreen = new Image();
  evergreen.src = './images/evergreens.png';
  var grass = new Image();
  grass.src = './images/grass1.png';
  //todo, add proper image loading delays

  var keyDirections = {
    37: LEFT,
    39: RIGHT,
    38: UP,
    40: DOWN
  };

  var tileImages = {
    0 : evergreen,
    1 : grass,
  }


  function render(dt) {
    var canvasSize = updateCanvasSize(document, canvas);

    context.fillStyle = "#FFFF00";
    context.fillRect(0, 0, canvasSize.x, canvasSize.y);

    var dir = new Vector2d(0,0);

    keyHandler.handleKeys(function(currentlyPressedKeys) {
      for (var key in keyDirections) {
        if (currentlyPressedKeys[key]) {
          dir = dir.add(keyDirections[key]);
        }
      }
    })
    var speed = 400;
    playerPos = playerPos.add(dir.scale(speed * dt));
    var coordConverter = new CoordinateConverter(playerPos, new Vector2d(canvasSize.x, canvasSize.y));
    var canvasRect = new Rect(new Vector2d(0, 0), new Vector2d(canvasSize.x, canvasSize.y));

    var tileGrid = canvasRect.map(function (v) { return coordConverter.canvasToTile(v); } ).outerCorners();
    tileGrid.eachGridPoint(function(tileCoord) {
      var mapCoord = MapVector2d.fromVector2d(tileCoord);
      var tile = map[mapCoord.x][mapCoord.y];
      var canvasCoord = coordConverter.tileToCanvas(tileCoord);
      context.drawImage(tileImages[tile],canvasCoord.x,canvasCoord.y);
    });

    var canvasPlayerPos = coordConverter.worldToCanvas(playerPos);
    context.drawImage(image,canvasPlayerPos.x,canvasPlayerPos.y);

  }

  var timeTracker = new TimeTracker();
  function frame() {
    var dt = timeTracker.deltaTime();
    render(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}



