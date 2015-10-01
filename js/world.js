
//TODO remove this copy eventually
var LEFT = new Vector2d(-1, 0);
var RIGHT = new Vector2d(1, 0);
var UP = new Vector2d(0, -1);
var DOWN = new Vector2d(0, 1);

function randomMap(size) {
  var map = [];
  for (var x = 0; x < size.x; x++) {
    map[x] = [];
    for (var y = 0; y < size.y; y++) {
      map[x][y] = getRandomInt(0, 1);
    }
  }
  return map;
}


function World(tileSize) {
  var world = this;
  world.TorusVector2d = function (x, y) {
    var modPos = new Vector2d(x, y)
      .add(world.halfMapSize)
      .mod(world.mapSize)
      .sub(world.mapSize.scale(0.5));
    this.x = modPos.x;
    this.y = modPos.y;
  }
  world.TorusVector2d.fromScalar = function (scalar) {
    return new world.TorusVector2d(scalar, scalar);
  };
  Vector2d.setupPrototype(world.TorusVector2d);

  world.mapSizeTiles = tileSize;
  world.mapSize = world.mapSizeTiles.scale(32);
  world.halfMapSize = world.mapSize.scale(0.5);

  // #TODO there is too much high-level initialization here,
  //   we should probably break this out into a class method

  world.map = randomMap(world.mapSizeTiles);

  world.player = new Character(new world.TorusVector2d(0, 0), RIGHT);

}
