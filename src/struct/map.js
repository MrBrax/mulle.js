class MulleMap {

	constructor( game, id ){

		this.game = game;

		this.MapId = id;

		this._data = {};

	}

	reset(){

		// console.log('map', this._data);

		this.MapImage 	= this._data.MapImage;
		this.Topology 	= this._data.Topology;
		this.objects 	= this._data.objects;

	}

	fromJSON( data ){

		this._data = data;

		this.reset();

	}


}

export default MulleMap;