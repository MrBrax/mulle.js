/**
 * MulleDriveCar object
 * @module objects/drivecar
 */
"use strict";

import MulleSprite from 'objects/sprite';

/**
 * Overworld car
 * @extends MulleSprite
 */
class MulleDriveCar extends MulleSprite {

	constructor( game ){

		super( game );

		this.setDirectorMember('05.DXR', 121);

		this.spriteFrames = {
			"-2": {},
			"-1": {},
			"0": {},
			"1": {},
			"2": {}
		};

		for( var i = 0; i < 16; i++ ){
			this.spriteFrames["-2"][ i + 1 ] = this.game.mulle.getDirectorImage( '05.DXR', (78 + i) ).name;
		}

		for( var i = 0; i < 16; i++ ){
			this.spriteFrames["-1"][ i + 1 ] = this.game.mulle.getDirectorImage( '05.DXR', (94 + i) ).name;
		}

		for( var i = 0; i < 16; i++ ){
			this.spriteFrames["0"][ i + 1 ] = this.game.mulle.getDirectorImage( '05.DXR', (110 + i) ).name;
		}

		for( var i = 0; i < 16; i++ ){
			this.spriteFrames["1"][ i + 1 ] = this.game.mulle.getDirectorImage( '05.DXR', (126 + i) ).name;
		}

		for( var i = 0; i < 16; i++ ){
			this.spriteFrames["2"][ i + 1 ] = this.game.mulle.getDirectorImage( '05.DXR', (142 + i) ).name;
		}


		/*
		this.sprite = carMember.sprite( 320, 220 );

		this.sprite.name = 'drivecar';

		this.sprite.smoothed = false;

		this.spriteFrames = { "-2": {}, "-1": {}, "0": {}, "1": {}, "2": {} };
		for( var i = 0; i < 16; i++ ){
			this.spriteFrames["0"][ i + 1 ] = this.game.mulle.getMember('05.DXR', 'Internal', 110 + i);
		}
		*/

		this.speed = 0;
		this.direction = 0;
		this.altitude = 0;
		this.inclination = 0;

		this.stopTimer = 0;
		this.acceleration = 0;

		this.reachForSpeed = 0;

		this.Steering = 0;

		this.forwardBackward = 0;

		this.lastPosition = new Phaser.Point( 0, 0 );
		
		this.previousData = [];
		for( var i = 0; i < 10; i++ ){
			this.previousData.push( [ new Phaser.Point(0, 0), 1 ] );
		}

		this.OutOfBounds = 0;

		this.internalDirection = 0;
		this.nrOfDirections = 16;

		this.keySteer = 1;

		this.mapOffset = new Phaser.Point( 4, 2 );

		this.directionList = [];
		for(var i = 1; i <= this.nrOfDirections; i++){
			var tmp = Math.PI * 2 * i / this.nrOfDirections;
			var xPart = ( Math.sin(tmp) );
			var yPart = -( Math.cos(tmp) );
			this.directionList.push( new Phaser.Point(xPart, yPart) );
		}

		this.wheelPositions = [];
		for(var i = 1; i <= this.directionList.length; i++){
			var x = 8 * this.directionList[ i - 1 ].x;
			var y = 8 * this.directionList[ i - 1 ].y;
			this.wheelPositions.push( new Phaser.Point(x, y) );
		}


		this.setDirection(1);

		// input
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.logicLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 30, this.drive, this);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		
		this.engineSounds = [
			["05e073v0", "05e079v0", "05e074v0", "05e075v0", "05e076v0", "05e077v0", "05e078v0"],
			["05e067v0", "05e073v0", "05e068v0", "05e069v0", "05e070v0", "05e071v0", "05e072v0"],
			["05e025v0", "05e031v0", "05e026v0", "05e027v0", "05e028v0", "05e029v0", "05e030v0"],
			["05e004v0", "05e010v0", "05e005v0", "05e006v0", "05e007v0", "05e008v0", "05e009v0"],
			["05e011v0", "05e017v0", "05e012v0", "05e013v0", "05e014v0", "05e015v0", "05e016v0"],
			["05e053v0", "05e059v0", "05e054v0", "05e055v0", "05e056v0", "05e057v0", "05e058v0"],
			["05e018v0", "05e024v0", "05e019v0", "05e020v0", "05e021v0", "05e022v0", "05e023v0"],
			["05e060v0", "05e066v0", "05e061v0", "05e062v0", "05e063v0", "05e064v0", "05e065v0"],
			["05e032v0", "05e038v0", "05e033v0", "05e034v0", "05e035v0", "05e036v0", "05e037v0"]
			// 0		1			2			3			4			5			6
			// startup 	shutdown 	idle		speed1		speed2		speed3		speed4
		];

