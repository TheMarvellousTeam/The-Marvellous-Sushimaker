
var components = components || {};

components.PixiRenderer = CES.Component.extend({
    name: 'pixiRenderer',
    init:function( stage ){
    	this.stage = stage;

        //TODO consider sharing the textures
        var texture = PIXI.Texture.fromImage("src/img/bg-mid.png");
        this.sprite = new PIXI.TilingSprite( texture , 512 , 512 ); 
        this.sprite.position.x = 0;
        this.sprite.position.y = 128;
        this.prepare();
    },
    prepare: function ( ) {
        this.stage.addChild( this.sprite );
    },
    dispose: function ( ) {
        console.warn('TODO remove from stage')
    },
});

