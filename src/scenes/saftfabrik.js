import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';

class SaftfabrikState extends MulleState {

	preload(){

		super.preload();

		this.game.load.pack('saftfabrik', 'assets/saftfabrik.json', null, this);

	}

	create(){

		super.create();

		this.DirResource = '87.DXR';

		this.game.mulle.addAudio('saftfabrik');

		this.car = null;

		var hasLemonade 	= this.game.mulle.user.Car.hasCache('#Lemonade');
		var hasTank 		= this.game.mulle.user.Car.hasPart( 172 );


		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember( this.DirResource, 208 );
		this.game.add.existing(background);


		var mulle = new MulleActor(this.game, 496, 332, 'mulleDefault');
		mulle.talkAnimation = 'talkRegular';
		mulle.silenceAnimation = 'idle';
		this.game.add.existing(mulle);
		this.game.mulle.actors.mulle = mulle;


		this.car = new MulleBuildCar(this.game, 217, 335, null, true, false);
		this.game.add.existing(this.car);



		var garson = new MulleActor(this.game, 537, 218, 'garson');
		garson.talkAnimation = 'talk';
		garson.silenceAnimation = 'idle';
		this.game.add.existing(garson);
		this.game.mulle.actors.garson = garson;
		
		garson.talk('87d002v0', () => {

			if( hasTank ){
			
				// jomenvisst
				mulle.talk('87d004v0', () => {

					var splash = new MulleSprite(this.game, 320, 241);
					splash.setDirectorMember( this.DirResource, 26 );
					this.game.add.existing(splash);

					var f = [];
					for( var i = 0; i < 4; i++ ) f.push([this.DirResource, 26 + i]);
					splash.addAnimation('idle', f, 5, true);

					splash.animations.play('idle');

					// splash sound
					this.game.mulle.playAudio('87e001v0', () => {

						splash.destroy();

						// nu kör du bara rakt fram
						garson.talk('87d005v0', () => {
							
							// uppfattat
							mulle.talk('87d006v0', () => {

								game.time.events.add(Phaser.Timer.SECOND * 1, () => {
									this.game.state.start( 'world' );
								});

							});

						});

					});

				});

				this.game.mulle.user.Car.addCache('#Lemonade');

			}else{

				// nja
				mulle.talk('87d003v0', () => {

					game.time.events.add(Phaser.Timer.SECOND * 1, () => {
						this.game.state.start( 'world' );
					});

				});

			}

		});

		

		// var dog = new MulleSprite(this.game, 480, 386);
		// dog.setDirectorMember('85.DXR', 26);
		// this.game.add.existing(dog);


		// narrator
		// this.game.mulle.playAudio('87d001v0');
		
		// slut saft
		// this.game.mulle.playAudio('87d002v0');
		
		// nja
		// this.game.mulle.playAudio('87d003v0');

		
		// this.game.mulle.playAudio('87d004v0');
	
		
		// this.game.mulle.playAudio('87d005v0');

		
		// this.game.mulle.playAudio('87d006v0');

		// nu är ju saftfabriken stängd
		// this.game.mulle.playAudio('87d007v0');

	}

	shutdown(){

		this.game.mulle.stopAudio('87e001v0');

		this.game.mulle.actors.mulle = null;

		super.shutdown();

	}

}

export default SaftfabrikState;