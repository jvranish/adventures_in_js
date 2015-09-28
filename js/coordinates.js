"use strict";

function CoordinateConverter(playerPos, canvasSize, canvasTopLeft) {
    this.playerPos = playerPos;
    this.canvasSize = canvasSize;
    this.canvasTopLeft = canvasTopLeft
}

CoordinateConverter.prototype.worldToCanvas = function(worldCoord)
{
  // TODO use real map sizes rather than hardcoded
  // things here
  var mapSizeTiles = new Vector2d(100, 100);
  var mapSize = mapSizeTiles.scale(32);

  // world is in units of pixels so just need offset
  var canvasCenterInWorld = this.playerPos;
  var canvasCenterInCanvas = new Vector2d(this.canvasSize.x, this.canvasSize.y).scale(0.5);
  var canvasOriginInWorld = canvasCenterInWorld.sub(canvasCenterInCanvas);
  var canvasPos = worldCoord.sub(canvasOriginInWorld).add(mapSize.scale(0.5))
        .mod(mapSize)
        .sub(mapSize.scale(0.5));
  return canvasPos;
  // return worldCoord.sub(canvasCenterInWorld).add(canvasCenterInCanvas);
}
CoordinateConverter.prototype.canvasToWorld = function(canvasCoord)
{
  // world is in units of pixels so just need offset
  var canvasCenterInWorld = this.playerPos;
  var canvasCenterInCanvas = new Vector2d(this.canvasSize.x, this.canvasSize.y).scale(0.5);
  return canvasCoord.sub(canvasCenterInCanvas).add(canvasCenterInWorld);
}

CoordinateConverter.prototype.worldToTile = function(worldCoord)
{
  // tile coords are same as world, but just scaled by 32
  return worldCoord.scale(1/32);
}
CoordinateConverter.prototype.tileToWorld = function(tileCoord)
{
  // tile coords are same as world, but just scaled by 32
  return tileCoord.scale(32);
}

CoordinateConverter.prototype.tileToCanvas = function(tileCoord)
{
  return this.worldToCanvas(this.tileToWorld(tileCoord));
}
CoordinateConverter.prototype.canvasToTile = function(canvasCoord)
{
  return this.worldToTile(this.canvasToWorld(canvasCoord));
}

CoordinateConverter.prototype.mouseToCanvas = function(mousePos)
{
  return mousePos.sub(this.canvasTopLeft);
}
CoordinateConverter.prototype.mouseToWorld = function(mousePos)
{
  return canvasToWorld(mouseToCanvas(mousePos));
}
