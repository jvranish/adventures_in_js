"use strict";
function Rect(ul, br) {
    this.ul = ul;
    this.br = br;
}

Rect.create = function(a, b) {
  return new Rect(a.min(b), a.max(b));
};

Rect.prototype.overlaps = function (other) {
  return this.br.greaterOrEqual(other.ul) && this.ul.less(other.br);
};

Rect.prototype.enlarge = function (other) {
  return new Rect(this.ul.sub(Vector2d.fromScalar(other)),
                  this.br.add(Vector2d.fromScalar(other)))
}

Rect.prototype.outerCorners = function () {
  return new Rect(this.ul.floor(), this.br.ceil());
};
Rect.prototype.innerCorners = function () {
  return new Rect(this.ul.ceil(), this.br.floor());
};
Rect.prototype.eachGridPoint = function(f) {
  this.ul.eachGridPoint(f, this.br);
};
Rect.prototype.map = function(f) {
  return new Rect(f(this.ul), f(this.br));
};

Rect.prototype.width = function() {
  return Math.abs(this.ul.x - this.br.x);
};

Rect.prototype.height = function() {
  return Math.abs(this.ul.y - this.br.y);
};

Rect.prototype.center = function() {
  return this.ul.add(this.br).scale(0.5);
}