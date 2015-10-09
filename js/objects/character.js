
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
  var dir = this.facingCardinalDirection();
  var action = this.currentAction();
  var sprite_data = sprites_data["white-mage"][action];
  var animationSpeed = sprite_data.base_framerate + (sprite_data.motion_framerate_factor * this.walkSpeed);
  // TODO this should be based on the _start time_ of the animation
  var currentFrame = Math.round(t * animationSpeed) % sprite_data.num_frames;
  var frameName = action + "/white-mage." + action + "." + dir + "." + (new Array(4 - currentFrame.toString().length + 1).join("0") + currentFrame.toString()) + ".png";
  return { "frameName": frameName,
           "spriteSheet": white_mage_spritesheet,
           "centerOffset": sprite_data.center_offset};
};
