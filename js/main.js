"use strict";
function updateCanvasSize(doc, canvas) {
  var canvasSize = new Vector2d(doc.body.clientWidth,
                                doc.body.clientHeight);
  canvas.width = canvasSize.x;
  canvas.height = canvasSize.y;
  return canvasSize;
}



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

  var world = new World(new Vector2d(100, 100));

  var canvas = document.getElementById("viewPort");
  var canvasBoundRect = canvas.getBoundingClientRect();
  var t = 0;

  var context = canvas.getContext("2d");
  var keyHandler = KeyHandler.setupHandlers(document, canvas);

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
      world,
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
        world.player.setDestination(worldPos);
        // console.log(events.mouseButtonPressEvents[2]);
        // console.log(worldPos);
        // console.log(worldPos.mod(world.mapSize));
      }
    });
    var maxTravelDist = world.player.walkSpeed * dt;

    if (world.player.destinationPos)
    {
      // this is not exactly super intuitive, I'm going to try to make a generic TorusVector class
      // that can handle the wrap around more transparently.
      var displacement = world.player
        .destinationPos
        .sub(world.player.playerPos);
      // console.log(displacement);
      var moveAmount = displacement.clipTo(maxTravelDist);
      world.player.playerPos = world.player.playerPos.add(moveAmount);
    }

    var coordConverter = new CoordinateConverter(
      world,
      new Vector2d(canvasSize.x, canvasSize.y),
      new Vector2d(canvasBoundRect.left, canvasBoundRect.top));
 /// TODO fix canvas coord converter

    var canvasRect = new Rect(new Vector2d(0, 0), new Vector2d(canvasSize.x, canvasSize.y));

    var tileGrid = canvasRect.map(function (v) { return coordConverter.canvasToTile(v); } ).outerCorners();
    tileGrid.eachGridPoint(function(tileCoord) {
      var mapCoord = tileCoord.mod(world.mapSizeTiles);;
      var tile = world.map[mapCoord.x][mapCoord.y];
      var canvasCoord = coordConverter.tileToCanvas(tileCoord);
      context.drawImage(tileImages[tile],canvasCoord.x,canvasCoord.y);
    });


    if(world.player.playerPos.equal(world.player.destinationPos)){
      world.player.destinationPos = null;
    } else if(world.player.destinationPos !== null){
      context.fillStyle = "#FF0000";
      var redDotPos = coordConverter.worldToCanvas(world.player.destinationPos);
      context.fillRect(
        redDotPos.x - 3,
        redDotPos.y - 3,
        6,
        6
      );
    }

    var canvasplayer = coordConverter.worldToCanvas(world.player.playerPos).sub(Vector2d.fromScalar(64));
    playerImage = world.player.currentSprite(t);
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
