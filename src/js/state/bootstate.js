var GameState = GameState || {};

(function( exposure ){

	var BootState = new Phaser.State();
	BootState.preload = function() {
  	this.load.image('logo', 'src/assets/logo.png');
    
	};
	BootState.create = function() {
  	var logo = this.add.sprite(0,0,'logo');
    //this.game.state.start('game');
  	logo.inputEnabled = true ;
  	logo.input.useHandCurse = true;
  	logo.events.onInputDown.add(function(){
    	this.game.state.start('game');
  	});
	};

	exposure.BootState = BootState;

})(GameState);