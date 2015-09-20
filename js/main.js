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
  var canvas = document.getElementById("viewPort");
  var canvasBoundRect = canvas.getBoundingClientRect();

  var context = canvas.getContext("2d");
  var player = new Character(new Vector2d(0, 0));
  var keyHandler = KeyHandler.setupHandlers(document, canvas);
  var map = randomMap(mapSizeTiles.x, mapSizeTiles.y);

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

  var cardinalDirections = [
    {key: new Vector2d(0,  -1), value: "n"},
    {key: new Vector2d(1,  -1), value: "ne"},
    {key: new Vector2d(1,   0), value: "e"},
    {key: new Vector2d(1,   1), value: "se"},
    {key: new Vector2d(0,   1), value: "s"},
    {key: new Vector2d(-1,  1), value: "sw"},
    {key: new Vector2d(-1,  0), value: "w"},
    {key: new Vector2d(-1, -1), value: "nw"},
  ];

  var tileImages = {
    0 : evergreen,
    1 : grass,
  };


  function render(dt) {
    var canvasSize = updateCanvasSize(document, canvas);

    context.fillStyle = "#FFFF00";
    context.fillRect(0, 0, canvasSize.x, canvasSize.y);

    var dir = new Vector2d(0,0);

    keyHandler.handleEvents(function(events) {
      for (var key in keyDirections) {
        if (events.currentlyPressedKeys[key]) {
          dir = dir.add(keyDirections[key]);
        }
      }
      if (events.mouseButtonPressEvents[2])
      {
        console.log(events.mouseButtonPressEvents[2]);
      }
    });
    var speed = 400;

    // if()
    // player.playerPos = player.playerPos.add(dir.scale(speed * dt));
    // playerPos = playerPos.add(dir.scale(speed * dt));

    player.playerPos = player.playerPos.add(dir.scale(speed * dt)).mod(mapSize);

    var coordConverter = new CoordinateConverter(
      player.playerPos,
      new Vector2d(canvasSize.x, canvasSize.y),
      new Vector2d(canvasBoundRect.left, canvasBoundRect.top));
    var canvasRect = new Rect(new Vector2d(0, 0), new Vector2d(canvasSize.x, canvasSize.y));

    var tileGrid = canvasRect.map(function (v) { return coordConverter.canvasToTile(v); } ).outerCorners();
    tileGrid.eachGridPoint(function(tileCoord) {
      var mapCoord = tileCoord.mod(mapSizeTiles);
      var tile = map[mapCoord.x][mapCoord.y];
      var canvasCoord = coordConverter.tileToCanvas(tileCoord);
      context.drawImage(tileImages[tile],canvasCoord.x,canvasCoord.y);
    });

    var canvasplayer = coordConverter.worldToCanvas(player.playerPos);
    context.drawImage(image,canvasplayer.x, canvasplayer.y);

  }

  var timeDiffer = new TimeDiffer();
  function frame() {
    var dt = timeDiffer.deltaTime();
    render(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
