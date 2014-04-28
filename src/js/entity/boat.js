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

			game.physics.enable(this.sprite, Phaser.Physics.ARCADES);

			( params.layer || game.world ).addChild( this.sprite );


			this.shadowSprite = new Phaser.Sprite( game , params.x || 0 , params.y || 0 , params.texture );
			this.shadowSprite.anchor.setTo(0.5, 0.5);
			this.shadowSprite.scale.setTo( params.scale || 1 , params.scale || 1 );

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

	G.prototype.init = function(params) {
		E.prototype.init.call(this, params);
		this.filetUp = true;
		this.filetLoad = 0;
		this.fishLoad = 0 ;

		this.filetSprite = new Phaser.Sprite( game , params.x - 200 || 0 , params.y || 0 , 'filet0' );
		this.filetSprite.anchor.setTo(0.5, 0.5);
		this.filetSprite.scale.setTo( 0 , 0 );
		this.filetSprite.kill();
		game.physics.enable(this.filetSprite, Phaser.Physics.ARCADE);

		( params.filetLayer || params.layer || game.world ).addChild( this.filetSprite );
	};

	G.prototype.setPosition = function(x, y){
		E.prototype.setPosition.call(this, x, y);
		var dir = this.getDirection();
		this.filetSprite.x = x - dir.x*200;
		this.filetSprite.y = y - dir.y*200;
	};

	G.prototype.setDirection = function(x, y){
		E.prototype.setDirection.call(this, x, y);
		this.filetSprite.angle = Math.atan2( y , x )/Math.PI*180;
	};

	G.prototype.actionFilet = function() {
		if (this.filetUp){
			this.sprite.loadTexture('chalutier_down');
			this.filetSprite.revive();

			var down = game.add.tween(this.filetSprite.scale);
			down.to({x: 0.5, y: 0.5}, 3500, Phaser.Easing.Linear.None);
			down.onComplete.addOnce(filetJustDown, this);
			down.start();
		} else {
			var up = game.add.tween(this.filetSprite.scale);
			up.to({x: 0, y: 0}, 3500, Phaser.Easing.Linear.None);
			up.onComplete.addOnce(filetJustUp, this);
			up.start();
       		
    	}
	};

	var filetJustUp = function() {
		this.fishLoad += this.filetLoad;
       	this.filetLoad = 0 ;
    	this.sprite.loadTexture('chalutier_up');
    	this.filetSprite.kill();
    	this.filetSprite.scale.setTo(0,0);
    	this.filetSprite.loadTexture('filet0');
    	this.filetUp = true;
	};

	var filetJustDown = function() {
		this.filetUp = false ;
	};

	var updateFilet = function updateFilet(load){
		this.filetLoad += load ;
		if( this.filetLoad >= 75 ){
			this.filetSprite.loadTexture('filet4');
		} else if ( this.filetLoad >= 50 ) {
			this.filetSprite.loadTexture('filet3');
		} else if ( this.filetLoad >= 25 ) {
			this.filetSprite.loadTexture('filet2');
		} else if (this.filetLoad >= 10 ) {
			this.filetSprite.loadTexture('filet1');
		}
	}

	G.prototype.collideAnimal = function(boat, animal) {
		updateFilet.call(this, animal.award);
		animal.kill();
	};

	G.prototype.collideSeaShepherd = function(boat, seaShepherd) {
		updateFilet.call(this,-25 - Math.floor(Math.random()*15));
		this.filetSprite.loadTexture('filet0');
	};

	var dead = function dead() {
		this.filetUp = true;
		this.filetLoad = 0;
		this.fishLoad = 0 ;
		game.state.restart('game');
		game.state.start('boot');
	};

	G.prototype.collideObstacle = function(boat, iceberg) {
		dead.call(this);
	};



	var F = function SeaShepherd() { };
	for (var i in E.prototype)
		F.prototype =  E.prototype;
	F.prototype.update = function(speed) {
		this.shadowSprite.angle = this.sprite.angle ;
		game.physics.arcade.velocityFromAngle(this.sprite.angle, speed, this.sprite.body.velocity);
		this.shadowSprite.x=this.sprite.x + 20;
		this.shadowSprite.y=this.sprite.y + 35;
	};

	exposure.Chalutier = G;
	exposure.SeaShepherd = F;

})( entities );