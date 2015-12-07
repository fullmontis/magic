function Area( x1, y1, x2, y2 ) {
    this.isInside = function( x, y ) {
	if( x >= x1 && x<= x2 &&
	    y >= y1 && y <= y2 ) {
		return true;
	    } else {
		return false;
	    }
    };

    this.render = function( context ) {
	context.save();
	context.strokeStyle = "#000";
	context.strokeRect( x1, y1, x2-x1, y2-y1 );
	context.restore();
    };
}

function TriangleArea( xa, ya, xb, yb, xc, yc ) {
    // make point 1 the point with the normal angle
    var x1 = -1, 
	y1 = -1,
	x2 = -1,
	y2 = -1,
	x3 = -1, 
	y3 = -1,
	xu = -1, 
	yu = -1,
	xs = -1,
	ys = -1;
    
    // not a normal triangle
    if( !((xa == xb && ya == yc) ||
	(xa == xc && ya == yb) ||
	(xb == xa && yb == yc) ||
	(xb == xc && yb == ya) ||
	(xc == xb && yc == ya) ||
	(xc == xa && yc == yb))) {
	console.log("point a: ", xa, ya, "point b: ", xb, yb, "point c: ", xc, yc);
	throw "Error: TriangleArea: not a normal triangle";
    }

    var xtemp, ytemp;
    while( x1 == -1 ) {
	if( yb != yc && xb != xc ) {
	    x1 = xa; y1 = ya;
	    if( yb == ya ) {
		x2 = xb; y2 = yb;
		x3 = xc; y3 = yc;
	    } else {
		x2 = xc; y2 = yc;
		x3 = xb; y3 = yb;
	    }
	}

	if( x1 == -1 ) { // rotate
	    xtemp = xa; ytemp = ya;
	    xa = xb; ya = yb;
	    xb = xc; yb = yc;
	    xc = xtemp; yc = ytemp;
	}
    }

    if( x1 < x2 ) {
	xs = x1; xu = x2;
    } else {
	xs = x2; xu = x1;
    }

    if( y1 < y3 ) {
	ys = y1; yu = y3;
    } else {
	ys = y3; yu = y1; 
    }
    
    var m = (x2 - x1)/(y3 - y1);
    var base = 0;
    var invert = 1; 
    if( x1 > x2 ) invert = -1; // needed when the normal angle is not on the y axis
    if( y1 < y3 && invert == 1 ) base = x2 - x1;
    console.log( x1, x2, x3, y1, y2, y3, xs, ys, xu, yu);

    this.isInside = function( xp, yp ) {
	// first check if it is inside the rectangle made by the triangle
	// then check if it is in the half portion covered by the triangle
	if( xp >= xs && xp <= xu &&
	    yp >= ys && yp <= yu &&
	    (xp - xs - base + m * (yp - ys)) * invert <= 0 ) {
	    return true;
	} else {
	    return false;
	}
    };

    this.render = function( context ) {
	context.strokeStyle = "#000";

	context.beginPath();
	context.moveTo( x1, y1 );
	context.lineTo( x2, y2 );
	context.lineTo( x3, y3 );
	context.closePath();

	context.stroke();
    };
}

