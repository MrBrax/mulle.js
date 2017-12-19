"use strict";

var MapObject = {};

MapObject.onCreate = function(){

	return;
};

MapObject.onEnterInner = function( car ){

	console.log('fill gas');

	var snd = this.game.mulle.playAudio('31e006v0');

	car.enabled = false;
	car.speed = 0;

	snd.onStop.addOnce( () => {
		car.enabled = true;
	});

	game.time.events.repeat(3300 / 10, 10, () => {

		car.fuelCurrent = this.game.math.clamp( car.fuelCurrent + ( car.fuelMax / 10 ), 0, car.fuelMax );

	}, this);

};

export default MapObject;