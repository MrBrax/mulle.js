class MulleAudio extends Phaser.AudioSprite {

	constructor( game, key ){

		super(game, key);

	}

	playId( id ){

		for( var i in this.config.spritemap ){

			if( this.config.spritemap[i].id && id == this.config.spritemap[i].id ){

				return this.play( i );

			}

		}

	}

}

export default MulleAudio;