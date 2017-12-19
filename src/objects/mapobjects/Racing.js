"use strict";

import MulleSprite from 'objects/sprite';

var MapObject = {};

MapObject.ObjectId = 7;

function boardNumber( n ){

	return Math.round( n * 100 ) / 100;

}

MapObject.onCreate = function(){

	// console.error('unfinished object', this.id, this);

	this.isRacing = false;

	this.nrOfTimesPassed = 0
	this.mustEnterFrom = this.opt.EnterDir;

	this.board = new MulleSprite( this.game, this.opt.Board.x, this.opt.Board.y );
	this.board.setDirectorMember('CDDATA.CXT', '31b045v0');
	this.game.add.existing(this.board);


	this.boardText1 = new Phaser.Text( this.game, 15, 10, '', {
		font: '16px arial',
		fill: '#00ff00'
	} );

	this.board.addChild( this.boardText1 );

	this.boardText2 = new Phaser.Text( this.game, 15, 40, '', {
		font: '16px arial',
		fill: '#00ff00'
	} );

	this.board.addChild( this.boardText2 );

	this.boardLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 15, () => {

		if( this.isRacing ){
			this.boardText1.text = boardNumber( ( Date.now() - this.raceStart ) / 1000 );
		}

	});

	this.networkListener = (event) => {
		
		var msg = JSON.parse(event.data);

		if( msg.race ){

			console.log('race msg', msg.race);

			if( msg.race[0] ) this.boardText1.text = boardNumber( msg.race[0].time ) + " " + msg.race[0].name;

			if( msg.race[1] ) this.boardText2.text = boardNumber( msg.race[1].time ) + " " + msg.race[1].name;

		}

	}

	this.game.mulle.net.socket.addEventListener('message', this.networkListener );

};


function calcDirection( theStart, theEnd ){
	
	var diffX = theEnd.x - theStart.x;
	var diffY = theStart.y - theEnd.y;

	var hypo = Math.sqrt(diffX * diffX + diffY * diffY)
	
	if(diffY == 0) diffY = 0.1

	var tempDirection = Math.atan( diffX / diffY );

	if(diffX > 0){
		if(diffY > 0){
			// nothing()
		}else{
			tempDirection = tempDirection + Math.PI;
		}
	}else{
		if(diffY > 0){
			tempDirection = tempDirection + 2 * Math.PI;
		}else{
			tempDirection = tempDirection + Math.PI;
		}
	}

	tempDirection = tempDirection / Math.PI;
	
	tempDirection = Math.round( tempDirection * 16 / 2 );
	
	if(tempDirection == 0) tempDirection = 16

	//if option = #WithHypo then
	//	return([tempDirection, hypo])
	//}
	//
	return tempDirection;

}

MapObject.onEnterInner = function( car ){

	var tempEnterAngl = calcDirection( car.position, this.position );
	var diff = Math.abs( this.mustEnterFrom - tempEnterAngl );
	if( diff > 8 ) diff = 16 - diff;

	if( diff <= 3 ){

		this.enteredFrom = 1;

		if( this.isRacing ){

			if( this.nrOfTimesPassed == 1 ){

				console.log('finish race');

				this.game.mulle.playAudio( this.def.Sounds[1] );

				this.isRacing = false;

				var finalTime = ( Date.now() - this.raceStart ) / 1000;

				this.boardText1.text = boardNumber( finalTime ) + " " + this.game.mulle.user.UserId;
				
				this.game.mulle.net.send({ race: finalTime });

				alert( finalTime );


			}

		}else{

			console.log('start race');

			this.game.mulle.playAudio( this.def.Sounds[0] );

			this.raceStart = Date.now();

			this.isRacing = true;

			this.nrOfTimesPassed = 0;

		}

		return;
	}

	this.enteredFrom = -1;

};

MapObject.onExitInner = function( car ){

	if( this.isRacing ){

		console.log('exit inner');

		var tempEnterAngl = calcDirection( car.position, this.position );
		var diff = Math.abs( this.mustEnterFrom - tempEnterAngl );
		if( diff > 8 ) diff = 16 - diff;


		if( diff <= 3 ){

			if( this.enteredFrom == -1 ){

				this.nrOfTimesPassed--;

				console.log('passed minus', this.nrOfTimesPassed);

			}

		}else{

			if( this.enteredFrom == 1 ){

				this.nrOfTimesPassed++;

				console.log('passed plus', this.nrOfTimesPassed);

			}

		}

	}

};

MapObject.onDestroy = function(){

	this.board.destroy();

	this.game.time.events.remove( this.boardLoop );

	this.game.mulle.net.socket.removeEventListener('message', this.networkListener );

};

export default MapObject;