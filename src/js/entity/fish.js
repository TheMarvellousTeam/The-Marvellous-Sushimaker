var entities = entities || {};

(function( exposure ){

	var E = function Animal () {}
	E.prototype = {

		// Base API exposure

		group: null,

		speed: null,

		init : function( params ){

			params = params || {};
				
			this.group = new Phaser.Group( game );
			this.group.enableBody = true;
			this.group.physicsBodyType = Phaser.Physics.ARCADES ;

			( params.layer || game.world ).addChild( this.group );

			this.speed = params.speed || 50 ;
			
			for(var i=0; i< (params.count || 10); i++){
				
				var fish = this.group.create(game.world.randomX, game.world.randomY, params.texture);
				fish.angle = Math.floor(360 * Math.random());
				fish.anchor.setTo(0.5, 0.5);
				fish.scale.setTo( params.scale || 1 , params.scale || 1 );

				var shadow = ( params.shadowLayer || this.group ).create( fish.x , fish.y , params.texture);
				shadow.anchor.set( 0.5, 0.5);
				shadow.scale.setTo( params.scale || 1 , params.scale || 1 );
				shadow.alpha = 0 ;
				shadow.angle = fish.angle;

				fish.shadowFish = shadow ;

				fish.award = ( params.award || 0 ) + Math.floor(Math.random()*(params.award||0));

				game.add.tween(shadow)
						.to({alpha:1}, 1500, Phaser.Easing.Linear.None)
						.start();
				game.add.tween(fish)
						.to({alpha:1}, 1500, Phaser.Easing.Linear.None)
						.start();

				game.add.tween(fish)
						.to({angle:fish.angle+Math.floor(Math.random()*180)}, 8000, Phaser.Easing.Linear.None)
						.to({angle:fish.angle+Math.floor(Math.random()*180)}, 8000, Phaser.Easing.Linear.None)
						.loop()
						.start();
			}
			
		},

		update : function(){
			this.group.forEachAlive(function(fish){
				fish.shadowFish.angle = fish.angle;
				game.physics.arcade.velocityFromAngle(fish.angle, this.speed , fish.body.velocity);
				fish.shadowFish.x = fish.x + 12 ;
				fish.shadowFish.y = fish.y + 21 ;

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