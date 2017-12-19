"use strict";

var MapObject = {};

MapObject.onCreate = function(){
	
	this.setDirectorMember(this.def.FrameList.normal[0]);

	console.log('ferry', this);

	this.ferryStep = 0;

	this.isOnFerry = false;

	this.fromX = this.x;
	this.fromY = this.y;

	this.ferryLoop();

};

MapObject.ferryLoop = function(){

	var car = this.game.state.states[ this.game.state.current ].driveCar;

	var dist = car.position.distance( this.position );

	var dropOff = [
		new Phaser.Point(254, 177),
		new Phaser.Point(369, 224)
	];

	// go on land
	if( this.isOnFerry ){
		this.isOnFerry = false;
		this.removeChild(car);
		car.oldParent.addChild(car);
		car.enabled = true;
		car.position.set( dropOff[ this.ferryStep ].x, dropOff[ this.ferryStep ].y );
		car.bringToTop();
	}

	// go on ferry
	if( dist < 40 && !this.isOnFerry ){

		this.isOnFerry = true;

		car.direction = this.ferryStep == 0 ? 14 : 7;

		car.enabled = false;

		car.oldParent = car.parent;

		this.addChild(car);

		car.position.set(16, 16);

		car.bringToTop();

		/*
		var t = game.add.tween( car ).to( {
			x: this.x,
			y: this.y
		}, 100, Phaser.Easing.Linear.None, true);
		*/

	}

	if( this.ferryStep == 0 ){

		var t = game.add.tween( this ).to( {
			x: this.optionalData.EndLoc.x,
			y: this.optionalData.EndLoc.y
		}, 3000, Phaser.Easing.Linear.None, true);

		t.onComplete.addOnce( () => {

			game.time.events.add(Phaser.Timer.SECOND, () => {

				this.ferryStep++;
				this.ferryLoop();

			}, this);			

		});

	}

	if( this.ferryStep == 1 ){

		var t = game.add.tween( this ).to( {
			x: this.fromX,
			y: this.fromY
		}, 3000, Phaser.Easing.Linear.None, true);

		t.onComplete.addOnce( () => {

			game.time.events.add(Phaser.Timer.SECOND, () => {

				this.ferryStep = 0;
				this.ferryLoop();

			}, this);		

		});

	}

};

MapObject.onEnterInner = function(){

};

export default MapObject;