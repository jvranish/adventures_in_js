
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
  this.action = { "type": "paused" }
};



Character.rehydrate = function(obj) {
  Vector2d.rehydrate(obj.playerPos);
  Vector2d.rehydrate(obj.facingDir);
  if (obj.destinationPos !== null) {
    Vector2d.rehydrate(obj.destinationPos);
  }
  obj.__proto__ = Character.prototype;
  return obj;
}

Character.prototype.pause = function() {
  this.action = { "type": "paused" };
}

Character.prototype.walkTo = function(dest) {
  if (!this.playerPos.equal(dest)) {
    this.facingDir = this.playerPos.directionTo(dest);
    this.action = {
      "type": "walking",
      "destinationPos": dest,
      "walkSpeed": 100.0
    };
  }
}


Character.prototype.updateWalk = function(dt, map, walkAction) {
  var maxTravelDist = walkAction.walkSpeed * dt;
  if (walkAction.destinationPos)
  {
    if (this.playerPos.equal(walkAction.destinationPos)) {
      this.pause();
    }
    else {
      var displacement = walkAction
        .destinationPos
        .sub(this.playerPos);
      var moveAmount = displacement.clipTo(maxTravelDist);
      var newPos = this.playerPos.add(moveAmount);
      if (map.isWalkable(newPos)) {
        this.playerPos = this.playerPos.add(moveAmount);
      } else {
        this.pause();
      }
    }
  }
}

Character.prototype.update = function(dt, map) {
  switch (this.action.type) {
    case "walking":
      this.updateWalk(dt, map, this.action);
      break;
    default:
    case "pause":
      break;
  }
}

Character.prototype.isWalking = function() {
  return (this.action.type === "walking");
};

Character.prototype.facingCardinalDirection = function() {
  return this.facingDir.lookupByDir(cardinalDirections);
};

Character.prototype.currentSprite = function(t, frameOffsets) {
  var dir = this.facingCardinalDirection();
  var action = this.action.type;
  var sprite_data = sprites_data["black-mage"][action];
  var animationSpeedasdf = 100.0;
  if (action === "walking") {
    animationSpeedasdf = this.action.walkSpeed;
  }
  var animationSpeed = sprite_data.base_framerate + (sprite_data.motion_framerate_factor * animationSpeedasdf);
  // TODO this should be based on the _start time_ of the animation
  var currentFrame = Math.round(t * animationSpeed) % sprite_data.num_frames;
  var frameOffset = frameOffsets["black-mage"][action][dir][currentFrame];
  // var frameName = action + "/white-mage." + action + "." + dir + "." + (new Array(4 - currentFrame.toString().length + 1).join("0") + currentFrame.toString()) + ".png";
  return { "frameOffset": frameOffset,
           // "spriteSheet": white_mage_spritesheet,
           "centerOffset": sprite_data.center_offset};
};
