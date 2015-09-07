"use strict";
function Rect(ul, br) {
    this.ul = ul;
    this.br = rb;
}

Rect.create = function(a, b) {
  return new Rect(a.min(b), a.max(b));
}

Rect.prototype = {
  overlaps : function (other) {
    return this.lr.greaterOrEqual(other.ul) && this.ul.less(other.lr);
  }
  outerCorners : function () {
    return new Rect(this.ul.upperLeftCorner(), this.br.bottomRightCorner());
  }
  innerCorners : function () {
    return new Rect(this.ul.bottomRightCorner(), this.br.upperLeftCorner());
  }
}