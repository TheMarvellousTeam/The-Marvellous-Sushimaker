var components = components || {};

(function( exposure ){

	var Point = Phaser.Point;

	var tmp = new Point();
	var tmp2 = new Point();
	var tmp3 = new Point();
	var tmp4 = new Point();

	var squareDistance = function( A , B ){
		var x=A.x-B.x,y=A.y-B.y;
		return x*x + y*y;
	}

	var maximise = function( max , B ){
		if( B.x > max.x )
			max.x = B.x
		if( B.y > max.y )
			max.y = B.x
		return max;
	}

	var minimise = function( min , B ){
		if( B.x < min.x )
			min.x = B.x
		if( B.y < min.y )
			min.y = B.x
		return min;
	}

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

		collide:function(x,y,marge){

			marge = marge || 2;

			var bb = this.getBoundingBox();

			if( bb.top.x + marge > x || bb.bottom.x - marge < x || bb.top.y + marge > y || bb.bottom.y - marge < y )
				return null;

			var l = this.getLength();

			var k = 30;

			var B = tmp2.set( this.pts[0].x , this.pts[0].y );
			var A = tmp

			var top = tmp3
			var bot = tmp4

			for(var t=1;t<=k;t++){
				
				A = A.set( B.x , B.y );
				B = this.getPoint( t/k , B );

				bot.x = Math.max( A.x , B.x )+marge;
				bot.y = Math.max( A.y , B.y )+marge;

				top.x = Math.min( A.x , B.x )-marge;
				top.y = Math.min( A.y , B.y )-marge;

				if( top.x > x || bot.x < x || top.y > y || bot.y < y )
					continue;

				//dichotomie

				var a = t/k,
					b = (t-1)/k

				return {
					atomic : this,
					atomic_t : (a+b)/2,
					p : this.getPoint( (a+b)/2 )
				}

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

			var t_ = ( t*l-s )/this._atomic[i].getLength();

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

		collide:function( x , y ){
			var collideInfo;
			for( var i=this._atomic.length;i--;)
				if( ( collideInfo = this._atomic[i].collide(x,y) ) ){
					return collideInfo
				}
			return null;
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

			this._graphic = new Phaser.Graphics( game , 0, 0);

			game.world
			game.stage.addChild( this._graphic );


			this.bc = new BezierCurve().init();
			this.bc._atomic = [ new AtomicBezierCurve().init( new Point(50,50) , new Point(550,250) , new Point(50,450) ) ]
			
			this.drawPath( this.bc );

			return this;
		},

		listen : function( enable ){

			game.input.onDown.remove( this.onMouseDown , this )

			if( !enable )
				return this

			game.input.onDown.add( this.onMouseDown , this )

			return this
		},

		drawPath:function( bc ){

			this._graphic.clear();

			var pas = 10;
			var l = bc.getLength();
			var p = new Point();
			for( var k=0;k<l;k+=pas ){

				p = bc.getPoint( k/l , p );

				this._graphic.beginFill(0xFFFF0B, 0.5);
    			this._graphic.drawCircle( p.x , p.y , 2 );
    			this._graphic.endFill();
    		}

    		if( !this.picked )
    			return 

    		this._graphic.beginFill(0xFFFF0B, 0.5);
    		this._graphic.drawCircle( this.picked.x , this.picked.y , 5 );
    		this._graphic.endFill();

		},

		onMouseDown:function( event ){

			if( event.button != 0 )
				return;

			this.picked = null;

			var c
			if( (c=this.bc.collide( event.worldX , event.worldY ) ) ){
				console.log("collide")
				this.picked = c.p;
				this.drawPath( this.bc );
			}

		},

	}


	exposure.PathEditable = C;

})( components );

