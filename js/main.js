"use strict";
function updateCanvas(doc, canvas) {
  canvas.width = doc.body.clientWidth;
  canvas.height = doc.body.clientHeight;
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

function main() {
  var canvas = document.getElementById("viewPort");
  var context = canvas.getContext("2d");

  var keyHandler = KeyHandler.setupHandlers(document);
  var map = randomMap(mapSizeTiles.x, mapSizeTiles.y);

  var playerPos = new TorusVector2d(0, 0);
  var LEFT = new TorusVector2d(-1, 0);
  var RIGHT = new TorusVector2d(1, 0);
  var UP = new TorusVector2d(0, -1);
  var DOWN = new TorusVector2d(0, 1);

  function worldToCanvas(worldCoord)
  {
    // world is in units of pixels so just need offset
    var canvasCenterInWorld = playerPos;
    var canvasCenterInCanvas = new Vector2d(canvas.width, canvas.height).scale(0.5);
    return worldCoord.sub(canvasCenterInWorld).add(canvasCenterInCanvas);
  }
  function canvasToWorld(canvasCoord)
  {
    // world is in units of pixels so just need offset
    var canvasCenterInWorld = playerPos;
    var canvasCenterInCanvas = new Vector2d(canvas.width, canvas.height).scale(0.5);
    return canvasCoord.sub(canvasCenterInCanvas).add(canvasCenterInWorld);
  }

  function worldToTile(worldCoord)
  {
    // tile coords are same as world, but just scaled by 32
    return worldCoord.scale(1/32);
  }
  function tileToWorld(tileCoord)
  {
    // tile coords are same as world, but just scaled by 32
    return tileCoord.scale(32);
  }

  function tileToCanvas(tileCoord)
  {
    return worldToCanvas(tileToWorld(tileCoord));
  }
  function canvasToTile(canvasCoord)
  {
    return worldToTile(canvasToWorld(canvasCoord));
  }

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

  function render() {
    updateCanvas(document, canvas);

    context.fillStyle = "#FFFF00";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var dir = new TorusVector2d(0,0);

    keyHandler.handleKeys(function(currentlyPressedKeys) {
      for (var key in keyDirections) {
        if (currentlyPressedKeys[key]) {
          dir = dir.add(keyDirections[key]);
        }
      }
    })

    playerPos = playerPos.add(dir.scale(4));

    var tileGrid = new Rect(new Vector2d(0,0), new Vector2d(canvas.width, canvas.height)).map(canvasToTile).outerCorners();
    tileGrid.eachGridPoint(function(tileCoord) {
      var mapCoord = MapVector2d.fromVector2d(tileCoord);
      var tile = map[mapCoord.x][mapCoord.y];
      var canvasCoord = tileToCanvas(tileCoord);
      context.drawImage(tileImages[tile],canvasCoord.x,canvasCoord.y);
    });

    var canvasPlayerPos = worldToCanvas(playerPos);
    context.drawImage(image,canvasPlayerPos.x,canvasPlayerPos.y);

    requestAnimationFrame(render);

  }
  render();
}