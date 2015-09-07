"use strict";
function Vector2d(x,y) {
  this.x = x;
  this.y = y;
}

Vector2d.fromScalar = function (scalar) {
    return new Vector2d(scalar, scalar);
}

Vector2d.prototype = {
  add : function (other) {
    return new Vector2d(this.x + other.x, this.y + other.y);
  },
  sub : function (other) {
    return new Vector2d(this.x - other.x, this.y - other.y);
  },
  mul : function (other) {
    return new Vector2d(this.x * other.x, this.y * other.y);
  },
  div : function (other) {
    return new Vector2d(this.x / other.x, this.y / other.y);
  },
  mod : function (other) {
    return new Vector2d(this.x % other.x, this.y % other.y);
  },
  neg : function() {
    return new Vector2d(-this.x, -this.y);
  },

  upperLeftCorner : function() {
    return new Vector2d(Math.floor(this.x), Math.ceil(this.y));
  },
  bottomRightCorner : function() {
    return new Vector2d(Math.ceil(this.x), Math.floor(this.y));
  },

  equal : function (other) {
    return (this.x === other.x) && (this.y === other.y);
  },
  greater : function (other) {
    return (this.x > other.x) && (this.y > other.y);
  },
  less : function (other) {
    return (this.x < other.x) && (this.y < other.y);
  },
  greaterOrEqual : function (other) {
    return (this.x >= other.x) && (this.y >= other.y);
  },
  lessOrEqual : function (other) {
    return (this.x <= other.x) && (this.y <= other.y);
  },

  scale : function (scalar) {
    return new Vector2d(this.x * scalar, this.y * scalar);
  },
  each : function (f, other) {
    return new Vector2d(f(this.x, other.x), f(this.y, other.y));
  },
  min : function (other) {
    return new this.each(Math.min, other);
  },
  max : function (other) {
    return new this.each(Math.max, other);
  },
  reduce : function(f) {
    return f(this.x, this.y);
  },
  sum : function () {
    return this.reduce(function(a, b) { return a + b; } )
  },
  dot : function (other) {
    return this.mul(other).sum();
  },
  magnitude : function () {
    return Math.sqrt(this.dot(this).sum());
  },

  perpendicular : function () {
    return new Vector2d(-this.y, this.x);
  },
  normalize : function () {
    var m = this.magnitude();
    if (m == 0)
    { return new Vector2d(0, 0); }
    else
    { return new Vector2d(this.x / m, this.y / m); }
  },

  distance : function (other) {
    return this.sub(other).magnitude();
  },
  directionTo : function (other) {
    return other.sub(this).normalize();
  },
  eachGrid : function(f, a, b)
  {
    var diff = b.sub(a);
    for (var x = 0; x < diff.x; x++) {
      for (var y = 0; y < diff.y; y++) {
        var p = a.add(new Vector2d(x, y));
        f(p);
      }
    }
  }
}

