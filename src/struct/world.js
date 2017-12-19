import MulleMap from 'struct/map';

class MulleWorld {

	constructor( game, id ){

		this.game = game;

		this.WorldId = id;

		// this.rDests = [];

	}

	getMap( x, y ){

		return this.map[ y - 1 ][ x - 1 ];

	}

	// randomize destinations that show up
	calcRandomDestinations(){

		this.allRDests = {};

		for( var y = 0; y < this.map.length; y++ ){

			for( var x = 0; x < this.map[y].length; x++ ){

				var MapDef 		= this.map[y][x];
				var MapId 		= MapDef.MapId;
				
				for( var i in MapDef.objects ){

					var objectId = MapDef.objects[i][0];

					var objectDef = this.game.mulle.ObjectsDB[ objectId ];

					if( objectDef.type == "#rdest" ){
					
						var pos = new Phaser.Point( x + 1, y + 1 );

						if( this.allRDests[ objectId ] ){
							
							this.allRDests[ objectId ].push( pos );

						}else{

							this.allRDests[ objectId ] = [ pos ];

						}

						// console.log('adest', objectDef);

					}

					// console.log( MapDef.objects[i] );

				}

			}

		}

	}

	randomizeDestinations(){

		this.rDests = {};

		for( var i in this.allRDests ){
			var tempDest = this.allRDests[i];
			// var tempNrOfMaps = tempDest.length;
			// var tempMap = this.game.rnd.integerInRange(0, tempNrOfMaps);
			// console.log('rdest', this.allRDests[i], tempDest[tempMap]);
			this.rDests[i] = this.game.rnd.pick(tempDest); // this.allRDests[i][tempMap];
		}

		// console.log('rdests', this.rDests);

	}

	fromJSON( data ){

		this.StartCoordinate 	= Phaser.Point.parse( data.StartCoordinate );
		this.StartDirection 	= data.StartDirection;
		this.StartMap 			= Phaser.Point.parse( data.StartMap );
		
		this.map = [];

		for( var y = 0; y < data.map.length; y++ ){

			var row = [];

			for( var x = 0; x < data.map[y].length; x++ ){

				var id = data.map[y][x];

				var map = new MulleMap( this.game, id );
				map.fromJSON( this.game.mulle.MapsDB[id] );

				row.push( map );

			}

			this.map.push(row);

		}

	}


}

export default MulleWorld;