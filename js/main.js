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

  var data_content = document.getElementById("sprites_json");
  var data = JSON.parse(data_content );

  var world = new World(new Vector2d(100, 100), 12345);

  var canvas = document.getElementById("viewPort");
  var canvasBoundRect = canvas.getBoundingClientRect();
  var t = 0;

  var context = canvas.getContext("2d");
  var keyHandler = KeyHandler.setupHandlers(document, canvas);

  var evergreen = document.getElementById("evergreen");
  var grass = document.getElementById("grass");
  //todo, add proper image loading delays

  var tileImages = {
    0 : evergreen,
    1 : grass,
  };


  world.playerJoined(0);
  var currentPlayerId = 0;

  function update(dt) {
    var canvasSize = updateCanvasSize(document, canvas);
    var currentPlayer = world.players[currentPlayerId];
    var coordConverter = new CoordinateConverter(
      currentPlayer.playerPos,
      new Vector2d(canvasSize.x, canvasSize.y),
      new Vector2d(canvasBoundRect.left, canvasBoundRect.top));

    keyHandler.handleEvents(function(events) {
      if (events.mouseButtonPressEvents[2])
      {
        var worldPos = coordConverter.canvasToWorld(events.mouseButtonPressEvents[2]);
        world.incomingEvent(0, { newDestination: worldPos });
      }
    });

    world.update(dt);
  }


  function render(dt) {

    var canvasSize = updateCanvasSize(document, canvas);
    context.fillStyle = "#FFFF00";
    context.fillRect(0, 0, canvasSize.x, canvasSize.y);
    var currentPlayer = world.players[0];
    var coordConverter = new CoordinateConverter(
      currentPlayer.playerPos,
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

    var currentPlayer = world.players[currentPlayerId];

    if(currentPlayer.destinationPos !== null){
      context.fillStyle = "#FF0000";
      var redDotPos = coordConverter.worldToCanvas(currentPlayer.destinationPos);
      context.fillRect(
        redDotPos.x - 3,
        redDotPos.y - 3,
        6,
        6
      );
    }

    for (var player_id in world.players)
    {
      var player = world.players[player_id];
      var playerImage = player.currentSprite(t);
      var spriteSheet = playerImage.spriteSheet;
      var frameName = playerImage.frameName;
      var img = document.getElementById(playerImage.spriteSheet.meta.image);

      var frame = spriteSheet.frames[frameName].frame;
      var sourceSize = spriteSheet.frames[frameName].spriteSourceSize;

      var canvasplayer = coordConverter.worldToCanvas(player.playerPos);
      context.drawImage(img,
                        frame.x, frame.y,
                        frame.w, frame.h,
                        canvasplayer.x + sourceSize.x - playerImage.centerOffset.x,
                        canvasplayer.y + sourceSize.y - playerImage.centerOffset.y,
                        sourceSize.w, sourceSize.h);
    }

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
