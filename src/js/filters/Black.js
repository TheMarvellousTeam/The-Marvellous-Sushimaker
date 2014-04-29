/**
* @author Mat Groves http://matgroves.com/ @Doormat23
*/

/**
* This turns your displayObjects to grayscale.
* @class Gray
* @contructor
*/
Phaser.Filter.Black = function (game) {

    Phaser.Filter.call(this, game);

    this.fragmentSrc = [

        "precision mediump float;",

        "varying vec2       vTextureCoord;",
        "varying vec4       vColor;",
        "uniform sampler2D  uSampler;",

        "void main(void) {",
            "gl_FragColor = texture2D(uSampler, vTextureCoord);",
            "gl_FragColor.r = 0.;",
            "gl_FragColor.g = 0.;",
            "gl_FragColor.b = 0.;",
            "gl_FragColor.a = gl_FragColor.a * 0.5;",
        "}"
    ];

};

//"gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);",

Phaser.Filter.Black.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Black.prototype.constructor = Phaser.Filter.Black;
