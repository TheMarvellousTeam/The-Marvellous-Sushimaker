var bezier = {};

(function( exposure ){

	var Point = Phaser.Point;

	var tmp = new Point();
	var tmp2 = new Point();
	var tmp3 = new Point();
	var tmp4 = new Point();

	// shim
	Point.prototype.squareDistance = function( B ){
		var x=this.x-B.x,
			y=this.y-B.y;
		return x*x + y*y;
	}

	Point.prototype.maximise = function( max , B ){
		if( B.x > max.x )
			max.x = B.x
		if( B.y > max.y )
			max.y = B.x
		return max;
	}

	Point.prototype.minimise = function( min , B ){
		if( B.x < min.x )
			min.x = B.x
		if( B.y < min.y )
			min.y = B.x
		return min;
	}

	Phaser.Line.prototype.intersectsCircle = function( x,y ,r , segment ){
		var A = this.end;
		var B = this.start;

		var AM = new Point(x-A.x,y-A.y);
		var AB = new Point(B.x-A.x,B.y-A.y);
		var l = A.distance( B );

		AB.normalize();

		var s = AM.dot( AB );

		if( segment && ( s<-r || l+r<s ) )
			return null;

		return Math.abs( AB.dot( new Point( AM.y , -AM.x ) ) ) < r;
	}

	Point.prototype.dot = function( A ){
		return this.x*A.x + this.y*A.y;
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

			this.length = null;

			return this;
		},

		getLength:function(){
			if(this.length!=null)
				return this.length;

			var l = Math.sqrt( 
				(this.pts[0].x-this.pts[1].x)*(this.pts[0].x-this.pts[1].x) + (this.pts[0].y-this.pts[1].y)*(this.pts[0].y-this.pts[1].y) ) + Math.sqrt( (this.pts[0].x-this.pts[2].x)*(this.pts[0].x-this.pts[2].x) + (this.pts[0].y-this.pts[2].y)*(this.pts[0].y-this.pts[2].y) );

			var k = Math.ceil(l*0.02)+1;

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

			var x = t_*t_ * this.pts[0].x + 2*t*t_ * this.pts[1].x + t*t * this.pts[2].x,
				y = t_*t_ * this.pts[0].y + 2*t*t_ * this.pts[1].y + t*t * this.pts[2].y;

			return resultat ? resultat.set(x,y) : new Point(x,y);
		},

		getPointAtFixedDistance : function( distance , from , segment ){

			var l = this.getLength();

			var a = from || 0;
			
			var A = this.getPoint( a );
			var E = new Point();

			var pas = Math.min( 0.1, 5/l );
			var target = pas /8

			var s = 0;
			var t = 0;

			while( pas > target ){

				this.getPoint( a+t+pas , E );

				var d = A.distance( E );

				if( s+d < distance ){
					A.set(E.x,E.y);
					t += pas;
					s+= d;

					if( a+t > 1 && segment )
						return null;

				}else{
					pas = pas / 2;
				}
			}

			t += a + pas/2;

			if( segment && t>1 )
				t = 1;

			return t;
		},

		getTangent:function( t , resultat ){

			var pas = 0.001;
			
			this.getPoint( t+pas , tmp2 )
			this.getPoint( t-pas , tmp )

			return ( resultat || new Point() ).set( tmp2.x - tmp.x , tmp2.y - tmp.y );
		},

		getUnitTangent :function( t , resultat ){
			return this.getTangent( t , resultat ).normalize();
		},

		subCurve : function( t1 , t2 ){

			var a = this.getPoint( t1 )
			var c = this.getPoint( t2 )

			// need to find b
			// the point at ( t1 + t2 ) /2 for the original curve and the one at 0.5 for the new one are the same
			// resolve this equation

			// factorise the calculus
			var E = this.getPoint( ( t1+t2 )/2 );

			E.x = 2 * E.x - ( a.x + c.x ) / 2
			E.y = 2 * E.y - ( a.y + c.y ) / 2

			return AtomicBezierCurve.Create( a , E , c );
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

			marge = marge || 10;

			var bb = this.getBoundingBox();

			if( bb.top.x - marge > x || bb.bottom.x + marge < x || bb.top.y - marge > y || bb.bottom.y + marge < y )
				return null;

			var l = this.getLength();

			var k = l*0.1;

			var minDist = marge*marge;
			var mint = null;
			var tt;

			var infoMin = Infinity;

			tmp2.set(x,y)

			for(var t=0;t<=k;t++){
				
				this.getPoint( t/k , tmp );

				if( (tt=tmp.squareDistance( tmp2 )) < minDist ){
					minDist = tt;
					mint = t/k;
				}
				if( tt < infoMin )
					infoMin = tt;
			}

			if( mint == null )
				return;

			return {
					atomic : this,
					atomic_t : mint,
					p : this.getPoint( mint )
				}
		},

		clone:function(){
			return AtomicBezierCurve.Create( this.pts );
		},

		dispose: function(){
		}
	};
	AtomicBezierCurve.Create = function( a , b , c ){
		return new AtomicBezierCurve().init( a , b , c );
	}


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

			if( !this._atomic.length )
				return ( resultat || new Point() ).set( 0,0,0,0 );

			var a = this._toAtomic( t , resultat )

			return this._atomic[a.i].getPoint( a.t , resultat );
		},

		_toAtomic : function( t ){

			if( t<=0 )
				return{
					t:0,
					i:0
				}

			if( t>=1 )
				return{
					t:1,
					i:this._atomic.length-1
				}

			var l=this.getLength();
			var s=0;
			for( var i=0; i<this._atomic.length-1 ; i++){
				var ll=this._atomic[i].getLength();
				if( t*l < s+ll )
					break;

				s += ll
			}

			return{
					t:( t*l-s )/this._atomic[i].getLength() ,
					i:i
				}
		},

		getBoundingBox : function(){

			if( !this._atomic.length )
				return {
					top:new Point(),
					bottom:new Point(),
				}

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

		subCurve:function( t1 , t2 ){

			var a1 = this._toAtomic( t1 )
			var a2 = this._toAtomic( t2 )

			var atom = [];
			if( a1.i == a2.i )
				atom.push( this._atomic[ a1.i ].subCurve( a1.t , a2.t ) )
			else{
				atom.push( this._atomic[ a1.i ].subCurve( a1.t , 1 ) )

				for( var i=a1.i+1 ; i<a2.i ; i++ )
					atom.push( this._atomic[ i ].clone() )

				atom.push( this._atomic[ a2.i ].subCurve( 0 , a2.t ) )
			}


			var n = new BezierCurve().init();
			n._atomic = atom;

			return n;
		},

		collide:function( x , y , marge ){
			var collideInfo;
			for( var i=this._atomic.length;i--;)
				if( ( collideInfo = this._atomic[i].collide(x,y , marge) ) ){
					collideInfo.t = this.tToGlobal( collideInfo.atomic_t , i );
					return collideInfo
				}
			return null;
		},

		getTangent : function( t  , resultat ){

			if( !this._atomic.length )
				return ( resultat || new Point() ).set( 0,0,0,0 );

			var a = this._toAtomic( t );
			return this._atomic[ a.i ].getTangent( a.t , resultat );
		},

		tToLocal : function( t ,i ){

			var s=0;
			for(var k=0; k<i ;k++ )
				s += this._atomic[k].getLength();

			return ( t * this.getLength() - s )/this._atomic[i].getLength();
		},

		tToGlobal : function( t ,i ){

			var s=0;
			for(var k=0; k<i ;k++ )
				s += this._atomic[k].getLength();

			return ( t * this._atomic[i].getLength() + s ) / this.getLength();
		},

		getPointAtFixedDistance : function( distance , from , segment ){

			var a = this._toAtomic( from || 0 );
			var l = this.getLength();


			for( var i=a.i ; i<this._atomic.length ; i++ ){

				var s=0;
				for(var k=0; k<i ;k++ )
					s += this._atomic[k].getLength();


				var t = this._atomic[i].getPointAtFixedDistance( distance , this.tToLocal( from , i ) , true )

				if( t == null )
					continue;

				return this.tToGlobal( t , i ) ;
			}

			return null;
		},

		dispose: function(){
			for( var i=this._atomic.length;i--;)
				this._atomic[i].dispose();
		}
	};

	exposure.AtomicBezierCurve = AtomicBezierCurve;
	exposure.BezierCurve = BezierCurve;

})( bezier );


