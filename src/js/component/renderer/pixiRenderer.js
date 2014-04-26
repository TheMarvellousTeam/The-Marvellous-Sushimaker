var PIXI = require('PIXI');
var CES = require('CES');

var PixiRenderer = CES.Component.extend({
    name: 'pixiRenderer',
    init:function( stage ){
    	this.stage = stage;

        //TODO consider sharing the textures
        var texture = PIXI.Texture.fromImage("src/img/boat.png");
        this.sprite = new PIXI.Sprite( texture ); 
        this.sprite.position.x = 250;
        this.sprite.position.y = 250;
        this.prepare();
    },
    prepare: function ( ) {
        this.stage.addChild( this.sprite );
    },
    dispose: function ( ) {
        console.warn('TODO remove from stage')
    },
});


exports.comp = PixiRenderer;