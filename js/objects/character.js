
var cardinalDirections = [
  {key: new Vector2d(0,  -1), value: "n"},
  {key: new Vector2d(1,  -1), value: "ne"},
  {key: new Vector2d(1,   0), value: "e"},
  {key: new Vector2d(1,   1), value: "se"},
  {key: new Vector2d(0,   1), value: "s"},
  {key: new Vector2d(-1,  1), value: "sw"},
  {key: new Vector2d(-1,  0), value: "w"},
  {key: new Vector2d(-1, -1), value: "nw"},
];


var Character = function(aPlayerPos, facingDir) {
  this.playerPos = aPlayerPos;
  this.facingDir = facingDir;
  this.destinationPos = null;
  this.walkSpeed = 100.0;
};

Character.prototype.isWalking = function() {
  return (this.destinationPos !== null);
};

Character.prototype.setDestination = function(dest) {
  if (!this.playerPos.equal(dest)) {
    this.facingDir = this.playerPos.directionTo(dest);
    this.destinationPos = dest;
  }
};

Character.prototype.facingCardinalDirection = function() {
  return this.facingDir.lookupByDir(cardinalDirections);
};

Character.prototype.currentAction = function() {
  if (this.destinationPos) {
    return "walking";
  } else {
    return "paused";
  }
}

Character.prototype.currentSprite = function(t) {
  var animationSpeeds = { walking: this.walkSpeed/12,
                          paused: 4};
  var dir = this.facingCardinalDirection();
  var action = this.currentAction();
  var frames = sprites_data["black-mage"][action][dir];
  var animationSpeed = animationSpeeds[action];
  var currentFrame = Math.round(t * animationSpeed) % frames.length;
  var imgId = sprites_data["black-mage"][action][dir][currentFrame];
  return document.getElementById(imgId);
};
