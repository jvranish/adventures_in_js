

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

  this.fireSprite = this.loadSprite("Fire01.png", 8, 4);


  var tilesSpritesheet = document.getElementById("mountain_landscape");
  var spritesheet = document.getElementById("black-mage-spritesheet.png");
  // var fireSprites = document.getElementById("Fire01.png");
  // debugger;
  this.textures = twgl.createTextures(this.gl, {
    tiles: { src: tilesSpritesheet },
    sprites: { src: spritesheet },
    // fileSprites: { src: fireSprites },
  });
}

GlInfo.prototype.quadCoords = function(rect) {
  var a = [rect.x, rect.y];
  var b = [rect.x + rect.w, rect.y];
  var c = [rect.x, rect.y + rect.h];
  var d = [rect.x + rect.w, rect.y + rect.h];
  //a c b
  //b c d
  return a.concat(c).concat(b).concat(b).concat(c).concat(d);
}

GlInfo.prototype.loadSprite = function(filename, nw, nh) {
  var textureCoords = [];
  var vertexCoords = [];

  var sprites = document.getElementById(filename);
  var texture = twgl.createTexture(this.gl, { src: sprites} );
  var spriteWidth = sprites.naturalWidth / nw;
  var spriteHeight = sprites.naturalHeight / nh;
  for (var i = 0; i < nw; i++) {
    for (var j = 0; j < nh; j++) {
      var txRect = {
        x: i * spriteWidth,
        y: i * spriteHeight,
        w: spriteWidth,
        h: spriteHeight,
      };
      var vxRect = {
        x: 0,
        y: 0,
        w: spriteWidth,
        h: spriteHeight,
      };
      textureCoords = textureCoords.concat(this.quadCoords(txRect));
      vertexCoords = vertexCoords.concat(this.quadCoords(vxRect));
    }
  }
  var spriteBufferInfo = twgl.createBufferInfoFromArrays(this.gl, {
    vertexCoords: { numComponents: 2, data: vertexCoords},
    textureCoords: { numComponents: 2, data: textureCoords},
  });
  return {
    bufferInfo: spriteBufferInfo,
    texture: texture,
    frames: nw * nh,
  };
}

GlInfo.prototype.drawSprite = function(sprite, frame, x, y) {
  this.gl.enable(this.gl.BLEND);
  this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

  twgl.setBuffersAndAttributes(this.gl, this.programInfo, sprite.bufferInfo);
  twgl.setUniforms(this.programInfo, {
    translation: [x, y],
    resolution: [this.gl.canvas.width, this.gl.canvas.height],
    textureSize: [1024, 1024],
    image: sprite.texture
  });
  twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, sprite.bufferInfo, 6, (Math.round(frame) % sprite.frames) * 6);

  this.gl.disable(this.gl.BLEND);
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
    textureSize: [512, 1024],
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