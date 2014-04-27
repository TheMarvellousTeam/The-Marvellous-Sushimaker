var components = components || {};

(function( exposure ){

	var Point = Phaser.Point;

	var tmp = new Point();
	var tmp2 = new Point();
	var tmp3 = new Point();
	var tmp4 = new Point();

	var squareDistance = function( A , B ){
		var x=A.x-B.x,
			y=A.y-B.y;
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

		return AB.dot( new Point( AM.y , -AM.x ) ) < r;
	}

	Phaser.Point.prototype.dot = function( A ){
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

			var x = t_*t_ * this.pts[0].x + 2*t*t_ * this.pts[1].x + t*t * this.pts[2].x,
				y = t_*t_ * this.pts[0].y + 2*t*t_ * this.pts[1].y + t*t * this.pts[2].y;

			return resultat ? resultat.set(x,y) : new Point(x,y);
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

			marge = marge || 50;

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

				if( (tt=squareDistance( tmp , tmp2 )) < minDist ){
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

			var a = this._toAtomic( t )

			return this._atomic[a.i].getPoint( a.t , resultat );
		},

		_toAtomic : function( t ){

			if( t==0 )
				return{
					t:0,
					i:0
				}

			if( t==1 )
				return{
					t:1,
					i:this._atomic.length-1
				}

			var l=this.getLength();
			var s=0;
			for( var i=0; t<s/l ; i++)
				s+=this._atomic[i].getLength();

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
					atom.push( this._atomic[ a2.i ].clone() )

				atom.push( this._atomic[ a2.i ].subCurve( 0 , a2.t ) )
			}


			var n = new BezierCurve().init();
			n._atomic = atom;

			return n;
		},

		collide:function( x , y ){
			var collideInfo;
			for( var i=this._atomic.length;i--;)
				if( ( collideInfo = this._atomic[i].collide(x,y) ) ){
					return collideInfo
				}
			return null;
		},

		dispose: function(){
			for( var i=this._atomic.length;i--;)
				this._atomic[i].dispose();
		}
	};

	var RoadMap = function RoadMap(){}
	RoadMap.prototype = {

		ctrlPoints : null,

		firstTangent : null,

		lastTangent : null,

		init : function( ){

			this.bc = new BezierCurve().init();

			return this;
		},

		setControlPoints : function( firstTangent , pts ){

			this.ctrlPoints = pts ;

			this.firstTangent = firstTangent;

			this.bc.dispose();

			var tangent = new Point( this.firstTangent.x , this.firstTangent.y );

			var atomic = [];

			for( var i=1;i<pts.length;i++){

				var A = pts[i-1].clone(),
					B = pts[i].clone();

				var E = tmp.set( (A.x+B.x)/2 , (A.y+B.y)/2 );

				var N = tmp2.set( B.y-A.y , A.x-B.x );

				var l1 = new Phaser.Line( A.x - tangent.x*900 , A.y - tangent.y*900 , A.x + tangent.x*900 , A.y + tangent.y*900 )
				var l2 = new Phaser.Line( E.x - N.x*900 , E.y - N.y*900 , E.x + N.x*900 , E.y + N.y*900 )
				
				E = l1.intersects( l2 , false );

				atomic.push( AtomicBezierCurve.Create( A , E , B )  )

				tangent.set( B.x - E.x , B.y - E.y );
			}

			this.bc._atomic = atomic;

			this.lastTangent = tangent.normalize();

			return this;
		},

		getPoint : function( t , resultat ){
			
			if( this.bc.getLength() == 0)
				t=t+1;

			if( t < 1 )
				return this.bc.getPoint( t );
			else{
				var B = this.ctrlPoints[ this.ctrlPoints.length-1 ];
				return ( resultat || new Point() ).set( (t-1)*this.lastTangent.x*500 + B.x , (t-1)*this.lastTangent.y*500 + B.y  );
			}
		},

		collide : function( x , y ){

			var B = this.ctrlPoints[ this.ctrlPoints.length-1 ];
			var ray = new Phaser.Line( B.x , B.y , B.x + this.lastTangent.x * 9000 , B.y + this.lastTangent.y * 9000 )

			if( ray.intersectsCircle( x,y  , 50 , true ) )
				return {
					p : new Point(
						B.x + this.lastTangent.x*10,
						B.y + this.lastTangent.y*10
					),
					t : 1.2,
				}


			return this.bc.collide( x , y );
		},
	}



	var C = function PathEditable(){};
	C.prototype={

		_graphic : null,

		name : "pathEditable",

		init:function( target ){
			this.target = target;

			this._graphic = new Phaser.Graphics( game , 0, 0);

			game.stage.addChild( this._graphic );


			this.rm = new RoadMap().init().setControlPoints( 
				target.getDirection().clone() ,
			[
				target.getPosition().clone()
			])

			//this.rm.bc = this.rm.bc.subCurve( 0.2 , 1 )
			
			this.drawPath( this.rm , this.target.sprite.parent.camera );

			return this.listen( true ).bind( true );
		},

		bind : function( enable ){

			// TODO unbind when enable is false

			var that = this
			var target = this.target

			var update = target.update;

			target.update = function(){

				update.call( target );

				that.update.call( that );
			};

			return this;
		},

		listen : function( enable ){

			game.input.onDown.remove( this.onMouseDown , this )

			if( !enable )
				return this

			game.input.onDown.add( this.onMouseDown , this )

			return this
		},

		drawPath:function( c , camera ){

			this._graphic.clear();

			var toWorld = function( p ){
				p.x -= camera.x;
				p.y -= camera.y;
				return p;
			}

			var p = new Point();
			for( var k=0;k<5;k+=0.01 ){

				p = toWorld( c.getPoint( k , p ) );

				this._graphic.beginFill(0xFFFF0B, 0.8);
    			this._graphic.drawCircle( p.x , p.y , 2 );
    			this._graphic.endFill();
    		}

    		for( var k=0;k<c.ctrlPoints.length;k++ ){

    			p.set( c.ctrlPoints[k].x , c.ctrlPoints[k].y )
				p = toWorld( p );

				this._graphic.beginFill(0xFFFF0B, 0.5);
    			this._graphic.drawCircle( p.x , p.y , 4 );
    			this._graphic.endFill();
    		}
    		/*
    		for( var k=0;k<c.bc._atomic.length;k++ ){


				this._graphic.lineStyle(2, 0x888888, 0.8);
				this._graphic.moveTo( c.bc._atomic[k].pts[0].x , c.bc._atomic[k].pts[0].y );
	    		this._graphic.lineTo( c.bc._atomic[k].pts[1].x , c.bc._atomic[k].pts[1].y );
	    		this._graphic.lineTo( c.bc._atomic[k].pts[2].x , c.bc._atomic[k].pts[2].y );


    		}*/

    		if( !this.picked )
    			return 

    		this._graphic.beginFill(0xFFFF0B, 0.5);
    		this._graphic.drawCircle( this.picked.x , this.picked.y , 5 );
    		this._graphic.endFill();
		},

		update:function(){

			this.onMouseMove();

			this.drawPath( this.rm , this.target.sprite.parent.camera );
		},

		onMouseMove:function(){

			if( !this.picked || (game.input.mouse.button < 0 && (this.picked=null)) || !this.picked  )
				return;

			// DO something
			//this.onMouseDown();
			this.rm = new RoadMap().init().setControlPoints( 
				this.rm.firstTangent,
			[
				this.rm.ctrlPoints[0],
				new Point( game.input.worldX , game.input.worldY )
			]) 
			this.drawPath( this.rm , this.target.sprite.parent.camera );

		},

		onMouseDown:function( ){

			this.picked = null;

			var c
			if( (c=this.rm.collide( game.input.worldX , game.input.worldY ) ) ){
				this.picked = c.p;
				this.drawPath( this.rm );
			}
		},
	}

	C.attach = function( entity ){
		var c = new C();
		c.init( entity );
		entity.components = entity.components || {}
		entity.components[ c.name ] = c
		return c;
	};

	exposure.PathEditable = C;

})( components );

