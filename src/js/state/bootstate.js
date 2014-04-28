var GameState = GameState || {};

(function( exposure ){

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
    this.load.image('sea_shepherd', 'src/assets/sea_shepherd.png');
    this.load.image('sushi', 'src/assets/sushi.png');
    this.load.image('particle', 'src/assets/particle2.png');
    this.load.image('filet0', 'src/assets/filet0.png');
    this.load.image('filet1', 'src/assets/filet1.png');
    this.load.image('filet2', 'src/assets/filet2.png');
    this.load.image('filet3', 'src/assets/filet3.png');
    this.load.image('filet4', 'src/assets/filet4.png');
    components.underSea.preload();
	};
	BootState.create = function() {
  	var logo = this.add.sprite(0,0,'logo');
  	logo.inputEnabled = true ;
  	logo.input.useHandCurse = true;
  	logo.events.onInputDown.add(function(){
    	this.game.state.start('game');
  	});
	};

	exposure.BootState = BootState;

})(GameState);