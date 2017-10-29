function BitmapFont( bitmap, fontChars, fontWidth, fontHeight, fontSpace, fontBottom ) {
    this.bitmap = bitmap;
    this.fontChars = fontChars;
    this.fontWidth = fontWidth;
    this.fontHeight = fontHeight;
    this.fontSpace = fontSpace;
    this.fontBottom = fontBottom; // number of pixels from the bottom of the front 
                                  // on which we have the baseline
    
    // Some check to see that the input data is right
    
    if( this.bitmap.width % (this.fontWidth + this.fontSpace) != 0 ) { // length is not right!
	throw("Font: Error: font width and bitmap size don't match!");
    }

    // Here we hash the font so that rendering is faster

    this.hash = {};
    var nCharsInLine = this.bitmap.width / (this.fontWidth + this.fontSpace);
    var x = 0;
    var y = 0;
    for( var i=0; i < this.fontChars.length; i++ ) {
	x = i % nCharsInLine;
	y = (i / nCharsInLine) | 0;
	this.hash[this.fontChars.charCodeAt(i)] = [ 
	    x * (this.fontWidth  + this.fontSpace) + this.fontSpace,
	    y * (this.fontHeight + this.fontSpace) + this.fontSpace
	];
    }
    
    this.render = function( context, string, x, y, scale, anchorX, anchorY ) {
	scale = scale || 1;

	// anchor = 0 for left/top align
	// anchor = 1 for right/bottom align
	anchorX = anchorX || 0; 
	anchorY = anchorY || 0;
	
	var stringPixelLength = this.stringPixelWidth( string );

	x = x - (anchorX * stringPixelLength * scale) | 0;
	y = y - (anchorY * this.fontHeight * scale) | 0;

	for( var i=0; i < string.length; i++ ) {
	    if( string[i] != ' ' ) { // no need to waste time rendering spaces :D
		context.drawImage( this.bitmap, 
				   this.hash[string.charCodeAt(i)][0], 
				   this.hash[string.charCodeAt(i)][1],
				   this.fontWidth, this.fontHeight,
				   x + i * (this.fontWidth + this.fontSpace) * scale, 
				   y - this.fontBottom * scale,
				   this.fontWidth * scale, this.fontHeight * scale );
	    }
	}
    };

    this.stringPixelWidth = function( string ) {
	return string.length * (this.fontWidth + this.fontSpace) - this.fontSpace;
    };
}

function fillTextWrap( context, text, x, y, w, lineHeight, nchars )
{   
    if( nchars == undefined || nchars > text.length ) nchars = text.length;
    var lines = getTextLines( context, text, w );
    var line = "";
    var align = context.textAlign;
    context.textAlign = "left";
    for( var i=0; i<lines.length; i++ ) {
	var dx = 0;
	if( align == "center" ) {
	    dx = -context.measureText(lines[i]).width/2;
	} else {
	    dx = 0;
	}
	nchars -= lines[i].length;
	if( nchars >= 0 ) {
            context.fillText( lines[i], x + dx, y + i*lineHeight );
	} else {
	    context.fillText( lines[i].substr(0, lines[i].length+nchars ), x + dx, y + i*lineHeight );
            break;
	}
    }
    context.textAlign = align;
}

function getTextLines( context, text, width )
{
    var words = text.split(' ');
    var line = "";
    var lines = [];
    for( var i=0; i<words.length; i++ ) {
	if( context.measureText(line + words[i]).width < width ) {
	    line += words[i] + " ";
	} else {
	    lines.push(line);
	    line = words[i] + " ";
	}
    }
    lines.push(line);
    return lines;
}
