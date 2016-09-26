"use strict";

function updateCanvasSize(doc, canvas) {
  var canvasSize = new Vector2d(doc.body.clientWidth,
                                doc.body.clientHeight);
  canvas.width = canvasSize.x;
  canvas.height = canvasSize.y;
  return canvasSize;
}

function FakeSim(world) {
  this.clientId = function() { return "asdf"; };
  this.sendEvent = function(event) {  world.incomingEvent("asdf", event); };
  this.lastTime = window.performance.now() / 1000;
  this.world = world;
}
FakeSim.prototype.clientId = function() {
  return "asdf";
}
FakeSim.prototype.sendEvent = function(event) {
  return this.world.incomingEvent(this.clientId(), event);
}
FakeSim.prototype.update = function(now) {
  var dt = now - this.lastTime;
  this.lastTime = now;
  return this.world.update(dt);
}

function createSim(multiplayer, world) {
  var sim = null;
  if (multiplayer === "true") {
    sim = SimSim.createSimulation({
        adapter: {
            type: 'socket_io',
            options: { url: "http://54.89.82.62:4050" }
        },
        world: world
    });
    sim.start();
  } else {
    var storedWorld = sessionStorage.getItem('world');
    if (storedWorld) {
      world.setData(JSON.parse(storedWorld));
    } else {
      world.playerJoined("asdf");
    }

    sim = new FakeSim(world);
  }
  return sim
}

function main() {
  var sim = null;
  var world = null;
  function init() {
    var canvas = document.getElementById("canvas");
    // twgl.resizeCanvasToDisplaySize(canvas);
    var multiplayer = getParameterByName("multiplayer");

    var mapSeed = Math.floor(Math.random() * 2147483648);
    world = new World(new Vector2d(300, 300), 12345, mapSeed);

    sim = createSim(multiplayer, world);
  }

  var initDone = false;

  function doSimUpdate() {
    var now = window.performance.now() / 1000;
    sim.update(now);
    if (!initDone && sim.clientId()!= null && sim.clientId() in world.players) {
      var localPlayer = world.players[sim.clientId()];

      var coordConverter = new CoordinateConverter(
        localPlayer.playerPos,
        canvas
      );

      document.getElementById('x-pos').innerHTML = localPlayer.playerPos.x / 32;
      document.getElementById('y-pos').innerHTML = localPlayer.playerPos.y / 32;

      var glInfo = new GlInfo(canvas, world.map.tileGrid, coordConverter);

      var inputs = new Inputs(document, canvas, coordConverter);

      var gameState = new LocalGameState(world, glInfo, coordConverter, localPlayer, inputs);

      requestAnimationFrame(function(time) {
        frame(gameState, time);
      });
      initDone = true;
    }
  }
  var updateTimer = setInterval(doSimUpdate, 50);

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
    if (initDone) {
      var guiInputs = gameState.inputs.getInputs();

      if(typeof(guiInputs.mouseEvents.rightClick) != "undefined") {
        // console.log("right click!");
        console.log(guiInputs.mouseEvents.rightClick.mapPosition);
        // gameState.localPlayer.playerPos = guiInputs.mouseEvents.rightClick.mapPosition;
        // var worldPos = coordConverter.canvasToWorld(events.mouseButtonPressEvents[2]);
        sim.sendEvent({ newDestination: guiInputs.mouseEvents.rightClick.mapPosition });
        // gameState.world.incomingEvent(0, { newDestination: guiInputs.mouseEvents.rightClick.mapPosition });
        document.getElementById('x-pos').innerHTML = gameState.localPlayer.playerPos.x / 32;
        document.getElementById('y-pos').innerHTML = gameState.localPlayer.playerPos.y / 32;
      }


      gameState.coordConverter.update(gameState.localPlayer.playerPos);
      gameState.glInfo.update();
      // gameState.world.update(gameState.coordConverter, dt);
      // doSimUpdate();
      sessionStorage.setItem('world', JSON.stringify(gameState.world.getData()));
    }
  }

  function render(dt, gameState, time) {
    gameState.glInfo.renderMap();
    gameState.glInfo.renderCharacters(gameState.world, time);
  }

  function frame(gameState, t) {
    var dt = gameState.inputs.updateTime(t);
    update(dt, gameState);
    render(dt, gameState, t);

    requestAnimationFrame(function(t1) {
      frame(gameState, t1/1000.0);
    });
  }

  init();
}
