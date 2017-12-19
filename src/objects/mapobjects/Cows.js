"use strict";

var MapObject = {};

MapObject.onCreate = function(){

	this.setDirectorMember('CDDATA.CXT', 497);

	this.addAnimation('idle', [ ['CDDATA.CXT', 497], ['CDDATA.CXT', 498] ], 2, true);


	var parting = this.addAnimation('parting', [ ['CDDATA.CXT', 499], ['CDDATA.CXT', 500] ], 5, false);
	parting.onComplete.add(() => {
		this.animations.play('parted');
	});

	this.addAnimation('parted', [ ['CDDATA.CXT', 501], ['CDDATA.CXT', 502] ], 2, true);

	var gathering = this.addAnimation('gathering', [ ['CDDATA.CXT', 500], ['CDDATA.CXT', 499] ], 5, false);
	gathering.onComplete.add(() => {
		this.animations.play('idle');
	});

	this.animations.play('idle');

}

MapObject.onEnterOuter = function( car ){

	

};


MapObject.onEnterInner = function( car ){

	var allowed = this.game.mulle.user.Car.getProperty('horntype', 0) >= 1;

	var horns = ["05e050v0", "05e049v0", "05e044v0", "05e042v0", "05d013v0"];

	if( allowed ){

		this.animations.play('parting');

		if( !this.playedSound ){

			this.game.mulle.playAudio( horns[ this.game.mulle.user.Car.getProperty('horntype', 0) - 1 ] );

			this.playedSound = true;

			var s = this.game.mulle.playAudio('31e001v0');
			s.onStop.addOnce( () => {
				this.playedSound = null;
			});

		}

	}else{

		if( !this.playedSound ){

			this.playedSound = true;

			var s = this.game.mulle.playAudio('31d001v0');
			s.onStop.addOnce( () => {
				this.playedSound = null;
			});

		}

		car.speed = 0;
		car.stepback(2);
		this.enteredInner = false;
		// car.position.set( car.lastPosition.x, car.lastPosition.y );
	
	}

};

MapObject.onExitInner = function( car ){

	this.animations.play('gathering');

};

export default MapObject;