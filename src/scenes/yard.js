'use strict';

import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';
import MulleButton from 'objects/button';
import MulleCarPart from 'objects/carpart';

export default class YardState extends MulleState {

	preload(){

		super.preload();

		// game.load.pack('04.DXR', 'assets/04.DXR/pack.json', null, this);
		
		this.game.load.pack('yard', 'assets/yard.json', null, this);

	}

	create(){

		super.create();
		
		this.car = null;
		this.junkParts = null;

		this.door_side = null;
		this.door_garage = null;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 800;

		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember('04.DXR', 118);
		this.game.add.existing(background);

		// var this.door_side, door_garage;

		var mailbox = new MulleButton(this.game, 320, 240, {
			imageDefault: ['04.DXR', 42],
			imageHover: ['04.DXR', 43],
			soundDefault: '04e009v0',
			soundHover: '04e010v0',
			click: (a) => {
				alert('mailbox');
			}
		});
		this.game.add.existing(mailbox);

		if( this.game.mulle.user.toYardThroughDoor ){

			// without car

			this.door_side = new MulleButton(this.game, 320, 240, {
				imageDefault: ['04.DXR', 13],
				imageHover: ['04.DXR', 14],
				soundDefault: '02e015v0',
				soundHover: '02e016v0',
				click: (a) => {
					this.game.mulle.activeCutscene = '00b011v0';
					this.game.state.start('garage');
				}
			});
			this.game.add.existing(this.door_side);


			this.door_garage = new MulleButton(this.game, 320, 240, {
				imageDefault: ['04.DXR', 40],
				imageHover: ['04.DXR', 41],
				soundDefault: '02e015v0',
				soundHover: '02e016v0',
				click: (a) => {
					this.game.mulle.activeCutscene = '00b016v0';
					this.game.state.start('garage');
				}
			});
			this.game.add.existing(this.door_garage);

			this.door_side.cursor = 'Right';
			this.door_side.cursorHover = 'Right';
			this.door_side.cursorDrag = 'MoveRight';

		}else{

			// with car

			var go_road = new MulleButton(this.game, 320, 240, {
				imageDefault: ['04.DXR', 16],
				click: (a) => {

					this.game.mulle.activeCutscene = '00b008v0';

					this.game.mulle.lastSession = null;

					this.game.mulle.user.Car.resetCache();

					this.game.state.start('world');

				}
			});
			this.game.add.existing(go_road);

			go_road.cursor = 'Click';


			// dummy door
			this.door_side = new MulleSprite(this.game, 320, 240);
			this.door_side.setDirectorMember('04.DXR', 13);
			this.game.add.existing(this.door_side);


			// garage door, drop zone
			this.door_garage = new MulleButton(this.game, 320, 240, {
				imageDefault: ['04.DXR', 41],
				imageHover: ['04.DXR', 41],
				click: (a) => {
					this.game.mulle.activeCutscene = '00b015v0';
					this.game.state.start('garage');
				}
			});

			this.door_garage.hitArea = new Phaser.Rectangle(220, -190, 100, 240);

			this.game.add.existing(this.door_garage);


			this.car = new MulleBuildCar(this.game, 368, 240, null, true, true);
			this.game.add.existing(this.car);

		}

		this.door_garage.cursor = 'Right';
		this.door_garage.cursorHover = 'Right';
		this.door_garage.cursorDrag = 'MoveRight';

		/*
		this.junkPile = this.game.mulle.user.Junk.yard;
		
		this.junkParts = this.junkPile.makeContainer();
		
		this.junkPile.addJunkLocation( this.door_garage, 'shopFloor' );
		this.junkPile.addJunkLocation( this.door_side, 'shopFloor' );

		this.junkPile.spawnParts();
		*/
	
		this.junkParts = this.game.add.group();
		this.junkParts.pileName = 'yard';

		for( let partId in this.game.mulle.user.Junk.yard ){
			
			let pos = this.game.mulle.user.Junk.yard[partId];

			let cPart = new MulleCarPart(this.game, partId, pos.x, pos.y);
			cPart.junkParts = this.junkParts;

			cPart.dropTargets.push([this.door_side, (d) => {
				d.destroy();
				this.game.mulle.user.Junk.shopFloor[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };
				this.game.mulle.playAudio('00e004v0');
				return true;
			}]);

			cPart.dropTargets.push([this.door_garage, (d) => {
				d.destroy();
				this.game.mulle.user.Junk.shopFloor[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };
				this.game.mulle.playAudio('00e004v0');
				return true;
			}]);
			
			this.junkParts.addChild(cPart);

		}


		this.game.mulle.playAudio('02e010v0');
	
		console.log('Yard', 'through door');

	}

	shutdown(){

		this.game.mulle.stopAudio('02e010v0');

		console.log('shutdown yard');

		this.game.mulle.user.Junk.yard = {};

		this.junkParts.forEach( (p) => {
			this.game.mulle.user.Junk.yard[ p.part_id ] = { x: p.x, y: p.y };
		});

		this.game.mulle.user.save();

		super.shutdown();

	}

}