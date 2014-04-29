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

		init : function( B , firstTangent ){

			this.bc = new bezier.BezierCurve().init();

			this.firstTangent = firstTangent || new Point( 1 , 0 );

			this.lastTangent = this.firstTangent.clone();

			this.ctrlPoints = [ B || new Point( 0 , 0 ) ];

			return this;
		},

		/*
		 * B the last point, 
		 * tangent the tangent on this point
		 * M the new point
		 */
		acceptControlPoint : function( B , tangent , M ){

			// not too close
			if( B.squareDistance( M ) < 100 )
				return null;

			var BM = new Point( M.x - B.x , M.y - B.y );

			var BMn = BM.clone().normalize();

			//  not behind
			if( BMn.dot( tangent ) < 0 )
				return null;

			var ballsR = 100;

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

		getLastCommon : function( t ){

			// where is the last atomic curve common to the actual and the wanabe curve
			var lastCommon = 0;
			if( t > 1 )
				lastCommon = this.bc._atomic.length-1;
			else{

				var l=this.bc.getLength();
				var s=0;
				for(  ; lastCommon < this.bc._atomic.length ; lastCommon++ ){
					
					var ll = this.bc._atomic[ lastCommon ].getLength();

					if( t*l < s+ll )
						break

					s += ll;
				}
				lastCommon--;
			}

			this._lastCommon = lastCommon;

			return lastCommon ;
			//return lastCommon >= 0 ? this.bc._atomic[ lastCommon ] : lastCommon;
		},

		alterControlPoints : function( M , lastCommon ){


			//lastCommon is a Atomic Object
			/*
			var el = lastCommon == null ? this.bc._atomic[ this.bc._atomic.length-1 ] : lastCommon
			
			// find the index of this Object
			if( el != -1 )

				for( lastCommon = this.bc._atomic.length ; lastCommon -- && this.bc._atomic[ lastCommon ] != el ; );
			*/

			// compute the last tangent

			lastCommon = this._lastCommon;

			var B = lastCommon >= 0 ? this.bc._atomic[ lastCommon ].pts[2] : this.ctrlPoints[0];

			var tangent =  lastCommon >= 0 ? new Point( B.x - this.bc._atomic[ lastCommon ].pts[1].x , B.y - this.bc._atomic[ lastCommon ].pts[1].y ).normalize() : this.firstTangent;


			// accept the new point
			if( !(M = this.acceptControlPoint( B, tangent, M ) ) )
				// return the roadMap without modification
				return this;


			// build the new atomic curve

			// mid of the B M edge
			E = new Point( (M.x+B.x)/2 , (M.y+B.y)/2 );

			var N = new Point( B.y-M.y , M.x-B.x ).normalize();

			var axis = new Point( N.y , -N.x );


			if( tangent.dot( axis ) < 0.5 ){
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

			while( this.bc._atomic.length > lastCommon+1 ){
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

		collide : function( x , y , marge ){

			marge = marge || 50;

			var collidInfo;
			if( (collidInfo = this.bc.collide( x , y ))  )
				return collidInfo;

			var B = this.ctrlPoints[ this.ctrlPoints.length-1 ];
			var ray = new Phaser.Line( B.x , B.y , B.x + this.lastTangent.x * 9000 , B.y + this.lastTangent.y * 9000 )

			if( ray.intersectsCircle( x,y  , marge , true ) )
				return {
					p : new Point(
						B.x + this.lastTangent.x*10,
						B.y + this.lastTangent.y*10
					),
					t : 1.2,
				}

			return null;
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
					
					while( this.ctrlPoints.length > this.bc._atomic.length+1 ){
						this.ctrlPoints.shift();
						this._lastCommon --;
					}
					
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


			this.rm = new RoadMap().init(
				target.getPosition().clone() ,
				target.getDirection().clone()
			)
			
			this.drawPath( this.rm , game.camera );

			return this.listen( true ).bind( true );
		},

		bind : function( enable ){

			// TODO unbind when enable is false

			var that = this
			var target = this.target

			var update = target.update ||function(){};
			target.update = function(){

				update.call( target );

				that.update.call( that );
			};

			var shutdown = target.shutdown ||function(){};
			target.shutdown = function(){

				shutdown.call( target );

				that.shutdown.call( that );
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

			if( !this._graphic )
				return;
			
			this._graphic.clear();

			var toWorld = function( p ){
				p.x -= camera.x;
				p.y -= camera.y;
				return p;
			}

			var max_d = 1800;

			var hash_l = 40,
				hash_L = 60

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

				if( ! (A.x < camera.x + 150 && A.x > camera.x - 150 && A.y < camera.y + 150 && A.y > camera.y - 150 ) ){
					this._graphic.lineStyle( 6 , 0xf24d1b, 1-l/max_d );
					this._graphic.moveTo( A.x , A.y );
					this._graphic.lineTo( B.x , B.y );
				}

    		}

    		var p = A;
    		for( var k=0;k<c.ctrlPoints.length;k++ ){

    			p.set( c.ctrlPoints[k].x , c.ctrlPoints[k].y )
				p = toWorld( p );

				this._graphic.beginFill( 0xf24d1b , 1);
    			this._graphic.drawCircle( p.x , p.y , 10 );
    			this._graphic.endFill();
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
		},

		update:function(){

			this.onMouseMove();
			
			var p = this.rm.marching( 3 );

			var p = p.clone();

			this.target.setPosition( p.x , p.y );
			this.target.setDirection( this.rm.firstTangent.x , this.rm.firstTangent.y );
			
			this.drawPath( this.rm , game.camera );
		},

		shutdown : function(){

			this.listen( false );

			if( !this._graphic )
				return;

			game.stage.removeChild( this._graphic );
			this._graphic=null;
		},

		onMouseMove:function(){

			if( !this.picked || (game.input.mouse.button < 0 && (this.picked=null)) || !this.picked  )
				return;


			var cursor = new Point( game.input.worldX , game.input.worldY ) 

			this.rm.alterControlPoints( 
				cursor ,
				this._lastCommon
			) 

			this.drawPath( this.rm , game.camera );
		},

		onMouseDown:function( ){

			this.picked = null;

			var c
			if( (c=this.rm.collide( game.input.worldX , game.input.worldY , 50 ) ) ){
				this.picked = c.p;
				this._lastCommon = this.rm.getLastCommon( c.t );
				//this._lastCommon = -1;
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

