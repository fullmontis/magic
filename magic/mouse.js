// Mouse input

function Mouse( canvas )
{
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;

    this.isDown = {
	left: false,
	right: false,
	middle: false
    };
    this.isClicked = {
	left: false,
	right: false,
	middle: false
    };
    this.isReleased = {
	left: false,
	right: false,
	middle: false
    };

    var xold = 0;
    var yold = 0;
    var lold = 0;
    var mold = 0;
    var rold = 0;

    this.update = function () {
	if (this.isDown.left && !lold) {
	    this.isClicked.left = true;
	} else {
	    this.isClicked.left = false;
	}

	if (this.isDown.middle && !mold) {
	    this.isClicked.middle = true;
	} else {
	    this.isClicked.middle = false;
	}

	if (this.isDown.right && !rold) {
	    this.isClicked.right = true;
	} else {
	    this.isClicked.right = false;
	}

	if (!this.isDown.left && lold) {
	    this.isReleased.left = true;
	} else {
	    this.isReleased.left = false;
	}

	if (!this.isDown.middle && mold) {
	    this.isReleased.middle = true;
	} else {
	    this.isReleased.middle = false;
	}

	if (!this.isDown.right && rold) {
	    this.isReleased.right = true;
	} else {
	    this.isReleased.right = false;
	}

	lold = this.isDown.left;
	mold = this.isDown.middle;
	rold = this.isDown.right;

	this.dx = this.x - xold;
	this.dy = this.y - yold;

	xold = this.x;
	yold = this.y;
    };

    // elements to calculate mouse coordinates when in fullscreen
    var game_ratio = this.canvas.width / this.canvas.height;
    var screen_ratio = screen.width / screen.height;

    var dx = 0;
    var dy = 0;

    if( game_ratio > screen_ratio ) {
	dx = 0;
	dy = (screen.height - screen.width / game_ratio ) / 2;
    } else if ( game_ratio < screen_ratio ) {
	dx = (screen.width - screen.height * game_ratio) / 2;
	dy = 0;
    } else { // same proportions
	dx = 0;
	dy = 0;
    }

    var fullscreenWidth = screen.width - 2 * dx;
    var fullscreenHeight = screen.height - 2 * dy;
    
    this.canvas.addEventListener( 'mousemove', function(e) {
	if( document.mozFullScreen || document.webkitIsFullScreen ) {
	    if( e.pageX > dx && e.pageX < dx + fullscreenWidth ) {
		this.x = ((e.pageX - dx) * this.canvas.width / fullscreenWidth) | 0;
	    }
	    if( e.pageY > dy && e.pageY <= dy + fullscreenHeight ) {
		this.y = ((e.pageY - dy) * this.canvas.height / fullscreenHeight) | 0;
	    }
	} else {
	    this.x = e.pageX - this.canvas.offsetLeft;
	    this.y = e.pageY - this.canvas.offsetTop;
	}
    }.bind(this), false);

    this.canvas.addEventListener( 'mousedown', function(e) {
	e.preventDefault();
	if (e.which == 1) { this.isDown.left = true; }
	if (e.which == 2) { this.isDown.middle = true; }
	if (e.which == 3) { this.isDown.right = true; }
    }.bind(this), false);

    this.canvas.addEventListener( 'mouseup', function(e) {
	e.preventDefault();
	if (e.which == 1) { this.isDown.left = false; }
	if (e.which == 2) { this.isDown.middle = false; }
	if (e.which == 3) { this.isDown.right = false; }
    }.bind(this), false);

}
