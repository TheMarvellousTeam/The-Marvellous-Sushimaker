/**
    @module system
    @namespace game
**/
game.module(
    'engine.system'
)
.body(function() {
'use strict';

/**
    @class System
    @extends game.Class
**/
game.System = game.Class.extend({
    /**
        Width of the game screen.
        @property {Number} width
    **/
    width: null,
    /**
        Height of the game screen.
        @property {Number} height
    **/
    height: null,
    /**
        Current delta-time.
        @property {Number} delta
    **/
    delta: 0,
    /**
        Main game timer.
        @property {Timer} timer
    **/
    timer: null,
    /**
        Canvas element.
        @property {HTMLCanvasElement} canvas
    **/
    canvas: null,
    /**
        Id of canvas element.
        @property {String} canvasId
        @default canvas
    **/
    canvasId: 'canvas',
    /**
        Is engine paused.
        @property {Boolean} paused
    **/
    paused: false,
    /**
        Is engine in HiRes mode.
        @property {Boolean} hires
    **/
    hires: false,
    /**
        Is engine in Retina mode.
        @property {Boolean} retina
    **/
    retina: false,
    /**
        Is mobile rotate screen visible.
        @property {Boolean} rotateScreenVisible
    **/
    rotateScreenVisible: false,
    /**
        Current id of the game loop.
        @property {Number} gameLoopId
    **/
    gameLoopId: 0,
    /**
        New scene to be set on end of run loop.
        @property {game.Scene} newSceneClass
    **/
    newSceneClass: null,
    /**
        Is game engine running.
        @property {Boolean} running
    **/
    running: false,

    init: function(width, height, canvasId) {
        width = width || game.System.width;
        height = height || game.System.height;
        if (!width) width = (game.System.orientation === game.System.PORTRAIT ? 768 : 1024);
        if (!height) height = (game.System.orientation === game.System.PORTRAIT ? 927 : 672);

        if (typeof game.System.aspectRatio === 'string') {
            var ratio = game.System.aspectRatio.split(':');
            if (ratio.length === 2) {
                if (window.innerWidth / window.innerHeight > ratio[0] / ratio[1]) {
                    height = window.innerHeight;
                    width = (height / ratio[1]) * ratio[0];
                }
                else {
                    width = window.innerWidth;
                    height = (width / ratio[0]) * ratio[1];
                }
                game.System.hires = false;
                game.System.scale = false;
            }
        }

        if (game.System.hires) {
            if (typeof game.System.hiresWidth === 'number' && typeof game.System.hiresHeight === 'number') {
                if (window.innerWidth >= game.System.hiresWidth && window.innerHeight >= game.System.hiresHeight) {
                    this.hires = true;
                }
            }
            else if (window.innerWidth >= width * game.System.hiresFactor && window.innerHeight >= height * game.System.hiresFactor) {
                this.hires = true;
            }
        }
        if (game.System.retina && game.device.pixelRatio === 2) {
            this.retina = true;
        }
        if (this.hires || this.retina) {
            width *= 2;
            height *= 2;
            game.scale = 2;
        }

        if (typeof game.System.resize !== 'undefined') game.System.scale = game.System.resize; // Deprecated

        this.width = width;
        this.height = height;
        this.canvasId = canvasId || this.canvasId;
        this.timer = new game.Timer();

        if (!document.getElementById(this.canvasId)) {
            var canvas = document.createElement((navigator.isCocoonJS && game.System.screenCanvas) ? 'screencanvas' : 'canvas');
            canvas.id = this.canvasId;
            document.body.appendChild(canvas);
        }

        // Deprecated
        if (game.System.canvas === false) game.System.webGL = true;

        if (game.System.webGL) this.renderer = new game.autoDetectRenderer(width, height, document.getElementById(this.canvasId), game.System.transparent, game.System.antialias);
        else this.renderer = new game.CanvasRenderer(width, height, document.getElementById(this.canvasId), game.System.transparent);

        this.canvas = this.renderer.view;
        this.stage = new game.Stage();

        game.normalizeVendorAttribute(this.canvas, 'requestFullscreen');
        game.normalizeVendorAttribute(this.canvas, 'requestFullScreen');
        game.normalizeVendorAttribute(navigator, 'vibrate');

        document.body.style.margin = 0;

        if (this.retina) {
            this.canvas.style.width = width / 2 + 'px';
            this.canvas.style.height = height / 2 + 'px';
        }
        else {
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
        }

        if (!navigator.isCocoonJS) {
            var visibilityChange;
            if (typeof document.hidden !== 'undefined') {
                visibilityChange = 'visibilitychange';
            }
            else if (typeof document.mozHidden !== 'undefined') {
                visibilityChange = 'mozvisibilitychange';
            }
            else if (typeof document.msHidden !== 'undefined') {
                visibilityChange = 'msvisibilitychange';
            }
            else if (typeof document.webkitHidden !== 'undefined') {
                visibilityChange = 'webkitvisibilitychange';
            }

            document.addEventListener(visibilityChange, function() {
                if (game.System.pauseOnHide) {
                    var hidden = !!game.getVendorAttribute(document, 'hidden');
                    if (hidden) game.system.pause();
                    else game.system.resume();
                }
            }, false);
        }

        window.addEventListener('devicemotion', function(event) {
            game.accelerometer = game.accel = event.accelerationIncludingGravity;
        }, false);

        if (!navigator.isCocoonJS) {
            // Deprecated
            if (typeof game.System.backgroundColor === 'object') {
                game.System.bgColorMobile = game.System.backgroundColor.mobile;
                game.System.bgColorRotate = game.System.backgroundColor.rotate;
            }
            // Deprecated
            if (typeof game.System.backgroundImage === 'object') {
                game.System.bgImageMobile = game.System.backgroundImage.mobile;
                game.System.bgImageRotate = game.System.backgroundImage.rotate;
            }

            if (game.System.bgColor && !game.System.bgColorMobile) game.System.bgColorMobile = game.System.bgColor;
            if (game.System.bgColorMobile && !game.System.bgColorRotate) game.System.bgColorRotate = game.System.bgColorMobile;

            if (game.System.bgImage && !game.System.bgImageMobile) game.System.bgImageMobile = game.System.bgImage;
            if (game.System.bgImageMobile && !game.System.bgImageRotate) game.System.bgImageRotate = game.System.bgImageMobile;

            if (!game.device.mobile) {
                if (game.System.bgColor) document.body.style.backgroundColor = game.System.bgColor;
                if (game.System.bgImage) document.body.style.backgroundImage = 'url(' + game.config.mediaFolder + game.System.bgImage + ')';
            }
            if (game.System.bgPosition) document.body.style.backgroundPosition = game.System.bgPosition;
        }

        if (navigator.isCocoonJS) {
            this.canvas.style.cssText = 'idtkscale:' + game.System.idtkScale + ';';
        }

        game.renderer = this.renderer;

        if (!navigator.isCocoonJS) this.initResize();
    },

    /**
        Vibrate device.
        @method vibrate
        @param {Number} time Time to vibrate.
    **/
    vibrate: function(time) {
        if (navigator.vibrate) return navigator.vibrate(time);
        return false;
    },

    /**
        Pause game engine.
        @method pause
    **/
    pause: function() {
        if (this.paused) return;
        this.paused = true;
        if (game.scene) game.scene.pause();
    },

    /**
        Resume paused game engine.
        @method resume
    **/
    resume: function() {
        if (!this.paused) return;
        this.paused = false;
        game.Timer.last = Date.now();
        if (game.scene) game.scene.resume();
    },

    /**
        Change current scene.
        @method setScene
        @param {game.Scene} sceneClass
    **/
    setScene: function(sceneClass) {
        if (this.running) this.newSceneClass = sceneClass;
        else this.setSceneNow(sceneClass);
    },

    setSceneNow: function(SceneClass) {
        if (game.tweenEngine) game.tweenEngine.tweens.length = 0;
        game.scene = new (SceneClass)();
        if (game.Debug && game.Debug.enabled && !navigator.isCocoonJS) this.debug = new game.Debug();
        this.startRunLoop();
    },

    startRunLoop: function() {
        if (this.gameLoopId) this.stopRunLoop();
        this.gameLoopId = game.setGameLoop(this.run.bind(this), this.canvas);
        this.running = true;
    },

    stopRunLoop: function() {
        game.clearGameLoop(this.gameLoopId);
        this.running = false;
    },

    run: function() {
        if (this.paused) return;

        game.Timer.update();
        this.delta = this.timer.delta() / 1000;

        game.scene.run();

        if (this.debug) this.debug.update();

        if (this.newSceneClass) {
            this.setSceneNow(this.newSceneClass);
            this.newSceneClass = null;
        }
    },

    resize: function(width, height) {
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.renderer.resize(this.width, this.height);
    },

    initResize: function() {
        this.ratio = game.System.orientation === game.System.LANDSCAPE ? this.width / this.height : this.height / this.width;

        if (game.System.center) this.canvas.style.margin = 'auto';

        if (game.device.mobile) {
            // Mobile position
            if (!game.System.center) {
                this.canvas.style.position = 'absolute';
                this.canvas.style.left = game.System.left + 'px';
                this.canvas.style.top = game.System.top + 'px';
            }

            document.addEventListener('touchstart', function(e) {
                e.preventDefault();
            }, false);

            var div = document.createElement('div');
            div.innerHTML = game.System.rotateImg ? '' : game.System.rotateMsg;
            div.style.position = 'absolute';
            div.style.height = '12px';
            div.style.textAlign = 'center';
            div.style.left = 0;
            div.style.right = 0;
            div.style.top = 0;
            div.style.bottom = 0;
            div.style.margin = 'auto';
            div.style.display = 'none';
            game.System.rotateDiv = div;
            document.body.appendChild(game.System.rotateDiv);

            if (game.System.rotateImg) {
                var img = new Image();
                var me = this;
                img.onload = function() {
                    div.image = img;
                    div.style.height = img.height + 'px';
                    div.appendChild(img);
                    me.resizeRotateImage();
                };
                img.src = game.config.mediaFolder + game.System.rotateImg;
                img.style.position = 'relative';
            }
        }
        else {
            // Desktop center
            this.canvas.style.position = 'absolute';
            if (game.System.center) {
                this.canvas.style.top = 0;
                this.canvas.style.left = 0;
                this.canvas.style.bottom = 0;
                this.canvas.style.right = 0;
            }
            else {
                this.canvas.style.left = game.System.left + 'px';
                this.canvas.style.top = game.System.top + 'px';
            }

            // Desktop scaling
            if (game.System.scale) {
                var minWidth = game.System.minWidth === 'auto' ? this.retina ? this.width / 4 : this.width / 2 : game.System.minWidth;
                var minHeight = game.System.minHeight === 'auto' ? this.retina ? this.height / 4 : this.height / 2 : game.System.minHeight;
                var maxWidth = game.System.maxWidth === 'auto' ? this.retina ? this.width / 2 : this.width : game.System.maxWidth;
                var maxHeight = game.System.maxHeight === 'auto' ? this.retina ? this.height / 2 : this.height : game.System.maxHeight;
                if (game.System.minWidth) this.canvas.style.minWidth = minWidth + 'px';
                if (game.System.minHeight) this.canvas.style.minHeight = minHeight + 'px';
                if (game.System.maxWidth) this.canvas.style.maxWidth = maxWidth + 'px';
                if (game.System.maxHeight) this.canvas.style.maxHeight = maxHeight + 'px';
            }
        }

        if (typeof window.onorientationchange !== 'undefined') {
            window.onorientationchange = this.onResize.bind(this);
        }
        else {
            window.onresize = this.onResize.bind(this);
        }

        this.onResize();
    },

    checkOrientation: function() {
        this.orientation = window.innerWidth < window.innerHeight ? game.System.PORTRAIT : game.System.LANDSCAPE;
        if (game.device.android2 && window.innerWidth === 320 && window.innerHeight === 251) {
            // Android 2.3 portrait fix
            this.orientation = game.System.PORTRAIT;
        }
        this.rotateScreenVisible = game.System.orientation !== this.orientation ? true : false;

        this.canvas.style.display = this.rotateScreenVisible ? 'none' : 'block';
        game.System.rotateDiv.style.display = this.rotateScreenVisible ? 'block' : 'none';

        if (this.rotateScreenVisible && game.System.bgColorRotate) document.body.style.backgroundColor = game.System.bgColorRotate;
        if (!this.rotateScreenVisible && game.System.bgColorMobile) document.body.style.backgroundColor = game.System.bgColorMobile;

        if (this.rotateScreenVisible && game.System.bgImageRotate) document.body.style.backgroundImage = 'url(' + game.config.mediaFolder + game.System.bgImageRotate + ')';
        if (!this.rotateScreenVisible && game.System.bgImageMobile) document.body.style.backgroundImage = 'url(' + game.config.mediaFolder + game.System.bgImageMobile + ')';

        if (this.rotateScreenVisible && game.system && typeof game.system.pause === 'function') game.system.pause();
        if (!this.rotateScreenVisible && game.system && typeof game.system.resume === 'function') game.system.resume();

        if (this.rotateScreenVisible) this.resizeRotateImage();
    },

    resizeRotateImage: function() {
        if (this.rotateScreenVisible && game.System.rotateDiv.image) {
            if (window.innerHeight < game.System.rotateDiv.image.height) {
                game.System.rotateDiv.image.style.height = window.innerHeight + 'px';
                game.System.rotateDiv.image.style.width = 'auto';
                game.System.rotateDiv.style.height = window.innerHeight + 'px';
                game.System.rotateDiv.style.bottom = 'auto';
            }
        }
    },

    onResize: function() {
        // Mobile orientation
        if (game.device.mobile) this.checkOrientation();

        if (!game.System.scale) return;

        if (game.device.mobile) {
            // Mobile resize
            var width = window.innerWidth;
            var height = window.innerHeight;

            // iPad iOS 7.0 landscape innerHeight bugfix
            if (game.device.iPad && height === 671 && this.orientation === game.System.LANDSCAPE) height = 672;

            if (game.System.orientation === game.System.LANDSCAPE) {
                this.canvas.style.height = height + 'px';
                this.canvas.style.width = height * this.ratio + 'px';
            }
            else {
                this.canvas.style.width = width + 'px';
                this.canvas.style.height = width * this.ratio + 'px';
            }

            if (game.device.iOS71) setTimeout(this.onResize.bind(this), 100);

            if (!game.device.ejecta) window.scroll(0, 1);
        }
        else {
            // Desktop resize
            if (window.innerWidth === 0) return; // Chrome bug
            if (window.innerWidth < this.width || window.innerHeight < this.height) {
                if (window.innerWidth / this.width < window.innerHeight / this.height) {
                    this.canvas.style.width = window.innerWidth + 'px';
                    this.canvas.style.height = window.innerWidth * (this.height / this.width) + 'px';
                }
                else {
                    this.canvas.style.height = window.innerHeight + 'px';
                    this.canvas.style.width = window.innerHeight * (this.width / this.height) + 'px';
                }
            }
            else {
                this.canvas.style.width = this.width + 'px';
                this.canvas.style.height = this.height + 'px';
            }
        }
    }
});

/**
    Enable/disable canvas centering.
    @attribute {Boolean} center
    @default true
**/
game.System.center = true;
/**
    Canvas position from left, when centering is disabled.
    @attribute {Number} left
    @default 0
**/
game.System.left = 0;
/**
    Canvas position from top, when centering is disabled.
    @attribute {Number} top
    @default 0
**/
game.System.top = 0;
/**
    Enable/disable canvas scaling.
    @attribute {Boolean} resize
    @default true
**/
game.System.scale = true;
/**
    Minimum width for canvas, when using scaling on desktop.
    @attribute {Number} minWidth
    @default auto
**/
game.System.minWidth = 'auto';
/**
    Minimum height for canvas, when using scaling on desktop.
    @attribute {Number} minHeight
    @default auto
**/
game.System.minHeight = 'auto';
/**
    Maximum width for canvas, when using scaling on desktop.
    @attribute {Number} maxWidth
    @default auto
**/
game.System.maxWidth = 'auto';
/**
    Maximum height for canvas, when using scaling on desktop.
    @attribute {Number} maxHeight
    @default auto
**/
game.System.maxHeight = 'auto';
/**
    Scaling method for CocoonJS.
    @attribute {ScaleToFill|ScaleAspectFit|ScaleAspectFill} idtkScale
    @default ScaleAspectFit
**/
game.System.idtkScale = 'ScaleAspectFit';
/**
    Use ScreenCanvas on CocoonJS.
    http://support.ludei.com/hc/en-us/articles/201810268-ScreenCanvas
    @attribute {Boolean} screenCanvas
    @default true
**/
game.System.screenCanvas = true;
/**
    Use HiRes mode.
    @attribute {Boolean} hires
    @default false
**/
game.System.hires = false;
/**
    Canvas width/height factor, when HiRes mode is enabled.
    @attribute {Number} hiresFactor
    @default 1.5
**/
game.System.hiresFactor = 1.5;
game.System.hiresWidth = null;
game.System.hiresHeight = null;
/**
    Use Retina mode.
    @attribute {Boolean} retina
    @default false
**/
game.System.retina = false;
/**
    Pause game engine, when page is hidden.
    @attribute {Boolean} pauseOnHide
    @default true
**/
game.System.pauseOnHide = true;
game.System.PORTRAIT = 0;
game.System.LANDSCAPE = 1;
/**
    Mobile orientation for the game.
    @attribute {LANDSCAPE|PORTRAIT} orientation
    @default game.System.PORTRAIT
**/
game.System.orientation = game.System.PORTRAIT;
/**
    Body background color.
    @attribute {String} bgColor
**/
game.System.bgColor = '#000000';
/**
    Body background color for mobile.
    @attribute {String} bgColorMobile
**/
game.System.bgColorMobile = null;
/**
    Body background color for mobile rotate screen.
    @attribute {String} bgColorRotate
**/
game.System.bgColorRotate = null;
/**
    Body background image.
    @attribute {String} bgImage
**/
game.System.bgImage = null;
/**
    Body background image for mobile.
    @attribute {String} bgImageMobile
**/
game.System.bgImageMobile = null;
/**
    Body background image for mobile rotate screen.
    @attribute {String} bgImageRotate
**/
game.System.bgImageRotate = null;
/**
    Body background image position.
    @attribute {String} bgPosition
**/
game.System.bgPosition = null;
/**
    Rotate message for mobile.
    @attribute {String} rotateMsg
    @default Please rotate your device
**/
game.System.rotateMsg = 'Please rotate your device';
/**
    Rotate image for mobile.
    @attribute {URL} rotateImg
    @default null
**/
game.System.rotateImg = 'rotate.png';
/**
    Enable WebGL renderer.
    @attribute {Boolean} webGL
    @default false
**/
game.System.webGL = false;
/**
    Use transparent renderer.
    @attribute {Boolean} transparent
    @default false
**/
game.System.transparent = false;
/**
    Use antialias (only on WebGL).
    @attribute {Boolean} antialias
    @default false
**/
game.System.antialias = false;

// Testing, is this useful?
game.System.aspectRatio = null;

});
