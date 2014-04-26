var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.load.image('logo', 'src/assets/logo.png');
};

function create() {
  var logo = game.add.sprite(0,0,'logo');
};

function update() {

};

function render() {

};