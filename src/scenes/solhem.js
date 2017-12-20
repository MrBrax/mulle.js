import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';

class SolhemState extends MulleState {

	preload(){

		super.preload();

		this.game.load.pack('solhem', 'assets/solhem.json', null, this);

	}

	create(){

		super.create();

		this.DirResource = '86.DXR';

		this.game.mulle.addAudio('solhem');

		this.car = null;

		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember(this.DirResource, 1);
		this.game.add.existing(background);

		var hasLadder = this.game.mulle.user.Car.hasPart( 173 );


		if( !this.game.mulle.user.hasStuff('#FerryTicket') ){

			var car = new MulleBuildCar(this.game, 257, 344, null, true, false);
			this.game.add.existing(car);

			var mulle = new MulleActor(this.game, 350, 398, 'mulleDefault');
			mulle.animations.play('idle');
			mulle.talkAnimation = 'talkRegular';
			mulle.silenceAnimation = 'idle';
			this.game.add.existing(mulle);
			this.game.mulle.actors.mulle = mulle;

			var miaBody = new MulleActor(this.game, 277, 246, 'miaBody');
			miaBody.animations.play('idle');
			miaBody.talkAnimation = 'talk';
			miaBody.silenceAnimation = 'idle';
			this.game.add.existing( miaBody );
			this.game.mulle.actors.miaBody = miaBody;

			var miaHead = new MulleActor(this.game, 535, 336, 'miaHead');
			miaHead.animations.play('idle');
			miaHead.talkAnimation = 'talk';
			miaHead.silenceAnimation = 'idle';
			this.game.add.existing( miaHead );
			this.game.mulle.actors.miaHead = miaHead;

			var cat = new MulleActor(this.game, 278, 240, 'cat');
			cat.animations.play('idle');
			this.game.add.existing( cat );
			this.game.mulle.actors.cat = cat;


			// åh vad bra att du kom mulle
			miaHead.talk('86d002v0', () => {

				if( hasLadder ){

					mulle.talk('86d004v0', () => {

						if( hasLadder ){
							var ladder = new MulleSprite(this.game, 0, 0);
							ladder.setDirectorMember(this.DirResource, 3);
							ladder.sortIndex = 12;
							car.add(ladder);
							car.forEach( (c) => { if(c.partId == 173) c.destroy(); } );
							car.sortLayers();
						}

						cat.animations.play('jump1').onComplete.addOnce(() => {

							miaBody.position.set( 278, 240 );
							miaHead.position.set( 528, 337 );

							miaBody.animations.play('catchIntro');

							miaHead.visible = false;

							cat.animations.play('jump2').onComplete.addOnce(() => {

								cat.visible = false;

								// miaBody.animations.play('idleCat');

								miaBody.animations.play('catchEnd').onComplete.addOnce(() => {

									miaHead.animations.play('idleCat');
									miaHead.visible = true;

									miaHead.talkAnimation = 'talkCat';
									miaHead.silenceAnimation = 'idleCat';

									// färja
									miaHead.talk('86d005v0', () => {

										this.game.mulle.user.addStuff('#FerryTicket');

										// man tackar
										mulle.talk('86d006v0', () => {

											this.game.state.start('world');

										});

									});

								});				

							});

							// 

						});

					});

				}else{

					mulle.talk('86d003v0', () => {

						this.game.state.start('world');

					});

				}

			});

		}else{

			var car = new MulleBuildCar(this.game, 257, 344, null, true, true);
			this.game.add.existing(car);

			this.game.mulle.actors.mulle.talk('86d007v0', () => {

				this.game.state.start('world');

			});

		}

		// 86e001v0 - cat meow
		// 86e002v0 - cat angry
		// 86e003v0 - cat meoooow
		// 86e004v0 - cat meow x3
		
		// 86e005v0 - bg loop

		// 86d001v0 - narrator
		
		//  - nja
		//  - jajamänsan
		// 86d005v0 - tack snälla
		// 86d006v0 - man tackar


		// 86d007v0 - ja jag hjälpte mia att ta ner

		this.game.mulle.playAudio('86e005v0');

	}

	shutdown(){

		this.game.mulle.actors.mulle = null;
		this.game.mulle.actors.miaHead = null;
		this.game.mulle.actors.miaBody = null;
		this.game.mulle.actors.cat = null;

		this.game.mulle.stopAudio('86e005v0');

		super.shutdown();

	}

}

export default SolhemState;