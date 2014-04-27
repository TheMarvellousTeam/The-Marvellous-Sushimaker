var GameState = GameState || {};

(function( exposure ){

	var BootState = new Phaser.State();
	BootState.preload = function() {
  	this.load.image('logo', 'src/assets/logo.png');
  	this.load.image('baleine', 'src/assets/baleine.png');
  	this.load.image('banc_poissons', 'src/assets/banc_poissons.png');
  	this.load.image('chalutier_up', 'src/assets/chalutier_up.png');
  	this.load.image('chalutier_down', 'src/assets/chalutier_down.png');
    this.load.image('dauphin', 'src/assets/dauphin.png');
  	this.load.image('iceberg', 'src/assets/iceberg.png');
  	this.load.image('mine', 'src/assets/mine.png');
  	this.load.image('sea_shepherd', 'src/assets/sea_shepherd.png');
  	this.load.image('sushi', 'src/assets/sushi.png');
    this.load.image('sea', 'src/assets/sea.png');
    this.load.image('particle', 'src/assets/particle.png');

    components.underSea.preload();

	};
	BootState.create = function() {
  	var logo = this.add.sprite(0,0,'logo');
  	logo.inputEnabled = true ;
  	logo.input.useHandCurse = true;
  	logo.events.onInputDown.add(function(){
    	this.game.state.start('game');
  	});
	};

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

    var shadowLayer = new Phaser.Group( game );

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
    components.PathEditable.attach( chalutier )

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

    this.physics.arcade.collide(chalutier.sprite, seaShepherd.sprite, chalutier.collideMortel, null, this);
    this.physics.arcade.collide(chalutier.sprite, icebergs.group, chalutier.collideMortel, null, this);
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
    }
    if ( this.timer2 < game.time.now - 2000 ) {
      icebergs.add();
      this.timer2 = game.time.now;
    }


    seaShepherd.update();
    chalutier.update(); 
    fishes.update();
    dolphins.update();
    whales.update();
    icebergs.update();
	};

	exposure.BootState = BootState;
	exposure.MainState = MainState;

})(GameState);