/**
 * World scene
 * @module WorldState
 */

import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleDriveCar from 'objects/drivecar';
import MulleToolbox from 'objects/toolbox';

import MulleMapObject from 'objects/mapobject';

// import MulleMapObject.Hill from 'objects/mapobjects/30.hill';

import MulleBuildCar from 'objects/buildcar';
import MulleMPCar from 'objects/mpcar';

import MulleWorld from 'struct/world';

/**
 * World scene, extension of phaser state
 * @extends Phaser.State
 */
class WorldState extends MulleState {

	preload(){

		super.preload();

		this.game.load.pack('driving', 'assets/driving.json', null, this);
		
		this.game.load.pack('map', 'assets/map.json', null, this);

		this.game.load.atlas('topography', 'assets/topography/topography.png', 'assets/topography/topography.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

	}

	saveSession( obj ){

		console.log('save session');

		this.game.mulle.lastSession = {
			mapCoordinate: this.mapCoordinate.clone(),
			carPosition: this.driveCar.position.clone(),
			carDirection: this.driveCar.direction,
			carFuel: this.driveCar.fuelCurrent,
			carMaxFuel: this.driveCar.fuelMax
		};

		if(obj) this.game.mulle.lastSession.mapObject = obj.id;

	}

	loadSession(){

		// console.log('load session', this.game.mulle.lastCarPosition );
		
		this.changeMap( this.game.mulle.lastSession.mapCoordinate, true );
		
		if(this.game.mulle.lastSession.mapObject){

			this.mapObjects.forEach( (o) => {
				if( o.id == this.game.mulle.lastSession.mapObject ){
					console.log('disable object', o.id);
					o.enteredInner = true;
					o.enteredOuter = true;
				}
			});

		}

		this.driveCar.position.set( this.game.mulle.lastSession.carPosition.x, this.game.mulle.lastSession.carPosition.y );
		
		this.driveCar.direction = this.game.mulle.lastSession.carDirection;

		this.driveCar.fuelCurrent = this.game.mulle.lastSession.carFuel;

		/*
		if( this.game.mulle.lastSession.SetWhenDone ){

			if( this.game.mulle.lastSession.SetWhenDone.Cache ){

				this.game.mulle.lastSession.SetWhenDone.Cache.forEach( (v) => {
					this.game.mulle.user.Car.CacheList.push(v);
				});

				console.log('cache set', this.game.mulle.user.Car.CacheList);

			}

		}
		*/

	}

	removeSession(){
		this.game.mulle.lastSession = null;
	}

	changeMap( pos, absolute = false ){

		console.log('Change map', pos);

		// console.log( pos, absolute ? 'absolute' : 'relative' );

		var newY = pos.y;
		var newX = pos.x;

		if(!absolute){
			newY += this.mapCoordinate.y;
			newX += this.mapCoordinate.x;
		}

		// var mapId = this.game.mulle.WorldsDB[ this.activeWorld ].map[ newY - 1 ][ newX - 1 ];

		// var mapData = this.game.mulle.MapsDB[ mapId ];

		var map = this.activeWorld.getMap( newX, newY );

		console.log('map coordinates', newX, newY );

		// console.log('main map', map);

		var mapId 		= map.MapId;
		var mapName 	= map.MapImage;
		var topName 	= map.Topology;

		// console.log('Map ID', mapId);
		// console.log('Map data', mapData);
		// console.log('Map name', mapName);
		// console.log('Topology name', topName);

		this.mapSprite.setDirectorMember( 'CDDATA.CXT', mapName );


		if(!this.topSprite){
			this.topSprite = this.game.add.sprite( -320, -240, 'topography', topName);
		}else{
			this.topSprite.frameName = topName;
		}

		this.topSprite.smoothed = false;


		this.topBitmap.draw( this.topSprite, 0, 0 );
		this.topBitmap.update();


		for (var i = this.mapObjects.children.length; i >= 0; i--){
			var c = this.mapObjects.children[i];
			if(!c || !c.def) continue;
			// console.log('remove loop', c);
			this.mapObjects.remove(c, true);
		}
		
		if( map.objects ){
	
			map.objects.forEach( (v) => {
				
				let objectId = v[0];
				let objectPos = Phaser.Point.parse( v[1] );
				let objectOpt = v[2];

				if( this.game.mulle.ObjectsDB[ objectId ].type == '#rdest' ){

					// console.log('mapobject rdest', objectId);

					var currentRDest = this.activeWorld.rDests[ objectId ];

					if( !this.mapCoordinate.equals( currentRDest ) ){

						console.debug( '[rdest]', 'inactive', objectId, currentRDest.x, currentRDest.y );

						return;

					}

				}

				let mapObject = new MulleMapObject( this.game, objectId, objectPos, objectOpt );

				mapObject.doCheck();

				this.mapObjects.add(mapObject);

				if( mapObject.def.type == '#Correct' ){

					console.debug('CORRECT', mapObject);

					var dist = this.driveCar.position.distance( mapObject.position );
					var hitInner = dist <= mapObject.InnerRadius/2;

					if( hitInner ){

						console.debug('CORRECT HIT', mapObject);

						this.driveCar.position.set( mapObject.position.x, mapObject.position.y );

					}

				}

			});

			// console.log( 'mapObjects', this.mapObjects );
			
		}

		this.mapCoordinate = new Phaser.Point(newX, newY);

		this.mapId = mapId;

		this.game.mulle.net.send( { map: mapId } );

		// console.log('New coordinates', this.mapCoordinate);

		// console.log('%cMap changed', 'font-size: large');

	}

	create(){

		super.create();

		this.topBitmap = null;
		this.topSprite = null;
		this.mapSprite = null;
		this.mapObjects = null;
		this.driveCar = null;

		this.activeWorld = null;

		this.game.mulle.addAudio('driving');

		this.game.physics.startSystem(Phaser.Physics.ARCADE);


		// hit bitmap
		this.topBitmap = this.game.make.bitmapData( 316, 198 );

		// map sprite
		this.mapSprite = new MulleSprite( this.game, 320, 200 );
		this.mapSprite.inputEnabled = true;
		this.mapSprite.hoverPoint = new Phaser.Point(0, 0);
		this.game.add.existing(this.mapSprite);

		// map objects
		this.mapObjects = this.game.add.group();

		
		this.activeWorld = new MulleWorld( this.game, 'Da Hood' ); // this.game.mulle.WorldsDB["Da Hood"];
		this.activeWorld.fromJSON( this.game.mulle.WorldsDB['Da Hood'] );

		this.activeWorld.calcRandomDestinations();

		this.activeWorld.randomizeDestinations();


		if( this.game.mulle.lastSession ){

			this.driveCar = new MulleDriveCar( this.game );
			this.driveCar.topology = this.topBitmap;
			this.driveCar.state = this;
			

			this.loadSession();
			this.removeSession();

			// this.game.add.existing( this.driveCar );
			this.mapObjects.add(this.driveCar);

		}else{

			this.mapCoordinate = this.activeWorld.StartMap.clone();

			
			
			// car
			this.driveCar = new MulleDriveCar( this.game );
			this.driveCar.setCoordinate( this.activeWorld.StartCoordinate );
			this.driveCar.setDirection( this.activeWorld.StartDirection );
			this.driveCar.topology = this.topBitmap;
			this.driveCar.state = this;
			// this.game.add.existing( this.driveCar );
			this.mapObjects.add(this.driveCar);

			this.changeMap( this.mapCoordinate, true ); 

		}

		this.spriteDashboard = new MulleSprite( this.game, 320, 440 );
		this.spriteDashboard.setDirectorMember('05.DXR', 25);
		this.game.add.existing(this.spriteDashboard);


		var fuelFrames = [];
		for( var i = 27; i < 27 + 16; i++ ){
			fuelFrames.push(['05.DXR', i]);
		}

		this.spriteFuelNeedle = new MulleSprite( this.game, 491, 447 );
		this.spriteFuelNeedle.setDirectorMember('05.DXR', 27);
		this.spriteFuelNeedle.addAnimation('fuel', fuelFrames, 10, true);
		this.spriteFuelNeedle.animations.stop('fuel');
		this.game.add.existing(this.spriteFuelNeedle);

		// console.log('fuel needle animations', this.spriteFuelNeedle.animations);


		this.spriteSpeedometer = new MulleSprite( this.game, 99, 446 );
		this.spriteSpeedometer.setDirectorMember('05.DXR', 46);
		this.game.add.existing(this.spriteSpeedometer);

		var spdMask = this.game.add.graphics(0, 0);
		spdMask.beginFill(0xffffff);
		spdMask.drawRect(88, 0, 300, 480);
		
		this.spriteSpeedometer.mask = spdMask;
		this.lastFuelAmount = 0;


		// toolbox, manual
		this.toolbox = new MulleToolbox( this.game, 659, 439 );
		this.game.add.existing(this.toolbox);

		this.toolbox.showToolbox = () => {

			console.log('show', this);

			this.popupMenu = new MulleSprite( this.game, 320, 200 );
			this.popupMenu.setDirectorMember('05.DXR', 53);
			this.game.add.existing(this.popupMenu);

			var rectList = {
				Steering:	[116, 114, 197, 244],
				Home:		[216, 116, 281, 249],
				Diploma:	[316, 127, 368, 264],
				quit:		[390, 125, 460, 266],
				Cancel:		[470, 255, 528, 365]
			};

			var soundList = {
				Home:		"09d006v0",
				Cancel:		"09d004v0",
				Steering:	"09d005v0",
				quit:		"09d003v0",
				Diploma:	"09d002v0"
			}

			var currentAudio;

			var funcList = {
				Home: () => {
					this.game.state.start( 'yard' );
				},
				Cancel: () => {
					this.toolbox.toggleToolbox( this.toolbox );
				},
				quit: () => {
					this.game.state.start( 'menu' );
				}
			};			

			this.popupMenuButtons = game.add.group();

			for( let n in rectList ){
				
				let r = rectList[n];
				
				let b = new Phaser.Button(this.game, r[0], r[1] - 40);
				b.width = r[2]-r[0];
				b.height = r[3]-r[1];

				b.onInputOver.add(() => {
					if(currentAudio) currentAudio.stop();
					currentAudio = this.game.mulle.playAudio( soundList[n] );
				});

				b.onInputDown.add(() => {
					if(currentAudio) currentAudio.stop();
					funcList[n]();
				});

				this.popupMenuButtons.addChild(b);

			}

			this.driveCar.enabled = false;
			this.driveCar.engineAudio.stop();

			return true;

		};

		this.toolbox.hideToolbox = () => {

			console.log('hide', this);

			this.popupMenu.destroy();

			this.popupMenuButtons.destroy();

			this.driveCar.enabled = true;
			
			if(this.driveCar.engineAudio) this.driveCar.engineAudio.play();

			return true;

		};

		// networking
		if( this.game.mulle.net.connected ){

			this.networkTicks = 4;

			this.networkListener = this.networkUpdate.bind(this);

			this.game.mulle.net.socket.addEventListener('message', this.networkListener );

			this.netLoop = this.game.time.events.loop(Phaser.Timer.SECOND / this.networkTicks, this.networkSend, this);
			this.clients = {};
			this.clientCars = this.game.add.group();

			this.chatInput = document.createElement('input');
			this.chatInput.style.position = 'absolute';
			this.chatInput.style.bottom = '18%';
			this.chatInput.style.left = '1%';
			this.chatInput.className = 'chatInput';
			this.chatInput.maxLength = 140;

			this.chatInput.addEventListener('keyup', (e) => {

				if( e.keyCode == 13 ){

					this.game.mulle.net.send( {
						msg: this.chatInput.value
					} );

					this.chatInput.value = '';

				}

			});

			document.getElementById('player').appendChild( this.chatInput );

			this.chatLog = [];

			this.chatHistory = new Phaser.Text( this.game, 0, 0, '', {
			
				font: '11px arial',
				fill: '#ffffff',
				// backgroundColor: 'rgba(0,0,0,.5)',

				stroke: '#000000',
				strokeThickness: 2,

				boundsAlignH: 'left',
				boundsAlignV: 'bottom'

			} );

			this.chatHistory.lineSpacing = -5;

			this.chatHistory.setTextBounds( 5, 290, 300, 80 );
			// this.chatHistory.textBounds = new Phaser.Rectangle( 0, 0, 300, 100 );

			this.game.add.existing( this.chatHistory );

		}


		// cheats
		if( this.game.mulle.cheats ){

			for( let y = 0; y < this.activeWorld.map.length; y++ ){
				
				let row = document.createElement('div');

				for( let x = 0; x < this.activeWorld.map[y].length; x++ ){
					
					let m = this.activeWorld.map[y][x];

					let b = document.createElement('button');
					b.innerHTML = m.MapId;
					b.className = 'button';

					b.addEventListener('click', (e) => {

						this.changeMap( new Phaser.Point(x+1, y+1), true );

					});

					row.appendChild(b);

				}

				document.getElementById('cheats').appendChild(row);

			}

		}


	}

	networkRefresh(){
		
		this.clientCars.killAll(true);

		// console.log('network refresh', this.clients);

		for( var id in this.clients ){

			var p = new MulleMPCar(this.game);
			
			p.position.set( this.clients[id].x, this.clients[id].y );
			
			p.updateImage();

			if( this.clients[id].n ){
				p.nametag.text = this.clients[id].n;
			}

			p.inputEnabled = true;
			p.input.useHandCursor = true;
			p.events.onInputDown.add( () => {

				this.driveCar.enabled = false;

				var showcar = new MulleBuildCar( this.game, 320, 240, this.clients[id].p, true, false );
				this.game.add.existing(showcar);
				
				// showcar.events.onInputDown.add( () => {
				
				setTimeout( () => {	
					this.driveCar.enabled = true;
					showcar.destroy();
				}, 3000 );

				// });

			});
			

			this.clientCars.addChild(p);

			this.clients[id].car = p;

			// console.log('add car', id);

		}

	}

	networkUpdate( event ){

		var msg = JSON.parse( event.data );

		// console.log('world network', msg.data);

		console.debug( 'network receive', msg );

		if( msg.c ){

			// console.log('client list updated');
			
			this.clients = msg.c;

			this.networkRefresh();

		}

		// if( msg.join ) this.clients[ msg.join ] = {};

		if( msg.leave ){

			// console.log('leave', msg.leave);

			delete this.clients[ msg.leave ];

			this.networkRefresh();

		}

		if( msg.x && msg.y ){

			if(!this.clients[ msg.i ]){
				console.error('invalid client', msg.i);
				return;
			}

			this.clients[ msg.i ].x = msg.x;
			this.clients[ msg.i ].y = msg.y;
			this.clients[ msg.i ].d = msg.d;

			// this.clients[ msg.i ].car.position.set( msg.x, msg.y );
			
			game.add.tween( this.clients[ msg.i ].car ).to( {
				x: msg.x,
				y: msg.y,
				// direction: msg.d,
			}, Phaser.Timer.SECOND / this.networkTicks, Phaser.Easing.Linear.None, true);

			this.clients[ msg.i ].car.direction = msg.d;

			this.clients[ msg.i ].car.updateImage();

		}

		if( msg.msg ){

			var t = '';

			this.chatLog.push( msg );

			this.chatLog.forEach( (m) => {
				t += m.p + ': ' + m.msg + "\n";
			});

			if( this.chatLog.length > 5 ) this.chatLog.splice(0, 1);

			this.chatHistory.text = t.trim("\n");

		}	

	}

	networkSend(){

		if( this.game.mulle.net.socket ){

			if( Object.keys( this.clients ).length == 0 ) return;

			if(
				this.lastX == Math.round( this.driveCar.position.x ) &&
				this.lastY == Math.round( this.driveCar.position.y ) &&
				this.lastD == this.driveCar.direction
			){

				return;

			}

			this.game.mulle.net.send( {
				x: Math.round( this.driveCar.position.x ),
				y: Math.round( this.driveCar.position.y ),
				d: this.driveCar.direction
			} );

			this.lastX = Math.round( this.driveCar.position.x );
			this.lastY = Math.round( this.driveCar.position.y );
			this.lastD = this.driveCar.direction;

		}

	}

	update(){
		
		// fuel meter
		var fuelAmount = Math.max( 0, Math.min( 16, Math.round( (this.driveCar.fuelCurrent / this.driveCar.fuelMax) * 16 ) ) );

		if( this.lastFuelAmount != fuelAmount ){
			// this.spriteFuelNeedle.frameName = (27 + ( fuelAmount - 1 )  ).toString();
			this.spriteFuelNeedle.animations.frame = this.spriteFuelNeedle.animations._outputFrames[ fuelAmount ];
			this.lastFuelAmount = fuelAmount;
		}


		// speed meter
		this.spriteSpeedometer.position.x = 100 + Math.abs( 140 * ( this.driveCar.speed / this.driveCar.getQuickProperty('speed') ) );


		var p = this.game.input.activePointer;

		// activate meme mode
		if( this.game.input.keyboard.isDown(77) ){
			if(!this.driveCar.memeMode){
				
				this.changeMap( new Phaser.Point(4, 5), true );

				this.driveCar.position.set( 400, 62 );

				this.driveCar.direction = 12;

				this.driveCar.enableMemeMode();
			
			}
		}

		if(!this.game.mulle.debug){
			
			// set active steering method
			if( p.isDown ) this.driveCar.keySteer = 0;

			if( this.driveCar.cursors.up.isDown ||
				this.driveCar.cursors.down.isDown ||
				this.driveCar.cursors.left.isDown ||
				this.driveCar.cursors.right.isDown ){
				this.driveCar.keySteer = 1;
			}

		}else{
			
			if( p.isDown && p.position.y < 400 ){
				this.driveCar.position.set( p.position.x, p.position.y );
				this.driveCar.speed = 0;
			}
		
		}
		

		// mouse steer
		if( !this.driveCar.keySteer ){
			
			var m = p.position;
			var c = this.driveCar.position;
			var a = this.driveCar.direction * 22.5;

			var ang = this.game.math.wrapAngle( m.angle(c, true) - a - 90 - 11.25 );

			if( ang >= 22.5 ){
				this.driveCar.Steering = 1;
			}else if(ang <= -22.5){
				this.driveCar.Steering = -1;
			}else{
				this.driveCar.Steering = 0;
			}

			var goDir = this.driveCar.direction;


			if( p.isDown ){

				// turn around
				var dir = ( ang < -90 || ang > 90 ) ? -1 : 1;

				this.driveCar.changeSpeed( dir );

				// this.game.canvas.className = 'cursor-direction-' + goDir;
				// console.log('drive', 'cursor-direction-' + goDir );

			}else{
				this.driveCar.changeSpeed(0);

				// this.game.canvas.className = 'cursor-drive';
				// console.log('stop');
				
			}

		}

	}

	
	render(){

		if(this.game.mulle.debug){

			this.mapObjects.forEach( (v) => {

				if(!v.def) return;

				this.game.debug.geom(v.outer,'rgba(155,0,0,.6)');
				this.game.debug.geom(v.inner,'rgba(255,255,0,.6)');
				this.game.debug.text( '#' + v.id, v.x, v.y );
				this.game.debug.text( 'D ' + v.def.DirResource, v.x, v.y + 16 );

			});

		}
	
	}


	shutdown(){

		this.topBitmap.destroy();

		this.clientCars.destroy();

		if(this.cutscene){
			this.cutscene.destroy();
			this.cutscene = null;
		}

		// networking stuff
		if( this.game.mulle.net.connected ){
			this.game.mulle.net.socket.removeEventListener('message', this.networkListener);
		}

		if(this.netLoop) this.game.time.events.remove( this.netLoop );
		if(this.chatInput) this.chatInput.parentNode.removeChild(this.chatInput);
		if(this.chatHistory) this.chatHistory.destroy();
		
	}

}

export default WorldState;