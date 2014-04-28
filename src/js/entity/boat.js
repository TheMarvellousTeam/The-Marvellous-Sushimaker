var entities = entities || {};

(function( exposure ){


	var E = function Boat () {};
	E.prototype = {


		// Base API exposure

		sprite : null,

		direction : null,


		emitter: null,

		init : function( params ){

			params = params || {};

			this.sprite =  params.sprite;

			if( this.sprite == null ){

				this.sprite = new Phaser.Sprite( game , params.x || 0 , params.y || 0 , params.texture );

				this.sprite.anchor.setTo(0.5, 0.5);

				this.sprite.scale.setTo( params.scale || 1 , params.scale || 1 );
			}

			this.shadowSprite = new Phaser.Sprite( game , params.x || 0 , params.y || 0 , params.texture );
			this.shadowSprite.anchor.setTo(0.5, 0.5);
			this.shadowSprite.scale.setTo( params.scale || 1 , params.scale || 1 );

			game.physics.enable(this.sprite, Phaser.Physics.ARCADES);



			( params.layer || game.world ).addChild( this.sprite );

			( params.shadowLayer || params.layer || game.world ).addChild( this.shadowSprite );
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
			this.shadowSprite.angle = this.sprite.angle;
		},

		setPosition : function(x,y){
			this.sprite.position.x=x;
			this.sprite.position.y=y;

			this.shadowSprite.position.x=x + 20;
			this.shadowSprite.position.y=y + 35;
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

	var G = function Chalutier() {};
	for (var i in E.prototype)
		G.prototype[i] = E.prototype[i];

	G.prototype.filetUp = true;

	G.prototype.filetLoad =0;

	G.prototype.actionFilet = function() {
		var load = 0 ;
		if (this.filetUp){
			this.sprite.loadTexture('chalutier_down');
		} else {
       		load = this.filetLoad;
       		this.filetLoad = 0 ;
    		this.sprite.loadTexture('chalutier_up');
    	}
		this.filetUp = !this.filetUp;
		return load ;
	};

	G.prototype.collideFish = function(boat, fish) {
		if( !this.filetUp ){
			this.filetLoad += 1;
			fish.kill();
		}
	};

	G.prototype.collideDolphin = function(boat, dolphin){
		if( !this.filetUp ){
			this.filetLoad += 10;
			dolphin.kill();
		}
	};

	G.prototype.collideWhale = function(boat, whale){
		if( !this.filetUp ){
			this.filetLoad += 50;
			whale.kill();
		}
	};

	G.prototype.collideMortel = function(boat, seaShepherd) {
		this.filetUp = true;
		this.filetLoad = 0;
		game.state.restart('game');
		game.state.start('boot');
	};


	var F = function SeaShepherd() { };
	for (var i in E.prototype)
		F.prototype =  E.prototype;
	F.prototype.update = function() {
		this.shadowSprite.angle = this.sprite.angle ;
		game.physics.arcade.velocityFromAngle(this.sprite.angle, 50, this.sprite.body.velocity);
		this.shadowSprite.x=this.sprite.x + 20;
		this.shadowSprite.y=this.sprite.y + 35;
	};

	exposure.Chalutier = G;
	exposure.SeaShepherd = F;

})( entities );