"use strict";

//**********************************************
//  New code for converting
// ******************************************
function convertGrid(grid, width, height, seed) {
  var prng = new ParkMillerRNG(seed);
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
      //clean cliffs
      if (current == "" && checkLower(c5) && c4 == "" && checkLower(c3)) {
        //c5
        grid[i][j+1 < height? j+1 : 0] = "";
        //c3
        grid[i+1 < width? i+1 : 0][j] = "";
      }
      if (current == "" && checkLower(c7) && c6 == "" && checkLower(c5)) {
        //c7
        grid[i-1 > 0? i-1 : width-1][j] = "";
        //c3
        grid[i][j+1 < height? j+1 : 0] = "";
      }
      //clean coastline
      if (current == "ocean" && c5 == "coast" && c4 == "ocean" && c3 == "coast") {
        //c5
        grid[i][j+1 < height? j+1 : 0] = "ocean";
        //c3
        grid[i+1 < width? i+1 : 0][j] = "ocean";
      }
      if (current == "ocean" && c7 == "coast" && c6 == "ocean" && c5 == "coast") {
        //c7
        grid[i-1 > 0? i-1 : width-1][j] = "ocean";
        //c3
        grid[i][j+1 < height? j+1 : 0] = "ocean";
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
        newGrid[s1+i][s2+j] = [type + i + j*16].concat(newGrid[s1+i][s2+j]);
      }
    }


  } 
  function createTree(newGrid, x, y, w, h, offset, type) {
    var s1 = x-offset[0];
    var s2 = y-offset[1];
    //check to make sure we won't display over anything else
    var pass = true;
    for (var i = 0; i < w; i++) {
      for (var j = 0; j < h; j++) {
        if (newGrid[s1+i][s2+j].length > 1 || newGrid[s1+i][s2+j].indexOf(79) < 0) {//|| newGrid[s1+i][s2+j].indexOf(10) != -1) { 
          pass = false;
          
        }
        else
        {
          
          console.log(newGrid[s1+i][s2+j].length);
        }
      }
    }
    if (pass) {
      for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
          newGrid[s1+i][s2+j] = [type + i + j*16].concat(newGrid[s1+i][s2+j]);
        }
      }
    }


  }
  function createGrass(x, y, current) {
    var tree = null; 
    //if we want to create a tree this is where we would do it.
    //var isTree = prng.nextIntRange(0, 100);
    //its just grass
    //if (isTree <= 80) {
    
    //newGrid[x][y] = newGrid[x][y].splice(0, 0, [79]);
    if (current == "lower") {
      if (newGrid[x][y].indexOf(79) < 0) {
        newGrid[x][y] = newGrid[x][y].concat([79]);
        if (Math.floor((prng.nextDouble() * 500) + 1) < 5) {
          tree = [x,y];
        }
      }
    }
    else if (current == "") {
      newGrid[x][y] = newGrid[x][y].concat([10]);
    }
    else if (current == "coast"){
      newGrid[x][y] = newGrid[x][y].concat([79]);
    }
    else {
      //newGrid[x][y] = newGrid[x][y].concat([79]);
    }
    
    
    //}
    //its a tree!
    //else {
      //fancy code for making a tree
    //}
    //if (tree != null) {
      //console.log(tree) 
    //}
    return tree;
  }
  function checkLower(c) {
    if (c == "lower" ||  c == "coast" || c == "ocean") {
      return true//(c == "lower" ||  c == "coast")
    }
    else {
      return false
    }
  }
  function checkShore(c) {
    if (c == "ocean") {
      return true;
    }
    else {
      return false;
    }
  }
  
  var n = 0;
  var trees = [];
  var tree;
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
        tree = createGrass(n, m, current)
        if (tree != null) {
          trees.push(tree);
        }

        //**********************************************************
        //     Cliff Conversion
        //**********************************************************

        //condition for Cliff8a (concave) - (c1, c8 and c7 are all lower and e isn't)
        if (current == "" && checkLower(c1) && checkLower(c8) && checkLower(c7)  ) {
          //type = 0
          createCliff(newGrid, n, m, 2, 2, [1,1], 0);
        }
        //condition for Cliff8b (convex) - (c1 and c7 are the same as e but 8 is lower)
        else if (current == "" && c1 == "" && checkLower(c8) && c7 == "") {
          //type = 112
          createCliff(newGrid, n, m, 2, 2, [1,1], 112);
        }
        //condition for Cliff1 (north) - (c1 and c8 are lower than e but 7 is the same)
        else if (current == "" && checkLower(c1) && checkLower(c8) && c7 == "") {
          //type = 2
          createCliff(newGrid, n, m, 1, 2, [0,1], 2);
        }
        //condition for Cliff7 (west) - (c7 and c8 are lower than e but 1 is the same)
        else if (current == "" && c1 == "" && checkLower(c8) && checkLower(c7)) {
          //type = 32
          createCliff(newGrid, n, m, 2, 1, [1,0], 32);
        }
        else {
          tree = createGrass(n, m, current)
          //console.log(tree)
          if (tree != null) {
            trees.push(tree);
          }
        }

        //condition for Cliff2a (concave) - (c1, c2 and c3 are all lower than e)
        if (current == "" && checkLower(c1) && checkLower(c2) && checkLower(c3)) {
            //type = 4
            createCliff(newGrid, n+1, m, 2, 2, [0,1], 4);
        }
        //condition for Cliff2b (convex) - (c1 and c3 are the same as e but 2 is lower
        else if (current == "" && c1 == "" && checkLower(c2) && c3 == "") {
          //type = 146
          createCliff(newGrid, n+1, m, 2, 2, [0,1], 114);
        }
        //condition for Cliff1 (north) - (c1 and c2 are lower than e but 3 is the same)
        else if (current == "" && checkLower(c1) && checkLower(c2) && c3 == "") {
          //type = 2
          createCliff(newGrid, n+1, m, 1, 2, [0,1], 2);
        }
        //condition for Cliff3 (east) - (c3 and c2 are lower than e but 1 is the same)
        else if (current == "" && c1 == "" && checkLower(c2) && checkLower(c3)) {
          //type = 36
          createCliff(newGrid, n+1, m, 2, 1, [0,0], 36);
        }
        else {
          tree = createGrass(n+1, m, current)
          if (tree != null) {
            trees.push(tree);
          }
        }


        //condition for Cliff4a (concave) - (c5, c4 and c3 are all lower than e)
        if (current == "" && checkLower(c5) && checkLower(c4) && checkLower(c3)) {
          //type = 68
          createCliff(newGrid, n+1, m+1, 2, 3, [0,0], 68);
        }
        //condition for Cliff4b (convex) - (c5 and c3 are the same as e but 4 is lower)
        else if (current == "" && c5 == "" && checkLower(c4) && c3 == "") {
          //type = 146
          createCliff(newGrid, n+1, m+1, 2, 3, [0,0], 56);
        }
        //condition for Cliff5 (south) - (c5 and c4 are lower than e but 3 is the same)
        else if (current == "" && checkLower(c5) && checkLower(c4) && c3 == "") {
          //type = 66
          createCliff(newGrid, n+1, m+1, 1, 3, [0,0], 66);
        }
        //condition for Cliff3 (east) - (c4 and c3 are lower than e but 5 is the same)
        else if (current == "" && c5 == "" && checkLower(c4) && checkLower(c3)) {
          //type = 36
          createCliff(newGrid, n+1, m+1, 2, 1, [0,0], 36);
        }
        else {
          tree = createGrass(n+1, m+1, current)
          if (tree != null) {
            trees.push(tree);
          }
        }


        //condition for Cliff6a (concave) - (c5, c6 and c7 are all lower than e)
        if (current == "" && checkLower(c5) && checkLower(c6) && checkLower(c7)) {
          //type = 64
          createCliff(newGrid, n, m+1, 2, 3, [1,0], 64);
        }
        //condition for Cliff6b (convex) - (c5 and c7 are the same as e but 6 is lower)
        else if (current == "" && c5 == "" && checkLower(c6) && c7 == "") {
          //type = 144
          createCliff(newGrid, n, m+1, 2, 3, [1,0], 54);
        }
        //condition for Cliff5 (south) - (c5 and c6 are lower than e but 7 is the same)
        else if (current == "" && checkLower(c5) && checkLower(c6) && c7 == ""){
          //type = 66
          createCliff(newGrid, n, m+1, 1, 3, [0,0], 66);
        }
        //condition for Cliff7 (west) - (c7 and c6 are lower than e but 5 is the same)
        else if (current == "" && c5 == "" && checkLower(c6) && checkLower(c7)) {
          //type = 32
          createCliff(newGrid, n, m+1, 2, 1, [1,0], 32);
        }
        else {
          tree = createGrass(n, m+1, current)
          if (tree != null) {
            trees.push(tree);
          }
        }
      //********************************************//
      // end of cliffs
      //********************************************//
      
      //**********************************************************
      //     Coast Conversion
      //**********************************************************
        
        //condition for Coast4a (concave) - (c1, c8 and c7 are all lower and e isn't)
        if (current == "coast" && checkShore(c1) && checkShore(c8) && checkShore(c7)  ) {
          //type = 0
          createCliff(newGrid, n, m, 1, 1, [0,0], 342);//341
        }
        //condition for Coast4b (convex) - (c1 and c7 are the same as e but 8 is lower)
        else if (current == "coast" && c1 == "coast" && checkShore(c8) && c7 == "coast") {
          //type = 112
          createCliff(newGrid, n, m, 1, 1, [0,0], 359);
        }
        //condition for Coast5 (south) - (c1 and c8 are lower than e but 7 is the same)
        else if (current == "coast" && checkShore(c1) && checkShore(c8) && c7 == "coast") {
          //type = 2
          createCliff(newGrid, n, m, 1, 1, [0,0], 340);
        }
        //condition for Coast3 (east) - (c7 and c8 are lower than e but 1 is the same)
        else if (current == "coast" && c1 == "coast" && checkShore(c8) && checkShore(c7)) {
          //type = 32
          createCliff(newGrid, n, m, 1, 1, [0,0], 325);
        }
        else {
          createGrass(n, m, current)
          
        }

        //condition for Coast6a (concave) - (c1, c2 and c3 are all lower than e)
        if (current == "coast" && checkShore(c1) && checkShore(c2) && checkShore(c3)) {
            //type = 4
            createCliff(newGrid, n+1, m, 1, 1, [0,0], 343);//339
        }
        //condition for Coast6b (convex) - (c1 and c3 are the same as e but 2 is lower
        else if (current == "coast" && c1 == "coast" && checkShore(c2) && c3 == "coast") {
          //type = 146
          createCliff(newGrid, n+1, m, 1, 1, [0,0], 358);
        }
        //condition for Coast5 (south) - (c1 and c2 are lower than e but 3 is the same)
        else if (current == "coast" && checkShore(c1) && checkShore(c2) && c3 == "coast") {
          //type = 2
          createCliff(newGrid, n+1, m, 1, 1, [0,0], 340);
        }
        //condition for Coast7 (west) - (c3 and c2 are lower than e but 1 is the same)
        else if (current == "coast" && c1 == "coast" && checkShore(c2) && checkShore(c3)) {
          //type = 36
          createCliff(newGrid, n+1, m, 1, 1, [0,0], 323);
        }
        else {
          createGrass(n+1, m, current)
        }


        //condition for Coast8a (concave) - (c5, c4 and c3 are all lower than e)
        if (current == "coast" && checkShore(c5) && checkShore(c4) && checkShore(c3)) {
          //type = 68
          createCliff(newGrid, n+1, m+1, 1, 1, [0,0], 307);//307
        }
        //condition for Coast8b (convex) - (c5 and c3 are the same as e but 4 is lower)
        else if (current == "coast" && c5 == "coast" && checkShore(c4) && c3 == "coast") {
          //type = 146
          createCliff(newGrid, n+1, m+1, 1, 1, [0,0], 342);
        }
        //condition for Coast1 (north) - (c5 and c4 are lower than e but 3 is the same)
        else if (current == "coast" && checkShore(c5) && checkShore(c4) && c3 == "coast") {
          //type = 66
          createCliff(newGrid, n+1, m+1, 1, 1, [0,0], 308);
        }
        //condition for Coast7 (west) - (c4 and c3 are lower than e but 5 is the same)
        else if (current == "coast" && c5 == "coast" && checkShore(c4) && checkShore(c3)) {
          //type = 36
          createCliff(newGrid, n+1, m+1, 1, 1, [0,0], 323);
        }
        else {
          createGrass(n+1, m+1, current)
        }


        //condition for Coast2a (concave) - (c5, c6 and c7 are all lower than e)
        if (current == "coast" && checkShore(c5) && checkShore(c6) && checkShore(c7)) {
          //type = 64
          createCliff(newGrid, n, m+1, 1, 1, [0,0], 343);//309
        }
        //condition for Coast2b (convex) - (c5 and c7 are the same as e but 6 is lower)
        else if (current == "coast" && c5 == "coast" && checkShore(c6) && c7 == "coast") {
          //type = 144
          createCliff(newGrid, n, m+1, 1, 1, [0,0], 343);
        }
        //condition for Coast1 (north) - (c5 and c6 are lower than e but 7 is the same)
        else if (current == "coast" && checkShore(c5) && checkShore(c6) && c7 == "coast"){
          //type = 66
          createCliff(newGrid, n, m+1, 1, 1, [0,0], 308);
        }
        //condition for Coast3 (east) - (c7 and c6 are lower than e but 5 is the same)
        else if (current == "coast" && c5 == "coast" && checkShore(c6) && checkShore(c7)) {
          //type = 32
          createCliff(newGrid, n, m+1, 1, 1, [0,0], 325);
        }
        else {
          createGrass(n, m+1, current)
        }
        //********************************************//
        //end of coast conversion
        //********************************************//
      }
      else {//if it is an ocean
        //we are expanding every square into four squares. In this case all four are an exact copy
        //*****
        // we don't have a tile for ocean yet
        // so ocean is using the stone tile 10
        newGrid[n][m] = newGrid[n][m].concat([324]);

        newGrid[n][m+1] = newGrid[n][m+1].concat([324]);

        newGrid[n+1][m] = newGrid[n+1][m].concat([324]);

        newGrid[n+1][m+1] = newGrid[n+1][m+1].concat([324]);
      }//end of !Ocean

      m = m + 2;
    }//end of j

    n = n + 2;
  }//end of i
  console.log(trees.length)
  //loop through trees, make trees, check for anything underneath (cliff... tree)
  for (var i = 0; i < trees.length; i++) {
    //if (trees[i].length > 0) {
      createTree(newGrid, trees[i][0], trees[i][1], 3, 4, [0,0], 196)
    //}
  }
  
  
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

