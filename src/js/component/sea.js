var components = components || {};

(function( exposure ){

	var displacementFilter,bg,group,overlay;

	var preload = function(){
		
		game.load.image('displacement', 'src/assets/displacement_map.jpg');
		game.load.image('sea_background', 'src/assets/displacement_BG.jpg');
		game.load.image('sea_ecume', 'src/assets/zeldaWaves.png');
		
		
		var displacementTexture = PIXI.Texture.fromImage("src/assets/displacement_map.jpg");
		displacementFilter = new PIXI.DisplacementFilter(displacementTexture);
	}

	var create = function(){
		
		group = new Phaser.Group( game );


		// displacement filter
		group.filters = [ displacementFilter ];


		displacementFilter.scale.x = 20;
		displacementFilter.scale.y = 20;

		/*
		//overlay = new Phaser.TileSprite( 0, 0 , 128 , 128 , 'sea_ecume');
		overlay = new Phaser.Sprite( 128 , 128 , 'sea_ecume');
		
		overlay.width = 5000;
		overlay.height = 5000;
	
		// add background rockies
		//group.addChild( bg );

		//add water volution
		group.addChild( overlay );
		*/
		
		

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