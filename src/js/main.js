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
    game.state.start('game');
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
  var chalutierUp = this.add.sprite(game.width/4, game.height/2, 'chalutier_up');
  chalutierUp.anchor.setTo(0.5, 0.5);
  chalutierUp.scale.setTo(0.3, 0.3);

  var chalutierDown = this.add.sprite(game.width/4, game.height/2, 'chalutier_down');
  chalutierDown.anchor.setTo(0.5, 0.5);
  chalutierDown.scale.setTo(0.3, 0.3);
  chalutierDown.visible = false;
};


function preload() {
  game.state.add('boot', BootState);
  game.state.add('game', GameState);
};

function create() {
  game.state.start('boot');
};