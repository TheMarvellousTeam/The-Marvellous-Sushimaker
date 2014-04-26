game.module(
    'game.scene'
)
.require(
    'engine.scene',
    'engine.keyboard'
)
.body(function() {

SceneGame = game.Scene.extend({
    backgroundColor: 0xb9bec7,

    init: function() {
        this.trawler = new Trawler();
    },

    keydown: function() {
    	if ( game.keyboard.keysDown['SPACE'] ){
    		if (this.trawler.spriteUp.visible){
    			this.trawler.spriteUp.visible = false;
    			this.trawler.spriteDown.visible = true;
    		} else {
	    		this.trawler.spriteUp.visible = true;
    			this.trawler.spriteDown.visible = false;
   			}
    	}
    },

    click: function() {
    	console.log('clic');
    	console.log(e);
    },

});

});