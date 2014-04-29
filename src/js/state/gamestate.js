var GameState = GameState || {};

(function( exposure ){

  var chalutier = new entities.Chalutier();
  var seaShepherd = new entities.SeaShepherd();
  var fishes = new entities.Animal();
  var whales = new entities.Animal();
  var dolphins = new entities.Animal();
  var icebergs = new entities.Iceberg();
  var mines = new entities.Mine();


	var MainState = new Phaser.State();
	MainState.create = function() {



    stats.setMode( 1 );
    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = "absolute"
    stats.domElement.style.top = "10px";
    stats.domElement.style.left = "10px";

    stats.begin();

    this.stage.backgroundColor='#888888';


    var back = new Phaser.TileSprite( game , 0, 0 , 1 , 1 , 'back');
    back.width = 5000;
    back.height = 5000;
    game.world.addChild( back );


    components.underSea.create();
    components.deathEffect.create( game.world );

    this.world.addChild( components.underSea.layer() );


		this.world.setBounds(0, 0, 5000, 5000);

    
    fishes.init({
      count: 75,
      award:1,
      texture: 'banc_poissons',
      scale: 0.1,
      speed: 75,
      layer: components.underSea.layer(),
      shadowLayer : components.underSea.shadowLayer(),
    });

    whales.init({
      count: 5,
      award:50,
      texture: 'baleine',
      scale:0.25,
      speed: 150,
      layer: components.underSea.layer(),
      shadowLayer : components.underSea.shadowLayer(),
    });

    dolphins.init({
      count: 10,
      award:10,
      texture: 'dauphin',
      scale:0.1,
      speed: 300,
      layer: components.underSea.layer(),
      shadowLayer : components.underSea.shadowLayer(),
    });

    mines.init({
      layer:components.underSea.layer()
    });
    
    chalutier.init({
      x: this.world.width/2,
      y: this.world.height/2,
      texture : 'chalutier_up',
      scale : 0.3,
      shadowLayer : components.underSea.shadowLayer(),
      filetLayer : components.underSea.layer(),
    });

    do{
      var randx = this.world.randomX ;
      var randy = this.world.randomY ;
    } while( randx > chalutier.sprite.x - 800 
          && randx < chalutier.sprite.x + 800 
          && randy > chalutier.sprite.y - 800
          && randy < chalutier.sprite.y + 800);

    seaShepherd. init({
      x: randx,
      y: randy,
      texture : 'sea_shepherd',
      scale : 0.3,
      shadowLayer : components.underSea.shadowLayer(),
    });

    icebergs.init();

    this.camera.follow( chalutier.sprite );
    components.PathEditable.attach( chalutier );
    components.EcumeEmiter.attach( chalutier , components.underSea.layer() );
    components.EcumeEmiter.attach( seaShepherd , components.underSea.layer() );


    var overlay = new Phaser.TileSprite( game , 0, 0 , 256 , 256 , 'sea_ecume');
    overlay.name = 'overlay'
    overlay.alpha = 1
    overlay.width = 5000;
    overlay.height = 5000;

    overlay.z = 3;
    
    components.underSea.layer().addChild( overlay );

    var sushiTable = this.add.sprite( 125 + 5, 80, 'sushiTable');
    sushiTable.anchor.setTo(0.5, 0.5);
    sushiTable.scale.setTo(0.6, 0.8);
    sushiTable.fixedToCamera = true;

		var sushi = this.add.sprite(125 - 25, 45, 'sushi');
  	sushi.anchor.setTo(0.5, 0.5);
  	sushi.scale.setTo(0.15, 0.15);
  	sushi.fixedToCamera = true;

  	this.sushiScore = this.add.text(125 + 20, 50, 'x 0', { fill:"#000000"});
  	this.sushiScore.fixedToCamera = true;

    this.cdFilet = this.time.now ;
    this.timer1 = this.time.now ;
    this.timer2 = this.time.now ;
	};

	MainState.update = function() {

    stats.end();
    stats.begin();

    this.physics.arcade.collide(chalutier.sprite, seaShepherd.sprite, chalutier.collideSeaShepherd, null, chalutier);
    this.physics.arcade.collide(chalutier.sprite, icebergs.group, chalutier.collideObstacle, null, chalutier);
    this.physics.arcade.collide([icebergs.group, seaShepherd.sprite], icebergs.group);

    if( !chalutier.filetUp ){
      this.physics.arcade.overlap(chalutier.filetSprite, mines.group, chalutier.collideObstacle, null, chalutier);
      this.physics.arcade.overlap(chalutier.filetSprite, [whales.group, dolphins.group, fishes.group], chalutier.collideAnimal, null, chalutier);
    }

    if ( this.timer1 < game.time.now - 7000 ){
      var x = chalutier.filetSprite.x - seaShepherd.sprite.x;
      var y = chalutier.filetSprite.y - seaShepherd.sprite.y;

      game.add.tween(seaShepherd.sprite)
              .to({angle:(Math.atan2(y, x)*180)/Math.PI}, 4500, Phaser.Easing.Linear.None)
              .start();

      this.timer1 = game.time.now  ;
    };

    if ( game.time.now > this.cdFilet && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ) {
      chalutier.actionFilet(this.sushiScore);
      this.cdFilet = game.time.now + 3500 ;
    }

    if ( this.timer2 < game.time.now - 3000 ) {
      for(var i=0; i<1+Math.random()*3; i++) {
        do{
          var randx = this.world.randomX ;
          var randy = this.world.randomY ;
        } while( randx > chalutier.sprite.x - 800 
              && randx < chalutier.sprite.x + 800 
              && randy > chalutier.sprite.y - 800
              && randy < chalutier.sprite.y + 800);
        icebergs.add(randx, randy);
      }
      for(var i=0; i<1+Math.random()*3; i++) {
        do{
          var randx = this.world.randomX ;
          var randy = this.world.randomY ;
        } while( randx > chalutier.sprite.x - 800 
              && randx < chalutier.sprite.x + 800 
              && randy > chalutier.sprite.y - 800
              && randy < chalutier.sprite.y + 800);
        mines.add(randx, randy);
      }

      icebergs.move();
      this.timer2 = game.time.now;

      this.sushiScore.text = 'x '+chalutier.fishLoad;
    };

    seaShepherd.update(1 + chalutier.filetLoad*2 + Math.floor(chalutier.fishLoad/2));
    chalutier.update(); 
    fishes.update();
    dolphins.update();
    whales.update();
    icebergs.update();

    components.underSea.update();
	};

  MainState.shutdown = function(){
    if( chalutier.shutdown )chalutier.shutdown(); 
    /*
    fishes.shutdown();
    dolphins.shutdown();
    whales.shutdown();
    icebergs.shutdown();*/
  }

	exposure.MainState = MainState;

})(GameState);