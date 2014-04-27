var entities = entities || {};

(function( exposure ){

	var E = function Animal () {}
	E.prototype = {

		// Base API exposure

		group: null,

		speed: null,

		init : function( params ){

			params = params || {};
				
			this.group = game.add.group();
			this.group.enableBody = true;
			this.group.physicsBodyType = Phaser.Physics.ARCADES ;

			this.speed = params.speed || 50 ;

			for(var i=0; i< (params.count || 10); i++){
				var fish = this.group.create(game.world.randomX, game.world.randomY, params.texture);
				fish.angle = Math.floor(360 * Math.random());
				fish.anchor.setTo(0.5, 0.5);
				fish.scale.setTo( params.scale || 1 , params.scale || 1 );
				game.add.tween(fish)
						.to({angle:fish.angle+Math.floor(Math.random()*360)-180}, 8000, Phaser.Easing.Linear.None)
						.to({angle:fish.angle+Math.floor(Math.random()*360)-180}, 8000, Phaser.Easing.Linear.None)
						.loop()
						.start();
			}

		},

		update : function(){
			this.group.forEachAlive(function(fish){
				game.physics.arcade.velocityFromAngle(fish.angle, this.speed , fish.body.velocity);
			});
			this.group.forEachDead(function(fish){
				fish.reset(game.world.randomX, game.world.randomY, 1);
			});
		},

		dispose : function(){

		},

		/// internal stuff

	};

	exposure.Animal = E;

})( entities );