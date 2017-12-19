/**
 * MulleState base state
 * @module MulleState
 */
"use strict";

import MulleSprite from '../objects/sprite';

/**
 * MulleState, extension of phaser state
 * @extends Phaser.State
 */
class MulleState extends Phaser.State {

	preload(){

		if( this.game.mulle.activeCutscene ){

			console.log('cutscene', this.key, this.game.mulle.activeCutscene);

			this.cutscene = new MulleSprite(this.game, 320, 240);
			this.cutscene.setDirectorMember( '00.CXT', this.game.mulle.activeCutscene );
			this.game.add.existing(this.cutscene);

			this.progress = game.add.graphics(0, 0);

		}

	}

	loadRender(){

		if( this.progress ){

			var p = this.game.load.progressFloat / 100;
			
			this.progress.clear();

			this.progress.beginFill('0x333333',1);
			this.progress.drawRect( 640/2 - 150, 400, 300, 32);
			this.progress.endFill();
			
			this.progress.beginFill('0x65C265',1);
			this.progress.drawRect( 640/2 - 150, 400, p * 300, 32);
			this.progress.endFill();

			this.progress.beginFill('0x65C265',1);

		}
		
	}

	/*
	

	loadUpdate(){		
		console.log('loadUpdate', this.key);
	}
	*/

	create(){

		if( this.cutscene ){
			console.log('destroy cutscene');
			this.cutscene.destroy();
			this.game.mulle.activeCutscene = null;

			this.progress.destroy();

		}

		if( !this.game.mulle.user ){

			this.game.mulle.user = this.game.mulle.UsersDB[ Object.keys(this.game.mulle.UsersDB)[0] ];

			// if( process.env.NODE_ENV !== "production" ){

			window.location.hash = this.key;

			this.game.mulle.net.send( { name: this.game.mulle.user.UserId } );
			this.game.mulle.net.send( { parts: this.game.mulle.user.Car.Parts } );

		}

		// this.game.canvas.className = '';

		this.game.mulle.cursor.reset();

		// console.log('prelaunch', this.key);

	}

}

export default MulleState;