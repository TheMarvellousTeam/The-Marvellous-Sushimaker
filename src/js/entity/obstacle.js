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

		add : function(x, y){
			var iceberg = this.group.create(x, y, 'iceberg');
			var scale = Math.random()/3+0.15;
			iceberg.scale.setTo(scale, scale);
			iceberg.anchor.setTo(0.5, 0.5);
			iceberg.angle = Math.floor(360 * Math.random());
			iceberg.speed = Math.floor(25 + Math.random()*50);

			var shadowSprite = new Phaser.Sprite( game , x , y , 'iceberg' );
			shadowSprite.anchor.setTo(0.5, 0.5);
			shadowSprite.scale.setTo( scale , scale );

			iceberg.shadowIceberg = shadowSprite;

			components.underSea.shadowLayer().addChild( shadowSprite );
		},

		move : function() {
			this.group.forEachAlive(function(iceberg){
				game.add.tween(iceberg)
						.to({angle: Math.floor(360*Math.random())}, 5000 + Math.floor(Math.random()*5000), Phaser.Easing.Linear.None)
						.start();
			});
		},

		update : function(){
			this.group.forEachAlive(function(iceberg){
				iceberg.shadowIceberg.angle = iceberg.angle ;
				game.physics.arcade.velocityFromAngle(iceberg.angle, iceberg.speed , iceberg.body.velocity);
				iceberg.shadowIceberg.x = iceberg.x + 10;
				iceberg.shadowIceberg.y = iceberg.y + 15;
			});
		},

	};

	var G = function Mine () {};
	G.prototype = {

		group: null,

		init : function(params){
			params = params || {};
				
			this.group = new Phaser.Group( game );
			this.group.enableBody = true;
			this.group.physicsBodyType = Phaser.Physics.ARCADES ;

			( params.layer || game.world ).addChild( this.group );
		},

		add : function(x, y){
			var mine = this.group.create(x, y, 'mine');
			mine.scale.setTo(0.2, 0.2);
			mine.anchor.setTo(0.5, 0.5);

			var shadowSprite = new Phaser.Sprite( game , x + 10 , y + 15, 'mine' );
			shadowSprite.anchor.setTo(0.5, 0.5);
			shadowSprite.scale.setTo(0.2, 0.2 );
			components.underSea.shadowLayer().addChild( shadowSprite );
		}

	};

	exposure.Iceberg = F;
	exposure.Mine = G;

})( entities );