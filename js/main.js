"use strict";

function updateCanvasSize(doc, canvas) {
  var canvasSize = new Vector2d(doc.body.clientWidth,
                                doc.body.clientHeight);
  canvas.width = canvasSize.x;
  canvas.height = canvasSize.y;
  return canvasSize;
}

function main() {
  function init() {
    var canvas = document.getElementById("canvas");
    // twgl.resizeCanvasToDisplaySize(canvas);

    var world = new World(new Vector2d(100, 100), 12345, 4321123);
    world.playerJoined(0);
    var localPlayer = world.players[0];
    //localPlayer.playerPos = new Vector2d(450, 450).scale(32).neg();

  // var canvas = document.getElementById("viewPort");
  // var canvasBoundRect = canvas.getBoundingClientRect();
  // var gl = twgl.getWebGLContext(canvas);

  // var t = 0;

  // // var context = canvas.getContext("2d");
  // var keyHandler = KeyHandler.setupHandlers(document, canvas);


  // var programInfo = twgl.createProgramInfo(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
    var coordConverter = new CoordinateConverter(
      localPlayer.playerPos,
      canvas
    );

    document.getElementById('x-pos').innerHTML = localPlayer.playerPos.x / 32;
    document.getElementById('y-pos').innerHTML = localPlayer.playerPos.y / 32;

    var glInfo = new GlInfo(canvas, world.map.tileGrid, coordConverter);

    // var textures = twgl.createTextures(gl, {
    //   "mountain_landscape":          { src: document.getElementById("mountain_landscape") },
    //   "black-mage-spritesheet.png":  { src: document.getElementById("black-mage-spritesheet.png") },
    //   "white-mage-spritesheet.png":  { src: document.getElementById("white-mage-spritesheet.png") },
    //   "harrytheorc-spritesheet.png": { src: document.getElementById("harrytheorc-spritesheet.png") },
    //   "greendwarf.png":              { src: document.getElementById("greendwarf.png") }
    // });

    var inputs = new Inputs(document, canvas, coordConverter);

    var gameState = new LocalGameState(world, glInfo, coordConverter, localPlayer, inputs);

    requestAnimationFrame(function(time) {
      frame(gameState, time);
    });

    return;
  }


  // var data_content = document.getElementById("sprites_json");
  // var data = JSON.parse(data_content );

  // var canvas = document.getElementById("viewPort");
  // var canvasBoundRect = canvas.getBoundingClientRect();
  
  //var context = canvas.getContext("2d");
  
  //var evergreen = document.getElementById("evergreen");
  //var grass = document.getElementById("grass");
  //todo, add proper image loading delays

  // var tileImages = {
  //   0 : evergreen,
  //   1 : grass,
  // };

  // var world = new World(new Vector2d(100, 100), 12345);
  // world.playerJoined(0);
  // var currentPlayerId = 0;

  function update(dt, gameState) {
    updateCanvasSize(document, gameState.glInfo.gl.canvas);
    //var canvasSize = updateCanvasSize(document, canvas);
    //var currentPlayer = world.players[currentPlayerId];
    // var coordConverter = new CoordinateConverter(
    //   currentPlayer.playerPos,
    //   new Vector2d(canvasSize.x, canvasSize.y),
    //   new Vector2d(canvasBoundRect.left, canvasBoundRect.top));
    //FIXIT add event handling
    // keyHandler.handleEvents(function(events) {
    //   if (events.mouseButtonPressEvents[2])
    //   {
    //     var worldPos = coordConverter.canvasToWorld(events.mouseButtonPressEvents[2]);
    //     world.incomingEvent(0, { newDestination: worldPos });
    //   }
    // });
    var guiInputs = gameState.inputs.getInputs();

    if(typeof(guiInputs.mouseEvents.rightClick) != "undefined") {
      // console.log("right click!");
      console.log(guiInputs.mouseEvents.rightClick.mapPosition);
      // gameState.localPlayer.playerPos = guiInputs.mouseEvents.rightClick.mapPosition;
      // var worldPos = coordConverter.canvasToWorld(events.mouseButtonPressEvents[2]);
      gameState.world.incomingEvent(0, { newDestination: guiInputs.mouseEvents.rightClick.mapPosition });
      document.getElementById('x-pos').innerHTML = gameState.localPlayer.playerPos.x / 32;
      document.getElementById('y-pos').innerHTML = gameState.localPlayer.playerPos.y / 32;
    }


    gameState.coordConverter.update(gameState.localPlayer.playerPos);
    gameState.glInfo.update();
    gameState.world.update(dt);
  }
  
  function render(dt, gameState, time) {
    gameState.glInfo.renderMap();
    gameState.glInfo.renderCharacters(gameState.world, time);
    gameState.glInfo.drawSprite(gameState.glInfo.fireSprite, time*50, 100, 100);

    //var canvasSize = updateCanvasSize(document, canvas);
    //context.fillStyle = "#FFFF00";
    //context.fillRect(0, 0, canvasSize.x, canvasSize.y);
    // var currentPlayer = world.players[currentPlayerId];
    // var coordConverter = new CoordinateConverter(
    //   currentPlayer.playerPos,
    //   new Vector2d(canvasSize.x, canvasSize.y),
    //   new Vector2d(canvasBoundRect.left, canvasBoundRect.top)
    // );
 /// TODO fix canvas coord converter

    /*
    * RE-IMPLEMENT WORLD DRAW
    */

    // var canvasRect = new Rect(new Vector2d(0, 0), new Vector2d(canvasSize.x, canvasSize.y));

    // var tileGrid = canvasRect.map(function (v) { return coordConverter.canvasToTile(v); } ).outerCorners();
    // tileGrid.eachGridPoint(function(tileCoord) {
    //   var mapCoord = tileCoord.mod(world.mapSizeTiles);;
    //   var tile = world.map[mapCoord.x][mapCoord.y];
    //   var canvasCoord = coordConverter.tileToCanvas(tileCoord);
    //   context.drawImage(tileImages[tile],canvasCoord.x,canvasCoord.y);
    // });
    //console.log(renderInfo.gl);
    

    //var currentPlayer = world.players[currentPlayerId];


    /*
    * RE-IMPLEMENT RED DOT ON RIGHT CLICK
    */
    // if(currentPlayer.destinationPos !== null){
    //   context.fillStyle = "#FF0000";
    //   var redDotPos = coordConverter.worldToCanvas(currentPlayer.destinationPos);
    //   context.fillRect(
    //     redDotPos.x - 3,
    //     redDotPos.y - 3,
    //     6,
    //     6
    //   );
    // }


    /*
    * RE-IMPLEMENT DRAW CHARACTERS
    */
    // for (var player_id in world.players)
    // {
    //   var player = world.players[player_id];
    //   var playerImage = player.currentSprite(t);
    //   var spriteSheet = playerImage.spriteSheet;
    //   var frameName = playerImage.frameName;
    //   var img = document.getElementById(playerImage.spriteSheet.meta.image);

    //   var frame = spriteSheet.frames[frameName].frame;
    //   var sourceSize = spriteSheet.frames[frameName].spriteSourceSize;

    //   var canvasplayer = coordConverter.worldToCanvas(player.playerPos);
    //   context.drawImage(img,
    //                     frame.x, frame.y,
    //                     frame.w, frame.h,
    //                     canvasplayer.x + sourceSize.x - playerImage.centerOffset.x,
    //                     canvasplayer.y + sourceSize.y - playerImage.centerOffset.y,
    //                     sourceSize.w, sourceSize.h);
    // }

  }

  function frame(gameState, t) {
    var dt = gameState.inputs.updateTime(t);
    // console.log(dt);
    update(dt, gameState);
    render(dt, gameState, t);

    requestAnimationFrame(function(t1) {
      frame(gameState, t1/1000.0);
    });
  }

  init();
}
