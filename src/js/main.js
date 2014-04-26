var game = new Phaser.Game(1200, 900, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var preload = function() {
  game.load.image('logo', 'src/assets/logo.png');
};

var create = function() {
  var logo = game.add.sprite('logo');
};

var update = function() {

};