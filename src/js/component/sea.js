var components = components || {};

(function( exposure ){

	var displacementFilter,bg,group,overlay,seaGroup,shadowLayer;

	var preload = function(){
		
		game.load.image('displacement', 'src/assets/displacement_map.jpg');
		game.load.image('sea_background', 'src/assets/sand2.jpg');
		game.load.image('sea_ecume', 'src/assets/zeldaWaves.png');
		

		var displacementTexture = PIXI.Texture.fromImage("src/assets/displacement_map.jpg");
		displacementFilter = new PIXI.DisplacementFilter(displacementTexture);
	}

	var create = function(){
		
		group = new Phaser.Group( game );

		

		


		// add background rockies
		bg = new Phaser.TileSprite( game , 0, 0 , 256 , 256 , 'sea_background');
		bg.z = 0;
		bg.width = 5000;
		bg.height = 5000;

		//group.addChild( bg );


		// where animals goes
		seaGroup = new Phaser.Group( game );
		seaGroup.z = 1;

		seaGroup.filters = [ displacementFilter ];

		group.addChild( seaGroup );


		// shawdow layer
		shadowLayer = new Phaser.Group( game );
		shadowLayer.z = -1;

		var blurX = game.add.filter('BlurX');
		var blurY = game.add.filter('BlurY');
		var gray = game.add.filter('Gray');

		blurX.blur = blurY.blur = 25

		shadowLayer.filters = [ gray , displacementFilter , blurX, blurY ];

		seaGroup.addChild( shadowLayer );


		// displacement filter
		group.filters = [ displacementFilter ];


		displacementFilter.scale.x = 40;
		displacementFilter.scale.y = 40;
	}

	var update = function(){
		displacementFilter.offset.x ++
		displacementFilter.offset.y ++
	}


	exposure.underSea = {
		preload : preload,
		create : create,
		update : update,
		layer : function(){ return seaGroup },
		shadowLayer : function(){ return shadowLayer }
	}

})( components );