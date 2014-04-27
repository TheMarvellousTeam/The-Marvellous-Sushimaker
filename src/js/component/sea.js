var components = components || {};

(function( exposure ){

	var displacementFilter,bg,group,overlay;

	var preload = function(){
		
		game.load.image('displacement', 'src/assets/displacement_map.jpg');
		game.load.image('sea_background', 'src/assets/sand.jpg');
		game.load.image('sea_ecume', 'src/assets/zeldaWaves.png');
		
		
		var displacementTexture = PIXI.Texture.fromImage("src/assets/displacement_map.jpg");
		displacementFilter = new PIXI.DisplacementFilter(displacementTexture);
	}

	var create = function(){
		
		group = new Phaser.Group( game );


		// displacement filter
		group.filters = [ displacementFilter ];


		displacementFilter.scale.x = 40;
		displacementFilter.scale.y = 40;


		bg = new Phaser.TileSprite( game , 0, 0 , 256 , 256 , 'sea_background');
		bg.width = 5000;
		bg.height = 5000;

		// add background rockies
		group.addChild( bg );

		
		
		overlay = new Phaser.TileSprite( game , 0, 0 , 256 , 256 , 'sea_ecume');
		overlay.alpha = 0.5
		overlay.width = 5000;
		overlay.height = 5000;
		
		//add water volution
		group.addChild( overlay );
		
		
		

	}

	var update = function(){
		displacementFilter.offset.x ++
		displacementFilter.offset.y ++
	}


	exposure.underSea = {
		preload : preload,
		create : create,
		update : update,
		layer : function(){ return group }
	}

})( components );