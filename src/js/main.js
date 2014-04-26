
var PIXI = require('PIXI');
var CES = require('CES');
var RendererComponenet = require('./component/renderer/pixiRenderer');
var GeometryComponenet = require('./component/physic/geometry');
var DynamicComponenet = require('./component/physic/dynamic');



var stages = {
	'ocean' : new PIXI.Stage(0xa84ed2)
}



var canvas = document.getElementById("game-canvas");
renderer = PIXI.autoDetectRenderer(
    canvas.width,
    canvas.height,
    canvas
);

/// instanciate a boat
var boat = new CES.Entity();
boat.addComponent( new RendererComponenet.comp( stages.ocean ) );


(function cycle() {

	
  	renderer.render( stages.ocean );
 
  	requestAnimFrame( cycle );
})();






