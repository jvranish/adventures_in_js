"use strict";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeSections(n, border, dim) {
  var borderPoints = [];
  for (var i = 0; i < n; i ++) {
    var adjustedBorder = border.mul(dim);
    var center = dim.scale(0.5);
    var pi2 = Math.PI * 2.0;
    var theta = (pi2/n) * i;
    var variance = adjustedBorder.scale(Math.random());
    var direction = new Vector2d(Math.cos(theta), Math.sin(theta));
    borderPoints.push(center.add(center.sub(adjustedBorder).add(variance).mul(direction)));
//         borderPoints.push(new Vector2d(
//             centerX + (Math.cos(theta) * (centerX - adjustedBorder + varianceX)),
//             centerY + (Math.sin(theta) * (centerY - adjustedBorder + varianceX))
//           )
//         )
  }
  return borderPoints;
}

function fractalPoints(n, g, a, b) {
  if (n > 0) {
    var initialDir = a.directionTo(b);
    var dist = a.distance(b);
    var gDist = g * dist;
    var c = a.add(b).scale(0.5); // average points to get point in the middle
    var r = (Math.random() * gDist * 2)  - gDist; //a range from -g to g
    var p = a.directionTo(b).perpendicular().normalize().scale(r);
    var d = c.add(p);
    return fractalPoints(n-1, g, a, d).concat([d]).concat(fractalPoints(n-1, g, d, b));
  }
  return [];
}

function factalizeBorder(n, g, points) {
  var fractalBorder = []
  if (points.length >= 2) {
    // fractalBorder.push(points[0]);
    for (var j = 1; j < points.length; j++) {
      fractalBorder.push(points[j-1]);
      fractalBorder = fractalBorder.concat(fractalPoints(n, g, points[j-1], points[j]));
      fractalBorder.push(points[j]);
    }
  }
  return fractalBorder.concat(fractalPoints(n, g, points[points.length - 1], points[0]));
}

function overlapsOtherRoom(room, rooms) {
  for (var roomIdx in rooms) {
    if (rooms[roomIdx].overlaps(room)){
      return true;
    }
  }
  return false;
}

function makeRooms(dim, n, size, r, buffer){
  var rooms = [];
  var variance = r * size
  var lower = size - variance + buffer;
  var upper = size + variance + buffer;
  for (var j = 0; j < n; j++) {
    var attemptCount = 0;
    do {
      var x = getRandomInt(buffer, dim.x - upper);
      var y = getRandomInt(buffer, dim.y - upper);
      var width = getRandomInt(lower, upper);
      var height = getRandomInt(lower, upper);
      var ul = new Vector2d(x, y);
      var wh = new Vector2d(width, height);
      var room = new Rect(ul, ul.add(wh));
      attemptCount++;
      // #TODO put an upper bound here... can potentially infinite loop
      //  here
    } while (overlapsOtherRoom(room, rooms) && attemptCount < 30);
    if (attemptCount >= 30)
    {
      return rooms;
    }

    rooms.push(room.enlarge(-buffer));
  }
  return rooms;
}

//********************************
// more new code by Tea
// attempts at grid and translation
//
//
function drawGridLine(a, b, plot)
{
  lineAlgorithm(a.floor(), b.floor(), plot);
  // if (b.x < a.x) {
  //   bresenhamsLineAlgorithm(b, a, plot);
  // } else {
  //   bresenhamsLineAlgorithm(a, b, plot);
  // }
}

function lineAlgorithm(a, b, plot)
{
  var delta = b.sub(a);
  var numberOfSteps = delta.abs().maxElem();
  if (numberOfSteps == 0) {
    plot(a);
  }
  else {
    var step = delta.scale(1.0/numberOfSteps);

    for (var i = 0; i < numberOfSteps; i ++) {
      plot(a.add(step.scale(i)).floor());
    }
  }



  // Job's line algorithm
  //
  //  subtract a from b
  //  pick the axis that has the larger absolute value
  //
  // pick cardinal direction, always take one step in that direction
  //   do partial step in another direction
  // var delta = b.sub(a);
  // var D = delta.y - delta.x;
  // var y = a.y;


  // for (var x = a.x ; x < b.x; x++)
  // {
  //   plot(Math.floor(x),Math.floor(y));
  //   if (D >= 0) {
  //      var y = y + 1;
  //      var D = D - delta.x;
  //   }
  //   D = D + delta.y;
  // }
}

