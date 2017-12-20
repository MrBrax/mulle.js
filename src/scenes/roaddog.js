import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
import MulleActor from 'objects/actor';

class RoadDogState extends MulleState {

	preload(){

		super.preload();

		this.game.load.pack('roaddog', 'assets/roaddog.json', null, this);

	}

	create(){

		super.create();

		this.game.mulle.addAudio('roaddog');

		this.car = null;

		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember('85.DXR', 25);
		this.game.add.existing(background);

		this.car = new MulleBuildCar(this.game, 368, 240, null, true, true);
		this.game.add.existing(this.car);

		// var dog = new MulleSprite(this.game, 480, 386);
		// dog.setDirectorMember('85.DXR', 26);
		// this.game.add.existing(dog);

		var salka = new MulleActor(this.game, 480, 386, 'salkaRight');
		salka.animations.play('idle');
		this.game.add.existing(salka);


		this.game.mulle.playAudio('85e001v0'); // salka idle audio

		this.game.mulle.subtitle.setLines("85d002v0", "swedish", [
			"- Jahadu lilla {Salka}, du har kommit vilse igen.",
			"- Då kör vi hem dig till {Figge}!"
		], "mulle");

		this.game.mulle.subtitle.setLines("85d002v0", "english", [
			"- Oh {Salka}, you've gotten lost again.",
			"- We'll drive you home to {Figge}!"
		], "mulle");

		this.game.mulle.actors.mulle.talk('85d002v0', () => {
			
			this.game.mulle.activeCutscene = '00b008v0';

			this.game.mulle.user.Car.addCache('#GotDogOnce');
			this.game.mulle.user.Car.addCache('#Dog');
			
			this.game.state.start( 'world' );

		});

	}

	shutdown(){

		this.game.mulle.stopAudio('85e001v0');

		super.shutdown();

	}

}

export default RoadDogState;