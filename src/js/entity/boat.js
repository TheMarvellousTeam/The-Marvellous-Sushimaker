var entities = entities || {};

(function( exposure ){


	var E = function Boat () {}
	E.prototype = {


		// Base API exposure

		sprite : null,

		direction : null,

		init : function( params ){

			params = params || {};

			this.sprite =  params.sprite;

			if( this.sprite == null ){

				this.sprite = new Phaser.Sprite( game , params.x || 0 , params.y || 0 , params.texture );

				this.sprite.anchor.setTo(0.5, 0.5);

				this.sprite.scale.setTo( params.scale || 1 , params.scale || 1 );
			}

			this.layer = params.layer || game.world;

			this.layer.addChild( this.sprite );
		},

		update : function(){

		},

		dispose : function(){

		},

		getDirection : function(){
			return new Phaser.Point(
				Math.cos( this.sprite.angle/180*Math.PI ),
				Math.sin( this.sprite.angle/180*Math.PI )
			);
		},

		setDirection : function( x,y ){
			this.sprite.angle = Math.atan2( y , x )/Math.PI*180;
		},

		setPosition : function(x,y){
			this.sprite.position.x=x;
			this.sprite.position.y=y;
		},

		getPosition : function(){
			return this.sprite.position;
		},

		getDimension : function(){
			return {
				width : this.sprite.width,
				height : this.sprite.height
			};
		},


		/// internal stuff



	};

	exposure.Boat = E;

})( entities );