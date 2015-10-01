"use strict";

function CoordinateConverter(world, canvasSize, canvasTopLeft) {
    this.world = world;
    this.canvasSize = canvasSize;
    this.canvasTopLeft = canvasTopLeft
}

CoordinateConverter.prototype.worldToCanvas = function(worldCoord)
{
  // world is in units of pixels so just need offset
  var canvasCenterInWorld = this.world.player.playerPos;
  var canvasCenterInCanvas = new Vector2d(this.canvasSize.x, this.canvasSize.y).scale(0.5);
  var canvasOriginInWorld = canvasCenterInWorld.sub(canvasCenterInCanvas);
  var canvasPos = worldCoord.sub(canvasOriginInWorld);
  return canvasPos;
}
CoordinateConverter.prototype.canvasToWorld = function(canvasCoord)
{
  // world is in units of pixels so just need offset
  var canvasCenterInWorld = this.world.player.playerPos;
  var canvasCenterInCanvas = new Vector2d(this.canvasSize.x, this.canvasSize.y).scale(0.5);
  return canvasCenterInWorld.add(canvasCoord).sub(canvasCenterInCanvas);
}

CoordinateConverter.prototype.worldToTile = function(worldCoord)
{
  // tile coords are same as world, but just scaled by 32
  return worldCoord.scale(1/32) //.mod(this.world.mapSizeTiles);
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
