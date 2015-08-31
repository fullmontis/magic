function Animation() {
}

Animation.prototype.show = false;
Animation.prototype.alpha = 1;
Animation.prototype.update = function() {};
Animation.prototype.render = function( context ) {
    context.save();
    context.globalAlpha = this.alpha;
    context.restore();
};
Animation.prototype.reset = function() {
    this.show = false;
    this.alpha = 1;
};
