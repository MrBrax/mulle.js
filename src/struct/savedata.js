import MulleCar from 'struct/cardata';

class MulleSave {

	constructor( game, data ){

		this.game = game;

		/*
		
		*/
	
		if( data ){

			console.debug('[savedata]', 'supplied, apply', data.UserId);

			this.fromJSON(data);
			
		}else{

			console.debug('[savedata]', 'not found, set defaults');
	
			this.setDefaults();

		}

		this.calculateParts();
	
	}

	setDefaults(){
		
		this.UserId = "";

		this.Car = new MulleCar(this.game);

		// default junk locations
		this.Junk = {
			Pile1: {
				66: new Phaser.Point(296, 234),
				29: new Phaser.Point(412, 311),
				143: new Phaser.Point(416, 186),
				178: new Phaser.Point(570, 255) },
			Pile2: {
				215: new Phaser.Point(545, 222),
				47: new Phaser.Point(386, 304),
				12: new Phaser.Point(239, 269),
				140: new Phaser.Point(352, 187) },
			Pile3: {
				153: new Phaser.Point(512, 153),
				131: new Phaser.Point(464, 298),
				307: new Phaser.Point(246, 285),
				112: new Phaser.Point(561, 293),
				30: new Phaser.Point(339, 189) },
			Pile4: {
				190: new Phaser.Point(182, 143),
				23: new Phaser.Point(346, 203),
				126: new Phaser.Point(178, 301),
				211: new Phaser.Point(75, 193) },
			Pile5: {
				6: new Phaser.Point(192, 377),
				90: new Phaser.Point(102, 290),
				203: new Phaser.Point(33, 122),
				158: new Phaser.Point(186, 164),
				119: new Phaser.Point(375, 268) },
			Pile6: {
				2: new Phaser.Point(160, 351),
				214: new Phaser.Point(130, 172),
				210: new Phaser.Point(281, 300),
				121: new Phaser.Point(85, 275)},
			shopFloor: {},
			yard: {}
		};

		this.NrOfBuiltCars 		= 0;
		this.Saves 				= [];
		this.CompletedMissions 	= [];
		this.OwnStuff 			= [];
		this.myLastPile 		= 1;
		this.gifts 				= [];
		this.toYardThroughDoor 	= true;
		this.givenMissions 		= [];
		this.figgeIsComing 		= false;
		this.missionIsComing 	= false;

		this.language 			= this.game.mulle.defaultLanguage; // 'swedish';

	}

	addStuff( name ){

		if( this.hasStuff(name) ) return false;

		this.OwnStuff.push(name);

		this.save();

		return true;

	}

	removeStuff( name ){

		if( !this.hasStuff(name) ) return false;

		var i = this.OwnStuff.indexOf( name );

		this.OwnStuff.splice(i, 1);

		this.save();

		return true;

	}

	hasStuff( name ){
		return this.OwnStuff.indexOf( name ) !== -1;
	}

	hasPart( partId ){
		
		// junk piles
		for( var p in this.Junk ){
			if( Object.keys( this.Junk[p] ).indexOf( partId ) !== -1 || Object.keys( this.Junk[p] ).indexOf( partId.toString() ) !== -1 ) return true;
		}

		// regular car parts
		if( this.Car.Parts.indexOf( partId ) !== -1 || this.Car.Parts.indexOf( partId.toString() ) !== -1 ) return true;

		// morphed car parts
		for( var i of this.Car.Parts ){
			var p = this.game.mulle.PartsDB[ i ];
			if( p.master && partId == p.master ) return true;
		}

		return false;

	}

	/**
	 * @param {string}			Pile name
	 * @param {number}			Part ID
	 * @param {Phaser.Point}	Position in pile
	 * @param {Boolean}			Don't save user data
	 */
	addPart( pile, partId, pos, noSave = false ){

		if(!this.Junk[pile]) return false;

		if(!pos) pos = new Phaser.Point( this.game.rnd.integerInRange(0, 640), this.game.rnd.integerInRange(0, 480) );

		this.Junk[pile][partId] = pos;

		console.log('part added', pile, partId, pos);
		
		if(!noSave) this.save();

		return true;

	}

	calculateParts(){

		this.availableParts = {};

		var defaultParts = {
			Postal: [],
			JunkMan: [13, 20, 17, 89, 290, 120, 18, 19, 173, 21, 297, 22, 24, 25, 185, 26, 27, 28, 32, 35, 91, 132, 129, 134, 137, 146, 149, 154, 168, 216, 174, 175, 177, 189, 191, 192, 193, 233, 199, 208, 209, 212, 221, 227, 229, 235, 251, 264, 278, 294, 295, 14],
			Destinations: [162, 99, 172, 54, 306, 287, 113, 283, 9],
			Random: [33, 38, 41, 42, 43, 176, 48, 53, 55, 64, 65, 74, 75, 76, 92, 93, 100, 101, 104, 107, 116, 130, 96, 155, 161, 181, 186, 195, 196, 200, 213, 219, 220, 222, 228, 230, 234, 236, 239, 242, 245, 248, 254, 257, 260, 261, 265, 271, 272, 273, 286, 288, 296]
		};

		for( var cat in defaultParts ){

			this.availableParts[cat] = [];

			for( var id of defaultParts[cat] ){

				if( !this.hasPart(id) ){
					this.availableParts[cat].push(id);
					// }else{
					//console.warn('already has part', id);
				}

			}

		}

		console.log('availableParts', this.availableParts);

	}

	getRandomPart(){

		this.calculateParts();

		return this.game.rnd.pick( this.availableParts.Random );

	}

	save(){
		console.log('save data', this.UserId);
		window.localStorage.setItem('mulle_SaveData', JSON.stringify( this.game.mulle.UsersDB ) );
	}

	fromJSON( data ){

		this.UserId 			= data.UserId;
			
		this.Car 				= new MulleCar( this.game, data.Car );

		this.Junk 				= data.Junk;
		
		this.NrOfBuiltCars 		= data.NrOfBuiltCars;
		this.Saves 				= data.Saves;
		this.CompletedMissions 	= data.CompletedMissions;
		this.OwnStuff 			= data.OwnStuff ? data.OwnStuff : [];
		this.myLastPile 		= data.myLastPile;
		this.gifts 				= data.gifts;
		this.toYardThroughDoor 	= data.toYardThroughDoor;
		this.givenMissions 		= data.givenMissions;
		this.figgeIsComing 		= data.figgeIsComing;
		this.missionIsComing 	= data.missionIsComing;

		this.language			= this.game.mulle.defaultLanguage; // data.language ? data.language : this.game.mulle.defaultLanguage;

	}

	toJSON(){

		return {
			UserId: 			this.UserId,
			Car: 				this.Car,
			Junk: 				this.Junk,
			// NrOfBuiltCars:	this.NrOfBuiltCars,
			CompletedMissions: 	this.CompletedMissions,
			OwnStuff:			this.OwnStuff,
			givenMissions: 		this.givenMissions,
			myLastPile:			this.myLastPile
		}

	}

}

export default MulleSave;