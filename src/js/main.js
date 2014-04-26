var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update});

var BootState = new Phaser.State();
BootState.preload = function() {
  game.load.image('logo', 'src/assets/logo.png');
};
BootState.create = function() {
  this.load.sprite(0,0,'logo');
  this.now = game.time.now ;
};
BootState.update = function() {
  if ( game.time.now > this.now + 5000 ) {
    this.shutdown();
    game.state.start('game');
  }
};

var GameState = new Phaser.State();

function preload() {
  game.state.add('boot', BootState);
  game.state.add('game', GameState);
};

function create() {
  game.state.start('boot');
};

function update() {

};