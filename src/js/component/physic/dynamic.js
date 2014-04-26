var PIXI = require('PIXI');
var CES = require('CES');

var Dynamic = CES.Component.extend({
    name: 'dynamic',
    init:function( x , y ){
    	this.speed = new PIXI.Point(0,0);
    },
});

exports.comp = Dynamic;