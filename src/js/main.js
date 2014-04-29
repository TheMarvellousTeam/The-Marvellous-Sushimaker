var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', { preload: preload, create: create});

function preload() {
  	game.state.add('boot', GameState.BootState);
  	game.state.add('game', GameState.MainState);
	game.state.add('end', GameState.EndState);
};

function create() {
  game.state.start('boot');
};

