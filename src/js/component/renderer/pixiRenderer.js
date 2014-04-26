var PIXI = require('PIXI');
var CES = require('CES');

var PixiRenderer = CES.Component.extend({
    name: 'PixiRenderer',
    init:function( texture , stage ){
    	this.texture = texture;
    	this.stage = stage;
    },
    prepare: function ( ) {
        console.warn('TODO add to stage')
    },
    dispose: function ( ) {
        console.warn('TODO remove from stage')
    },
});


exports.comp = PixiRenderer;