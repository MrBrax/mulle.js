/**
 * GarageState
 * @module GarageState
 */
"use strict";

import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';
import MulleButton from 'objects/button';
import MulleCarPart from 'objects/carpart';
import MulleToolbox from 'objects/toolbox';

var partNames = {

	1: "chassi",
	
	2: "moped engine",
	
	5: "balcony",

	6: "med engine",
	9: "v8 engine",

	12: "red seat",

	13: "truck thing",

	14: "wooden box",

	17: "plane-front",
	18: "plane-middle",

	19: "chevy-front",
	20: "chevy-middle",
	21: "chevy-back",

	22: 'tractor front',


	30: 'yellow front',
	29: 'yellow middle',
	23: 'yellow back',

	24: 'vw blue front',

	26: 'greenhouse',

	25: 'racer front',
	27: 'racer middle',
	28: 'racer back',

	31: 'shack',
	32: 'heli front',
	33: 'tractor shovel',
	35: 'ticket',
	38: 'green engine',

	41: 'handlebars',

	42: 'desk lamp',

	43: 'lawnmower',

	47: 'lamp tires',

	48: 'med battery',

	53: 'drum tires',

	54: 'ship steering wheel',

	55: 'big gas tank',

	64: 'dashboard',

	65: 'bell',

	66: 'fender',

	96: 'wood wheels',

	99: 'horse carriage',

	100: 'wooden chair',

	101: 'electric engine',

	104: 'brakes',

	107: 'black battery',
	113: 'tractor tires',
	116: 'wheelbarrow tires',
	120: 'pinnstol',
	129: 'green striped couch',

	130: 'horse carriage lights',

	132: 'bike frame',

	133: 'gray gearbox',

	134: 'wine barrel',

	137: 'tub',

	146: 'telephone kiosk',

	149: 'caterpillar',

	150: 'brakes',

	154: 'red front',

	155: 'tent',

	162: 'milk jar',


	303: 'tires',

	306: 'jet engine',

	307: 'steering wheel'

};

/**
 * GarageState
 * @extends MulleState
 */
class GarageState extends MulleState {

	preload(){

		super.preload();
		
		this.game.load.pack('garage', 'assets/garage.json', null, this);

	}	

	figge(){

		this.game.mulle.user.calculateParts();

		// var tmpList = .splice(0);

		/*
		if( tmpList.length <= 3 ){

			tmpNewParts = tmpList.splice(0);



			return;
		}*/

		// car
		this.game.mulle.playAudio('03e009v0', () => {

			// narrator
			this.game.mulle.playAudio('03d043v0', () => {

				var figge = new MulleActor( this.game, 320, 240, 'figgeDoor' );

				this.game.add.existing(figge);

				this.game.mulle.actors.figge = figge;

				this.door_junk.onInputOverHandler();
				
				// door
				this.game.mulle.playAudio('02e016v0', () => {

					figge.animations.play('enter').onComplete.addOnce(() => {

						// hörru
						this.game.mulle.actors.figge.talk('03d044v0', () => {

							figge.animations.play( figge.silenceAnimation );

							this.game.mulle.actors.mulle.silenceAnimation = 'idle';
							this.game.mulle.actors.mulle.talkAnimation = 'talkRegular';
							
							// ser man på
							this.game.mulle.actors.mulle.talk('03d045v0', () => {

								this.game.mulle.actors.mulle.silenceAnimation = 'lookPlayer';
								this.game.mulle.actors.mulle.talkAnimation = 'talkPlayer';

								// jajamänsan
								this.game.mulle.actors.figge.talk('03d046v0', () => {

									figge.animations.play('exit').onComplete.addOnce(() => {

										this.door_junk.onInputOutHandler();
									
										// door
										this.game.mulle.playAudio('02e015v0', () => {

											figge.destroy();

											this.game.mulle.actors.figge = null;

											// car
											this.game.mulle.playAudio('03e010v0', () => {
												
												console.log('figge done');
											
											});

										});

									});

								});

							});

						});

					});

				});

			});

		});

		this.figgeGiveParts();

	}

