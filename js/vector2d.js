"use strict";
function Vector2d(x, y) {
  this.x = x;
  this.y = y;
}

Vector2d.fromScalar = function (scalar) {
  return new Vector2d(scalar, scalar);
};
Vector2d.setupPrototype = function(f) {
  f.prototype.add = function (other) {
    return new this.constructor(this.x + other.x, this.y + other.y);
  };
  f.prototype.sub = function (other) {
    return new this.constructor(this.x - other.x, this.y - other.y);
  };
  f.prototype.mul = function (other) {
    return new this.constructor(this.x * other.x, this.y * other.y);
  };
  f.prototype.div = function (other) {
    return new this.constructor(this.x / other.x, this.y / other.y);
  };
  f.prototype.fmod = function (other) {
    return new this.constructor(this.x % other.x, this.y % other.y);
  };
  f.prototype.mod = function (other) {
    return new this.constructor(mod(this.x, other.x), mod(this.y, other.y));
  };
  f.prototype.neg = function() {
    return new this.constructor(-this.x, -this.y);
  };

  f.prototype.floor = function() {
    return new this.constructor(Math.floor(this.x), Math.floor(this.y));
  };
  f.prototype.ceil = function() {
    return new this.constructor(Math.ceil(this.x), Math.ceil(this.y));
  };

  f.prototype.equal = function (other) {
    if(other === null) {
      return false;
    }
    return (this.x + 0.005 > other.x && this.x - 0.005 < other.x) && (this.y + 0.005 > other.y && this.y - 0.005 < other.y);
  };
  f.prototype.greater = function (other) {
    return (this.x > other.x) && (this.y > other.y);
  };
  f.prototype.less = function (other) {
    return (this.x < other.x) && (this.y < other.y);
  };
  f.prototype.greaterOrEqual = function (other) {
    return (this.x >= other.x) && (this.y >= other.y);
  };
  f.prototype.lessOrEqual = function (other) {
    return (this.x <= other.x) && (this.y <= other.y);
  };

  f.prototype.scale = function (scalar) {
    return new this.constructor(this.x * scalar, this.y * scalar);
  };
  f.prototype.each = function (f, other) {
    return new this.constructor(f(this.x, other.x), f(this.y, other.y));
  };
  f.prototype.min = function (other) {
    return new this.each(Math.min, other);
  };
  f.prototype.max = function (other) {
    return new this.each(Math.max, other);
  };
  f.prototype.reduce = function(f) {
    return f(this.x, this.y);
  };
  f.prototype.sum = function () {
    return this.reduce(function(a, b) { return a + b; } );
  };
  f.prototype.dot = function (other) {
    return this.mul(other).sum();
  };
  f.prototype.magnitude = function () {
    return Math.sqrt(this.dot(this));
  };

  f.prototype.perpendicular = function () {
    return new this.constructor(-this.y, this.x);
  };
  f.prototype.normalize = function () {
    var m = this.magnitude();
    if (m === 0)
    { return new this.constructor(0, 0); }
    else
    { return new this.constructor(this.x / m, this.y / m); }
  };

  f.prototype.clipTo = function(dist) {
    var mag = this.magnitude();
    if (mag > dist) {
      return this.scale(dist / mag);
    } else {
      return this
    }
  };

  f.prototype.distance = function (other) {
    return this.sub(other).magnitude();
  };
  f.prototype.directionTo = function (other) {
    return other.sub(this).normalize();
  };
  f.prototype.eachGridPoint = function(f, to) {
    var diff = to.sub(this);
    for (var x = 0; x < diff.x; x++) {
      for (var y = 0; y < diff.y; y++) {
        var point = this.add(new this.constructor(x, y));
        f(point);
      }
    }
  };
  f.prototype.lookupByDir = function(vectorDict) {
    var vectorDictClone = vectorDict.slice(0);
    vectorDictClone.sort(function(a, b) {
      var thisN = this.normalize();
      var aN = a.key.normalize();
      var bN = b.key.normalize();
      return thisN.dot(aN) - thisN.dot(bN);
    });
    return vectorDictClone[0].value;
  };
};

Vector2d.setupPrototype(Vector2d);
