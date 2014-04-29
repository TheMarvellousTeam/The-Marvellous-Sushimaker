var GameState = GameState || {};

(function( exposure ){

	var EndState = new Phaser.State();

	EndState.create = function() {
    game.add.sprite(0,0,'end');
	};

  EndState.update = function(){
    // Besoin d'un update ??
  };

	exposure.EndState = EndState;

})(GameState);