	figgeGiveParts(){
		
		if( this.game.mulle.user.availableParts.JunkMan.length > 0 ){

			for( var i = 0; i < 3; i++ ){
				
				var partId = this.game.mulle.user.availableParts.JunkMan[ i ];

				if(!partId) break;

				this.game.mulle.user.addPart('yard', partId, null, true);

				console.log('figge add part', partId);

			}

			this.game.mulle.user.save();

			return true;

		}

		return false;

	}

	makePart( partId, x, y ){

		let cPart = new MulleCarPart(this.game, partId, x, y);
		
		cPart.car = this.car;
		cPart.junkParts = this.junkParts;

		cPart.dropTargets.push([ this.door_junk, (d) => {
			d.destroy();
			this.game.mulle.user.Junk.Pile1[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };
			this.game.mulle.playAudio('00e004v0');
			return true;
		}]);

		cPart.dropTargets.push([ this.door_side, (d) => {
			d.destroy();
			this.game.mulle.user.Junk.yard[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };
			this.game.mulle.playAudio('00e004v0');
			return true;
		}]);

		cPart.dropTargets.push([ this.door_garage, (d) => {
			d.destroy();
			this.game.mulle.user.Junk.yard[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };
			this.game.mulle.playAudio('00e004v0');
			return true;
		}]);
		
		this.junkParts.addChild(cPart);

		return cPart;

	}

