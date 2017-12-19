/**
 * MulleToolbox object
 * @module objects/toolbox
 */
"use strict";

import MulleSprite from 'objects/sprite';

/**
 * Mulle actor, extension of mulle sprite + phaser sprite
 * @extends MulleSprite
 */
class MulleToolbox extends MulleSprite {

	constructor( game, x, y ){

		super( game, x, y );

		this.startX = x;
		this.startY = y;

		this.isShowing = false;

		this.setDirectorMember('00.CXT', 97);

		this.inputEnabled = true;

		// this.input.useHandCursor = true;

		this.events.onInputOver.add( () => {

			// console.log('hover');

			game.add.tween( this ).to( {
				x: this.startX-40,
				y: this.position.y,
				// direction: msg.d,
			}, Phaser.Timer.SECOND / 5, Phaser.Easing.Linear.None, true);

			this.game.mulle.playAudio('00e040v0');

		});

		this.events.onInputOut.add( () => {

			// console.log('hover');

			game.add.tween( this ).to( {
				x: this.startX,
				y: this.position.y,
				// direction: msg.d,
			}, Phaser.Timer.SECOND / 5, Phaser.Easing.Linear.None, true);

		});

		this.events.onInputDown.add( this.toggleToolbox );

	}

	toggleToolbox(me, pointer){

		if( me.isShowing ){
			me.isShowing = !me.hideToolbox();
		}else{
			me.isShowing = me.showToolbox();
		}

	}

	showToolbox(){

		// console.log('show toolbox', this);

	}

	hideToolbox(){

		// console.log('hide toolbox', this);

	}

}

export default MulleToolbox;