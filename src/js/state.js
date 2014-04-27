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
    this.load.image('sea', 'src/assets/sea.jpg');
    this.load.image('particle', 'src/assets/particle.png');
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

	var MainState = new Phaser.State();
	MainState.create = function() {
    this.stage.backgroundColor='#A5CEF2';
    var sea = this.add.sprite(0,0, 'sea');
    sea.width = 5000;
    sea.height = 5000;


		this.world.setBounds(0, 0, 5000, 5000);


    fishes.init({
      count: 50,
      texture: 'banc_poissons',
      scale: 0.1,
      speed: 100
    });

    whales.init({
      count: 5,
      texture: 'baleine',
      scale:0.25,
      speed: 200
    });

    dolphins.init({
      count: 10,
      texture: 'dauphin',
      scale:0.1,
      speed: 300
    });

    chalutier.init({
      x: this.world.width/2,
      y: this.world.height/2,
      texture : 'chalutier_up',
      scale : 0.3
    });

    seaShepherd. init({
      x: this.world.randomX,
      y: this.world.randomY,
      texture : 'sea_shepherd',
      scale : 0.3
    });


    this.camera.follow( chalutier.sprite );
    components.PathEditable.attach( chalutier )

		var sushi = this.add.sprite(35, this.game.height - 35, 'sushi');
  	sushi.anchor.setTo(0.5, 0.5);
  	sushi.scale.setTo(0.1, 0.1);
  	sushi.fixedToCamera = true;
  	this.sushi = this.add.text(65, this.game.height - 47, '0', {fontSize: 14, fill:"#000000"});
  	this.sushi.fixedToCamera = true;

  	var filetControl = this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
    var timer = this.time.now ;
  	filetControl.onDown.add(function() {
      if ( this.time.now > timer ) {
        var load = chalutier.actionFilet();
        this.sushi.text = ''+(parseInt(this.sushi.text)+load);
        timer = this.time.now + 5000 ;
      }
  	}, this);
    
	};

	MainState.update = function() {
    this.physics.arcade.overlap(chalutier.sprite, fishes.group, chalutier.collideFish, null, chalutier);
    this.physics.arcade.overlap(chalutier.sprite, dolphins.group, chalutier.collideDolphin, null, chalutier);
    this.physics.arcade.overlap(chalutier.sprite, whales.group, chalutier.collideWhale, null, chalutier);
    this.physics.arcade.collide(chalutier.sprite, seaShepherd.sprite, chalutier.collideSeaShepherd, null, chalutier);

    chalutier.update(); 
    seaShepherd.update();
    fishes.update();
    whales.update();
    dolphins.update();
	};

	exposure.BootState = BootState;
	exposure.MainState = MainState;

})(GameState);