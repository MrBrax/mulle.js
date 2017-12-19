import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';

class StureStortandState extends MulleState {

	preload(){

		super.preload();

		this.game.load.pack('sturestortand', 'assets/sturestortand.json', null, this);

	}

	create(){

		super.create();

		this.DirResource = '88.DXR';

		this.game.mulle.addAudio('sturestortand');

		this.car = null;

		var hasLemonade 	= this.game.mulle.user.Car.hasCache('#Lemonade');
		var hasTank 		= this.game.mulle.user.Car.hasPart( 172 );


		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember( this.DirResource, hasLemonade ? 32 : 40 );
		this.game.add.existing(background);



		var mulle = new MulleActor(this.game, 351, 234, 'mulleDefault');
		mulle.talkAnimation = 'talkRegular';
		mulle.silenceAnimation = 'idle';
		this.game.add.existing(mulle);
		this.game.mulle.actors.mulle = mulle;

		mulle.scale.x = -1;



		this.car = new MulleBuildCar(this.game, 41, 301, null, true, false);
		this.game.add.existing(this.car);

		if( hasLemonade ){

			var tube = new MulleSprite(this.game, 304, 245);
			tube.setDirectorMember( this.DirResource, 17 );
			this.game.add.existing(tube);

			var f = [];
			for( var i = 0; i < 9; i++ ) f.push([this.DirResource, 17 + i]);
			tube.addAnimation('idle', f, 5, true);

			tube.animations.play('idle');

			var sture = new MulleActor(this.game, 285, 162, 'stureHappy');
			sture.talkAnimation = 'talk';
			sture.silenceAnimation = 'idle';
			this.game.add.existing(sture);
			this.game.mulle.actors.sture = sture;


			// tackar tackar, mera saft och kalaset
			sture.talk('88d005v0', () => {

				// men så bra, den kommer nog väl till pass
				mulle.talk('88d006v0', () => {

					game.time.events.add(Phaser.Timer.SECOND * 1, () => {
						this.game.state.start( 'world' );
					});

				});

			});

			var partId = 162;

			this.game.mulle.user.addPart('yard', partId);

			this.game.mulle.user.Car.removeCache('#Lemonade');

		}else{

			var sture = new MulleActor(this.game, 285, 162, 'stureSad');
			sture.talkAnimation = 'talk';
			sture.silenceAnimation = 'idle';
			this.game.add.existing(sture);
			this.game.mulle.actors.sture = sture;

			// mulle, vi har ett problem
			sture.talk('88d002v0', () => {


				if(!hasTank){
					
					// tja, jag kan ju försöka hjälpa till
					mulle.talk('88d003v0', () => {

						game.time.events.add(Phaser.Timer.SECOND * 1, () => {
							this.game.state.start( 'world' );
						});

					});

				}else{

					// jajamänsan, såklart
					mulle.talk('88d004v0', () => {

						game.time.events.add(Phaser.Timer.SECOND * 1, () => {
							this.game.state.start( 'world' );
						});

					});

				}


			});


		}

		// var dog = new MulleSprite(this.game, 480, 386);
		// dog.setDirectorMember('85.DXR', 26);
		// this.game.add.existing(dog);


		// narrator
		// this.game.mulle.playAudio('88d001v0');

		/*
		

		*/


		// bg loop
		this.game.mulle.playAudio('88e001v0'); 

	}

	shutdown(){

		this.game.mulle.stopAudio('88e001v0');

		this.game.mulle.actors.mulle = null;

		super.shutdown();

	}

}

export default StureStortandState;