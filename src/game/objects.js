game.module(
    'game.objects'
)
.require(
    'engine.sprite',
    'engine.keyboard'
)
.body(function() {

Trawler = game.Class.extend({

	canChange: true,

	init: function(){
		this.spriteUp = new game.Sprite('chalutier_up.png', 500, 500, {
			anchor: {x:0.5, y:0.5},
			scale: {x:0.3, y:0.3},
			visible: true
		});

		this.spriteDown = new game.Sprite('chalutier_down.png', 500, 500, {
			anchor: {x:0.5, y:0.5},
			scale: {x:0.3, y:0.3},
			visible: false
		});

        game.scene.stage.addChild(this.spriteUp);
        game.scene.stage.addChild(this.spriteDown);
        game.scene.addObject(this);
	},

    update: function() {
    	if (game.keyboard.keysDown['SPACE'] ) {
    		if( this.canChange ){
    			if (this.spriteUp.visible){
    				this.spriteUp.visible = false;
    				this.spriteDown.visible = true;
    			} else {
	    			this.spriteUp.visible = true;
    				this.spriteDown.visible = false;
   				}
   				this.canChange = false;
   			}
    	} else {
    		this.canChange = true;
    	}
    }

});

});