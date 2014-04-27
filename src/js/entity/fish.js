var entities = entities || {};

(function( exposure ){


	var E = function Fishes () {}
	E.prototype = {

		// Base API exposure

		group : null,

		init : function( params ){

			params = params || {};

			if( this.sprite == null ){
				
				this.group = game.add.group();
				this.group.enableBody = true;
				this.group.physicsBodyType = Phaser.Physics.P2JS ;

				for(var i=0; i< (params.nbFish || 10); i++){
					var fish = this.group.create(game.world.randomX, game.world.randomY, params.texture);
					fish.angle = Math.floor(360 * Math.random());
					fish.anchor.setTo(0.5, 0.5);
					fish.scale.setTo( params.scale || 1 , params.scale || 1 );
				}
			}

		},

		update : function(){

		},

		dispose : function(){

		},

		/// internal stuff

	};

	exposure.Fishes = E;

})( entities );