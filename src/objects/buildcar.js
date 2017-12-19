/**
 * Buildable car
 * @module objects/buildcar
 */
"use strict";

import MulleSave from 'struct/savedata';

import MulleSprite from 'objects/sprite';
import MulleActor from 'objects/actor';
import MulleCarPart from 'objects/carpart';

/**
 * Buildable car
 * @extends Phaser.Group
 */
class MulleBuildCar extends Phaser.Group {

	/**
	 * Create car
	 * @param  {Phaser.Game}	game
	 * @param  {number}			x
	 * @param  {number}			y
	 * @param  {Array}			parts
	 * @param  {Boolean}		isLocked
	 * @param  {Boolean}		hasDriver
	 * @return {void}
	 */
	constructor( game, x, y, parts, isLocked = false, hasDriver = false ){
		
		super(game);

		this.x = x;
		this.y = y;

		if(parts){
			this.parts = parts;
		}else{
			this.parts = this.game.mulle.user.Car.Parts
		}

		this.locked = isLocked;

		this.partSprites = {};

		this.points = {};
		this.layers = {};

		this.usedPoints = {};
		this.coveredPoints = {};

		this.mulleSit = null;
		this.hasDriver = hasDriver;

		this.onAttach 	= new Phaser.Signal();
		this.onDetach 	= new Phaser.Signal();
		this.onRefresh 	= new Phaser.Signal();

		this.refresh();

	}

	/**
	 * Refresh visible object with parts set earlier
	 * @return {void}
	 */
	refresh(){

		// console.log('refresh car', this.parts);

		this.points = {};
		this.layers = {};

		this.usedPoints = {};
		this.coveredPoints = {};

		// this.killAll();
		this.removeAll(true);
		this.partSprites = {};

		for( let partNum in this.parts ){

			let partId = this.parts[partNum];
			let partData = this.game.mulle.getPart( partId ); // this.game.mulle.PartsDB[partId];

			if(!partData){
				console.error('invalid part', partId);
				continue;
			}

			this.partSprites[ partId ] = {};

			if( partData.new ){

				partData.new.forEach( (v, k) => {

					this.points[ v.id ] = { fg: v.fg, bg: v.bg, offset: v.offset };

				});

			}

			if( partData.Requires ){
				partData.Requires.forEach( (s) => {
					this.usedPoints[s] = true;
				});
			}

			/*
			if( partData.Covers ){
				partData.Covers.forEach( (s) => {
					console.log('covers', partId, s);
					this.coveredPoints[s] = true;
				});
			}
			*/

			if( partData.UseView ){

				// let atlasId_fg = this.game.mulle.findFrame([cp1, cp2], partData.UseView);

				let sprite_fg = new MulleSprite(this.game, 0, 0);
				
				// sprite_fg.setFrameId( partData.UseView );
				sprite_fg.setDirectorMember( 'CDDATA.CXT', partData.UseView );

				sprite_fg.partId = partId;
				
				sprite_fg.layer = partData.Requires[0];

				sprite_fg.sortIndex = this.points[ sprite_fg.layer ] ? this.points[ sprite_fg.layer ].fg : 8;

				sprite_fg.position.add( partData.offset.x, partData.offset.y );

				if( !this.locked && partData.Requires ){

					sprite_fg.inputEnabled = true;
					
					// sprite_fg.input.useHandCursor = true;
					
					sprite_fg.events.onInputOver.add(() => {
						this.game.mulle.cursor.current = 'Grab';
					});

					sprite_fg.events.onInputOut.add(() => {
						this.game.mulle.cursor.current = null;
					});

					sprite_fg.events.onInputDown.add( (ev) => {

						this.game.mulle.cursor.current = null;
						
						console.debug('detach part by drag', partId);
						
						this.detach( partId );

					}, this.game);

				}

				this.add(sprite_fg);

				this.partSprites[ partId ]['fg'] = sprite_fg;

			}

			if( partData.UseView2 ){

				// let atlasId_bg = this.game.mulle.findFrame([cp1, cp2], partData.UseView2);

				let sprite_bg = new MulleSprite(this.game, 0, 0);
				sprite_bg.setDirectorMember( 'CDDATA.CXT', partData.UseView2 );
				sprite_bg.partId = partId;

				sprite_bg.layer = partData.Requires[0];
				sprite_bg.sortIndex = this.points[ sprite_bg.layer ].bg ? this.points[ sprite_bg.layer ].bg : 7;

				sprite_bg.is_bg = true;

				sprite_bg.position.add( partData.offset.x, partData.offset.y );

				this.add(sprite_bg);

				this.partSprites[ partId ]['bg'] = sprite_bg;

			}

			// console.log( partId, sprite.regPoint );

		}

		if( this.hasDriver ){
			
			this.mulleSit = new MulleActor(this.game, 0, 0, 'mulleSit');
			this.mulleSit.isMulle = true;
			this.mulleSit.sortIndex = 18;
			this.addChild(this.mulleSit);
			this.game.mulle.actors.mulle = this.mulleSit;

			// this.mulleSit.animations.play('wave');

		}

		for( var k in this.points ){
			this.layers[ k ] = { fg: this.points[k].fg, bg: this.points[k].bg };
		}
	
		this.sortLayers();

		this.onRefresh.dispatch();

		// console.log('used points', this.usedPoints);
		// console.log('covered points', this.coveredPoints);
		
		console.debug('[build-car]', 'attachment points', this.points);
		// console.log('sprites', this.sprites);
		// console.log('layers', this.layers);

	}