// clipped from wikipedia example and then adapted and sanified:
//  https://en.wikipedia.org/wiki/Midpoint_circle_algorithm#JavaScript
function drawCircle(center, radius, plot){
  var x = radius;
  var y = 0;
  var decisionOver2 = 1 - x;   // Decision criterion divided by 2 evaluated at x=r, y=0

  while(x >= y){
    lineAlgorithmOversampled(center, new Vector2d( x + center.x,  y + center.y), plot);
    lineAlgorithmOversampled(center, new Vector2d( y + center.x,  x + center.y), plot);
    lineAlgorithmOversampled(center, new Vector2d(-x + center.x,  y + center.y), plot);
    lineAlgorithmOversampled(center, new Vector2d(-y + center.x,  x + center.y), plot);
    lineAlgorithmOversampled(center, new Vector2d(-x + center.x, -y + center.y), plot);
    lineAlgorithmOversampled(center, new Vector2d(-y + center.x, -x + center.y), plot);
    lineAlgorithmOversampled(center, new Vector2d( x + center.x, -y + center.y), plot);
    lineAlgorithmOversampled(center, new Vector2d( y + center.x, -x + center.y), plot);
    y++;
    if (decisionOver2<=0){
      decisionOver2 += 2 * y + 1;   // Change in decision criterion for y -> y+1
    }else{
      x--;
      decisionOver2 += 2 * (y - x) + 1;   // Change for y -> y+1, x -> x-1
    }
  }
}

