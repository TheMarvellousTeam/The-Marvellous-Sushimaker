<<<<<<< HEAD

// bootstrap Phaser
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
function preload() {
	game.load.image('boat', 'src/img/boat.png');
}
 
function create() {

	game.add.sprite(0, 0, 'boat');

}
 
function update() {
}
=======
console.log('hello word');
>>>>>>> parent of af0d327... bowersify
