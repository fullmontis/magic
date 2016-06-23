// Mouse input

function Mouse( canvas ) {

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

    this.canvas.addEventListener( 'mousemove', function(e){
	this.x = e.pageX - this.canvas.offsetLeft;
	this.y = e.pageY - this.canvas.offsetTop;
    }.bind(this), false);

    this.canvas.addEventListener( 'mousedown', function(e){
	e.preventDefault();
	if (e.which == 1) { this.isDown.left = true; }
	if (e.which == 2) { this.isDown.middle = true; }
	if (e.which == 3) { this.isDown.right = true; }
    }.bind(this), false);

    this.canvas.addEventListener( 'mouseup', function(e){
	e.preventDefault();
	if (e.which == 1) { this.isDown.left = false; }
	if (e.which == 2) { this.isDown.middle = false; }
	if (e.which == 3) { this.isDown.right = false; }
    }.bind(this), false);

}
