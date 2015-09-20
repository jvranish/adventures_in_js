var Character = function(aPlayerPos, facingDir) {
	this.playerPos = aPlayerPos;
	this.facingDir = facingDir;
	this.destinationPos = null;
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

Character.prototype.isWalking = function() {
	return (this.destinationPos !== null);
};
