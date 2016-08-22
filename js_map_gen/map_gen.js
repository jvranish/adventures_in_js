"use strict";

//**********************************************
//  New code for converting
// ******************************************
function convertGrid(grid, width, height) {

  //clean up any annomolies that our tiles can't render
  var newGrid = new Array(height*2);
  for (var x = 0; x < height*2; x++)
  {
    newGrid[x] = new Array(width*2);
    newGrid[x].fill([]);
  }
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {

      var c1 = grid[i][j-1 > 0? j-1 : height-1];
      var c3 = grid[i+1 < width? i+1 : 0][j];
      var c5 = grid[i][j+1 < height? j+1 : 0];
      var c7 = grid[i-1 > 0? i-1 : width-1][j];

      var c2 = grid[i+1 < width? i+1 : 0][j-1 > 0? j-1 : height-1];
      var c4 = grid[i+1 < width? i+1 : 0][j+1 < height? j+1 : 0];
      var c6 = grid[i-1 > 0? i-1 : width-1][j+1 < height? j+1 : 0];
      var c8 = grid[i-1 > 0? i-1 : width-1][j-1 > 0? j-1 : height-1];

      var current = grid[i][j];
      if (current == "" && c5 == "lower" && c4 == "" && c3 == "lower") {
        //c5
        grid[i][j+1 < height? j+1 : 0] = "";
        //c3
        grid[i+1 < width? i+1 : 0][j] = "";
      }
      if (current == "" && c7 == "lower" && c6 == "" && c5 == "lower") {
        //c7
        grid[i-1 > 0? i-1 : width-1][j] = "lower";
        //c3
        grid[i][j+1 < height? j+1 : 0] = "lower";
      }

    }
  }//done cleaning

  //**********************************//
  //this is where the tile magic happens
  //**********************************//
  function createCliff(newGrid, x, y, w, h, offset, type) {
    var s1 = x-offset[0];
    var s2 = y-offset[1];
    for (var i = 0; i < w; i++) {
      for (var j = 0; j < h; j++) {
        //this is davids code... if it doesn't work its his
        //to fix ;)
        newGrid[s1+i][s2+j] = newGrid[s1+i][s2+j].concat([type + i + j*16]);
      }
    }


  }
  function createGrass(x, y) {

    //if we want to create a tree this is where we would do it.
    //var isTree = prng.nextIntRange(0, 100);
    //its just grass
    //if (isTree <= 80) {
    newGrid[x][y] = newGrid[x][y].concat([79]);
    //}
    //its a tree!
    //else {
      //fancy code for making a tree
    //}

  }

  var n = 0;
  for (var i = 0; i < height; i++) {

    var m = 0;
    for (var j = 0; j < width; j++) {

      if (grid[i][j] != "ocean") {
        //8 1 2
        //7 0 3
        //6 5 4
        var c1 = grid[i][j-1 > 0? j-1 : height-1];
        var c3 = grid[i+1 < width? i+1 : 0][j];
        var c5 = grid[i][j+1 < height? j+1 : 0];
        var c7 = grid[i-1 > 0? i-1 : width-1][j];

        var c2 = grid[i+1 < width? i+1 : 0][j-1 > 0? j-1 : height-1];
        var c4 = grid[i+1 < width? i+1 : 0][j+1 < height? j+1 : 0];
        var c6 = grid[i-1 > 0? i-1 : width-1][j+1 < height? j+1 : 0];
        var c8 = grid[i-1 > 0? i-1 : width-1][j-1 > 0? j-1 : height-1];

        var current = grid[i][j];

        //condition for Cliff8a (concave) - (c1, c8 and c7 are all lower and e isn't)
        if (current == "" && c1 == "lower" && c8 == "lower" && c7 == "lower"  ) {
          //type = 0
          createCliff(newGrid, n, m, 2, 2, [1,1], 0);
        }
        //condition for Cliff8b (convex) - (c1 and c7 are the same as e but 8 is lower)
        else if (current == "" && c1 == "" && c8 == "lower" && c7 == "") {
          //type = 112
          createCliff(newGrid, n, m, 2, 2, [1,1], 112);
        }
        //condition for Cliff1 (north) - (c1 and c8 are lower than e but 7 is the same)
        else if (current == "" && c1 == "lower" && c8 == "lower" && c7 == "") {
          //type = 2
          createCliff(newGrid, n, m, 1, 2, [0,1], 2);
        }
        //condition for Cliff7 (west) - (c7 and c8 are lower than e but 1 is the same)
        else if (current == "" && c1 == "" && c8 == "lower" && c7 == "lower") {
          //type = 32
          createCliff(newGrid, n, m, 2, 1, [1,0], 32);
        }
        else {
          createGrass(n, m);
        }

        //condition for Cliff2a (concave) - (c1, c2 and c3 are all lower than e)
        if (current == "" && c1 == "lower" && c2 == "lower" && c3 == "lower") {
            //type = 4
            createCliff(newGrid, n+1, m, 2, 2, [0,1], 4);
        }
        //condition for Cliff2b (convex) - (c1 and c3 are the same as e but 2 is lower
        else if (current == "" && c1 == "" && c2 == "lower" && c3 == "") {
          //type = 146
          createCliff(newGrid, n+1, m, 2, 2, [0,1], 146);
        }
        //condition for Cliff1 (north) - (c1 and c2 are lower than e but 3 is the same)
        else if (current == "" && c1 == "lower" && c2 == "lower" && c3 == "") {
          //type = 2
          createCliff(newGrid, n+1, m, 1, 2, [0,1], 2);
        }
        //condition for Cliff3 (east) - (c3 and c2 are lower than e but 1 is the same)
        else if (current == "" && c1 == "" && c2 == "lower" && c3 == "lower") {
          //type = 36
          createCliff(newGrid, n+1, m, 2, 1, [0,0], 36);
        }
        else {
          createGrass(n+1, m);
        }


        //condition for Cliff4a (concave) - (c5, c4 and c3 are all lower than e)
        if (current == "" && c5 == "lower" && c4 == "lower" && c3 == "lower") {
          //type = 68
          createCliff(newGrid, n+1, m+1, 2, 3, [0,0], 68);
        }
        //condition for Cliff4b (convex) - (c5 and c3 are the same as e but 4 is lower)
        else if (current == "" && c5 == "" && c4 == "lower" && c3 == "") {
          //type = 146
          createCliff(newGrid, n+1, m+1, 2, 3, [0,0], 146);
        }
        //condition for Cliff5 (south) - (c5 and c4 are lower than e but 3 is the same)
        else if (current == "" && c5 == "lower" && c4 == "lower" && c3 == "") {
          //type = 66
          createCliff(newGrid, n+1, m+1, 1, 2, [0,0], 66);
        }
        //condition for Cliff3 (east) - (c4 and c3 are lower than e but 5 is the same)
        else if (current == "" && c5 == "" && c4 == "lower" && c3 == "lower") {
          //type = 36
          createCliff(newGrid, n+1, m+1, 2, 1, [0,0], 36);
        }
        else {
          createGrass(n+1, m+1);
        }


        //condition for Cliff6a (concave) - (c5, c6 and c7 are all lower than e)
        if (current == "" && c5 == "lower" && c6 == "lower" && c7 == "lower") {
          //type = 64
          createCliff(newGrid, n, m+1, 2, 3, [1,0], 64);
        }
        //condition for Cliff6b (convex) - (c5 and c7 are the same as e but 6 is lower)
        else if (current == "" && c5 == "" && c6 == "lower" && c7 == "") {
          //type = 144
          createCliff(newGrid, n, m+1, 2, 3, [1,0], 144);
        }
        //condition for Cliff5 (north) - (c5 and c6 are lower than e but 7 is the same)
        else if (current == "" && c5 == "lower" && c6 == "lower" && c7 == ""){
          //type = 66
          createCliff(newGrid, n, m+1, 1, 2, [0,0], 66);
        }
        //condition for Cliff7 (west) - (c7 and c6 are lower than e but 5 is the same)
        else if (current == "" && c5 == "" && c6 == "lower" && c7 == "lower") {
          //type = 32
          createCliff(newGrid, n, m+1, 2, 1, [1,0], 32);
        }
        else {
          createGrass(n, m+1);
        }

      }
      else {//if it is an ocean
        //we are expanding every square into four squares. In this case all four are an exact copy
        //*****
        // we don't have a tile for ocean yet
        // so ocean is using the stone tile 10
        newGrid[n][m] = newGrid[n][m].concat([10]);

        newGrid[n][m+1] = newGrid[n][m+1].concat([10]);

        newGrid[n+1][m] = newGrid[n+1][m].concat([10]);

        newGrid[n+1][m+1] = newGrid[n+1][m+1].concat([10]);
      }//end of !Ocean

      m = m + 2;
    }//end of j

    n = n + 2;
  }//end of i
  return newGrid;
}

