var components = components || {};

(function( exposure ){

	var C = function PathEditable(){};
	C.prototype={

		_graphic : null,

		name : "ecumeEmiter",

		init:function( target ){
			this.target = target;

			this.emitter = game.add.emitter( this.target.getPosition().x , this.target.getPosition().y , 75);
			this.emitter.makeParticles('particle');
			this.emitter.setXSpeed(0, 0);
    		this.emitter.setYSpeed(0, 0);
    		this.emitter.setRotation(0, 0);
    		this.emitter.gravity = 0;
    		this.emitter.alpha = 0.3 ;
			this.emitter.start(false, 3000, 50);

			return this.bind( true );
		},

		bind : function( enable ){

			// TODO unbind when enable is false

			var that = this
			var target = this.target

			var update = target.update;

			target.update = function(){

				update.call( target );

				that.update.call( that );
			};

			return this;
		},

		update:function(){

			var dir = this.target.getDirection();
			var p = this.target.getPosition();

			this.emitter.emitX = p.x - dir.x*100 ;
			this.emitter.emitY = p.y - dir.y*100 ;
		},
	}

	C.attach = function( entity ){
		var c = new C();
		c.init( entity );
		entity.components = entity.components || {}
		entity.components[ c.name ] = c
		return c;
	};

	exposure.EcumeEmiter = C;

})( components );

