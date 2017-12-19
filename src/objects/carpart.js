/**
 * MulleCarPart object
 * @module objects/carpart
 */
"use strict";

import MulleSprite from 'objects/sprite';

/**
 * Mulle sprite, extension of phaser sprite
 * @extends MulleSprite
 */
class MulleCarPart extends MulleSprite {

	/**
	 * Create car part
	 * @param  {Phaser.Game}	game      Main game
	 * @param  {number}			part_id   Junk part ID
	 * @param  {number}			x         x position
	 * @param  {number}			y         y position
	 * @param  {boolean}		noPhysics Disable physics
	 * @return {void}
	 */
	constructor( game, part_id, x, y, noPhysics = false ){

		super(game, x, y);

		this.part_id = part_id;

		this.car = null;

		this.canAttach = false;
		this.activeMorph = null;
		this.activeView = null;
		this.noAttach = false;
		this.snapSound = false;

		this.snapDistance = 40;

		this.justDetached = false;

		this.groundSound = false;

		this.noPhysics = noPhysics;

		this.dropTargets = [];

		this.dragTicks = 0;


		if(!this.game.mulle.PartsDB[ this.part_id ]){
			console.error('invalid part', this.part_id);
			return;
		}

		this.partData = this.game.mulle.getPart( this.part_id );

		// this.sound_grab = "00e004v0";
		this.sound_floor = "00e001v0";
		this.sound_attach = "03e003v0";
		
		var weight = this.getProperty('weight');

		// console.log(this.part_id, 'weight', weight);

		if(weight){

			/*
				"00e001v0" // light floor
				"00e002v0" // medium floor
				"00e003v0" // heavy floor

				"00e004v0" // light lower
				"00e005v0" // medium lower
				"00e006v0" // heavy lower

				"03e003v0" // light attach
				"03e003v1" // medium attach
				"03e003v2" // heavy attach
			*/
		
			if(weight >= 4){
				this.sound_attach 	= "03e003v2";
				this.sound_floor 	= "00e003v0";
			}else if(weight >= 2){
				this.sound_attach 	= "03e003v1";
				this.sound_floor 	= "00e002v0";
			}

			

		}

		
		this.default = {
			junkView:	game.mulle.getDirectorImage('CDDATA.CXT', this.partData.junkView),
			UseView:	game.mulle.getDirectorImage('CDDATA.CXT', this.partData.UseView),
			UseView2:	game.mulle.getDirectorImage('CDDATA.CXT', this.partData.UseView2),
			offset: this.partData.offset.clone()
		};

		console.log('default', this.default);
		
		this.morphs = null;

		if( this.partData.MorphsTo ){

			this.morphs = [];

			for( let i = 0; i < this.partData.MorphsTo.length; i++ ){
				
				let partId = this.partData.MorphsTo[i];
				let partData = this.game.mulle.getPart(partId);

				// this.morphs.push(partData);
				
				this.morphs.push({
					
					partId: partId,
					partData: partData,
					
					junkView:	game.mulle.getDirectorImage('CDDATA.CXT', partData.junkView),
					UseView:	game.mulle.getDirectorImage('CDDATA.CXT', partData.UseView),
					UseView2:	game.mulle.getDirectorImage('CDDATA.CXT', partData.UseView2),
					
					offset: partData.offset.clone()

				});
				

			}

		}

		// this.loadTexture( this.UseView.key, this.UseView.frame );

		this.setImage('junkView');


		this.inputEnabled = true;

		this.input.enableDrag(false);
		
		// this.input.useHandCursor = true;
		
		this.cursor = 'Grab';
		
		// this.cursorDefault = 'grab';
		// this.cursorGrab = 'grab';

		
		this.events.onInputOver.add(() => {
			this.game.mulle.cursor.current = 'Grab';
		});

		this.events.onInputOut.add(() => {
			this.game.mulle.cursor.current = null;
		});
		

		// dragging
		this.events.onDragStart.add( this.onGrab.bind(this) );
		this.events.onDragStop.add( this.onDrop.bind(this) );
		this.events.onDragUpdate.add( this.onMove.bind(this) );


		if(!this.noPhysics){

			this.game.physics.enable( this, Phaser.Physics.ARCADE);
			this.body.collideWorldBounds = true;

			this.body.onWorldBounds = new Phaser.Signal();
			this.body.onWorldBounds.add(this.onHitGround, this);

		}
		
		// console.log('part', this.part_id, this.partData);

	}


