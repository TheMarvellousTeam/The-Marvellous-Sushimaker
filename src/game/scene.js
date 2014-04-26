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
    whaleAcc: 0,
    whalePop: 1.5,
    whaleMax: 3,
    whales: [],

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

    click: function(e) {
    	
    },

    update: function() {
    	// whale spawn
    	this.whaleAcc += game.system.delta ;
    	if ( this.whaleAcc > this.whalePop && this.whales.length < this.whaleMax ) {
    		this.whales.push(new Whale());
    		this.whaleAcc = 0 ;
    	}

    	for(var i=0; i<this.whales.length;i++){
    		this.whales[i].sprite.position.x += 10 ;
    		if ( this.whales[i].sprite.position.x > game.system.width + 100 ) {
    			game.scene.stage.remove(this.whales[i].sprite);
    			// whales[i];
    		}
    	}
    }

});

});