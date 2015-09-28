"use strict";
function updateCanvasSize(doc, canvas) {
  var canvasSize = new Vector2d(doc.body.clientWidth,
                                doc.body.clientHeight);
  canvas.width = canvasSize.x;
  canvas.height = canvasSize.y;
  return canvasSize;
}

function randomMap(width, height) {
  var map = [];
  for (var x = 0; x < width; x++) {
    map[x] = [];
    for (var y = 0; y < height; y++) {
      map[x][y] = getRandomInt(0, 1);
    }
  }
  return map;
}


var mapSizeTiles = new Vector2d(100, 100);
var mapSize = mapSizeTiles.scale(32);

function TimeDiffer() {
  this.last = window.performance.now();
}
TimeDiffer.prototype.deltaTime = function() {
  var now = window.performance.now();
  var dt = (now - this.last) / 1000;
  this.last = now;
  return dt;
};

function main() {
  var LEFT = new Vector2d(-1, 0);
  var RIGHT = new Vector2d(1, 0);
  var UP = new Vector2d(0, -1);
  var DOWN = new Vector2d(0, 1);

  var canvas = document.getElementById("viewPort");
  var canvasBoundRect = canvas.getBoundingClientRect();
  var t = 0;

  var context = canvas.getContext("2d");
  var player = new Character(new Vector2d(0, 0), RIGHT);
  var keyHandler = KeyHandler.setupHandlers(document, canvas);
  var map = randomMap(mapSizeTiles.x, mapSizeTiles.y);

  var playerImage = document.getElementById("warrior");
  var evergreen = document.getElementById("evergreen");
  var grass = document.getElementById("grass");
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
  };

  function update(dt) {

  }


  function render(dt) {
    var canvasSize = updateCanvasSize(document, canvas);

    context.fillStyle = "#FFFF00";
    context.fillRect(0, 0, canvasSize.x, canvasSize.y);

    var coordConverter = new CoordinateConverter(
      player.playerPos,
      new Vector2d(canvasSize.x, canvasSize.y),
      new Vector2d(canvasBoundRect.left, canvasBoundRect.top));

    var dir = new Vector2d(0,0);

    keyHandler.handleEvents(function(events) {
      for (var key in keyDirections) {
        if (events.currentlyPressedKeys[key]) {
          dir = dir.add(keyDirections[key]);
        }
      }
      if (events.mouseButtonPressEvents[2])
      {
        var worldPos = coordConverter.canvasToWorld(events.mouseButtonPressEvents[2]);
        player.setDestination(worldPos.mod(mapSize));
        // console.log(events.mouseButtonPressEvents[2]);
        // console.log(worldPos);
        // console.log(worldPos.mod(mapSize));
      }
    });
    var maxTravelDist = player.walkSpeed * dt;

    if (player.destinationPos)
    {
      // this is not exactly super intuitive, I'm going to try to make a generic TorusVector class
      // that can handle the wrap around more transparently.
      var displacement = player
        .destinationPos
        .sub(player.playerPos)
        .add(mapSize.scale(0.5))
        .mod(mapSize)
        .sub(mapSize.scale(0.5));
      // console.log(displacement);
      var moveAmount = displacement.clipTo(maxTravelDist);
      player.playerPos = player.playerPos.add(moveAmount).mod(mapSize);
    }

    var coordConverter = new CoordinateConverter(
      player.playerPos,
      new Vector2d(canvasSize.x, canvasSize.y),
      new Vector2d(canvasBoundRect.left, canvasBoundRect.top));
 /// TODO fix canvas coord converter

    var canvasRect = new Rect(new Vector2d(0, 0), new Vector2d(canvasSize.x, canvasSize.y));

    var tileGrid = canvasRect.map(function (v) { return coordConverter.canvasToTile(v); } ).outerCorners();
    tileGrid.eachGridPoint(function(tileCoord) {
      var mapCoord = tileCoord.mod(mapSizeTiles);
      var tile = map[mapCoord.x][mapCoord.y];
      var canvasCoord = coordConverter.tileToCanvas(tileCoord);
      context.drawImage(tileImages[tile],canvasCoord.x,canvasCoord.y);
    });


    if(player.playerPos.equal(player.destinationPos)){
      player.destinationPos = null;
    } else if(player.destinationPos !== null){
      context.fillStyle = "#FF0000";
      var redDotPos = coordConverter.worldToCanvas(player.destinationPos);
      context.fillRect(
        redDotPos.x - 3, 
        redDotPos.y - 3, 
        6, 
        6
      );
    }

    var canvasplayer = coordConverter.worldToCanvas(player.playerPos).sub(Vector2d.fromScalar(64));
    playerImage = player.currentSprite(t);
    context.drawImage(playerImage,canvasplayer.x, canvasplayer.y);

  }

  var timeDiffer = new TimeDiffer();
  function frame() {
    var dt = timeDiffer.deltaTime();
    update(dt);
    render(dt);
    requestAnimationFrame(frame);
    t += dt;
  }
  requestAnimationFrame(frame);
}
