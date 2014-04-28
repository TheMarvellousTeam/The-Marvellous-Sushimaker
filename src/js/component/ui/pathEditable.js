var components = components || {};

(function( exposure ){

	var Point = Phaser.Point;

	var tmp = new Point();
	var tmp2 = new Point();
	var tmp3 = new Point();
	var tmp4 = new Point();

	var RoadMap = function RoadMap(){}
	RoadMap.prototype = {

		ctrlPoints : null,

		firstTangent : null,

		lastTangent : null,

		init : function( ){

			this.bc = new bezier.BezierCurve().init();

			return this;
		},

		/*
		 * B the last point, 
		 * tangent the tangent on this point
		 * M the new point
		 */
		acceptControlPoint : function( B , tangent , M ){

			// not too close
			if( B.squareDistance( M ) < 1000 )
				return null;

			var BM = new Point( M.x - B.x , M.y - B.y );

			var BMn = BM.clone().normalize();

			//  not behind
			if( BMn.dot( tangent ) < 0.2 )
				return null;

			var ballsR = 300;

			var n = new Point( tangent.y , -tangent.x )

			if( BM.dot( n ) < 0 ){
				n.x = -n.x
				n.y = -n.y
			}

			var ballsCenter = new Point( B.x + n.x * ballsR , B.y + n.y * ballsR );

			// not in the balls ( in this case project )
			if( ballsCenter.squareDistance( M ) < ballsR*ballsR ){

				var OM = new Point( M.x - ballsCenter.x , M.y - ballsCenter.y )

				OM.normalize();

				OM.x = OM.x * ballsR + ballsCenter.x;
				OM.y = OM.y * ballsR + ballsCenter.y;

				return OM;
			}

			return M;
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

				var E = new Point( (A.x+B.x)/2 , (A.y+B.y)/2 );

				var N = tmp2.set( B.y-A.y , A.x-B.x );

				var l1 = new Phaser.Line( A.x - tangent.x*900 , A.y - tangent.y*900 , A.x + tangent.x*900 , A.y + tangent.y*900 )
				var l2 = new Phaser.Line( E.x - N.x*900 , E.y - N.y*900 , E.x + N.x*900 , E.y + N.y*900 )
				
				E = l1.intersects( l2 , false );

				if( !E )
					continue;

				atomic.push( bezier.AtomicBezierCurve.Create( A.clone() , E.clone() , B.clone() )  )

				tangent.set( B.x - E.x , B.y - E.y ).normalize();
			}

			this.bc._atomic = atomic;

			this.lastTangent = tangent.normalize();

			return this;
		},

		alterControlPoints : function( M , t ){


			// where is the last atomic curve common to the actual and the wanabe curve
			var lastCommon = 0;
			if( t > 1 )
				lastCommon = this.bc._atomic.length;
			else{

				var l=this.rm.bc.getLength();
				var s=0;
				for(  ; lastCommon < this.rm.bc._atomic.length ; lastCommon++ ){
					
					var ll = this.rm.bc._atomic[ lastCommon ].getLength();

					if( c.t*l < s+ll )
						break

					s += ll;
				}
				lastCommon--;
			}

			// compute the last tangent

			var B = lastCommon >= 0 ? this.rm.bc._atomic[ lastCommon ].pts[2] : this.ctrlPoints[0];

			var tangent =  lastCommon >= 0 ? new Point( this.rm.bc._atomic[ lastCommon ].pts[1].x - B.x , this.rm.bc._atomic[ lastCommon ].pts[1].y - B.y ).normalize() : this.firstTangent;


			// accept the new point
			if( !(M = acceptControlPoint( B, tangent, M ) ) )
				// return the roadMap without modification
				return this;


			// build the new atomic curve

			// mid of the B M edge
			E = new Point( (M.x+B.x)/2 , (M.y+B.y)/2 );

			var N = new Point( B.y-M.y , M.x-B.x ).normalize();

			if( tangent.dot( N ) < 0.1 )
				return this;


			if( tangent.dot( N ) < 0.5 ){
				// case 1

				var l = M.distance( B )

				E = new Point(
					B.x + tangent.x * l,
					B.y + tangent.y * l
				)

			}else{

				var l1 = new Phaser.Line( B.x - tangent.x , B.y - tangent.y , B.x + tangent.x , B.y + tangent.y )
				var l2 = new Phaser.Line( E.x - N.x , E.y - N.y , E.x + N.x , E.y + N.y )
				
				E = l1.intersects( l2 , false );
			}

			var a = bezier.AtomicBezierCurve.Create( B.clone() , E.clone() , M.clone() )

			this.lastTangent = new Point( M.x-E.x , M.y-E.y ).normalize();

			for( var i=lastCommon+1 ; i<this.bc._atomic.length; i++ ){
				this.bc._atomic.splice( this.bc._atomic.length-1 , 1 )[0].dispose();
				this.ctrlPoints.splice( this.ctrlPoints.length-1 , 1 );
			}
			this.bc._atomic.push( a );
			this.ctrlPoints.push( M );

			return this;
		},

		getPoint : function( t , resultat ){
			
			if( this.bc.getLength() == 0)
				t=t+1;

			if( t < 1 )
				return this.bc.getPoint( t , resultat );
			else{
				var B = this.ctrlPoints[ this.ctrlPoints.length-1 ];
				return ( resultat || new Point() ).set( (t-1)*this.lastTangent.x + B.x , (t-1)*this.lastTangent.y + B.y  );
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

		getPointAtFixedDistance : function( distance , from , segment ){

			var l = this.bc.getLength();

			if( from > 1 || l == 0 )
				return from + distance;

			if( from * l + distance > l )

				return  1 + from * l + distance - l;


			if( this.bc.getLength() > 0 ){

				var t = this.bc.getPointAtFixedDistance( distance , from , true );

				if( t != null )
					return t;
			}
		},

		marching : function( distance ){

			if( this.bc.getLength() > 0 ){

				var t = this.bc.getPointAtFixedDistance( distance );

				if( t != null ){

					this.bc = this.bc.subCurve( t , 1 );

					this.firstTangent = this.bc.getTangent( 0 ).normalize();

					this.ctrlPoints[0].x = this.bc._atomic[0].pts[0].x;
					this.ctrlPoints[0].y = this.bc._atomic[0].pts[0].y;

					return this.ctrlPoints[0];
				} else {
					this.bc._atomic = [];
					this.ctrlPoints = [this.ctrlPoints[0]];
				}

			}

			this.ctrlPoints[0].x += this.firstTangent.x * distance;
			this.ctrlPoints[0].y += this.firstTangent.y * distance;

			return this.ctrlPoints[0];
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
			
			this.drawPath( this.rm , game.camera );

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

			var max_d = 1800;

			var hash_l = 18,
				hash_L = 18

			var t=0;
			var l=0;

			var A = new Point();
			var B = new Point();
			var C = toWorld( c.getPoint( 0 ) );
			while( l < max_d ){

				A.set(C.x,C.y);

				t = c.getPointAtFixedDistance( hash_l , t );
				c.getPoint( t , B );

				t = c.getPointAtFixedDistance( hash_L , t );
				c.getPoint( t , C );

				l += hash_l + hash_L;

				toWorld( C );
				toWorld( B );

				this._graphic.lineStyle( 5 , 0x888888, 1-l/max_d );
				this._graphic.moveTo( A.x , A.y );
				this._graphic.lineTo( B.x , B.y );

    		}

    		if( !(debug = false) )
    			return

    		var p = A;
    		for( var k=0;k<1;k+=0.01 ){

    			toWorld( c.getPoint( k , p ) );

				this._graphic.beginFill(0xFFFF0B, 0.5);
    			this._graphic.drawCircle( p.x , p.y , 1 );
    			this._graphic.endFill();
    		}

    		var p = A;
    		for( var k=0;k<c.ctrlPoints.length;k++ ){

    			p.set( c.ctrlPoints[k].x , c.ctrlPoints[k].y )
				p = toWorld( p );

				this._graphic.beginFill( 0xFF00000 , 1);
    			this._graphic.drawCircle( p.x , p.y , 1 );
    			this._graphic.endFill();
    		}
    		
    		for( var k=0;k<c.bc._atomic.length;k++ ){


    			toWorld( A.set( c.bc._atomic[k].pts[0].x , c.bc._atomic[k].pts[0].y ) )
    			toWorld( B.set( c.bc._atomic[k].pts[1].x , c.bc._atomic[k].pts[1].y ) )
    			toWorld( C.set( c.bc._atomic[k].pts[2].x , c.bc._atomic[k].pts[2].y ) )

				this._graphic.lineStyle(2, 0xFF00000, 1);
				this._graphic.moveTo( A.x , A.y );
	    		this._graphic.lineTo( B.x , B.y );
	    		this._graphic.lineTo( C.x , C.y );


    		}


    		var ballsR = 300;

			var n = new Point( c.lastTangent.y , -c.lastTangent.x )
			var B = c.ctrlPoints[ c.ctrlPoints.length-1 ]
			if( this._begining && this._begining.length )
				B = this._begining[ this._begining.length-1 ]

			var ballsCenter = new Point( B.x + n.x * ballsR , B.y + n.y * ballsR );

			toWorld( ballsCenter );

    		this._graphic.lineStyle(4, 0x00FF00, 1);
    		this._graphic.drawCircle( ballsCenter.x , ballsCenter.y , 300 );
		},

		update:function(){

			this.onMouseMove();

			var p = this.rm.marching( 3 );

			var p = p.clone();

			this.target.setPosition( p.x , p.y );
			this.target.setDirection( this.rm.firstTangent.x , this.rm.firstTangent.y );

			this.drawPath( this.rm , game.camera );
		},

		onMouseMove:function(){

			if( !this.picked || (game.input.mouse.button < 0 && (this.picked=null)) || !this.picked  )
				return;


			var cursor = new Point( game.input.worldX , game.input.worldY ) 

			//cursor = this.rm.acceptControlPoint( this._begining[ this._begining.length-1 ] , this.rm.lastTangent , cursor )

			if( !cursor )
				return;

			this.rm = new RoadMap().init().setControlPoints( 
				this.rm.firstTangent,

				this._begining
				.concat( cursor )
			) 

			this.drawPath( this.rm , game.camera );

		},

		onMouseDown:function( ){

			this.picked = null;

			var c
			if( (c=this.rm.collide( game.input.worldX , game.input.worldY ) ) ){
				this.picked = c.p;

				

				this._begining = [ this.rm.ctrlPoints[0] ];

				var l=this.rm.bc.getLength();
				var s=0;
				for(var k=0 ; k<this.rm.bc._atomic.length ; k++ ){
					
					var ll = this.rm.bc._atomic[k].getLength();

					if( c.t*l < s+ll )
						break

					this._begining.push( this.rm.ctrlPoints[k+1] )
					s += ll;
				}
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

