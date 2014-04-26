
var PIXI = require('PIXI');
var rendererComponenet = require('./component/renderer/pixiRenderer');

var canvas = document.getElementById("game-canvas");
renderer = PIXI.autoDetectRenderer(
    canvas.width,
    canvas.height,
    canvas
);


