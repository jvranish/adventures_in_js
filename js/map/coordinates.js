"use strict";

//Canvas is posiition offset world pixel coordinates
//World is standard x,y pixel coordinates
//Tile is tile coordinates


function CoordinateConverter(viewPortPosition, canvas) {
    this.viewPortPosition = viewPortPosition;
    this.canvas = canvas;
    var canvasBoundRect = this.canvas.getBoundingClientRect();
    this.canvasTopLeft = new Vector2d(canvasBoundRect.left, canvasBoundRect.top);
}

CoordinateConverter.prototype.update = function(viewPortPosition) {
  this.viewPortPosition = viewPortPosition;
  var canvasBoundRect = this.canvas.getBoundingClientRect();
  this.canvasTopLeft = new Vector2d(canvasBoundRect.left, canvasBoundRect.top); 
}

CoordinateConverter.prototype.worldToCanvas = function(worldCoord)
{
  // viewPortPosition is in units of pixels so just need offset
  var canvasCenterInWorld = this.viewPortPosition;
  var canvasCenterInCanvas = new Vector2d(canvas.width, canvas.height).scale(0.5);
  var canvasOriginInWorld = canvasCenterInWorld.sub(canvasCenterInCanvas);
  var canvasPos = worldCoord.sub(canvasOriginInWorld);
  return canvasPos;
}
CoordinateConverter.prototype.canvasToWorld = function(canvasCoord)
{
  // viewPortPosition is in units of pixels so just need offset
  var canvasCenterInWorld = this.viewPortPosition;
  var canvasCenterInCanvas = new Vector2d(canvas.width, canvas.height).scale(0.5);
  return canvasCenterInWorld.add(canvasCoord).sub(canvasCenterInCanvas);
}

CoordinateConverter.prototype.worldToTile = function(worldCoord)
{
  // tile coords are same as viewPortPosition, but just scaled by 32
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
  return this.canvasToWorld(this.mouseToCanvas(mousePos));
}
