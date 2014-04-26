
/*
var RendererComponenet = require('./component/renderer/pixiRenderer');
var GeometryComponenet = require('./component/physic/geometry');
var DynamicComponenet = require('./component/physic/dynamic');
*/


var stages = {
	'ocean' : new PIXI.Stage(0xa84ed2)
}


/*
var canvas = document.getElementById("game-canvas");
var renderer = PIXI.autoDetectRenderer(
    canvas.width,
    canvas.height,
    canvas
);

/// instanciate a boat
var boat = new CES.Entity();
boat.addComponent( new RendererComponenet.comp( stages.ocean ) );

var midTexture = PIXI.Texture.fromImage("src/img/bg-mid.png");
  mid = new PIXI.Sprite(midTexture);
  mid.position.x = 0;
  mid.position.y = 128;
  stages.ocean.addChild(mid);

(function cycle() {

	
  	renderer.render( stages.ocean );
 
  	requestAnimFrame( cycle );
})();

*/

var stage = new PIXI.Stage(0x66FF99);

var boat = new CES.Entity();
boat.addComponent( new components.PixiRenderer( stage ) );



   				renderer = new PIXI.autoDetectRenderer(
   					512,
   					384,
   					document.getElementById("game-canvas")
   				);

   				
	
   				requestAnimFrame(update);
   				
         function update() {

            renderer.render(stage);

            requestAnimFrame(update);
         }




