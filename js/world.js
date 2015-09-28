
function World(tileSize) {
  this.mapSizeTiles = tileSize;
  this.mapSize = this.mapSizeTiles.scale(32);
  this.halfMapSize = this.mapSize.scale(0.5);
  this.t = 0;
  this.player = new Character(new Vector2d(0, 0), RIGHT);


  var world = this;
  this.TorusVector2d = function (x, y) {
    var modPos = new Vector2d(x, y)
      .add(world.halfMapSize)
      .mod(world.mapSize)
      .sub(world.mapSize.scale(0.5));
    this.x = modPos.x;
    this.y = modPos.y;
  }
  this.TorusVector2d.fromScalar = function (scalar) {
    return new world.TorusVector2d(scalar, scalar);
  };
  Vector2d.setupPrototype(this.TorusVector2d);
}

