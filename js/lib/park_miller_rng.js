
function ParkMillerRNG(seed) {
  this.seed = seed;
  this.gen();
}

ParkMillerRNG.prototype.gen = function() {
  return this.seed = (this.seed * 16807) % 2147483647;
};

ParkMillerRNG.prototype.nextDouble = function() {
  return (this.gen() / 2147483647);
};

ParkMillerRNG.prototype.nextInt = function() {
  return this.gen();
};

ParkMillerRNG.prototype.nextIntRange = function(min, max) {
  return Math.round(min + ((max - min) * this.gen() / 2147483647.0));
};

ParkMillerRNG.prototype.choose = function(list) {
  var i;
  i = this.nextIntRange(0, list.length - 1);
  return list[i];
};

// This looks weird because it was generated from coffee script
ParkMillerRNG.prototype.weighted_choose = function(list) {
  var current_weight, next_weight, target_weight, total_weight, value, weight, _i, _j, _len, _len1, _ref, _ref1;
  total_weight = 0;
  for (_i = 0, _len = list.length; _i < _len; _i++) {
    _ref = list[_i], value = _ref[0], weight = _ref[1];
    total_weight += weight;
  }
  target_weight = this.nextIntRange(0, total_weight);
  current_weight = 0;
  for (_j = 0, _len1 = list.length; _j < _len1; _j++) {
    _ref1 = list[_j], value = _ref1[0], weight = _ref1[1];
    next_weight = current_weight + weight;
    if (target_weight <= (weight + current_weight)) {
      return value;
    }
    current_weight = next_weight;
  }
};
