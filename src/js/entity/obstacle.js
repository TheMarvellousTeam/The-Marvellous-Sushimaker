var entities = entities || {};

(function( exposure ){

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

	exposure.Iceberg = F;

})( entities );