	sortLayers(){
		this.customSort( (a, b) => {
			return a.sortIndex < b.sortIndex ? -1 : 1;
		});
	}

	/**
	 * Attach a part by ID
	 * @param  {number} partId
	 * @return {Boolean} successful
	 */
	attach( partId, noSave = false ){

		if(this.locked) return false;

		this.parts.push( parseInt( partId ) );

		this.onAttach.dispatch( partId );

		this.refresh();

		if(!noSave) this.save();

		return true;

	}

	/**
	 * Detach a part by ID
	 * @param  {number}		partId
	 * @param  {Boolean}	makePart	create part and start dragging
	 * @return {Boolean}	successful
	 */
	detach( partId, makePart = false ){

		if(this.locked) return false;

		console.debug('detach part', partId);

		var partIndex = this.parts.indexOf( partId );
		if( partIndex === -1 ) return false;

		let partData = this.game.mulle.getPart( partId );

		var newPos = this.partSprites[ partId ].fg.worldPosition.clone();
		var newId = partData.master ? partData.master : partId;
		
		this.parts.splice( partIndex, 1 );

		this.onDetach.dispatch( partId, newId, newPos );

		this.refresh();

		if( makePart ){
		
			var holdPart = new MulleCarPart(this.game, newId);
			holdPart.car = this;
			holdPart.justDetached = true;

			// holdPart.setJunkPile( this.game.mulle.user.Junk.shopFloor, true );

			this.junkParts.addChild(holdPart);

			holdPart.position.set( newPos.x, newPos.y );
			holdPart.position.add( holdPart.regPoint.x, holdPart.regPoint.y );			

			holdPart.input.startDrag( this.game.input.activePointer );

			this.game.mulle.playAudio( holdPart.sound_attach );

		}

		this.save();

		return true;

	}

	destroy(){

		if(this.mulleSit && this.game.mulle.actors.mulle == this.mulleSit) this.game.mulle.actors.mulle = null;

		super.destroy();

	}

	/**
	 * Dump data into user save object
	 * @return {void}
	 */
	save(){
		this.game.mulle.user.Car.Parts = this.parts;
		// this.game.mulle.user.save();
	}

}

export default MulleBuildCar;