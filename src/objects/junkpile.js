class MulleJunkPile {

	constructor( game, id, data ){

		this.game = game;

		this.id = id;

		this.parts = {};

		if( data ){

			console.log('data supplied', id, data);

			for( var partId in data.parts ){
				this.parts[ partId ] = data.parts[ partId ];
			}

		}else{

			console.log('create default junk');

			var initialJunk = {
				Pile1: { 66: new Phaser.Point(296, 234), 29: new Phaser.Point(412, 311), 143: new Phaser.Point(416, 186), 178: new Phaser.Point(570, 255) },
				Pile2: { 215: new Phaser.Point(545, 222), 47: new Phaser.Point(386, 304), 12: new Phaser.Point(239, 269), 140: new Phaser.Point(352, 187) },
				Pile3: { 153: new Phaser.Point(512, 153), 131: new Phaser.Point(464, 298), 307: new Phaser.Point(246, 285), 112: new Phaser.Point(561, 293), 30: new Phaser.Point(339, 189) },
				Pile4: { 190: new Phaser.Point(182, 143), 23: new Phaser.Point(346, 203), 126: new Phaser.Point(178, 301), 211: new Phaser.Point(75, 193) },
				Pile5: { 6: new Phaser.Point(192, 377), 90: new Phaser.Point(102, 290), 203: new Phaser.Point(33, 122), 158: new Phaser.Point(186, 164), 119: new Phaser.Point(375, 268) },
				Pile6: { 2: new Phaser.Point(160, 351), 214: new Phaser.Point(130, 172), 210: new Phaser.Point(281, 300), 121: new Phaser.Point(85, 275)},
				shopFloor: { 200: new Phaser.Point(160, 351) },
				yard: {}
			}

			for( var partId in initialJunk[ this.id ] ){

				this.parts[ partId ] = initialJunk[ this.id ][ partId ];

			}

			console.log('data created', this.parts);

		}

		this.pileConfig = {
			yard: 		{ physics: true },
			shopFloor: 	{ physics: true },
			Pile1: 		{ rect: [ [193, 260, 637, 400], [291, 193, 637, 263], [361, 153, 636, 194] ] },
			Pile2: 		{ rect: [ [210, 252, 654, 380], [256, 174, 651, 262], [365, 120, 667, 188] ] },
			Pile3: 		{ rect: [ [150, 281, 639, 380], [127, 162, 643, 291], [183, 100, 639, 164] ] },
			Pile4: 		{ rect: [ [0, 324, 425, 404], [3, 174, 425, 325], [3, 90, 425, 182] ] },
			Pile5: 		{ rect: [ [6, 268, 450, 412], [5, 180, 411, 275], [0, 100, 303, 189] ] },
			Pile6: 		{ rect: [ [0, 275, 400, 390], [1, 201, 368, 283], [4, 135, 270, 203] ] }
		};

		var pile = this.pileConfig[ this.id ];

		if(pile.rect){
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
		}else{
			this.dropRects = false;
		}

		this.junkLocations = [];

	}

	addPart( id, x, y ){

		console.log('junk pile', this.id, 'add part', this.id, id);

		this.parts[id] = new Phaser.Point( x, y );

	}

	removePart( id ){

		console.log('junk pile', this.id, 'remove part', id);

		delete this.parts[id];

	}

	loadParts(){

		var parts = this.game.mulle.user.Junk[ this.id ];

		/*
		for( var partId in parts ){
			
			var pos = this.game.mulle.user.Junk.shopFloor[partId];

			var p = new MulleCarPart(this.game, partId, pos.x, pos.y);
			p.car = this.car;
			
			p.setJunkPile('shopFloor');

			p.dropTargets.push([door_junk, (d) => {

				d.moveToJunkPile('Pile1');
				this.game.mulle.saveData();

				d.destroy();

				return true;

			}]);
			
			this.junkParts.addChild(p);

		}
		*/


	}

	makeContainer(){
		this.container = new Phaser.Group(this.game);
		return this.container;
	}

	spawnParts(){

		if(!this.container) return;

		var usePhysics = this.id.substr(0, 4) == 'Pile';

		for( let partId in this.parts ){
				
			let p = new MulleCarPart( this.game, partId, this.parts[partId].x, this.parts[partId].y, usePhysics );
			
			p.setJunkPile( this, true );

			/*
			if( this.car ) p.car = this.car;
			
			if( this.dropRects ) p.dropRects = this.dropRects;

			if( this.junkLocations ){

				this.junkLocations.forEach( (loc) => {
				
					p.dropTargets.push([loc.obj, (d) => {


						console.log('drop on target', loc);
						
						this.removePart( partId );

						this.game.mulle.user.Junk[ loc.id ].addPart( partId, p.position.x, p.position.y );

						this.game.mulle.user.save();

						d.destroy();

						return true;

					}]);

				});

			}
			*/
					
			// this.container.addChild(p);

		}

	}

	updateJunk(obj){
		console.log('junk pile', this.id, 'update junk', obj.part_id);
		this.parts[ obj.part_id ] = obj.position.clone();
	}

	save(){



	}

	addJunkLocation( obj, id ){
		this.junkLocations.push( { obj: obj, id: id } );
	}

	toJSON(){
		return { id: this.id, parts: this.parts };
	}

	destroy(){
		this.container.destroy();
		this.container = null;
		this.junkLocations = [];
		this.car = null;
	}

}