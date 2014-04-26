var components = components || {};

(function( exposure ){

	var Point = Phaser.Point;

	var AtomicBezierCurve = function AtomicBezierCurve () {};
	AtomicBezierCurve.prototype={

		pts:null,

		init:function( a ,b ,c ){
			if( Array.isArray( a ) )
				this.pts=a;
			else{
				this.pts = [a,b,c];
			}

			return this;
		},

		getLength:function(){
			if(this.length)
				return this.length;

			var l = Math.sqrt( 
				(this.pts[0].x-this.pts[1].x)*(this.pts[0].x-this.pts[1].x) + (this.pts[0].y-this.pts[1].y)*(this.pts[0].y-this.pts[1].y) ) + Math.sqrt( (this.pts[0].x-this.pts[2].x)*(this.pts[0].x-this.pts[2].x) + (this.pts[0].y-this.pts[2].y)*(this.pts[0].y-this.pts[2].y) );

			var k = Math.ceil(l*0.05)+1;

			var A = new Point(0,0),
				B = new Point(this.pts[0].x,this.pts[0].y)

			var l =0;

			for(var t=1;t<k;t++){
				A = A.set(B.x,B.y);
				B = this.getPoint( t/k , B );
				l += A.distance( B );
			}

			return ( this.length = l );
		},

		getPoint:function( t , resultat ){

			var t_ = 1-t;

			var x = t_*t_ * this.pts[0].x + t*t_ * this.pts[1].x + t*t * this.pts[2].x,
				y = t_*t_ * this.pts[0].y + t*t_ * this.pts[1].y + t*t * this.pts[2].y;

			return resultat ? resultat.set(x,y) : new Point(x,y);
		},

		getBoundingBox:function(){

			var top = new Point(this.pts[0].x,this.pts[0].y)
			var bottom = top.clone()

			var k = Math.ceil( this.getLength()*0.05)+1;

			var A = new Point(0,0)

			for(var t=1;t<k;t++){
				A = this.getPoint( t/k , A );
				
				if( A.x > bottom.x )
					bottom.x = A.x
				if( A.y > bottom.y )
					bottom.y = A.y

				if( A.x < top.x )
					top.x = A.x
				if( A.y < top.y )
					top.y = A.y
			}

			return {
				top : top,
				bottom : bottom
			}
		},
	};


	var BezierCurve = function BezierCurve () {};
	BezierCurve.prototype={

		_atomic : null,

		init:function(  ){
			this._atomic = [];

			return this;
		},

		getLength:function(){
			var l = 0;
			for( var i=this._atomic.length;i--;)
				l+=this._atomic[i].getLength();
			return l;
		},

		getPoint:function( t , resultat ){

			if( t==0 )
				return this._atomic[0].getPoint( t , resultat );

			if( t==1 )
				return this._atomic[ this._atomic.length-1 ].getPoint( t , resultat );

			var l=this.getLength();
			var s=0;
			for( var i=0; t<s/l ; i++)
				s+=this._atomic[i].getLength();

			var t_ = (t-(s/l))/this._atomic[i].getLength();

			return this._atomic[i].getPoint( t_ , resultat );
		},

		getBoundingBox : function(){

			var bb = this._atomic[0].getBoundingBox();

			for( var i=1;i<this._atomic.length;i++){

				var tmp = this._atomic[i].getBoundingBox();

				if( tmp.bottom.x > bb.bottom.x )
					bb.bottom.x = tmp.bottom.x
				if( tmp.bottom.y > bb.bottom.y )
					bb.bottom.y = tmp.bottom.y

				if( tmp.top.x > bb.top.x )
					bb.top.x = tmp.top.x
				if( tmp.top.y > bb.top.y )
					bb.top.y = tmp.top.y
			}

			return bb;
		},
	};

	var GetPointOnQuadraticBezier = function( ){

	}

	var BezierDisplay = function( game ){

		var graphics = game.add.graphics(0, 0);


	}

	var C = function PathEditable(){};
	C.prototype={

		_graphic : null,

		_controlPoints : null,

		init:function( target ){
			this.target = target;

			var game = game;

			this._graphic = new Phaser.Graphics( game , 0, 0);

			this.drawPath();

			this.bc = new BezierCurve().init();
			this.bc._atomic = [ new AtomicBezierCurve().init( new Point(50,50) , new Point(250,150) , new Point(50,450) ) ]
			
			this.bc.getBoundingBox();
		},

		drawPath:function(){

			this._graphic.clear();

		},

	}


	exposure.PathEditable = C;

})( components );

