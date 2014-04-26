var PIXI = require('PIXI');
var CES = require('CES');

var Geometry = CES.Component.extend({
    name: 'geometry',
    init:function( x , y ){
    	this.position = new PIXI.Point(x,y);
    },
});

exports.comp = Geometry;