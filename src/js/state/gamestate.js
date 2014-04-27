var GameState = GameState || {};

(function( exposure ){

  var chalutier = new entities.Chalutier();
  var seaShepherd = new entities.SeaShepherd();
  var fishes = new entities.Animal();
  var whales = new entities.Animal();
  var dolphins = new entities.Animal();
  var icebergs = new entities.Iceberg();


	var MainState = new Phaser.State();
	MainState.create = function() {

    this.stage.backgroundColor='#33be9f';

    /*
    var sea = this.add.tileSprite(0,0, 128 , 128 , 'sea');
    sea.width = 5000;
    sea.height = 5000;

    components.underSea.create();
  
    */

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
    
    chalutier.init({
      x: this.world.width/2,
      y: this.world.height/2,
      texture : 'chalutier_up',
      scale : 0.3,
      shadowLayer : components.underSea.shadowLayer(),
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


		var sushi = this.add.sprite(35, this.game.height - 35, 'sushi');
  	sushi.anchor.setTo(0.5, 0.5);
  	sushi.scale.setTo(0.1, 0.1);
  	sushi.fixedToCamera = true;
  	this.sushi = this.add.text(65, this.game.height - 47, '0', {fontSize: 14, fill:"#000000"});
  	this.sushi.fixedToCamera = true;

  	var filetControl = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var timer = this.time.now ;
  	filetControl.onDown.add(function() {
      if ( this.time.now > timer ) {
        var load = chalutier.actionFilet();
        this.sushi.text = ''+(parseInt(this.sushi.text)+load);
        timer = this.time.now + 5000 ;
      }
  	}, this);

    this.timer1 = this.time.now ;
    this.timer2 = this.time.now ;
	};

	MainState.update = function() {
    
    components.underSea.update();

    this.physics.arcade.collide(seaShepherd.sprite, icebergs.group);
    this.physics.arcade.collide(icebergs.group, icebergs.group);
    this.physics.arcade.collide(chalutier.sprite, seaShepherd.sprite, chalutier.collideMortel, null, chalutier);
    this.physics.arcade.collide(chalutier.sprite, icebergs.group, chalutier.collideMortel, null, chalutier);

    this.physics.arcade.overlap(chalutier.sprite, fishes.group, chalutier.collideFish, null, chalutier);
    this.physics.arcade.overlap(chalutier.sprite, dolphins.group, chalutier.collideDolphin, null, chalutier);
    this.physics.arcade.overlap(chalutier.sprite, whales.group, chalutier.collideWhale, null, chalutier);
    
    if ( this.timer1 < game.time.now - 5000 ){
      var x = chalutier.sprite.x - seaShepherd.sprite.x;
      var y = chalutier.sprite.y - seaShepherd.sprite.y;

      game.add.tween(seaShepherd.sprite)
              .to({angle:Math.atan2(y, x)*180/Math.PI}, 4500, Phaser.Easing.Linear.None)
              .start();

      this.timer1 = game.time.now  ;
    };
    if ( this.timer2 < game.time.now - 3000 ) {
      for(var i=0; i<3; i++)
        icebergs.add();
      this.timer2 = game.time.now;
    };


    seaShepherd.update();
    chalutier.update(); 
    fishes.update();
    dolphins.update();
    whales.update();
    icebergs.update();
	};

	exposure.MainState = MainState;

})(GameState);