	/**
	 * Set active image
	 * @param {string} name junkView/UseView/UseView2
	 */
	setImage( name ){

		/*
		if( this.frameName == name ) return;

		if( this.activeMorph != null ){

		}else{

			console.log( 'set frame', this.default[name] );

			this.setFrame( this.default[name] );

		}
		*/
		
		var src = this.activeMorph != null ? this.morphs[ this.activeMorph ] : this.default;

		if( this.key == src[name].key && this.animations.frameName == src[name].name ) return;


		if( this.key == src[name].key ){

			// console.log('same key', src[name].name, this.frameName);

			this.frameName = src[name].name;

		}else{

			this.loadTexture( src[name].key, src[name].name );

		}

		this.activeView = name;

		console.debug('set image', this.activeMorph, name,  src[name].key,  src[name].name);

	}

	onMove( game, pointer, x, y, point, fromStart ){

		// console.debug('move part', pointer, x, y, point, fromStart);

		/*
		for( var obj of window.game.world.children ){

			if( obj.hitArea ){

				if( obj.hitArea.contains( pointer.position.x - obj.position.x, pointer.position.y - obj.position.y ) ){

					if(!obj.isOver){
						// obj.onInputOverHandler();
						obj.events.onInputOver.dispatch(this, { dragging: this } );
						obj.isOver = true;
					}
					
				}else{

					if(obj.isOver){
						// obj.onInputOutHandler();
						obj.events.onInputOut.dispatch(this, { dragging: this } );
						obj.isOver = null;
					}


				}

			}

		}
		*/

		
		if( this.dropTargets ){

			for( var t of this.dropTargets){
				
				// console.log(i, this.dropTargets[i]);
				
				if(!t[0].hitArea) continue;

				// var test = t[0].hitArea.clone();
				// test.offset( t[0].x, t[0].y );

				// game.debug.geom(test,'rgba(255,0,0,.6)');

				if( t[0].hitArea.contains( pointer.x - t[0].position.x, pointer.y - t[0].position.y ) ){

					if( !t[0].isHovering ){

						t[0].cursor = t[0].cursorDrag;

						t[0].events.onInputOver.dispatch();
						
						t[0].isHovering = true;

						// this.game.mulle.cursor.add( t[0].cursorDrag );

					}

					break;

				}else{

					if( t[0].isHovering ){

						t[0].cursor = t[0].cursorHover;
						
						t[0].events.onInputOut.dispatch();
						
						t[0].isHovering = null;

						// this.game.mulle.cursor.remove( t[0].cursorDrag );

					}

				}

			}

		}
		

		if(!this.car) return;

		if( !this.justDetached && this.noAttach ){

			this.activeMorph = null;
			this.canAttach = false;

			if( this.activeView != 'junkView' ) this.setImage('junkView');

			this.dragTicks++;
			if( this.dragTicks == 60 ){

				this.game.mulle.actors.mulle.talk('03d04' + this.game.rnd.integerInRange(0, 2) + 'v0');

			}

			// console.log('no attach');

			return;

		}

		var offJnk = this.default.junkView.frame.regpoint;

		if( this.morphs ){

			for( var i = 0; i < this.morphs.length; i++ ){
				
				var morph = this.morphs[i];
				
				// var partData = this.game.PartsDB[ partId ];
				
				var offUse = morph.UseView.frame.regpoint;

				var chk_x = x - offJnk.x + offUse.x;
				var chk_y = y - offJnk.y + offUse.y - morph.offset.y;

				var dst_x = this.car.x + morph.offset.x;
				var dst_y = this.car.y + morph.offset.y;

				var distance = this.game.math.distance( chk_x, chk_y, dst_x, dst_y );

				if( distance < this.snapDistance ){
					// console.log('snap to morph ' + i);
					
					if(!this.checkCanAttach(i)) continue;

					this.position.set( dst_x, dst_y );
					this.canAttach = true;
					this.activeMorph = i;
					this.setImage('UseView');

					if(!this.snapSound){
						this.game.mulle.playAudio( this.sound_attach );
						this.snapSound = true;
					}

					return;
				}

			}

			if( this.snapSound ){
				this.game.mulle.playAudio( this.sound_attach );
				this.snapSound = false;
			}
			
			this.canAttach = false;
			this.activeMorph = null;
			this.setImage('junkView');
			

		}else{
			
			// var offJnk = this.game.offsets[ this.junkView.frame ];
			
			var offUse = this.default.UseView.frame.regpoint;

			var chk_x = x - offJnk.x + offUse.x;
			var chk_y = y - offJnk.y + offUse.y;

			var distance = this.game.math.distance( chk_x, chk_y, this.car.x, this.car.y );

			if( distance < this.snapDistance && this.checkCanAttach() ){

				this.setImage('UseView');
				this.position.set( this.car.x, this.car.y );
				this.canAttach = true;

				if(!this.snapSound){
					this.game.mulle.playAudio( this.sound_attach );
					this.snapSound = true;
				}

			}else{
				this.setImage('junkView');
				this.canAttach = false;

				if( this.snapSound ){
					this.game.mulle.playAudio( this.sound_attach );
					this.snapSound = false;
				}
				

			}

		}

	}