function drawThickLine(a, b, radius, plot)
{
  var fa = a.floor();
  var fb = b.floor();

  drawCircle(fa, radius, plot);
  drawGridLine(fa, fb, plot);

  var displacement = b.sub(a);
  var dist = displacement.magnitude();
  if (dist > 0) {
    var dir = displacement.scale(1.0/dist);
    var perp = dir.perpendicular();
    var aStart = a.sub(perp.scale(radius));
    var aEnd = a.add(perp.scale(radius));

    lineAlgorithmOversampled(aStart, aEnd, function(pStart){
      lineAlgorithmOversampled(pStart, pStart.add(displacement), plot);
    });

    drawCircle(fb, radius, plot);
  }
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

function lineAlgorithmOversampled(a, b, plot)
{
  var delta = b.sub(a);
  var numberOfSteps = delta.abs().sum();
  if (numberOfSteps == 0) {
    plot(a);
  }
  else {
    var step = delta.scale(1.0/numberOfSteps);

    for (var i = 0; i < numberOfSteps; i ++) {
      plot(a.add(step.scale(i)).floor());
    }
  }
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

  //room
  if (RoomPoints.length > 0) {
    for (var r in RoomPoints) {
      var room = RoomPoints[r]
      if (room.length > 0) {
        var lastRoomPoint = room[room.length - 1];
        //lastPathPoint
        for (var p in room) {
          drawThickLine(lastRoomPoint, room[p], 2, plotLower);
          lastRoomPoint = room[p];
          //grid[p.x][p.y] = "coast";
        }
      }
    }
  }
  if (pathPoints.length > 0) {
    for (var pa in pathPoints) {
      var path = pathPoints[pa]
      if (path.length > 0) {
        fillLower(grid, width, height, path[0].floor());
        fillLower(grid, width, height, path[path.length-1].floor());
      }
    }
  }


  //Path
  var pathRadius = Math.max(Math.min(width/100, height/100), 1);
  if (pathPoints.length > 0) {
    for (var pa in pathPoints) {
      var path = pathPoints[pa]
      if (path.length > 0) {
        var lastPathPoint = path[0];
        //lastPathPoint
        for (var p in path) {
          if (p > 0) {
            drawThickLine(lastPathPoint, path[p], pathRadius, plotLower);
          }
          lastPathPoint = path[p];
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
  var count = 0;
  var process_next = searchSurroundingSpace(g, 1, 1, width, height);
  do {
    var open = process_next;
    process_next = [];
    while (open.length != 0) {
      var nextSpace = open.pop();
      if  (g[nextSpace[0]][nextSpace[1]] == "")
      {
        g[nextSpace[0]][nextSpace[1]] = "ocean";
        process_next = process_next.concat(searchSurroundingSpace(g, nextSpace[0], nextSpace[1], width, height));
      }
      count = count + 1;
    }
  } while(process_next.length != 0);
}

function fillLower(g, width, height, start) {

  var count = 0;
  var process_next = searchSurroundingSpace(g, start.x, start.y, width, height);
  do {
    var open = process_next;
    process_next = [];
    while (open.length != 0) {
      var nextSpace = open.pop();
      if  (g[nextSpace[0]][nextSpace[1]] == "")
      {
        g[nextSpace[0]][nextSpace[1]] = "lower";
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

    var pathPoints = [rooms[j].center()].concat(fractalPoints(prng, 5, 0.1, rooms[j].center(), rooms[k].center())).concat([rooms[k].center()]);

    pathList.push(pathPoints);
  }
  return [sections, roomsList, pathList];
}

function findStartingPosition(grid, size, predicate) {
  var dir = new Vector2d(1, 0);
  var w = Math.min(size.x, size.y) - 1;
  var search_length = w * w;
  var segment_length = 1;
  var cells_passed = 0;
  var currentPos = size.scale(0.5);
  for (var i = 0; i < search_length; i++ ) {
    if (predicate(currentPos)) {
      break;
    }
    cells_passed++;
    currentPos = currentPos.add(dir);
    if (cells_passed == segment_length) {
      cells_passed = 0;
      dir = dir.perpendicular();
      if (dir.y == 0) { segment_length++; }
    }
  }
  return currentPos;
}

function generateMap(size, seed) {
  var [sections, roomsList, pathList] = generateMapComponents(size, seed)
  var grid = makeGrid(sections, roomsList, pathList, size.x, size.y);
  var convertedGrid = convertGrid(grid, size.x, size.y, seed);
  var startingPos = findStartingPosition(convertedGrid, size.scale(2), function(p) {
    return convertedGrid[p.x][p.y][0] == 79;
  });
  return [convertedGrid, startingPos];
}

