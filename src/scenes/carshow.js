'use strict';

import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';

class CarShowState extends MulleState {

	preload(){

		super.preload();

		// game.load.pack('04.DXR', 'assets/04.DXR/pack.json', null, this);
		
		this.game.load.pack('carshow', 'assets/carshow.json', null, this);

	}

	create(){

		super.create();
		
		this.car = null;

		this.game.mulle.addAudio('carshow');

		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember('94.DXR', 200);
		this.game.add.existing(background);


		var judge = new MulleActor(this.game, 155, 210, 'judge');
		judge.talkAnimation = 'talk';
		judge.silenceAnimation = 'idle';
		this.game.add.existing(judge);
		this.game.mulle.actors.judge = judge;

		var score = new MulleSprite(this.game, 177, 93);
		score.setDirectorMember('94.DXR', 17);
		this.game.add.existing(score);
		score.visible = false;


		var mulle = new MulleActor(this.game, 89, 337, 'mulleDefault');
		mulle.talkAnimation = 'talkRegular';
		mulle.silenceAnimation = 'idle';
		this.game.add.existing(mulle);
		this.game.mulle.actors.mulle = mulle;

		mulle.animations.play('lookLeft');


		this.car = new MulleBuildCar(this.game, 321, 288, null, true, false);
		this.game.add.existing(this.car);

		this.game.mulle.playAudio('94e001v0');


		// begin
		
		var funnyFactor = this.game.mulle.user.Car.getProperty('funnyfactor', 0);

		var rating;

		if( funnyFactor < 2 ){
			rating = 1;
		}else if( funnyFactor < 3 ){
			rating = 2;
		}else if( funnyFactor < 5 ){
			rating = 3;
		}else if( funnyFactor < 7 ){
			rating = 4;
		}else{
			rating = 5;
		}

		// 94d003v0 - welcome
		// 94d004v0 - 5
		// 94d005v0 - 4
		// 94d006v0 - 3
		// 94d007v0 - 2
		// 94d008v0 - 1
		// 94d009v0 - medalj

		var scoreTalk = { 1: '94d008v0', 2: '94d007v0', 3: '94d006v0', 4: '94d005v0', 5: '94d004v0' };

		console.log('funnyfactor', funnyFactor, rating);
		
		judge.displayScore = () => {

			judge.talkAnimation = 'talkScore';

			console.log('display score');

			// display score
			score.setDirectorMember('94.DXR', 17 + ( rating - 1 ) );
			score.visible = true;

			// say score
			judge.talk( scoreTalk[ rating ], () => {

				// end
				console.log('end');
				this.game.state.start('world');

			});

		};
		
		// intro
		judge.talkAnimation = 'talk';
		judge.talk('94d003v0', () => {

			console.log('raise score');

			// show score
			setTimeout( () => {
				judge.animations.play('raiseScore');
			}, 500);

		});

		// ;
	
		console.log('Car show');

	}

	shutdown(){

		this.game.mulle.stopAudio('94e001v0');

		this.game.mulle.actors.mulle = null;
		this.game.mulle.actors.judge = null;

	}

}

export default CarShowState;