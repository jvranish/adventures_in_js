
//TODO remove this copy eventually
var LEFT = new Vector2d(-1, 0);
var RIGHT = new Vector2d(1, 0);
var UP = new Vector2d(0, -1);
var DOWN = new Vector2d(0, 1);



function World(tileSize, seed) {
  this.mapSizeTiles = tileSize;
  this.mapSize = this.mapSizeTiles.scale(32);
  this.prng = new ParkMillerRNG(seed);


  // #TODO there is too much high-level initialization here,
  //   we should probably break this out into a class method

  this.map = this.randomMap(this.mapSizeTiles);

  this.players = {};

}

World.prototype.randomMap = function(size) {
  var map = [];
  for (var x = 0; x < size.x; x++) {
    map[x] = [];
    for (var y = 0; y < size.y; y++) {
      map[x][y] = this.prng.nextInt(0, 1);
    }
  }
  return map;
}

World.prototype.getData = function() {
  // return {
  //   seed: this.prng.seed,
  //   mapSize: this.mapSizem
  //   mapSizeTiles: this.mapSizeTiles,
  //   this.
  // }
  return this.players;
};

World.prototype.setData = function(data) {
  this.players = data;
};

World.prototype.getChecksum = function() {
  // no useful checksum for now
  //   a possible simple implementation would be to JSONify the world state and then md5, or sha1, or crc32 the resulting string
  return 0;
};

World.prototype.playerJoined = function(id) {
  this.players[id] = new Character(new Vector2d(0, 0), RIGHT);
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
    this.players[id].setDestination(event.newDestination);
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
        // this is not exactly super intuitive, I'm going to try to make a generic TorusVector class
        // that can handle the wrap around more transparently.
        var displacement = character
          .destinationPos
          .sub(character.playerPos);
        // console.log(displacement);
        var moveAmount = displacement.clipTo(maxTravelDist);
        character.playerPos = character.playerPos.add(moveAmount);
      }
    }
  }
};
