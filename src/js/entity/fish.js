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
			/*
			for(var i=0; i< (params.count || 10); i++){
				
				var fish = this.group.create(game.world.randomX, game.world.randomY, params.texture);
				var shadow = ( param.shadowLayer || this.group ).create( fish.x , fish.y , params.texture);
				
				fish.angle = Math.floor(360 * Math.random());
				fish.anchor.setTo(0.5, 0.5);
				fish.scale.setTo( params.scale || 1 , params.scale || 1 );

				shadow.angle = fish.angle;
				shadow.anchor.set( 0.5, 0.5);
				shadow.scale.setTo( params.scale || 1 , params.scale || 1 );

				game.add.tween(fish)
						.to({angle:fish.angle+Math.floor(Math.random()*360)}, 8000, Phaser.Easing.Linear.None)
						.to({angle:fish.angle+Math.floor(Math.random()*360)}, 8000, Phaser.Easing.Linear.None)
						.loop()
						.start();
			}
			*/
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

	var F = function Iceberg () {};
	F.prototype = {

		group: null,

		init : function(params){
			params = params || {};
				
			this.group = new Phaser.Group( game );
			this.group.enableBody = true;
			this.group.physicsBodyType = Phaser.Physics.ARCADES ;

			( params.layer || game.world ).addChild( this.group );
		},

		add : function(){
			var iceberg = this.group.create(game.world.randomX, game.world.randomY, 'iceberg');
			iceberg.scale = 0.2;
			iceberg.angle = Math.floor(360 * Math.random());
			iceberg.speed = Math.floor(75 + Math.random()*150);
		},

		move : function() {
			this.group.forEachAlive(function(iceberg){
				game.add.tween(iceberg)
						.to({angle: Math.floor(360*Math.random())}, 3000 + Math.floor(Math.random()*5000), Phaser.Easing.Linear.None)
						.start();
			});
		},

		update : function(){
			this.group.forEachAlive(function(iceberg){
				game.physics.arcade.velocityFromAngle(iceberg.angle, iceberg.speed , iceberg.body.velocity);
			});
		},

	};

	exposure.Animal = E;
	exposure.Iceberg = F;

})( entities );