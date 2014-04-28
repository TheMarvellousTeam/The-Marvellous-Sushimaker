var components = components || {};

(function( exposure ){

	var C = function PathEditable(){};
	C.prototype={

		name : "ecumeEmiter",

		init:function( target , layer ){
			this.target = target;

			var underSea = layer;

			this.ems = [];

			for(var i=0;i<2;i++){

				var em = new Phaser.Particles.Arcade.Emitter( game , this.target.getPosition().x , this.target.getPosition().y , 75);
				em.makeParticles('particle');
	    		em.setRotation(0, 0);
	    		em.setAlpha(0.9, 0.01,800);
	    		em.gravity = 0;
				em.start(false, 1000, 50);

				em.maxParticleScale = 0.5;
				em.minParticleScale = 0.2;

				underSea.addChild( em );

				this.ems[ i ] = em;
			}

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


			for(var i=0;i<2;i++){

				var n = i==0 ? new Phaser.Point( dir.y , -dir.x ) : new Phaser.Point( -dir.y , dir.x );

				this.ems[i].emitX = p.x - dir.x*95 + n.x *20;
				this.ems[i].emitY = p.y - dir.y*95 + n.y *20;

				this.ems[i].minParticleSpeed.setTo( n.x * 15 , n.y * 15 );
	    		this.ems[i].maxParticleSpeed.setTo( n.x * 25 , n.y * 25 );
	    	}
		},
	}

	C.attach = function( entity , layer ){
		var c = new C();
		c.init( entity , layer );
		entity.components = entity.components || {}
		entity.components[ c.name ] = c
		return c;
	};

	exposure.EcumeEmiter = C;

})( components );

