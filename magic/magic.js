// MagicEngine: an HTML5 framework for rapid prototyping

"use strict";

window.onload = function () { window.focus(); };
window.onclick = function () { window.focus(); };
window.focused = false;
window.onblur = function() { this.focused = false; };
window.onfocus = function() { this.focused = true; };

function Magic( width, height, parentId, startState, lockMouse )
{
    var _this = this; // used for reference in objects, ugly as death, must remove
    var CANVAS_ID = "magic";

    // Find useable audio extensions for the browser
    this.audioCodec = (function() {
	var audio = document.createElement("audio");
	var canplayogg = (typeof audio.canPlayType === "function" && 
			  audio.canPlayType("audio/ogg") !== "");
	if (canplayogg) {
            return "ogg";
	} else {
            return "m4a";
	}
    }());

    // The main canvas element on which we are going to operate
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.id = CANVAS_ID;
    
    this.canvas.goFullScreen =
	this.canvas.requestFullScreen ||
	this.canvas.webkitRequestFullScreen ||
	this.canvas.mozRequestFullScreen;

    document.getElementById(parentId).appendChild(this.canvas);
    this.canvas.oncontextmenu = function() { return false; };

    // fullscreen button
    this.fullButton = document.createElement('button');
    this.fullButton.innerHTML = "Go Fullscreen";
    this.fullButton.id = "test";
    this.fullButton.addEventListener('click', function(){
	document.getElementById(CANVAS_ID).goFullScreen();
    });
    document.getElementById(parentId).appendChild(this.fullButton);

    // mouse pointer locking
 
    if( lockMouse ) {
	this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
            this.canvas.mozRequestPointerLock ||
            this.canvas.webkitRequestPointerLock;

	document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock;
	
	this.canvas.onclick = function() {
	    this.canvas.requestPointerLock();
	}.bind(this);
    }

    this.context = this.canvas.getContext('2d');
    this.context.font = "30px Arial";
    
    // Disable image filtering, use nearest neighbour
    this.context.imageSmoothingEnabled = false;
    this.context.mozImageSmoothingEnabled = false;
    this.context.webkitImageSmoothingEnabled = false;

    // Game starts here
    this.start = function() {
	this.state['boot'].img = new Image();
	this.state['boot'].img.onload = this.preloadWrapper.bind(this);
	this.state['boot'].img.src = 'img/boot.png';
    };

    // Assets loading and management

    this.load  = {
	complete: [],
	pending: []
    };
    this.image = {};
    this.sound = {};
    this.map   = {};

    // Callback function used for data loading success
    this.loaded = function( itemId, type, file ) {
	return function() {
	    this.load.complete.push(itemId);
	    
	    if( type == 'map' && file != undefined ) {
		this.map[itemId] = file;
	    };
	    
	    if( this.load.complete.length == this.load.pending.length ){
		// remove all callbacks from loaded sounds
		// this is to avoid the sound triggering it when reloading it
		for( var soundId in this.sound ){ 
		    this.sound[soundId].oncanplaythrough = undefined;
		}
		
		// start the actual game
		this.state.push(startState);
	    }
	}.bind(this);
    };
 
    this.load.image = function( imageId, url ) {
	this.image[imageId] = new Image();
	this.image[imageId].onload = this.loaded(imageId);
	this.image[imageId].src = url;
	this.load.pending.push(imageId);
    }.bind(this);

    this.load.sound = function( soundId, oggUrl, m4aUrl ) {
	var url;

	if( this.audioCodec == 'ogg' ) {
	    url = oggUrl;  
	} else {
	    url = m4aUrl;
	} 

	this.sound[soundId] = new Audio();
	this.sound[soundId].oncanplaythrough = this.loaded(soundId);
	this.sound[soundId].src = url;
	this.load.pending.push(soundId);
    }.bind(this);

    this.load.map = function( mapId, url ) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
	    if( xhr.readyState == 4 ) {
		this.loaded( mapId, 'map', JSON.parse(xhr.responseText) )();
	    }
	}.bind(this);

	xhr.open('GET', url, true);
	xhr.send();

	this.load.pending.push(mapId);
    }.bind(this);

    // State management

    // Boot is a special state used for the loading screen

    // Game is the main game state, and the default the game is in 
    // after boot

    this.state = {
	boot: {},
	game: {},
	stack: ['boot'],
	push: function( newStateName ) {
	    this.stack.push(newStateName);
	    this.getCurrent().create();
	},
	pop: function() {
	    this.stack.pop();
	},
	getCurrent: function() {
	    return this[this.stack[this.stack.length-1]];
	},

	// this acts as a wrapper for the current state
	// it is required for state change transitions
	update: function() {
	    this.getCurrent().update();
	},
	render: function( context ) {
	    this.getCurrent().render( context );
	}
    };

    this.state['boot'] = new State( 
	function() { // update
	    this.loaded = _this.load.complete.length / 
		_this.load.pending.length;
	},
	function( context ) { // render
	    var w = context.canvas.width/2;
	    var h = context.canvas.height/2;
	    context.drawImage(this.img, 
			      w - this.img.width/2, 
			      h - this.img.height/2);
	    var barWidth = _this.canvas.width - 20;
	    var barHeight = 10;
	    var barX = 10;
	    var barY = _this.canvas.height - 20;
	    context.rect( barX-1.5, barY-1.5, 
			  barWidth+3, barHeight+3, '#666', 1, true );
	    context.rect( barX, barY, 
			  barWidth*this.loaded, barHeight, '#333' );
	});

    this.state['game'] = new State();

    State.prototype.image = this.image;
    State.prototype.sound = this.sound;
    State.prototype.map = this.map;
    State.prototype.state = this.state;

    // Resource preload function, will be overwritten by game

    this.preload = function() {};

    this.preloadWrapper = function() {
	this.preload();
	this.updateLoop();
	this.renderLoop();
    }.bind(this);
    
    this.updateLoop = function() {
	this.state.update();
	requestAnimationFrame( this.updateLoop );
    }.bind(this);

    this.renderLoop = function () {
	this.state.render( this.context );
	requestAnimationFrame( this.renderLoop );
    }.bind(this);
}

function State( update, render ) {
    this.update = update;
    this.render = render;
}

State.prototype.create = function() {};
State.prototype.update = function( dt ) {};
State.prototype.render = function( context ) {};

