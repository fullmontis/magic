"use strict";

var game = new Magic( 500, 400, 'game' );
var mouse = new Mouse( game.canvas );
var keys = new Keyboard();
var fps = new FPS();

// constants 

game.context.fillColor = '#aaa';

// Resources

game.preload = function() {

    this.load.image('font', 'font/font_black.png');
    this.load.image('bold', 'font/font_bold_white.png');
};

game.state['game'].create = function() {
    this.font = new Font( this.image['font'], 
			  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
			  'abcdefghijklmnopqrstuvwxyz' + 
			  '1234567890!?\'"#%+-.,', 5, 11, 1, 3 );
    this.fontBold = new Font( this.image['bold'], 
			  'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 7, 13, 1, 4 );
};

game.state['game'].update = function( dt ) {
    mouse.update();

    // update code here

    keys.clear();
};

game.state['game'].render = function( context ) {
    context.fill();

    // render code here
};

game.state['game'].reset = function() {
};

game.start();
