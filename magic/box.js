
function Box( x, y, w, h ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.collidesWith = function( otherBox, offsetx, offsety ) {
	offsetx = offsetx || 0;
	offsety = offsety || 0;
	if( this.x + this.w + offsetx > otherBox.x &&
	    otherBox.x + otherBox.w > this.x + offsetx &&
	    this.y + this.h + offsety > otherBox.y &&
	    otherBox.y + otherBox.h > this.y + offsety ){
		return true;
	    } else {
		return false;
	    }
    };

    this.isInside = function( x, y ) {
	if( this.x <= x &&
	    this.y <= y &&
	    this.x + this.w >= x &&
	    this.y + this.h >= y ){
		return true;
	    } else {
		return false;
	    }
    };

    this.render = function( context, color ) {
	var thisColor = color || "#0f0";
	context.rect( this.x, this.y, this.w, this.h, thisColor, 0.5 );
    };
}
