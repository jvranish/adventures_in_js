//TODO remove this copy eventually
var LEFT = new Vector2d(-1, 0);
var RIGHT = new Vector2d(1, 0);
var UP = new Vector2d(0, -1);
var DOWN = new Vector2d(0, 1);

function arrayRehydrate(constructor, elems) {
  for (key in elems) {
    constructor.rehydrate(elems[key]);
  }
  return elems;
}
// function updateCanvasSize(doc, canvas) {
//   var canvasSize = new Vector2d(doc.body.clientWidth,
//                                 doc.body.clientHeight);
//   canvas.width = canvasSize.x;
//   canvas.height = canvasSize.y;
//   return canvasSize;
// }

function World(mapSizeTiles, seed, mapSeed, map, players) {
  this.mapSizeTiles = mapSizeTiles;
  this.mapSize = this.mapSizeTiles.scale(32);
  this.prng = new ParkMillerRNG(seed);

  this.mapSeed = mapSeed;

  this.map = map;

  this.players = players;
}
function World(mapSizeTiles, seed, mapSeed) {
  this.mapSizeTiles = mapSizeTiles;
  this.mapSize = this.mapSizeTiles.scale(32);
  this.prng = new ParkMillerRNG(seed);

  // #TODO there is too much high-level initialization here,
  //   we should probably break this out into a class method

  this.mapSeed = mapSeed;

  this.map = new Map(this.mapSizeTiles, this.mapSeed, this.prng);
  //this.map = this.randomMap(this.mapSizeTiles, this.mapSeed);

  this.players = {};
}

function generateNewWorld(mapSizeTiles, seed, mapSeed) {

}

World.prototype.getData = function() {
  return {
    seed: this.prng.seed,
    mapSize: this.mapSize,
    mapSizeTiles: this.mapSizeTiles,
    mapSeed: this.mapSeed,
    players: this.players,
  };
};

World.prototype.setData = function(data) {
  this.prng.seed = data.seed;

  this.mapSizeTiles = Vector2d.rehydrate(data.mapSizeTiles);
  this.mapSize = Vector2d.rehydrate(data.mapSize);

  //regenerate map if the seed is different
  if (this.mapSeed !== data.mapSeed)
  {
    this.mapSeed = data.mapSeed;
    this.map = new Map(this.mapSizeTiles, this.mapSeed, this.prng);
    //FIXIT
    //This does not update GL info for map
  }

  this.players = arrayRehydrate(Character, data.players);
};

World.prototype.getChecksum = function() {
  // no useful checksum for now
  //   a possible simple implementation would be to JSONify the world state and then md5, or sha1, or crc32 the resulting string
  return 0;
};

World.prototype.playerJoined = function(id) {
  this.players[id] = new Character(this.map.startingPos.scale(32), RIGHT);
};

World.prototype.playerLeft = function(id) {
  delete this.players[id];
};

World.prototype.step = function(dt) {
  this.update(dt);
};

World.prototype.theEnd = function() {
  // don't need anything here for now
}

World.prototype.incomingEvent = function(id, event) {
  if (event.newDestination)
  {
    this.players[id].setDestination(Vector2d.rehydrate(event.newDestination));
  }
};

World.prototype.update = function(dt) {
  for (var character_id in this.players) {
    var character = this.players[character_id];
    var maxTravelDist = character.walkSpeed * dt;
    if (character.destinationPos)
    {
      if (character.playerPos.equal(character.destinationPos)) {
        character.destinationPos = null;
      }
      else {
        var displacement = character
          .destinationPos
          .sub(character.playerPos);
        var moveAmount = displacement.clipTo(maxTravelDist);
        var newPos = character.playerPos.add(moveAmount);
        if (this.map.isWalkable(newPos)) {
          character.playerPos = character.playerPos.add(moveAmount);
        } else {
          character.destinationPos = null;
        }
      }
    }
  }
};
