var entities = entities || {};

(function( exposure ){


	var E = function Chalutier () {};
	E.prototype = {


		// Base API exposure

		sprite : null,

		direction : null,

		filetUp : true,
		filetLoad : 0 ,

		emitter: null,

		init : function( params ){

			params = params || {};

			this.sprite =  params.sprite;

			if( this.sprite == null ){

				this.sprite = new Phaser.Sprite( game , params.x || 0 , params.y || 0 , params.texture );

				this.sprite.anchor.setTo(0.5, 0.5);

				this.sprite.scale.setTo( params.scale || 1 , params.scale || 1 );
			}

			game.physics.enable(this.sprite, Phaser.Physics.ARCADES);

			this.layer = params.layer || game.world;

			this.layer.addChild( this.sprite );

			this.emitter = game.add.emitter(params.x, params.y, 75);
			this.emitter.makeParticles('particle');
			this.emitter.setXSpeed(0, 0);
    		this.emitter.setYSpeed(0, 0);
    		this.emitter.setRotation(0, 0);
    		this.emitter.gravity = 0;
    		this.emitter.alpha = 0.3 ;
			this.emitter.start(false, 3000, 50);
		},

		update : function(){
			var dir = this.getDirection().normalize();
			this.emitter.emitX = this.sprite.x-dir.x*100 ;
			this.emitter.emitY = this.sprite.y-dir.y*100 ;
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

		timer : null,

		actionFilet : function() {
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
		},

		collideFish : function(boat, fish) {
			if( !this.filetUp ){
				this.filetLoad += 1;
				fish.kill();
			}
		}

		/// internal stuff

	};

	var F = function SeaShepherd() { };
	F.prototype = {
		sprite : null,

		init : function( params ){

			params = params || {};

			this.sprite =  params.sprite;

			if( this.sprite == null ){

				this.sprite = new Phaser.Sprite( game , params.x || 0 , params.y || 0 , params.texture );

				this.sprite.anchor.setTo(0.5, 0.5);

				this.sprite.scale.setTo( params.scale || 1 , params.scale || 1 );
			}

			game.physics.enable(this.sprite, Phaser.Physics.ARCADES);

			this.layer = params.layer || game.world;

			this.layer.addChild( this.sprite );

			this.emitter = game.add.emitter(params.x, params.y, 75);
			this.emitter.makeParticles('particle');
			this.emitter.setXSpeed(0, 0);
    		this.emitter.setYSpeed(0, 0);
    		this.emitter.setRotation(0, 0);
    		this.emitter.gravity = 0;
    		this.emitter.alpha = 0.3 ;
			this.emitter.start(false, 3000, 50);

			game.add.tween(this.sprite)
					.to({angle:this.sprite.angle+Math.floor(Math.random()*360)-180}, 8000, Phaser.Easing.Linear.None)
					.to({angle:this.sprite.angle+Math.floor(Math.random()*360)-180}, 8000, Phaser.Easing.Linear.None)
					.loop()
					.start();
		},

		update: function() {
			game.physics.arcade.velocityFromAngle(this.sprite.angle, 75, this.sprite.body.velocity);

			var dir = this.getDirection().normalize();
			this.emitter.emitX = this.sprite.x-dir.x*250 ;
			this.emitter.emitY = this.sprite.y-dir.y*250 ;
		},

		dispose: function() {

		},

		getDirection : function(){
			return new Phaser.Point(
				Math.cos( this.sprite.angle/180*Math.PI ),
				Math.sin( this.sprite.angle/180*Math.PI )
			);
		},
	}

	exposure.Chalutier = E;
	exposure.SeaShepherd = F;

})( entities );