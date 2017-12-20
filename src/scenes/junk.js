'use strict';

import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleActor from 'objects/actor';
import MulleButton from 'objects/button';
import MulleCarPart from 'objects/carpart';

/* rects = [
  
  	Pile1:[rect(193, 260, 637, 400), rect(291, 193, 637, 263), rect(361, 153, 636, 194)],
  	Pile2:[rect(210, 252, 654, 380), rect(256, 174, 651, 262), rect(365, 120, 667, 188)],
  	Pile3:[rect(150, 281, 639, 380), rect(127, 162, 643, 291), rect(183, 100, 639, 164)],
  	Pile4:[rect(0, 324, 425, 404), rect(3, 174, 425, 325), rect(3, 90, 425, 182)],
  	Pile5:[rect(6, 268, 450, 412), rect(5, 180, 411, 275), rect(0, 100, 303, 189)],
  	Pile6:[rect(0, 275, 400, 390), rect(1, 201, 368, 283), rect(4, 135, 270, 203)],
  	shopFloor:[rect(20, 400, 600, 460)],
  	yard:[rect(290, 400, 580, 445)],

  	PileDoors:[rect(8, 106, 56, 323), rect(44, 84, 115, 224), rect(111, 41, 151, 103), rect(463, 47, 503, 107), rect(512, 69, 592, 208), rect(572, 94, 637, 312)]]
*/

class JunkState extends MulleState {

	constructor(){

		super();

		this.piles = {
			1: { bg: '02b001v0', door: 85, right: 162, left: 174, rect: [ [193, 260, 637, 400], [291, 193, 637, 263], [361, 153, 636, 194] ] },
			2: { bg: '02b002v0', door: 87, right: 164, left: 176, rect: [ [210, 252, 654, 380], [256, 174, 651, 262], [365, 120, 667, 188] ] },
			3: { bg: '02b003v0', door: 89, right: 166, left: 178, rect: [ [150, 281, 639, 380], [127, 162, 643, 291], [183, 100, 639, 164] ] },
			4: { bg: '02b004v0', door: 91, right: 168, left: 180, rect: [ [0, 324, 425, 404], [3, 174, 425, 325], [3, 90, 425, 182] ] },
			5: { bg: '02b005v0', door: 93, right: 170, left: 182, rect: [ [6, 268, 450, 412], [5, 180, 411, 275], [0, 100, 303, 189] ] },
			6: { bg: '02b006v0', door: 95, right: 172, left: 184, rect: [ [0, 275, 400, 390], [1, 201, 368, 283], [4, 135, 270, 203] ] }
		};

	}

	preload(){

		super.preload();

		this.game.load.pack('junk', 'assets/junk.json', null, this);

		// this.game.load.pack('partdesc', 'assets_new/partdesc.json', null, this);

	}

	savePile(){

		console.log('save junk parts', this.currentPile);

		this.game.mulle.user.Junk['Pile' + this.currentPile ] = {};

		this.junkParts.forEach( (obj) => {
			this.game.mulle.user.Junk['Pile' + this.currentPile ][ obj.part_id ] = { x: obj.x, y: obj.y };
		});

		this.game.mulle.user.save();

	}

