function Map(mapSizeTiles, mapSeed, prng) {
  // if(typeof(tileMap) == "undefined") {
  //   tileMap = this.generateRandomMap(new Vector2d(100, 100), 3423523);
  // }

  this.mapSizeTiles = mapSizeTiles;
  this.mapSeed = mapSeed;
  this.prng = prng;
  this.tileSize = new Vector2d(32, 32);

  //this.tileGrid = this.generateRandomMap(mapSizeTiles, mapSeed);
  // generateMap(mapSizeTiles);
  // this.tileGrid = mapFile;
  var [tileGrid, startPos] = generateMap(mapSizeTiles, mapSeed);
  this.tileGrid = tileGrid;
  this.startingPos = startPos;
  //debug();
  //this.glInfo = this.generateMapGlCoords();
}

Map.prototype.generateRandomMap = function(size, seed) {
  var map = [];
  var prng = new ParkMillerRNG(seed);
  for (var x = 0; x < size.x; x++) {
    map[x] = [];
    for (var y = 0; y < size.y; y++) {
      map[x][y] = [];
      map[x][y][0] = prng.nextIntRange(0, 255);
      map[x][y][1] = prng.nextIntRange(0, 255);
      map[x][y][2] = prng.nextIntRange(0, 255);
    }
  }
  return map;
}

