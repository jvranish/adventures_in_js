function GlInfo(canvas, tileGrid, coordConverter) {
  this.tileSize = new Vector2d(32, 32);
  this.coordConverter = coordConverter;
  this.translation = new Vector2d(0, 0);

  this.gl = twgl.getWebGLContext(canvas);
  this.programInfo = twgl.createProgramInfo(this.gl, ["2d-vertex-shader", "2d-fragment-shader"]);

  var mapArrays = this.generateMapGlCoords(tileGrid);

  this.mapBufferInfo = twgl.createBufferInfoFromArrays(this.gl, {
    vertexCoords: { numComponents: 2, data: mapArrays.vertexCoords},
    textureCoords: { numComponents: 2, data: mapArrays.textureCoords},
  });

  this.spriteBufferInfo = twgl.createBufferInfoFromArrays(this.gl, {
    vertexCoords: { numComponents: 2, data: sprites.vertexCoords},
    textureCoords: { numComponents: 2, data: sprites.textureCoords},
  });


  var tilesSpritesheet = document.getElementById("mountain_landscape");
  var spritesheet = document.getElementById("black-mage-spritesheet.png");

  this.textures = twgl.createTextures(this.gl, {
    tiles: { src: tilesSpritesheet },
    sprites: { src: spritesheet },
  });
}

GlInfo.prototype.update = function() {
  this.translation = this
    .coordConverter
    .worldToCanvas(new Vector2d(0, 0));
}

GlInfo.prototype.renderMap = function() {
  this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  twgl.resizeCanvasToDisplaySize(this.gl.canvas);

  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  // this.gl.viewport(0, 0, 600, 600);

  this.gl.enable(this.gl.BLEND);
  this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  this.gl.disable(this.gl.DEPTH_TEST);

  this.gl.useProgram(this.programInfo.program);
  twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.mapBufferInfo);
  twgl.setUniforms(this.programInfo, {
    translation: [Math.round(this.translation.x), Math.round(this.translation.y)],
    resolution: [this.gl.canvas.width, this.gl.canvas.height],
    textureSize: [512, 512],
    image: this.textures.tiles
  });
  twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.mapBufferInfo);

  this.gl.disable(this.gl.BLEND);
  this.gl.enable(this.gl.DEPTH_TEST);
}

GlInfo.prototype.renderCharacters = function (world, t) {

  this.gl.enable(this.gl.BLEND);
  this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

  for (var player_id in world.players)
  {
    var player = world.players[player_id];
    var playerImage = player.currentSprite(t, sprites["frameOffsets"]);
    var frameOffset = playerImage.frameOffset;
    var canvasplayer = this.coordConverter.worldToCanvas(player.playerPos);

    twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.spriteBufferInfo);
    twgl.setUniforms(this.programInfo, {
      translation: [canvasplayer.x - playerImage.centerOffset.x, canvasplayer.y - playerImage.centerOffset.y],
      resolution: [this.gl.canvas.width, this.gl.canvas.height],
      textureSize: [1212, 1995],
      image: this.textures.sprites
    });
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.spriteBufferInfo, 6, playerImage.frameOffset * 6);

  }
  this.gl.disable(this.gl.BLEND);
}

GlInfo.prototype.generateTileGlCoords = function(x, y, tx, ty) {
  // verticies
  var a = [x * this.tileSize.x, y * this.tileSize.y];
  var b = [x * this.tileSize.x + this.tileSize.x, y * this.tileSize.y];
  var c = [x * this.tileSize.x, y * this.tileSize.y + this.tileSize.y];
  var d = [x * this.tileSize.x + this.tileSize.x, y * this.tileSize.y + this.tileSize.y];
  // texture coords
  var ta = [tx * this.tileSize.x, ty * this.tileSize.y];
  var tb = [tx * this.tileSize.x + this.tileSize.x, ty * this.tileSize.y];
  var tc = [tx * this.tileSize.x, ty * this.tileSize.y + this.tileSize.y];
  var td = [tx * this.tileSize.x + this.tileSize.x, ty * this.tileSize.y + this.tileSize.y];
  // var vertexCoords = [].concat(a, b, c,
  //                     c, b, d);
  // var textureCoords = [].concat(ta, tb, tc,
  //                      tc, tb, td);

  var vertexCoords = [].concat(a, c, b,
                      b, c, d);
  var textureCoords = [].concat(ta, tc, tb,
                      tb, tc, td);
  return { 
    vertexCoords: vertexCoords,
    textureCoords: textureCoords
  };
}

GlInfo.prototype.getTextureCoord = function(num) {  
  var tx = num % 16;
  var ty = Math.floor(num / 16);

  return {x: tx, y: ty};
}

GlInfo.prototype.generateMapGlCoords = function(tileGrid) {
  var vertexCoords = [];
  var textureCoords = [];
  for (var x = 0; x < tileGrid.length; x++) {
    for (var y = 0; y < tileGrid[x].length; y++) {
      for(var z =  (tileGrid[x][y].length - 1); z >= 0; z--) {
        var texCoords = this.getTextureCoord(tileGrid[x][y][z]);
        var tileCoords = this.generateTileGlCoords(x, y, texCoords.x, texCoords.y);
        vertexCoords.push.apply(vertexCoords, tileCoords.vertexCoords);
        textureCoords.push.apply(textureCoords, tileCoords.textureCoords);
      }
    }
  }

  return { 
    vertexCoords: vertexCoords,
    textureCoords: textureCoords
  };
}