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

    this.stage.backgroundColor='#33be9f';

    components.underSea.create();

    this.world.addChild( components.underSea.layer() );


		this.world.setBounds(0, 0, 5000, 5000);

    
    fishes.init({
      count: 50,
      texture: 'banc_poissons',
      scale: 0.1,
      speed: 100,
      layer: components.underSea.layer(),
      shadowLayer : components.underSea.shadowLayer(),
    });

    whales.init({
      count: 5,
      texture: 'baleine',
      scale:0.25,
      speed: 200,
      layer: components.underSea.layer(),
      shadowLayer : components.underSea.shadowLayer(),
    });

    dolphins.init({
      count: 10,
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

    seaShepherd. init({
      x: this.world.randomX,
      y: this.world.randomY,
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


		var sushi = this.add.sprite(this.game.width/2 - 25, 45, 'sushi');
  	sushi.anchor.setTo(0.5, 0.5);
  	sushi.scale.setTo(0.15, 0.15);
  	sushi.fixedToCamera = true;

  	var sushiScore = this.add.text(this.game.width/2 + 25, 30, '0', {fontSize: '17px', fill:"#000000"});
  	sushiScore.fixedToCamera = true;

  	var filetControl = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var timer = this.time.now ;
  	filetControl.onDown.add(function() {
      if ( this.time.now > timer ) {
        chalutier.actionFilet();
        sushiScore.text = ''+chalutier.fishLoad;
        timer = this.time.now + 3500 ;
      }
  	}, this);

    this.timer1 = this.time.now ;
    this.timer2 = this.time.now ;
	};

	MainState.update = function() {
    this.physics.arcade.collide(chalutier.sprite, seaShepherd.sprite, chalutier.collideSeaShepherd, null, chalutier);
    this.physics.arcade.collide(chalutier.sprite, icebergs.group, chalutier.collideIceberg, null, chalutier);
    this.physics.arcade.collide(seaShepherd.sprite, icebergs.group);
    this.physics.arcade.collide(icebergs.group, icebergs.group);

    if( !chalutier.filetUp ){
      this.physics.arcade.overlap(chalutier.filetSprite, mines.group, chalutier.collideMine, null, chalutier);
      this.physics.arcade.overlap(chalutier.filetSprite, whales.group, chalutier.collideWhale, null, chalutier);
      this.physics.arcade.overlap(chalutier.filetSprite, dolphins.group, chalutier.collideDolphin, null, chalutier);
      this.physics.arcade.overlap(chalutier.filetSprite, fishes.group, chalutier.collideFish, null, chalutier);
    }
    
    if ( this.timer1 < game.time.now - 7000 ){
      var x = chalutier.filetSprite.x - seaShepherd.sprite.x;
      var y = chalutier.filetSprite.y - seaShepherd.sprite.y;

      game.add.tween(seaShepherd.sprite)
              .to({angle:(Math.atan2(y, x)*180)/Math.PI}, 4500, Phaser.Easing.Linear.None)
              .start();

      this.timer1 = game.time.now  ;
    };

    if ( this.timer2 < game.time.now - 3000 ) {
      for(var i=0; i<Math.random()*3; i++)
        icebergs.add();
      for(var i=0; i<Math.random()*3; i++)
        mines.add();

      icebergs.move();
      this.timer2 = game.time.now;
    };

    seaShepherd.update(chalutier.filetLoad*2 + chalutier.fishLoad/2);
    chalutier.update(); 
    fishes.update();
    dolphins.update();
    whales.update();
    icebergs.update();

    components.underSea.update();
	};

	exposure.MainState = MainState;

})(GameState);