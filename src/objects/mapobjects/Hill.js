"use strict";

var MapObject = {};

MapObject.onEnterInner = function( car ){

	console.log('enter hill, custom object', this);


	if( this.opt.HillType == '#SmallHill' ){

		if( this.game.mulle.user.Car.getQuickProperty('strength') <= this.game.mulle.user.Car.criteria.SmallHill ){
			
			console.log('small hill');

			this.soundPlay = this.game.mulle.playAudio( this.def.Sounds[0] );
		
		}else{

		}

	}else{

		if( this.game.mulle.user.Car.getQuickProperty('strength') <= this.game.mulle.user.Car.criteria.BigHill ){
			
			console.log('big hill');

			this.soundPlay = this.game.mulle.playAudio( this.def.Sounds[1] );
		
		}else{

		}

	}
	

};

export default MapObject;