var components = components || {};

(function( exposure ){

	var layer

	var done = false;

	var create = function( _layer ){

		layer = layer || game.world

	}

	var start = function(){

		if( done )
			return

		var gray = game.add.filter('Gray');
		var blurX = game.add.filter('BlurX');
		var blurY = game.add.filter('BlurY');

		gray.gray = blurX.blur = blur.blurY = 0

		game.add.tween( gray )
			.to({gray:0}, 10, Phaser.Easing.Linear.None)
			.delay( 100 )
			.to({gray:1}, 3000, Phaser.Easing.Linear.None)
			.start();

		game.add.tween( blurX )
			.to({blur:0}, 10, Phaser.Easing.Linear.None)
			.delay( 100 )
			.to({blur:20}, 2000, Phaser.Easing.Linear.None)
			.start();

		game.add.tween( blurY )
			.to({blur:0}, 10, Phaser.Easing.Linear.None)
			.delay( 100 )
			.to({blur:20}, 2000, Phaser.Easing.Linear.None)
			.start();

		var recFilter = function( o , doIt ){
			if( doIt )
				o.filters = ( o.filters || [] ).concat([ gray , blurX , blurY ]);

			for( var i=o.children.length;i--;)
				recFilter( o.children[i] , true );
		}

		window.setTimeout(function(){
			var w = new Phaser.Sprite( game , game.width/2 , game.height/2 , 'wasted');
			w.alpha = 0;
			w.scale.setTo(0.5, 0.5);
			w.anchor.setTo(0.5, 0.5);
			w.fixedToCamera = true;
			game.world.addChild( w );


			game.add.tween( w )
			.to({alpha:1}, 500, Phaser.Easing.Linear.None)
			.start();
		},1500)

		window.setTimeout(function(){

			var recFilter = function( o ){
				o.filters =null;

				for( var i=o.children.length;i--;)
					recFilter( o.children[i] );
			}
			recFilter( layer );

			game.state.restart('game');
			game.state.start('boot');
		},3000);

		recFilter( layer );

		done = true;
	}


	exposure.deathEffect = {
		start : start,
		create : create
	}

})( components );