	create(){

		super.create();

		this.car = null;
		this.junkPile = null;
		this.junkParts = null;

		this.door_junk = null;

		this.mulleActor = null;

		this.toolbox = null;
		this.popupMenu = null;

		this.door_junk = null;
		this.door_garage = null;
		this.door_side = null;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 800;

		this.game.mulle.addAudio('garage');

		// this.game.mulle.user.calculateParts();

		var background = new MulleSprite(this.game, 320, 240);
		// background.setFrameId('03b001v0');
		background.setDirectorMember('03.DXR', 33);

		this.game.add.existing(background);



		this.door_junk = new MulleButton(this.game, 320, 240, {
			imageDefault: ['03.DXR', 34],
			imageHover: ['03.DXR', 35],
			soundDefault: '02e015v0',
			soundHover: '02e016v0',
			click: () => {
				this.game.mulle.activeCutscene = 70;
				this.game.state.start('junk');
			}
		});

		this.door_junk.cursor		= 'Click';
		this.door_junk.cursorHover	= 'Click';
		this.door_junk.cursorDrag	= 'MoveIn';
		
		/*
		this.game.mulle.cursor.addHook(door_junk, function( obj, state, event ){

		this.game.add.existing(this.door_junk);

			if( event.dragging ) return 'cursor-drag_forward';

			if( state == 'over' ){
				return 'point';
			}

			return false;

		});
		*/
	
		this.game.add.existing(this.door_junk);


		this.door_garage = new MulleButton(this.game, 320, 240, {
			imageDefault: ['03.DXR', 36],
			imageHover: ['03.DXR', 37],
			soundDefault: '02e015v0',
			soundHover: '02e016v0',
			click: () => {

				if(!this.game.mulle.user.Car.isRoadLegal(true)) return;

				this.game.mulle.activeCutscene = 67;
				this.game.mulle.user.toYardThroughDoor = false;
				this.game.state.start('yard');

			}
		});

		this.door_garage.cursor			= 'Left';
		this.door_garage.cursorHover	= 'Left';
		this.door_garage.cursorDrag		= 'MoveLeft';

		// door_garage.moveJunk = 'yard';

		this.game.add.existing(this.door_garage);


		this.door_side = new MulleButton(this.game, 320, 240, {
			imageDefault: ['03.DXR', 38],
			imageHover: ['03.DXR', 39],
			soundDefault: '02e015v0',
			soundHover: '02e016v0',
			click: () => {
				this.game.mulle.activeCutscene = 68;
				this.game.mulle.user.toYardThroughDoor = true;
				this.game.state.start('yard');
			}
		});

		this.door_side.cursor		= 'Left';
		this.door_side.cursorHover	= 'Left';
		this.door_side.cursorDrag	= 'MoveLeft';

		// door_side.moveJunk = 'yard';

		this.game.add.existing(this.door_side);


		this.car = new MulleBuildCar(this.game, 368, 240, null, false);
		this.game.add.existing(this.car);

		this.car.onDetach.add( ( partId, newId, newPos ) => {

			var part = this.makePart( newId, newPos.x, newPos.y );

			part.justDetached = true;

			part.position.add( part.regPoint.x, part.regPoint.y );			

			part.input.startDrag( this.game.input.activePointer );

			this.game.mulle.playAudio( part.sound_attach );

		});


		this.mulleActor = new MulleActor(this.game, 118, 188, 'mulleDefault');
		this.game.add.existing(this.mulleActor);
		this.game.mulle.actors.mulle = this.mulleActor;

		// this.mulleActor.talk('20d001v0');
		// console.log('actor', this.mulleActor);


		// spawn junk parts
		this.junkParts = this.game.add.group();
		this.junkParts.pileName = 'shopFloor';
		this.car.junkParts = this.junkParts;

		for( let partId in this.game.mulle.user.Junk.shopFloor ){
			
			let pos = this.game.mulle.user.Junk.shopFloor[partId];

			this.makePart( partId, pos.x, pos.y );

		}


		// toolbox, manual
		this.toolbox = new MulleToolbox( this.game, 657, 432 );
		this.game.add.existing(this.toolbox);

		this.toolbox.showToolbox = () => {

			this.blockSprite = new MulleSprite( this.game, 0, 0 );
			this.blockSprite.width = 640;
			this.blockSprite.height = 480;
			this.blockSprite.inputEnabled = true;
			this.blockSprite.input.useHandCursor = false;
			this.game.add.existing( this.blockSprite );


			this.popupMenu = new MulleSprite( this.game, 320, 200 );
			this.popupMenu.setDirectorMember('00.CXT', 84);
			this.game.add.existing(this.popupMenu);

			return true;

		};

		this.toolbox.hideToolbox = () => {

			this.blockSprite.destroy();

			this.popupMenu.destroy();

			return true;

		};



		// spawn parts cheat
		
		if( this.game.mulle.cheats ){

			document.getElementById('cheats').innerHTML = '';

			for( let partId in this.game.mulle.PartsDB ){

				let partData = this.game.mulle.PartsDB[partId];

				if(partData.master) continue;

				let has = this.game.mulle.user.hasPart( partId );
				
				let b = document.createElement('button');
				b.innerHTML = ( partNames && partNames[partId] ) ? '(' + partId + ') ' + partNames[partId] : partId;
				b.className = 'button';

				if(has) b.disabled = true;

				b.addEventListener('click', (e) => {

					if( has ){
						alert('has part already');
						return;
					}

					this.makePart( partId, 320, 240 );

				});

				document.getElementById('cheats').appendChild(b);

			}

		}


	}

	shutdown(){

		console.log('shutdown garage');
		
		this.game.mulle.user.Junk.shopFloor = {};

		this.junkParts.forEach( (p) => {
			this.game.mulle.user.Junk.shopFloor[ p.part_id ] = { x: p.x, y: p.y };
		});

		this.game.mulle.user.save();

		this.game.mulle.net.send( { parts: this.game.mulle.user.Car.Parts } );

		this.game.mulle.actors.mulle = null;

		document.getElementById('cheats').innerHTML = '';

		super.shutdown();

	}

}

export default GarageState;