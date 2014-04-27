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
  		this.load.image('sea_shepher', 'src/assets/sea_shepherd.png');
  		this.load.image('sushi', 'src/assets/sushi.png');
	};
	BootState.create = function() {
  		var logo = this.add.sprite(0,0,'logo');
  		logo.inputEnabled = true ;
  		logo.input.useHandCurse = true;
  		logo.events.onInputDown.add(function(){
    		//this.game.state.start('game');
  		});

      pe = ( new components.PathEditable() ).init().listen( true );
	};

	BootState.update = function() {
    pe.update();
	};


	var MainState = new Phaser.State();
	MainState.preload = function() {

	};

	MainState.create = function() {
  		this.stage.backgroundColor='#A5CEF2';

		this.world.setBounds(0, 0, 5000, 5000);

		this.fish = [];
  		for(var i=0; i<10; i++){
  			this.createFish();
  		}

  		this.chalutier = this.add.sprite(this.world.width/2, this.world.height/2, 'chalutier_up');
  		this.chalutier.anchor.setTo(0.5, 0.5);
  		this.chalutier.scale.setTo(0.3, 0.3);
  		this.physics.enable(this.chalutier, Phaser.Physics.ARCADE);
  		this.filetUp = true ;
  		this.speed = 0 ;
		this.camera.follow(this.chalutier);

		var sushi = this.add.sprite(35, this.game.height - 35, 'sushi');
  		sushi.anchor.setTo(0.5, 0.5);
  		sushi.scale.setTo(0.1, 0.1);
  		sushi.fixedToCamera = true;
  		this.sushi = this.add.text(65, this.game.height - 47, '0', {fontSize: 14, fill:"#000000"});
  		this.sushi.fixedToCamera = true;

  		var spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  		spacebar.onDown.add(function() {
    		if (this.filetUp){
      			this.chalutier.loadTexture('chalutier_down');
    		} else {
      			this.chalutier.loadTexture('chalutier_up');
    		}
    		this.filetUp = !this.filetUp;
  		}, this);
	};

	MainState.createFish = function() {
		var afish = this.add.sprite(Math.random()*this.world.width, Math.random()*this.world.height, 'banc_poissons');
		afish.scale.setTo(0.2, 0.2);
		afish.addToAngle = Math.random()*3 - Math.random();
		this.physics.arcade.enable(afish, Phaser.Physics.ARCADE);
		this.fish.push(afish);
	};

	MainState.update = function() {
  		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    		this.chalutier.angle -= 2;
  		} else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    		this.chalutier.angle += 2;
  		} else if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    		this.speed += 10 ;
  		} else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
    		this.speed -= 10;
  		}
  		this.physics.arcade.velocityFromAngle(this.chalutier.angle, speed, this.chalutier.body.velocity);


  		if ( this.chalutier.x > this.world.width || this.chalutier.x < 0 || this.chalutier.y > this.world.height || this.chalutier.y < 0 ){
    		this.game.state.start('boot'); 
  		}

  		this.physics.arcade.overlap(this.chalutier, this.fish, onCollideFish, null, this);
  		for( var i=0; i<this.fish.length; i++){
  			this.fish[i].angle += this.fish[i].addToAngle ;
  			this.physics.arcade.velocityFromAngle(this.fish[i].angle, 150+Math.random()*300, this.fish[i].body.velocity);
  		}
	};

	var onCollideFish = function(obj1, obj2) {
		if ( !this.filetUp){
  			obj2.kill();
  			this.sushi.text = ''+(parseInt(this.sushi.text)+1+Math.floor(Math.random()*2));
  			this.createFish();
  		}
  	};

	exposure.BootState = BootState;
	exposure.MainState = MainState;

})(GameState);