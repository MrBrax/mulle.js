/**
 * MulleMPCar object
 * @module objects/mpcar
 */
"use strict";

import MulleSprite from 'objects/sprite';

/**
 * Multiplayer car
 * @extends MulleSprite
 */
class MulleMPCar extends MulleSprite {

	constructor( game ){

		super( game );

		this.setDirectorMember('05.DXR', 121);

		this.spriteFrames = {};

		for( var i = 0; i < 16; i++ ){
			this.spriteFrames[ i + 1 ] = this.game.mulle.getDirectorImage( '05.DXR', (110 + i) ).name;
		}


		this.direction = 1;
		
		this.enabled = true;

		this.nametag = new Phaser.Text( this.game, 0, -15, 'Player', {
			
			font: '10px arial',
			fill: '#ffffff',
			// backgroundColor: 'rgba(0,0,0,.5)',

			stroke: '#000000',
			strokeThickness: 2,

			boundsAlignH: 'center',
			boundsAlignV: 'middle'

		} );
		
		/*
		this.badge = new Mulle.Graphics(0, 0);
		this.badge.beginFill('0x333333',1);
		this.badge.drawRect( 0, 0, 300, 32);
		this.badge.endFill();
		*/

		// this.addChild( this.badge );
		this.addChild( this.nametag );

	}

	updateImage(){
		var n = this.spriteFrames[ this.direction ];		
		this.frameName = n;
	}

	destroy(){

		this.nametag.destroy();

		//this.badge.destroy();

		super.destroy();

	}

}

export default MulleMPCar;