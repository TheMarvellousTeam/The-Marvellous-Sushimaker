game.module(
    'game.objects'
)
.require(
    'engine.sprite'
)
.body(function() {

Trawler = game.Class.extend({

	canChange: true,

	init: function(){
		this.spriteUp = new game.Sprite('chalutier_up.png', game.system.width/4, game.system.height/2, {
			anchor: {x:0.5, y:0.5},
			scale: {x:0.3, y:0.3},
			rotation: 3.6,
			visible: true
		});

		this.spriteDown = new game.Sprite('chalutier_down.png', game.system.width/4, game.system.height/2, {
			anchor: {x:0.5, y:0.5},
			scale: {x:0.3, y:0.3},
			rotation: 3.6,
			visible: false
		});

        game.scene.stage.addChild(this.spriteUp);
        game.scene.stage.addChild(this.spriteDown);
        //game.scene.addObject(this);
	},

    update: function() {
    	console.log("prout");
    	// UPDATE WITH BESIER HERE
    }
});

Whale = game.Class.extend({

	init:function(){
		this.sprite = new game.Sprite('baleine.png');
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.scale.set(0.15, 0.15);
		this.sprite.position.set(-50, game.system.height*Math.random());
		this.sprite.rotation = 2.3;

		game.scene.stage.addChild(this.sprite);
		//game.scene.addObject(this);
	},

	update: function() {
		console.log('update: '+this.sprite.position.x);
		this.sprite.position.x += 10 ;
		if ( this.sprite.position.x > game.system.width + 25 ){
			game.scene.stage.remove(this.sprite);
			game.scene.removeObject(this);
		}
	}

});

});