		this.hornSounds = ["05e050v0", "05e049v0", "05e044v0", "05e042v0", "05d013v0"];
		
		// sound
		this.ignition = false;
		this.limitList = [10, 20, 40, 70];
		this.lastSpeed = -1;
		this.setEngineSound();


		// fuel
		this.fuelMax = this.getQuickProperty('fuelvolume');
		this.fuelCurrent = this.fuelMax * 0.8;

		// console.log('fuel max', this.fuelMax);

		// acc
		this.maxAcc = this.getQuickProperty('break');
		if( this.maxAcc < this.getQuickProperty('acceleration') ){
			this.maxAcc = this.getQuickProperty('acceleration');
		}
		
		this.enabled = true;

		// this.velocity = new Phaser.Point(0, 0);
		this.memeMode = false;

	}

	enableMemeMode(){

		this.body.drag.set(10);
		this.body.maxVelocity.set( this.getQuickProperty('speed') * 30 );
		this.body.maxAngular = 500;
		this.body.angularDrag = 500;

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		this.body.allowRotation = false;
		

		this.memeMode = true;

	}

	getProperty( name ){
		return this.game.mulle.user.Car.getProperty( name.toLowerCase() );
	}

	getQuickProperty( name ){
		return this.game.mulle.user.Car.getQuickProperty( name.toLowerCase() );
	}

	setEngineSound(){

		var eType = this.getProperty('enginetype', 1);

		var maxSpeed = this.getProperty('speed', 0);

		var perc = 100 * ( Math.abs(this.speed) / maxSpeed );

		if( eType ){

			var tempPos = 0;

			if(!this.ignition){
				this.ignition = true;
				tempPos = 0;

			}else if( perc >= 70 ){
				tempPos = 6;

			}else if( perc >= 40 ){
				tempPos = 5;

			}else if( perc >= 20 ){
				tempPos = 4;

			}else if( perc >= 10 ){
				tempPos = 3;

			}else if( perc < 10 ){
				tempPos = 2;
			}			

			if( this.lastSpeed == tempPos ) return;

			var lib = this.engineSounds[ eType - 1 ];

			// console.log('set sound', tempPos, lib[ tempPos ] );

			if( this.engineAudio ){
				this.engineAudio.stop();
				this.engineAudio = null;
			}

			this.engineAudio = this.game.mulle.playAudio( lib[ tempPos ] );

			this.lastSpeed = tempPos;

		}else{
			console.error('no engine type');
		}

	}

	correctDirection(i){
		if( i > this.nrOfDirections ) return i - this.nrOfDirections;
		if( i < 1 ) return i + this.nrOfDirections;
		return i;
	}

	updatePivot(){

		if(!this._frame){
			console.warn('no frame');
			return;
		}

		if(!this._frame.regpoint){
			console.warn('no regpoint', this._frame, this.key, this._frame.name);
			return;
		}

		this.regPoint.set( this._frame.regpoint.x, this._frame.regpoint.y + ( 3 * this.altitude ) );
		
		this.pivot.set( this.regPoint.x, this.regPoint.y );

	}

	setCoordinate( c ){
		this.position.set( c.x, c.y );
	}

	getCoordinate(){
		return this.position;
	}

	setDirection(i){
		this.direction = this.correctDirection( i );
		this.internalDirection = this.direction * 100;
		this.updateImage();
	}

	setSpeed(i){
		
		this.reachForSpeed = 0;
		this.acceleration = 0;
		this.speed = i;

		if( this.speed > 0 ){
			this.forwardBackward = 1;
		}else if( this.speed < 0 ){
			this.forwardBackward = -1;
		}else{
			this.forwardBackward = 0;
		}

	}

	changeSpeed( num ){
		this.acceleration = num;
		this.reachForSpeed = 0;
	}

	destroy(){

		if( this.engineAudio ){
			this.engineAudio.stop();
			this.engineAudio = null;
		}

		this.game.time.events.remove( this.logicLoop );

		super.destroy();

	}

	updateImage(){

		
		if(!this.spriteFrames[ this.inclination ]){
			console.error('invalid inclination', this.inclination);
			return;
		}
		

		var n = this.spriteFrames[ this.inclination ][ this.direction ];

		// this.sprite.setFrame( f );
		
		this.frameName = n;

	}

	drive(){

		if(!this.enabled) return;

		if( this.fuelCurrent <= 0 ){

			// 05d011v0 - fuel
			// 05d012v0 - fuel

			// 05d014v0 - electric
			// 05d015v0 05d016v0 - electric + gas
			// 05d017v0 - other

			this.enabled = false;

			if(this.engineAudio) this.engineAudio.stop();

			var a = '05d011v0';

			var s = this.game.mulle.playAudio( a );

			s.onStop.addOnce(() => {

				setTimeout(() => {
					this.game.state.start( 'garage' );
				}, 500);

			});
			
			return;

		}

		// fix out of bounds
		if( this.OutOfBounds > 5 ){

			for( var r = 0; r < 4; r++ ){

				var tryCoordinate = this.position.clone();
				if( r == 0 ) tryCoordinate.y -= this.OutOfBounds;
				if( r == 1 ) tryCoordinate.x += this.OutOfBounds;
				if( r == 2 ) tryCoordinate.y += this.OutOfBounds;
				if( r == 3 ) tryCoordinate.x -= this.OutOfBounds;

				// game.debug.pixel( tryCoordinate.x, tryCoordinate.y, 'rgba(0,255,255,1)' ) ;

				var check = this.pixelCheck( tryCoordinate );

				if( check < 240 ){
					this.position.set( tryCoordinate.x, tryCoordinate.y );
					this.OutOfBounds = 0;
					return;
				}

			}

			this.OutOfBounds++;

			return;

		}

		// keyboard steering
		if( this.keySteer ){

			// acceleration
			if (this.cursors.up.isDown){
				this.changeSpeed(1);
			}else if (this.cursors.down.isDown){
				this.changeSpeed(-1);
			}else{
				this.changeSpeed(0);
			}

			// steering
			if (this.cursors.left.isDown){
				
				this.Steering = -1;

			}else if (this.cursors.right.isDown){
				
				this.Steering = 1;


			}else{
				this.Steering = 0;

			}

		}

		this.calculateSpeed();

		// console.log( this.speed, this.tempMax );

		if( this.Steering ){

			if( this.memeMode ){

				// this.body.angularVelocity = 200 * this.Steering;
				// this.body.angularAcceleration += 2 * this.Steering;
				
				this.body.velocity.rotate(0, 0, 10 * this.Steering, true);

				// console.log( this.body.acceleration );

				// this.direction = this.correctDirection( Math.round( ( this.game.math.wrapAngle( this.game.math.radToDeg( this.body.angle ) - 90 ) + 180 ) / 22.5 ) + 1 );

				

				this.internalDirection = Math.round( ( this.nrOfDirections * 100 ) / this.body.angle );

				console.log( this.internalDirection, this.direction );

			}else{

				this.internalDirection += this.Steering * this.getQuickProperty('steering');

			}

			if( this.internalDirection > this.nrOfDirections * 100 ){
				this.internalDirection -= ( this.nrOfDirections * 100 );
			}else if( this.internalDirection <= 0 ){
				this.internalDirection = ( this.nrOfDirections * 100 ) + this.internalDirection;
			}

			this.direction = this.correctDirection( Math.round( this.internalDirection / 100 ) );

		}

	
		if( this.speed ){
			
			// turn away from walls
			for( var d = 0; d <= 1; d++ ){

				var dir = d == 0 ? -1 : 1;

				var amt = this.forwardBackward == 1 ? 7 + ( this.speed ) : -3;

				var ang = this.directionList[ this.correctDirection( this.direction + dir ) - 1 ].clone();
				
				ang.multiply( amt, amt );

				var tryCoordinate = this.position.clone();
				tryCoordinate.add( ang.x, ang.y );

				var check = this.pixelCheck( tryCoordinate );

				if( check >= 240 ){
					
					this.setDirection( this.direction - dir );
					
					// this.internalDirection -= ( dir * 50 );

					this.speed = this.speed * 0.9;
					if( this.speed < 0.1 && this.speed > -0.1 ) this.speed = 0;
					break;
				}

				// game.debug.pixel( tryCoordinate.x, tryCoordinate.y, 'rgba(0,255,255,1)' ) ;

			}


			var currentAngle = this.directionList[ this.direction - 1 ];

			if( this.memeMode ){

				//this.position.x += this.velocity.x;

				// this.body.velocity.x += this.speed * 10;

			}else{
			
				var nextPos = this.position.clone();
				nextPos.x += (currentAngle.x * this.speed);
				nextPos.y += (currentAngle.y * this.speed);

				var checkNext = this.pixelCheck( nextPos );

				if( checkNext >= 240 ){

					console.warn('hit wall', nextPos, checkNext);
					this.setSpeed(0);

					this.OutOfBounds++;

				}else{

					var setOk = true;

					var altitude = checkNext % 16;

					if( altitude > 2 ){

						altitude = 2;

						if( this.getQuickProperty('strength') <= this.game.mulle.user.Car.criteria.BigHill ){
							console.log('big hill check');
							setOk = false;
							this.speed = 0;
							// this.position.set( this.lastPosition.x, this.lastPosition.y );
						}

					}else if( altitude > 1 ){

						if( this.getQuickProperty('strength') <= this.game.mulle.user.Car.criteria.SmallHill ){
							console.log('small hill check');
							setOk = false;
							this.speed = 0;
							// this.position.set( this.lastPosition.x, this.lastPosition.y );
						}

					}

					// mud
					if( checkNext == 32 ){

						if( this.game.mulle.user.Car.criteria.MudGrip == 0 ){

							console.log('mud');
							
							setOk = false;
							this.speed = 0;

							if( !this.SoundMud ){

								var s = this.game.mulle.playAudio("05d003v0");
								s.onStop.addOnce(() => {
									this.SoundMud = null;
								});

								this.SoundMud = true;

							}

						}

					}

					// rocks
					if( checkNext == 16 ){

						if( this.game.mulle.user.Car.criteria.HolesDurability == 0 ){

							console.log('rocks');
							
							setOk = false;
							this.speed = 0;

							if( !this.SoundRocks ){

								var s = this.game.mulle.playAudio("05d002v0");
								s.onStop.addOnce(() => {
									this.SoundRocks = null;
								});

								this.SoundRocks = true;

							}

						}

					}

					if( setOk ){

						this.altitude = altitude;

						this.lastPosition.set( this.position.x, this.position.y );

						this.position.set( nextPos.x, nextPos.y );

					}

				}

			}

			// game.debug.text( "Hit: " + checkNext + ", " + checkNext, 5, 470 );

			// game.debug.pixel( nextPos.x, nextPos.y, 'rgba(255,255,0,1)' ) ;

			// game.debug.pixel( nextPos.x / 2, nextPos.y / 2, 'rgba(0,255,255,1)' ) ;

			this.fuelCurrent -= ( Math.abs( this.speed ) * this.getQuickProperty('fuelconsumption') ) / 100;

			// game.debug.text( "Fuel: " + this.fuelCurrent, 5, 470 );

		}
		
		this.setEngineSound();
		
		
		// change map	
		var b = this.checkBorders( this.direction, this.forwardBackward );
		if(b){
			console.log(b);
			console.log('Change map');
			
			if( b.x == -1 ) this.position.x = 640 - 8 - 1;
			if( b.x == 1 ) this.position.x = 4 + 8;
			
			if( b.y == -1 ) this.position.y = 396 - 1;
			if( b.y == 1 ) this.position.y = 4 + 8;
			
			this.state.changeMap(b);

		}

		// map object collision
		this.state.mapObjects.forEach( (obj) => {

			if(!obj.enabled) return;

			if(!obj.def) return;

			var dist = this.position.distance( obj.position );

			var hitInner = dist <= obj.InnerRadius/2;
			var hitOuter = dist <= obj.OuterRadius/2;

			if( hitOuter ){
				if( !obj.enteredOuter ){
					obj.enteredOuter = true;
					// console.log( i, 'enter out');
					obj.onEnterOuter(this);
				}
			}else{
				if( obj.enteredOuter ){
					obj.enteredOuter = false;
					// console.log( i, 'leave out');
					obj.onExitOuter(this);
				}
			}

			if( hitInner ){
				if( !obj.enteredInner ){
					obj.enteredInner = true;
					// console.log( i, 'enter in');
					obj.onEnterInner(this);
				}
			}else{
				if( obj.enteredInner ){
					obj.enteredInner = false;
					// console.log( i, 'leave in');
					obj.onExitInner(this);
				}
			}

		});

		// game.debug.text( "Speed: " + this.speed, 5, 410 );
		// game.debug.text( "Accel: " + this.acceleration, 5, 425 );
		// game.debug.text( "Coord: " + this.position, 5, 440 );
		
		// game.debug.text( "Alt: " + this.altitude, 5, 455 );
		// game.debug.text( "Inc: " + this.inclination, 5, 440 );

		this.previousData.push( [ this.position.clone(), this.direction ] );
		this.previousData.splice(0, 1);


		this.updateImage();

		// console.log( check, this.coordinate, this.speed, this.direction );

	}

	collisionHandler( a, b ){

		console.log(a, b);

	}

	checkBorders( theDirection, theForward ){

		var coord = this.getCoordinate().clone();
		coord.subtract( this.mapOffset.x, this.mapOffset.y );
		coord.divide( 2, 2 );

		if( theForward == 1 ){
			var temp = this.wheelPositions[ Math.abs( theDirection ) - 1 ];
			coord.add( temp.x, temp.y );
		}

		var tempIn = 2;

		// console.log(coord);

		if( coord.x < 1 + tempIn ){
			return new Phaser.Point(-1, 0);
		}else if( coord.x > 316 - tempIn ){
			return new Phaser.Point(1, 0);
		}else if( coord.y < 1 + tempIn ){
			return new Phaser.Point(0, -1);
		}else if( coord.y > 198 - tempIn ){
			return new Phaser.Point(0, 1);
		}

		return 0;

	}

	calculateSpeed(){

		if( this.stopTimer > 0 ) this.stopTimer--;

		if( this.acceleration ){

			if( this.memeMode ){

				this.game.physics.arcade.accelerationFromRotation( this.body.angle, 50 * this.acceleration, this.body.acceleration );

				// var s = this.acceleration * ( this.getQuickProperty('acceleration') * 20 );

				// this.body.acceleration.x += s;
				// this.body.acceleration.y += s;

				// console.log('meme', s, this.body.acceleration);

			}else{

				if( this.stopTimer == 0 ){

					var tempAcc = 0;

					if( this.forwardBackward == 0 ){
						
						tempAcc = this.acceleration * this.getQuickProperty('acceleration');
					
					}else{

						if( this.forwardBackward == this.acceleration ){
							
							tempAcc = this.acceleration * ( this.getQuickProperty('acceleration') );
						
						}else{

							// console.log('go backwards', Math.abs( this.speed ), this.maxAcc );
							
							tempAcc = this.acceleration * ( this.getQuickProperty('break') );
							
							if( Math.abs( this.speed ) <= this.maxAcc ){
								this.speed = 0;
								this.stopTimer = 10;
								tempAcc = 0;
								// console.log('backwards limit');
							}

						}

					}

					// console.log( tempAcc );

					// this.tempMax = this.quickCarProps.speed * ( this.keySteer * 20 + 50 );
					
					var maxSpeed = this.getQuickProperty('speed', 0);

					if( this.speed <= maxSpeed && this.speed >= -(maxSpeed/2) ){
						this.speed += tempAcc;
					}

					if( this.speed > maxSpeed ){
						this.speed = maxSpeed;
						// console.log('cap speed', maxSpeed);
					}else if( this.speed < -(maxSpeed/4) ){
						this.speed = -maxSpeed / 4;
					}

					// var acc = this.velocity.clone();
					// acc.multiply(0.1);

					// this.velocity.add( acc );

					// var ang = this.directionList[ this.direction - 1 ].clone();
					// ang.multiply( this.speed / 10 );

					// this.velocity.add( ang );

				}

				if( this.speed > 0 ){
					this.forwardBackward = 1;
				}else if( this.speed < 0 ){
					this.forwardBackward = -1;
				}else{
					this.forwardBackward = 0;
				}

			}

		}else{

			if( this.memeMode ){

				this.body.acceleration.set(0);

			}

		}


	}

	pixelCheck( coord ){

		var tryX = Math.round( ( coord.x - 4 ) / 2 );
		var tryY = Math.round( ( coord.y - 2 ) / 2 );

		if( tryX < 0 || tryY < 0 || tryX >= 316 || tryY >= 198 ){
			console.error('pixel check out of bounds');
			return 0;
		}
		
		// var pix = this.state.topBitmap.getPixel( tryX, tryY );
		var pix = this.topology.getPixel( tryX, tryY );

		// console.log( tryX, tryY, pix.r );

		// game.debug.text( pix.r + "," + pix.g + "," + pix.b, 10, 380 );

		// if( pix.r >= 240 ) return 0;

		// console.log(pix);

		// var col = ( ( pix.r * 6/256) * 36 ) + ( ( pix.g * 6/256) * 6 ) + ( pix.b * 6/256 );

		// console.log( pix / 1024 / 1024 );

		// return [ pix.r / 16, pix.r % 16 ];

		return pix.r;

	}


	stepback( nr ){

		console.log('stepback', nr);

		var temp = this.previousData[ ( this.previousData.length - 1 ) - nr ];

		this.position.set( temp[0].x, temp[0].y );
		this.direction = temp[1];

	}

}

export default MulleDriveCar;