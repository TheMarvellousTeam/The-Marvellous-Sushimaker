var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create});

// BOOT SCREEN
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
    this.game.state.start('game');
  });

  new components.PathEditable().init().listen(true);

};
BootState.update = function() {
};

// GAME STATE
var GameState = new Phaser.State();
GameState.preload = function() {

};
GameState.create = function() {
  this.world.setBounds(0, 0, 5000, 5000);

  var sushi = this.add.sprite(35, this.game.height - 35, 'sushi');
  sushi.anchor.setTo(0.5, 0.5);
  sushi.scale.setTo(0.1, 0.1);
  sushi.fixedToCamera = true;
  this.sushi = this.add.text(65, this.game.height - 47, '0', {fontSize: 14, fill:"#FFFFFF"});
  this.sushi.fixedToCamera = true;

  this.chalutier = this.add.sprite(this.world.width/2, this.world.height/2, 'chalutier_up');
  this.chalutier.anchor.setTo(0.5, 0.5);
  this.chalutier.scale.setTo(0.3, 0.3);

  this.filetUp = true ;

  this.camera.follow(this.chalutier);

  var spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spacebar.onDown.add(function() {
    this.sushi.text = ''+(parseInt(this.sushi.text)+1);

    if (this.filetUp){
      this.chalutier.loadTexture('chalutier_down');
    } else {
      this.chalutier.loadTexture('chalutier_up');
    }
    this.filetUp = !this.filetUp;
  }, this);
};
GameState.update = function() {
  if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.chalutier.x -= 20;
  } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.chalutier.x += 20;
  } else if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    this.chalutier.y -= 20;
  } else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
    this.chalutier.y += 20;
  }

  if ( this.chalutier.x > this.world.width || this.chalutier.x < 0 || this.chalutier.y > this.world.height || this.chalutier.y < 0 ){
    this.game.state.start('boot'); 
  }

};




function preload() {
  game.state.add('boot', BootState);
  game.state.add('game', GameState);
};

function create() {
  game.state.start('boot');
};