function makeGrid(coastPoints, RoomPoints, pathPoints, width, height) {
  var grid = new Array(height);
  for (var x = 0; x < width; x++)
  {
    grid[x] = new Array(height);
    grid[x].fill("");
  }
  //***still need some path between points? how do we do that?***
  //assign some value to grid where we have already established points
  
  function plotCoast(p) {
    grid[p.x][p.y] = "coast";
  }
  function plotLower(p) {
    if (grid[p.x][p.y] == "") {
      grid[p.x][p.y] = "lower";
    }
  }
  


  if (coastPoints.length > 0) {
    var lastCoastPoint = coastPoints[coastPoints.length - 1];
    lastCoastPoint
    for (var p in coastPoints) {
      drawGridLine(lastCoastPoint, coastPoints[p], plotCoast);
      lastCoastPoint = coastPoints[p];
      //grid[p.x][p.y] = "coast";
    }
  }

  fillOcean(grid, width, height);
  
  //Path
  if (pathPoints.length > 0) {
    for (var pa in pathPoints) {
      var path = pathPoints[pa]
      if (path.length > 0) {
        var lastPathPoint = path[0];
        //lastPathPoint
        for (var p in path) {
          if (p > 0) {
            drawGridLine(lastPathPoint, path[p], plotLower);
          }
          lastPathPoint = path[p];
          //grid[p.x][p.y] = "coast";
        }
      }
    }
  }
  //room
  if (RoomPoints.length > 0) {
    for (var r in RoomPoints) {
      var room = RoomPoints[r]
      if (room.length > 0) {
        var lastRoomPoint = room[room.length - 1];
        //lastPathPoint
        for (var p in room) {
          drawGridLine(lastRoomPoint, room[p], plotLower);
          lastRoomPoint = room[p];
          //grid[p.x][p.y] = "coast";
        }
      }
    }
  } 
 




  //next fill in ocean, starting at the four corners of the canvas

  //then fill in the rooms starting at the center point of the room (make sure center point is still actually in the room?)

  //then create edge pieces

  //then everything else is grass.
  return grid;

}
//begin function group for Fill Ocean
function fillOcean(g, width, height) {
  // console.log(open.length);
  var count = 0;
  var process_next = searchSurroundingSpace(g, 1, 1, width, height);
  do {
    var open = process_next;
    process_next = [];
    while (open.length != 0) {
    // console.log("here");
      var nextSpace = open.pop();
      if  (g[nextSpace[0]][nextSpace[1]] == "")
      {
        g[nextSpace[0]][nextSpace[1]] = "ocean";
        // console.log(open.length);
        //*****this line istn't wprking...*****
        process_next = process_next.concat(searchSurroundingSpace(g, nextSpace[0], nextSpace[1], width, height));
      }
      count = count + 1;
    }
  } while(process_next.length != 0);
}
function searchSurroundingSpace(g, x, y, width, height) {
  var open = [];
  var points = [[x-1, y], [x+1, y],
              [x, y-1], [x, y+1]];
  // console.log(points[0]);
  var arrayLength = points.length;
  for (var i = 0; i < arrayLength; i++) {
    var p = points[i]
    // console.log("this");
    // console.log(p);
    if (checkSpace(g, check_xy(p[0], width), check_xy(p[1], height), width, height)) {
      open.push([check_xy(p[0], width), check_xy(p[1], height)]);

    }
  }
  return open;
}

function checkSpace(g, x, y, width, height) {
  if (x >= 0 && y >= 0 && x < width && y < height) {
    if (g[x][y] == "") {
      return true;
    }
  }
  return false;
}

//this function is simply used to make sure that we are not
//going outside of bounds with this. and allows us to easily
//loop around the map
function check_xy(xy, length) {
  if (xy >= length) {
    xy = xy - length;
  }
  else if (xy < 0) {
    xy = xy + (length);
  }
  return xy
}
//end function group for fillOcean

function renderGrid(ctx, grid) {
  for (var x in grid) {
    for (var y in grid[x]) {
      if (grid[x][y] == "coast") {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(x,y,1,1);
      }
      else if (grid[x][y] == "ocean") {
        ctx.fillStyle = "rgb(0, 0, 255)";
        ctx.fillRect(x,y,1,1);
      }
      else if (grid[x][y] == "lower") {
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(x,y,1,1);
      }
    }
  }
}

function generateMapComponents(size) {
  var borderVariance = new Vector2d(0.25, 0.25);

  var ctx = canvas.getContext('2d');

  var sections = factalizeBorder(6, 0.2, makeSections(18, borderVariance, size));

  var roomsList = []
  var pathList = []
  var rooms = makeRooms(size, 16, 0.08*Math.min(size.x, size.y), 0.5, 10);
  for (var roomIdx in rooms) {
    var room = rooms[roomIdx];
    var roomPoints = []
    roomPoints.push(new Vector2d(
            room.ul.x + getRandomInt(5, 10) - 10,
            room.ul.y + getRandomInt(5, 10) - 10
          )
        );
    roomPoints.push(new Vector2d(
            room.ul.x + room.width() + getRandomInt(0, 5),
            room.ul.y + getRandomInt(5, 10) - 10
          )
        );
    roomPoints.push(new Vector2d(
            room.ul.x + room.width() + getRandomInt(0, 5),
            room.ul.y + room.height() + getRandomInt(0, 5)
          )
        );
    roomPoints.push(new Vector2d(
            room.ul.x + getRandomInt(5, 10) - 10,
            room.ul.y + room.height() + getRandomInt(0, 5)
          )
        );
    var roomSections = factalizeBorder(6, 0.2, roomPoints);
    roomsList.push(roomSections);
  }

  for (var j in rooms) {
    var k = getRandomInt(0, rooms.length - 1);

    var pathPoints = fractalPoints(8, 0.1, rooms[j].center(), rooms[k].center());

    pathList.push(pathPoints);
  }
  return [sections, roomsList, pathList]
}

function generateMap(size) {
  var [sections, roomsList, pathList] = generateMapComponents(size)
  return makeGrid(sections, roomsList, pathList, size.x, size.y);
}

