/**
 * MulleMapObject object
 * @module objects/mapobject
 */
"use strict";

import MulleSprite from 'objects/sprite';

var toLoad = [
	'Cows',
	'Ferry',
	'Gas',
	'Racing',
	'Goats',
	'WBridge',
	'CBridge',
	'FarAway',
	'Picture',
	'Hill',
	'Stop',
	'Sound',
	'Teleport'
];

var MapObjects = {};

toLoad.forEach( (l) => {
	MapObjects[ l ] = require('objects/mapobjects/' + l).default;
});

/**
 * Overworld object
 * @extends MulleSprite
 */
class MulleMapObject extends MulleSprite {

	constructor( game, id, pos, opt ){

		super( game );
	
		this.id = id;

		this.position.set( pos.x, pos.y );

		this.opt = opt;
		this.optionalData = opt;

		this.enteredInner = false;
		this.enteredOuter = false;

		this.enabled = true;

		// this.loadTexture('test');

		// this.FrameList = [];

		this.def = this.game.mulle.ObjectsDB[ this.id ];

		this.OuterRadius = this.opt && this.opt.OuterRadius ? this.opt.OuterRadius : this.def.OuterRadius;
		this.InnerRadius = this.opt && this.opt.InnerRadius ? this.opt.InnerRadius : this.def.InnerRadius;

		this.CustomObject = this.def.CustomObject;

		// this.DirResource = this.def.DirResource;
		
		this.Sounds = this.def.Sounds;

		this.FrameList = this.def.FrameList;

		// this.SetWhenDone = this.def.SetWhenDone;
		
		// this.CheckFor = this.def.CheckFor;
		
		// this.IfFound = this.def.IfFound;	
		
		this.SpriteInfo = this.def.SpriteInfo ? this.def.SpriteInfo : {};

		
		// debug
		this.outer = new Phaser.Circle( this.x, this.y, this.OuterRadius );
		this.inner = new Phaser.Circle( this.x, this.y, this.InnerRadius );		

		if( this.CustomObject ){

			// this.custom = MapObjects[ this.CustomObject ];

			Object.assign( this, MapObjects[ this.CustomObject ] ); 

		}

		this.onCreate();

		console.debug('MapObject', this.id, this.def, this.opt);

	}

	collide( where ){

		// console.log('collide', this.id, where);

	}

	setFrameList( name, direction ){

		if( this.def.FrameList["1"] ){

			if(!direction) direction = "1";

			if( this.def.FrameList[ direction ][ name ] ){

				var def = this.def.FrameList[ direction ][ name ][0];

				if( def != 'Dummy' ){
					this.setDirectorMember( def );
				}

			}

		}else{

			if( this.def.FrameList[ name ] ){

				var def = this.def.FrameList[ name ][0];

				if( def != 'Dummy' ){
					this.setDirectorMember( def );
				}

			}

		}

	}

	onCreate(){

		if( this.custom && this.custom.onCreate ){
			this.custom.onCreate.call(this);
			return;
		}

		if( this.def.FrameList ){

			if( typeof this.def.FrameList == 'object' ){

				if( this.opt && this.opt.Show ){

					this.setFrameList('normal', this.opt.Show);

				}else{

					this.setFrameList('normal');

				}

				// console.log('FrameList', this.id, this.def.FrameList);

				// frame = this.def.FrameList.normal[0];

			}else{

			}

		}

	}

	onEnterOuter( car ){
	
		if( this.custom && this.custom.onEnterOuter ){
			this.custom.onEnterOuter.call(this, car);
			return;
		}

	}

	onExitOuter( car ){


		if( this.custom && this.custom.onExitOuter ){
			this.custom.onExitOuter.call(this, car);
			return;
		}		

	}

	onEnterInner( car ){

		// console.log( this, 'enter inner', this.def, this.opt );

		if( this.custom && this.custom.onEnterInner ){
			this.custom.onEnterInner.call(this, car);
			return;
		}

		if( this.def.type == '#dest' || this.def.type == '#rdest' ){
			car.enabled = false;
			car.engineAudio.stop();
			// car.engineAudio = null;
		}

		if( this.def.Sounds && this.def.Sounds.length > 0 ){

			console.log('object sound', this.def.Sounds);
			
			var soundPlay = this.game.mulle.playAudio( this.def.Sounds[0] );

			soundPlay.onStop.addOnce(() => {
				this.onEnterInnerCallback( car );
			}, this);

		}else{			

			this.onEnterInnerCallback( car );

		}

	}

	onEnterInnerCallback( car ){

		/*
			if( this.soundPlay ){
				this.soundPlay.onStop.remove(this.onEnterInnerCallback, this);
			 	this.soundPlay = null;
			}
		*/

		if( this.def.type == '#dest' || this.def.type == '#rdest' ){

			this.game.state.states[ this.game.state.current ].saveSession(this);

			this.game.mulle.SetWhenDone = this.SetWhenDone;

		}

		if( this.def.type == '#dest' ){

			var dest = this.def.DirResource;

			console.log('change scene', dest);

			this.game.mulle.activeCutscene = '00b008v0';

			if( this.game.state.states[ this.game.mulle.scenes[ dest ] ]){

				this.game.state.start( this.game.mulle.scenes[ dest ] );

			}else{

				alert('unhandled scene "' + this.game.mulle.scenes[ dest ] + '"');

				car.enabled = true;

			}

		}else if( this.def.type == '#rdest' ){

			var rdest = this.def.DirResource;

			console.log('change rscene', rdest);

			this.game.mulle.activeCutscene = '00b008v0';

			if( this.game.state.states[ this.game.mulle.scenes[ rdest ] ]){

				this.game.state.start( this.game.mulle.scenes[ rdest ] );

			}else{

				alert('unhandled rscene "' + this.game.mulle.scenes[ rdest ] + '"');

				car.enabled = true;

			}

		}

		// if( this.def.SetWhenDone ){

			// this.game.mulle.lastSession.SetWhenDone = this.def.SetWhenDone;			

		// }

	}

	onExitInner( car ){

		if( this.custom && this.custom.onExitInner ){
			this.custom.onExitInner.call(this, car);
			return;
		}

	}

	doCheck(){

		if(!this.def.CheckFor) return;

		if( this.def.CheckFor.Cache ){

			this.def.CheckFor.Cache.forEach( (v) => {

				if( this.game.mulle.user.Car.hasCache( v ) ){

					if( this.def.IfFound == "#NoDisplay" ){
						this.enabled = false;
						this.renderable = false;
						console.log('disable map object', this.id, this.def.CheckFor.Cache, this.game.mulle.user.Car.CacheList );
					}

				}

			});

		}

		// console.log(this.id, 'IfFound', this.def.IfFound);
		// console.log(this.id, 'CheckFor', this.def.CheckFor);
		// console.log(this.id, 'SetWhenDone', this.def.SetWhenDone);

	}

	
	destroy(){

		if( this.custom && this.custom.onDestroy ){
			this.custom.onDestroy.call(this);
			return;
		}

		super.destroy();

	}
	

}

export default MulleMapObject;