function makeSections(prng, n, border, dim) {
  var borderPoints = [];
  for (var i = 0; i < n; i ++) {
    var adjustedBorder = border.mul(dim);
    var center = dim.scale(0.5);
    var pi2 = Math.PI * 2.0;
    var theta = (pi2/n) * i;
    var variance = adjustedBorder.scale(prng.nextDouble());
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

function fractalPoints(prng, n, g, a, b) {
  if (n > 0) {
    var initialDir = a.directionTo(b);
    var dist = a.distance(b);
    var gDist = g * dist;
    var c = a.add(b).scale(0.5); // average points to get point in the middle
    var r = (prng.nextDouble() * gDist * 2)  - gDist; //a range from -g to g
    var p = a.directionTo(b).perpendicular().normalize().scale(r);
    var d = c.add(p);
    return fractalPoints(prng, n-1, g, a, d).concat([d]).concat(fractalPoints(prng, n-1, g, d, b));
  }
  return [];
}

function factalizeBorder(prng, n, g, points) {
  var fractalBorder = []
  if (points.length >= 2) {
    // fractalBorder.push(points[0]);
    for (var j = 1; j < points.length; j++) {
      fractalBorder.push(points[j-1]);
      fractalBorder = fractalBorder.concat(fractalPoints(prng, n, g, points[j-1], points[j]));
      fractalBorder.push(points[j]);
    }
  }
  return fractalBorder.concat(fractalPoints(prng, n, g, points[points.length - 1], points[0]));
}

function overlapsOtherRoom(room, rooms) {
  for (var roomIdx in rooms) {
    if (rooms[roomIdx].overlaps(room)){
      return true;
    }
  }
  return false;
}

function makeRooms(prng, dim, n, size, r, buffer){
  var rooms = [];
  var variance = r * size
  var lower = size - variance + buffer;
  var upper = size + variance + buffer;
  for (var j = 0; j < n; j++) {
    var attemptCount = 0;
    do {
      var x = prng.nextIntRange(buffer, dim.x - upper);
      var y = prng.nextIntRange(buffer, dim.y - upper);
      var width = prng.nextIntRange(lower, upper);
      var height = prng.nextIntRange(lower, upper);
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

function generateMapComponents(size, seed) {
  var borderVariance = new Vector2d(0.25, 0.25);

  // it's important to fork the global prng and create a new
  // instance from the map seed here.
  //   that way we can change the map generation algorithm without
  //   it affecting other random things
  var prng = new ParkMillerRNG(seed);

  var sections = factalizeBorder(prng, 6, 0.2, makeSections(prng, 18, borderVariance, size));

  var roomsList = [];
  var pathList = [];
  var rooms = makeRooms(prng, size, 16, 0.08*Math.min(size.x, size.y), 0.5, 10);
  for (var roomIdx in rooms) {
    var room = rooms[roomIdx];
    var roomPoints = [];
    roomPoints.push(new Vector2d(
            room.ul.x + prng.nextIntRange(5, 10) - 10,
            room.ul.y + prng.nextIntRange(5, 10) - 10
          )
        );
    roomPoints.push(new Vector2d(
            room.ul.x + room.width() + prng.nextIntRange(0, 5),
            room.ul.y + prng.nextIntRange(5, 10) - 10
          )
        );
    roomPoints.push(new Vector2d(
            room.ul.x + room.width() + prng.nextIntRange(0, 5),
            room.ul.y + room.height() + prng.nextIntRange(0, 5)
          )
        );
    roomPoints.push(new Vector2d(
            room.ul.x + prng.nextIntRange(5, 10) - 10,
            room.ul.y + room.height() + prng.nextIntRange(0, 5)
          )
        );
    var roomSections = factalizeBorder(prng, 6, 0.2, roomPoints);
    roomsList.push(roomSections);
  }

  for (var j in rooms) {
    var k = prng.nextIntRange(0, rooms.length - 1);

    var pathPoints = fractalPoints(prng, 8, 0.1, rooms[j].center(), rooms[k].center());

    pathList.push(pathPoints);
  }
  return [sections, roomsList, pathList];
}

function generateMap(size, seed) {
  var [sections, roomsList, pathList] = generateMapComponents(size, seed)
  var grid = makeGrid(sections, roomsList, pathList, size.x, size.y);
  return convertGrid(grid, size.x, size.y);
}

