game.module(
    'game.scene'
)
.require(
    'engine.scene'
)
.body(function() {

SceneGame = game.Scene.extend({
    backgroundColor: 0xb9bec7,

    init: function() {
        this.trawler = new Trawler();
    }

});

});