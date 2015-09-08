"use strict";
function Rect(ul, br) {
    this.ul = ul;
    this.br = br;
}

Rect.create = function(a, b) {
  return new Rect(a.min(b), a.max(b));
}

Rect.prototype.overlaps = function (other) {
  return this.lr.greaterOrEqual(other.ul) && this.ul.less(other.lr);
};
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
