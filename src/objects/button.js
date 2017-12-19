/**
 * Button extension
 * @module objects/button
 */
"use strict";

import MulleSprite from 'objects/sprite';

/**
 * Mulle button
 * @extends Phaser.Button
 */
class MulleButton extends Phaser.Button {

	constructor( game, x, y, opt ){

		super(game, x, y);

		this.opt = opt;

		
		this.displaySprite = new MulleSprite(this.game, this.x, this.y);

		// this.displaySprite.loadTexture( this.opt.imageDefault[0], this.opt.imageDefault[1].toString() );
		this.displaySprite.setDirectorMember( this.opt.imageDefault[0], this.opt.imageDefault[1] );

		this.game.add.existing(this.displaySprite);


		if( this.displaySprite._frame ){

			this.hitArea = new Phaser.Rectangle(
				-this.displaySprite.regPoint.x,
				-this.displaySprite.regPoint.y,
				this.displaySprite._frame.width,
				this.displaySprite._frame.height
			);

		}else{

			console.error('no hit area', this);

		}

		this.input.useHandCursor = false;

		this.cursor = 'Click';

	}

	onInputOverHandler(){

		if(this.cursor) this.game.mulle.cursor.current = this.cursor;
		
		if(this.displaySprite && this.opt.imageHover) this.displaySprite.setDirectorMember( this.opt.imageHover[0], this.opt.imageHover[1] );
		
		if(this.opt.soundHover) this.game.mulle.playAudio( this.opt.soundHover );

	}

	onInputOutHandler(){

		this.game.mulle.cursor.current = null;

		if(this.displaySprite && this.opt.imageDefault) this.displaySprite.setDirectorMember( this.opt.imageDefault[0], this.opt.imageDefault[1] );
		
		if(this.opt.soundDefault) this.game.mulle.playAudio( this.opt.soundDefault );

	}

	onInputUpHandler(){
		this.opt.click();
	}

	onDown(){
		
	}

};

export default MulleButton;