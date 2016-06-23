function Animation( image, nx, ny ) {
    this.image = image;
    this.nx = nx;
    this.ny = ny;
    this.frameWidth = (this.image.getWidth() / this.nx) | 0;
    this.frameHeight = (this.image.getHeight() / this.ny) | 0;

    if( this.image.getWidth() != this.frameWidth * this.nx ) {
	throw("Animation: incorrect number of X frames");
    }
    if( this.image.getHeight() != this.frameHeight * this.ny ) {
	throw("Animation: incorrect number of Y frames");
    }

    this.hash = {};

    for( var j=0; j < this.ny; j++ ) {
	for( var i=0; i < this.nx; i++ ) {
	    this.hash[i + j*this.nx] = {
		x: this.frameWidth * i,
		y: this.frameHeight * j
	    };
	}
    }
}

Animation.prototype.show = false;
Animation.prototype.alpha = 1;
Animation.prototype.update = function() {};
Animation.prototype.render = function( context, frame, x, y ) {
    if( this.show ) {
	context.save();
	context.globalAlpha = this.alpha;
	context.drawImage( this.image,
			   this.hash[frame].x,
			   this.hash[frame].y,
			   this.frameWidth,
			   this.frameHeight,
			   x, y,
			   this.frameWidth, this.frameHeight );
	context.restore();
    }
};
Animation.prototype.reset = function() {
    this.show = false;
    this.alpha = 1;
};
