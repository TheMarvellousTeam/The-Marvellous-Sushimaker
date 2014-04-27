var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create});

function preload() {
  game.state.add('boot', GameState.BootState);
  game.state.add('game', GameState.MainState);
};

function create() {
  game.state.start('boot');
};
