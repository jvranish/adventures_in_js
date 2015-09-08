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


// uh ohhhh, a little bit of evil here :P ...
Number.prototype.mod = function(n) { return ((this % n) + n) % n; }

function TorusVector2d(x, y) {
  var mapWidth = 100*32;
  var mapHeight = 100*32;
  this.x = x.mod(mapWidth);
  this.y = y.mod(mapHeight);
}
TorusVector2d.fromVector2d  = function(v) {
  return new TorusVector2d(v.x, v.y);
}

Vector2d.setupPrototype(TorusVector2d);


function MapVector2d(x, y) {
  var mapWidth = 100;
  var mapHeight = 100;
  this.x = x.mod(mapWidth);
  this.y = y.mod(mapHeight);
}
MapVector2d.fromVector2d  = function(v) {
  return new MapVector2d(v.x, v.y);
}

Vector2d.setupPrototype(MapVector2d);

function main() {
  var canvas = document.getElementById("viewPort");
  var context = canvas.getContext("2d");

  var keyHandler = KeyHandler.setupHandlers(document);
  var map = randomMap(100, 100);

  var playerPos = new TorusVector2d(200, 200);
  var LEFT = new Vector2d(-1, 0);
  var RIGHT = new Vector2d(1, 0);
  var UP = new Vector2d(0, -1);
  var DOWN = new Vector2d(0, 1);

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

  function render() {
    updateCanvas(document, canvas);

    context.fillStyle = "#FFFF00";
    context.fillRect(0, 0, canvas.width, canvas.height);

    keyHandler.handleKeys(function(currentlyPressedKeys) {
      if (currentlyPressedKeys[37]) {
          // Left cursor key
          playerPos = playerPos.add(LEFT);
      }
      if (currentlyPressedKeys[39]) {
          // Right cursor key
          playerPos = playerPos.add(RIGHT);
      }
      if (currentlyPressedKeys[38]) {
          // Up cursor key
          playerPos = playerPos.add(UP);
      }
      if (currentlyPressedKeys[40]) {
          // Down cursor key
          playerPos = playerPos.add(DOWN);
      }
    })

    var tileGrid = new Rect(new Vector2d(0,0), new Vector2d(canvas.width, canvas.height)).map(canvasToTile).outerCorners();

    tileGrid.eachGridPoint(function(tileCoord) {
      var mapCoord = MapVector2d.fromVector2d(tileCoord);
      var tile = map[mapCoord.x][mapCoord.y];
      var canvasCoord = tileToCanvas(tileCoord);
      if (tile === 0)
      {
        context.drawImage(evergreen,canvasCoord.x,canvasCoord.y);
      }
      else
      {
        context.drawImage(grass,canvasCoord.x,canvasCoord.y);
      }
    });

    var canvasPlayerPos = worldToCanvas(playerPos);
    context.drawImage(image,canvasPlayerPos.x,canvasPlayerPos.y);

    requestAnimationFrame(render);

  }
  render();
}