	setPile( num ){
		
		if( this.junkParts ){
			this.savePile();	
			this.junkParts.destroy();
			this.game.mulle.user.save();
		}

		this.currentPile = num;

		var pile = this.piles[ this.currentPile ];

		if( this.background ) this.background.destroy();

		this.background = new MulleSprite(this.game, 320, 240);
		this.background.setDirectorMember( '02.DXR', pile.bg );
		this.game.add.existing(this.background);

		var leftPile = this.currentPile - 1;
		if( leftPile < 1 ) leftPile = 6;

		var rightPile = this.currentPile + 1;
		if( rightPile > 6 ) rightPile = 1;


		if( this.doorShop ) this.doorShop.destroy();

		this.doorShop = new MulleButton(this.game, 320, 240, {
			imageDefault: ['02.DXR', pile.door ],
			imageHover: ['02.DXR', pile.door + 1 ],
			soundDefault: '02e015v0',
			soundHover: '02e016v0',
			click: () => {
				this.game.mulle.activeCutscene = 71;
				this.game.state.start('garage');
			}
		});
		this.game.add.existing( this.doorShop );


		if( this.arrowRight ) this.arrowRight.destroy();

		this.arrowRight = new MulleButton(this.game, 320, 240, {
			imageDefault: ['02.DXR', pile.right ],
			imageHover: ['02.DXR', pile.right + 1 ],
			click: () => {
				this.setPile( rightPile );
			}
		});
		this.game.add.existing( this.arrowRight );


		if( this.arrowLeft ) this.arrowLeft.destroy();

		this.arrowLeft = new MulleButton(this.game, 320, 240, {
			imageDefault: ['02.DXR', pile.left ],
			imageHover: ['02.DXR', pile.left + 1 ],
			click: () => {
				this.setPile( leftPile );
			}
		});

		this.game.add.existing( this.arrowLeft );


		this.dropRects = [];

		for( var i = 0; i < pile.rect.length; i++){
			var rect 		= new Phaser.Rectangle();
			rect.left 		= pile.rect[i][0];
			rect.top 		= pile.rect[i][1];
			rect.right 		= pile.rect[i][2];
			rect.bottom 	= pile.rect[i][3];
			this.dropRects.push(rect);
			// game.debug.geom(rect,'rgba(255,0,0,.6)');
		}

		/*
		this.junkPile = this.game.mulle.user.Junk['Pile' + this.currentPile];
		
		this.junkParts = this.junkPile.makeContainer();

		this.junkPile.addJunkLocation( this.doorShop, 'shopFloor' );
		this.junkPile.addJunkLocation( this.arrowLeft, 'Pile' + leftPile );
		this.junkPile.addJunkLocation( this.arrowRight, 'Pile' + rightPile );

		this.junkPile.spawnParts();
		*/

		this.junkParts = this.game.add.group();

		
		// var jnk = game.mulle.UsersDB[ game.mulle.activeProfile ].Junk['Pile' + this.currentPile];

		console.log('spawn junk parts');

		var jnk = this.game.mulle.user.Junk['Pile' + this.currentPile ];

		for( let partId in jnk ){

			console.log( partId );

			// let jp = jnk[partId];
			
			let p = new MulleCarPart(this.game, partId, jnk[partId].x, jnk[partId].y, true);

			p.dropRects = this.dropRects;

			// p.setJunkPile('Pile' + this.currentPile);


			// door
			p.dropTargets.push([this.doorShop, (d) => {

				d.destroy();

				this.game.mulle.user.Junk.shopFloor[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };

				this.savePile();

				this.game.mulle.playAudio('00e004v0');

				return true;

			}]);


			// arrow left
			p.dropTargets.push([this.arrowLeft, (d) => {

				d.destroy();

				this.game.mulle.user.Junk['Pile' + leftPile ][partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };

				this.savePile();

				this.game.mulle.playAudio('00e004v0');

				return true;

			}]);


			// arrow right
			p.dropTargets.push([this.arrowRight, (d) => {

				d.destroy();

				this.game.mulle.user.Junk['Pile' + rightPile ][partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 };

				this.savePile();

				this.game.mulle.playAudio('00e004v0');

				return true;
				
			}]);
			
			this.junkParts.addChild(p);
		}

		/*
		var poly = new Phaser.Polygon();
		poly.setTo([ new Phaser.Point(200, 100), new Phaser.Point(350, 100), new Phaser.Point(375, 200), new Phaser.Point(150, 200) ]);
		*/
	    
	}

	create(){

		super.create();

		this.background = null;
		this.doorShop = null;
		this.arrowRight = null;
		this.arrowLeft = null;
		this.dropRects = null;

		this.junkPile = null;
		this.junkParts = null;

		this.setPile(1);

		this.game.mulle.playAudio('02e010v0');

		/*
		var go_road = new MulleButton(this.game, 320, 240, {
			imageDefault: ['yard-sprites-0', '16'],
			click: () => {
				game.state.start('world');
			}
		});
		this.game.add.existing(go_road);
		*/
	
	}

	shutdown(){

		console.log('junk shutdown');

		this.game.mulle.stopAudio('02e010v0');

		this.savePile();

		this.game.mulle.user.save();

	}

	render(){
		// if(this.rect) game.debug.geom(this.rect,'#0fffff');
	}

}

export default JunkState;