	/**
	 * Check if part can be attached
	 * @param  {number} morph Morph ID
	 * @return {boolean}
	 */
	checkCanAttach( morph = null ){

		// this.noAttach = false;

		if( morph != null && this.morphs ){

			if( this.morphs[ morph ].partData.Requires ){
				for( var r in this.morphs[ morph ].partData.Requires ){
					if( this.car.usedPoints[ this.morphs[ morph ].partData.Requires[r] ] ){
						// console.log('used point', morph);
						return false;
					}
				}
			}

			if( this.morphs[ morph ].partData.Covers ){
				for( var r in this.morphs[ morph ].partData.Covers ){
					if( this.car.coveredPoints[ this.morphs[ morph ].partData.Covers[r] ] ){
						// console.log('covered point', morph, this.morphs[ morph ].partData.Covers[r] );
						return false;
					}
				}
			}

		}

		if( this.partData.Requires ){

			var hasPoint = false;
			for( var r in this.partData.Requires ){
				if( this.car.points[ this.partData.Requires[r] ] ){
					hasPoint = true;
					break;
				}
			}
			if(!hasPoint) return false;

			for( var r in this.partData.Requires ){
				if( this.car.usedPoints[ this.partData.Requires[r] ] ){
					return false;
				}
			}

			for( var r in this.partData.Covers ){
				if( this.car.coveredPoints[ this.partData.Covers[r] ] ){
					return false;
				}
			}

		}

		return true;

	}

	onGrab(){

		// console.debug('grab part', this);

		this.dragTicks = 0;

		this.bringToTop();

		// this.game.mulle.playAudio( this.sound_grab );

		this.groundSound = false;

		if(!this.noPhysics){
			this.body.moves = false;
		}

		if(!this.car) return;

		if( this.morphs ){

			var ok = this.morphs.length;
			this.morphs.forEach( (m, i) => {
				if( !this.checkCanAttach(i) ) ok--;				
			});

			this.noAttach = ok <= 0;

		}else{

			this.noAttach = !this.checkCanAttach();

		}


	}
	
	onDrop( obj, pointer ){

		// console.log('drop part', a, b, c);

		if(!this.justDetached){

			var dist = Phaser.Point.distance( this.position, this.input.dragStartPoint );

			if( dist < 5 ){

				this.playDescription();

			}

		}

		
		this.snapSound = false;

		if(!this.noPhysics){
			this.body.moves = true;
			this.body.velocity.set(0);
		}else{

			this.game.mulle.playAudio( this.sound_floor );

		}

		this.justDetached = false;

		if( !this.noAttach && this.canAttach ){

			var partId = this.part_id;

			if( this.activeMorph !== null ) partId = this.morphs[ this.activeMorph ].partId;

			console.log('attach part by drag', partId);

			this.events.onInputOut.dispatch();

			this.destroy();
			
			this.car.attach( partId );

			return;

		}else{

			this.activeMorph = null;
			this.setImage('junkView');

		}

		// drop action
		if( this.dropTargets ){

			for( var dt of this.dropTargets ){
				
				// console.log(i, this.dropTargets[i]);
				
				if(!dt[0].hitArea) continue;

				// var test = dt[0].hitArea.clone();
				// test.offset( dt[0].x, dt[0].y );
				
				// game.debug.geom(test,'rgba(255,0,0,.6)');

				if( dt[0].hitArea.contains( pointer.x - dt[0].position.x, pointer.y - dt[0].position.y ) ){

					var g = this.game; // save this just for a second
					
					var ret = dt[1]( this );
					
					if(ret){

						g.mulle.cursor.remove( dt[0].cursor );

						dt[0].cursor = dt[0].cursorHover;

						return;

					}

				}

			}

		}


		// tween back
		if( this.dropRects ){

			var inBounds = false;
			for( var i = 0; i < this.dropRects.length; i++ ){
				if( this.dropRects[i].contains( this.x, this.y ) ){
					inBounds = true;
					break;
				}
			}

			if(!inBounds){

				// console.log('out of bounds');
				
				var r = this.game.rnd.pick( this.dropRects ); 

				this.game.add.tween(this).to( { x: r.randomX, y: r.randomY }, 1000, Phaser.Easing.Cubic.Out, true);


			}
			
		}

		// if( this.junkPile ){
		// 	this.updateJunkPile();
		// }

	}

	onHitGround(){

		if(!this.groundSound){

			this.game.mulle.playAudio( this.sound_floor );

			this.groundSound = true;

			// if( this.junkPile ){
			// 	this.updateJunkPile();
			// }

		}

	}

	/**
	 * Have Mulle talk about the part
	 * @return {void}
	 */
	playDescription(){

		if(!this.game.mulle.actors.mulle) return;

		this.game.mulle.actors.mulle.talk( this.partData.description );

	}

	getProperty( name ){
		return this.partData.getProperty( name );
	}
	

}

export default MulleCarPart;