var GameState = GameState || {};

(function( exposure ){

	var EndState = new Phaser.State();

	EndState.create = function() {
    game.add.sprite(0,0,'end');
	};

	exposure.EndState = EndState;

})(GameState);