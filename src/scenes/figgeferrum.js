import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';

class FiggeFerrumState extends MulleState {

	preload(){

		super.preload();

		this.game.load.pack('figgeferrum', 'assets/figgeferrum.json', null, this);

	}

	create(){

		super.create();

		this.game.mulle.addAudio('figgeferrum');

		this.car = null;


		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember('92.DXR', 1);
		this.game.add.existing(background);


		var mulle = new MulleActor(this.game, 95, 300, 'mulleDefault');
		mulle.animations.play('idle');
		mulle.talkAnimation = 'talkRegular';
		mulle.silenceAnimation = 'idle';
		this.game.add.existing(mulle);
		this.game.mulle.actors.mulle = mulle;


		var buffa = new MulleActor(this.game, 271, 347, 'buffa');
		buffa.animations.play('idle');
		this.game.add.existing(buffa);
		this.game.mulle.actors.buffa = buffa;

		// this.car = new MulleBuildCar(this.game, 368, 240, null, true, true);
		// this.game.add.existing(this.car);
		

		var figgeBody = new MulleSprite(this.game, 102, 292);
		figgeBody.setDirectorMember('92.DXR', 16);
		this.game.add.existing(figgeBody);


		var figgeHead = new MulleActor(this.game, 102, 292, 'figge');
		this.game.add.existing(figgeHead);
		this.game.mulle.actors.figge = figgeHead;


		// 92e001v0 - gas
		// 92e002v0 - bg
		// 92d001v0 - intro
		
		// 92d002v0 - nu har en salka sprungit
		// 92d003v0 - nää int har jag sett din hund
		// 92d004v0 - jo visst
		// 92d005v0 - tack du mulle
		// 92d006v0 - tack ska du ha
		
		// 92d007v0 - mulle intro talk

		this.game.mulle.playAudio('92e002v0');

		if( this.game.mulle.user.Car.hasCache('#ExtraTank') ){

			// 92d007v0 - mulle intro talk
			this.game.mulle.actors.mulle.talk('92d007v0', () => {
				this.game.state.start( 'world' );
			});

			return;
		}

		console.log('last session', this.game.mulle.lastSession);

		this.game.mulle.subtitle.setLines("92d002v0", "swedish", [
			"- Nu har 'en {Salka} sprungit bort igen.",
			"- Int' har du sett'na?"
		], "figge");

		this.game.mulle.subtitle.setLines("92d003v0", "swedish", [
			"- Nä, int' har ja' sett din hund."
		], "mulle");

		this.game.mulle.subtitle.setLines("92d002v0", "english", [
			"- My {Salka} ran away again,",
			"- Have you seen him?"
		], "figge");

		this.game.mulle.subtitle.setLines("92d003v0", "english", [
			"- Nope, haven't seen your dog."
		], "mulle");

		// 92d002v0 - nu har en salka sprungit
		this.game.mulle.actors.figge.talk('92d002v0', () => {

			if( this.game.mulle.user.Car.hasCache('#Dog') ){

				// 92d004v0 - jo visst
				this.game.mulle.actors.mulle.talk('92d004v0', () => {

					var salka = new MulleActor(this.game, 200, 363, 'salkaLeft');
					salka.animations.play('idle');
					this.game.add.existing(salka);

					// 92d005v0 - tack du mulle
					this.game.mulle.actors.figge.talk('92d005v0', () => {

						var gas = new MulleSprite(this.game, 168, 413);
						gas.setDirectorMember('92.DXR', 11);
						this.game.add.existing(gas);

						// 92d006v0 - tack ska du ha
						this.game.mulle.actors.mulle.talk('92d006v0', () => {

							this.game.mulle.user.Car.addCache('#ExtraTank');

							this.game.mulle.lastSession.carFuel = this.game.mulle.lastSession.carMaxFuel;
				
							this.game.state.start( 'world' );

						});

					});

				});

			}else{

				// 92d003v0 - nää int har jag sett din hund
				this.game.mulle.actors.mulle.talk('92d003v0', () => {

					this.game.state.start( 'world' );

				});

			}


		});

	}

	shutdown(){

		this.game.mulle.stopAudio('92e002v0');

		this.game.mulle.actors.figge = null;
		this.game.mulle.actors.mulle = null;
		this.game.mulle.actors.buffa = null;

		super.shutdown();

	}

}

export default FiggeFerrumState;