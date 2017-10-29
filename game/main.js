"use strict";
var SCREEN_W = 640,
    SCREEN_H = 480;

var SCALE = 1;
var SCW = SCREEN_W/SCALE;
var SCH = SCREEN_H/SCALE;

var DEBUG = true;
var print = console.log;

var game = new Magic( SCREEN_W, // canvas width
		      SCREEN_H, // canvas height
		      'game', // canvas element
		      'game'  // state to boot into
		    );

var mouse = new Mouse( game.canvas );
var keys = new Keyboard();

// Resources

game.preload = function() {
    this.load.image("boot", "img/boot.png");
};

game.state['game'].create = function() {
};

game.state['game'].update = function()
{
    mouse.update();
    keys.clear();
};

game.state['game'].render = function( context )
{
    context.save();
    context.scale(SCALE, SCALE);
    context.clearRect(0, 0, SCW, SCH);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, SCW, SCH);
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.drawImage(this.image["boot"],SCW/2-50, 50); 
    fillTextWrap(context, "Welcome to the Magic Engine!", SCW/2, 300, 250, 30);
    
    context.restore();
};

game.state['game'].reset = function() {};

game.canvas.focus();
game.start();

//------------------------------
// Game functions

function rand( min, max ) {
    return (Math.random()*(max-min)|0) + min;
}

function newSprite( props ) {
    var news = {img: "default", x: 0, y:0, z:0, update: emptyF, render: renderBasic};
    for( var p in props ) news[p] = props[p];
    return news;
}

var sprites = {};
var spriteOrder = ["border", "directions", "cursor"];

function emptyF(){};

function renderBasic( context ) { context.drawImage( this.img, this.x, this.y ); }

function renderColor( context ) {
    context.fillStyle = this.color;
    context.fillRect( this.x, this.y, this.w, this.h );
}
