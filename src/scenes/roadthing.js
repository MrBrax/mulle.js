import MulleState from 'scenes/base';

import MulleSprite from 'objects/sprite';
import MulleBuildCar from 'objects/buildcar';
// import MulleActor from 'objects/actor';
import MulleCarPart from 'objects/carpart';

class RoadThingState extends MulleState {

	preload(){

		super.preload();

		this.game.load.pack('roadthing', 'assets/roadthing.json', null, this);

	}

	create(){

		super.create();

		this.DirResource = '84.DXR';

		this.game.mulle.addAudio('roadthing');

		this.car = null;

		var background = new MulleSprite(this.game, 320, 240);
		background.setDirectorMember(this.DirResource, 25);
		this.game.add.existing(background);

		this.car = new MulleBuildCar(this.game, 368, 240, null, true, true);
		this.game.add.existing(this.car);

		if(!this.game.mulle.SetWhenDone){
		
			this.game.mulle.SetWhenDone = {
				Cache: [
					"#RoadThing1"
				],
				"Parts": [
					287,
					"#Random"
				]
			};

		}

		var partId;

		for( var i of this.game.mulle.SetWhenDone.Parts ){

			if( i == '#Random' ){

				i = this.game.mulle.user.getRandomPart();

			}else{
			
				if( this.game.mulle.user.hasPart( i ) ) continue;

			}

			// console.log('final part', i);

			partId = i;

			break;

		}

		console.log('given part', partId);

		var part = new MulleCarPart(this.game, partId, 150, 400);
		part.input.inputEnabled = false;
		part.input.disableDrag();
		this.game.add.existing(part);

		this.game.mulle.user.addPart('yard', partId);

		this.game.mulle.user.Car.addCache( this.game.mulle.SetWhenDone.Cache[0] );
		
		this.game.mulle.actors.mulle.talk('84d001v0', () => {

			game.time.events.add(Phaser.Timer.SECOND * 2, () => {
				
				this.game.state.start( 'world' );

			}, this);

		});
		

	}

	shutdown(){

		super.shutdown();

	}

}

export default RoadThingState;