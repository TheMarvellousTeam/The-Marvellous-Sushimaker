game.module(
    'game.main'
)
.require(
	'game.assets',
	'game.objects',
	'game.scene'
)
.body(function() {

game.start(SceneGame, 1200, 900);

});
