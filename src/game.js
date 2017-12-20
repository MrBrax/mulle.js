/**
 * MulleGame module
 * @module game
 */

import BootState from 'boot';
import LoadState from 'load';

import MulleNet from 'util/network';
import MulleCursor from 'util/cursor';


import MenuState from 'scenes/menu';

import GarageState from 'scenes/garage';
import JunkState from 'scenes/junk';
import YardState from 'scenes/yard';

import WorldState from 'scenes/world';

import FiggeFerrumState from 'scenes/figgeferrum';
import RoadDogState from 'scenes/roaddog';
import RoadThingState from 'scenes/roadthing';
import CarShowState from 'scenes/carshow';
import StureStortandState from 'scenes/sturestortand';
import SaftfabrikState from 'scenes/saftfabrik';
import SolhemState from 'scenes/solhem';


// var requireScenes = require.context('scenes', true, /\.js$/);
// requireScenes.keys().forEach(requireScenes);

import MulleSubtitle from 'objects/subtitle';

import MulleAudio from 'objects/audio';

import MulleSave from 'struct/savedata';



// import * as MulleScenes from 'scenes/*';

var memberLookup = {};
var directorImageLookup = {};

/**
 * Main game object
 * @extends Phaser.Game
 */
class MulleGame extends Phaser.Game {

	constructor(){

		super({
			
			width: 640,
			height: 480,
			
			// width: '80%',
			// height: '80%',

			type: Phaser.AUTO,
			parent: 'player',
			antialias: false

		});		

		/**
		 * Utility library
		 * @property {MulleGame}	game	Main game
		 * @property {Object}		scenes	Scene lookups
		 * @property {Object}		audio	Audio collections
		 * @property {Object}		actors	Available actors
		 * @property {function}		playAudio
		 */
		this.mulle = {};

		this.mulle.game = this;

		this.mulle.debug = false;
		this.mulle.cheats = true;

		this.mulle.networkEnabled = true;

		this.mulle.networkServer		= 'mulle.dongers.net:8765';
		this.mulle.networkDevServer	= 'localhost:8765';

		this.mulle.defaultLanguage = 'english';
		// this.mulle.defaultLanguage = 'swedish';

		this.mulle.scenes = {

			"02": "junk",
			"03": "garage",
			"04": "yard",
			"05": "world",

			"10": "menu",

			"82": "mudcar",
			"83": "treecar",
			"84": "roadthing",
			"85": "roaddog",

			"86": "solhem",
			"87": "saftfabrik",
			"86": "sturestortand",
			"89": "viola",
			"90": "dorisdigital",
			"91": "luddelabb",
			"92": "figgeferrum",

			"93": "ocean",
			"94": "carshow"

		}

		this.mulle.states = {

			'boot':				BootState,
			'load':				LoadState,

			'menu':				MenuState, // 10

			'junk':				JunkState, // 02
			'garage':			GarageState, // 03
			'yard':				YardState, // 04
			'world':			WorldState, // 05

			'roadthing':		RoadThingState, // 84
			'roaddog':			RoadDogState, // 85
			'solhem':			SolhemState, // 86
			'saftfabrik':		SaftfabrikState,
			'sturestortand':	StureStortandState, 
			'figgeferrum':		FiggeFerrumState, // 92

			'carshow':			CarShowState, // 94

		}

		this.mulle.audio = {};

		this.mulle.subtitle = new MulleSubtitle( this );

		this.mulle.actors = {};

		/**
		 * Play audio by member name
		 * @param  {string} id
		 * @return {Phaser.Sound} sound object
		 */
		this.mulle.playAudio = function( id, onStop = null ){

			for( let a in this.game.mulle.audio ){

				var p = this.game.mulle.audio[a];

				for( var s in p.sounds ){

					if( p.sounds[s].extraData && id.toLowerCase() == p.sounds[s].extraData.dirName.toLowerCase() ){

						var snd = p.play( s );

						if(snd && onStop)
							snd.onStop.addOnce(onStop);

						return snd;

					}

				}

			}

			console.error('sound not found', id, this.game.mulle.audio);

			return false;

		}

		this.mulle.addAudio = function( key ){

			if(this.game.mulle.audio[key]) return;

			this.game.mulle.audio[key] = new MulleAudio(this.game, key + '-audio');


			for( var id in this.game.mulle.audio[key].config.spritemap ){

				this.game.mulle.audio[key].sounds[id].extraData = this.game.mulle.audio[key].config.spritemap[id].data;

				/*
				var cues = this.game.mulle.audio[key].config.spritemap[id].cue;

				if( cues ){

					this.game.mulle.audio[key].sounds[id].cuePoints = [];

					for( var i = 0; i < cues.length; i++ ){

						this.game.mulle.audio[key].sounds[id].cuePoints.push( cues[i] ); // addMarker( i + '_' + cues[i][1], cues[i][0] / 1000, 0.1 );

					}

				}
				*/

			}

			console.debug('[audio]', 'add', this.game.mulle.audio[key]);

		}

		this.mulle.stopAudio = function( id ){

			for( let a in this.game.mulle.audio ){

				var p = this.game.mulle.audio[a];

				for( var s in p.sounds ){

					if( p.sounds[s].extraData && id == p.sounds[s].extraData.dirName ){

						return p.stop( s );

					}

				}

			}

			console.error('sound not found', id);

			return false;

		}


		this.mulle.cursor = new MulleCursor( this );

		this.mulle.PartsDB = {};
		this.mulle.getPart = function( id ){
			return this.PartsDB[id];
		}

		this.mulle.UsersDB = [];
		this.mulle.saveData = function(){
			console.debug('SAVING DATA');
			window.localStorage.setItem('mulle_SaveData', JSON.stringify( this.game.mulle.UsersDB ) );
		}

		this.mulle.setData = function( key, value ){
			this.game.mulle.UsersDB[ this.game.mulle.activeProfile ][ key ] = value;
		}

		this.mulle.loadData = function(){

			// console.debug('LOADING DATA');

			this.game.mulle.UsersDB = {};

			var savedata = window.localStorage.getItem('mulle_SaveData');
			
			if( savedata ){
				
				var data = JSON.parse( savedata );

				// console.debug('Raw save data', data);

				for( var name in data ){

					this.game.mulle.UsersDB[name] = new MulleSave( this.game, data[name] );

					console.debug('[userdata]', 'loaded', name, this.game.mulle.UsersDB[name]);

				}

				console.debug('[userdata]', 'finish loading', this.game.mulle.UsersDB);

			}else{

				console.warn('[userdata]', 'empty');

			}

		}


		this.mulle.findFrame = function( collection, name ){

			for( var i in collection ){
				var a = collection[i];
				if( a.frameData.checkFrameName( name ) ) return a.key;
			}

			return false;

		}

		this.mulle.frameLookup = {};

		this.mulle.findFrameById = function( id, returnFrame = false ){
			
			var keys = this.game.cache.getKeys( Phaser.Cache.IMAGE );

			for( var k in keys ){

				var img = this.game.cache.getImage( keys[k], true );

				var frames = img.frameData.getFrames();

				for( var f in frames ){

					if( frames[f].id && id == frames[f].id ){

						// this.game.mulle.frameLookup[ id ] = [img.key, frames[f].name];

						return returnFrame ? { frame: frames[f], key: img.key, name: frames[f].name } : [img.key, frames[f].name];

					}

				}

			}

			return false;

		}

		this.mulle.findDirectorMember = function( name ){

			if( memberLookup[ name ] ){
				return memberLookup[ name ];
			}

			var keys = this.game.cache.getKeys( Phaser.Cache.IMAGE );

			for( var k in keys ){

				var img = this.game.cache.getImage( keys[k], true );

				var frames = img.frameData.getFrames();

				for( var f in frames ){

					if( frames[f].dirName === name ){

						memberLookup[ name ] = frames[f];

						return frames[f];

					}

				}

			}

			console.error('get member fail', name);

		}

		this.mulle.getDirectorImage = function( dir, num ){

			if(!dir || !num){
				// console.error('invalid parameters', dir, num);
				return false;
			}

			var l = dir + '_' + num;

			if(directorImageLookup[l]) return directorImageLookup[l];


			var keys = this.game.cache.getKeys( Phaser.Cache.IMAGE );

			for( var k in keys ){

				var img = this.game.cache.getImage( keys[k], true );

				var frames = img.frameData.getFrames();

				for( var f in frames ){

					if( frames[f].dirFile == dir && ( frames[f].dirNum === num || frames[f].dirName === num ) ){

						var data = { frame: frames[f], key: img.key, name: frames[f].name };

						directorImageLookup[l] = data;

						return data;

					}

				}

			}

			console.error('get image fail', dir, num);

			return false;

		}


		this.mulle.getFrameRegPoint = function( id ){

			var f = this.game.mulle.findFrameById( id, true );

			if(f){

				return f.regpoint;

			}else{

				return false;

			}

		}

		this.mulle.net = new MulleNet(this);


	}

	/**
	 * Setup and launch game
	 * @return {void}
	 */
	setup(){

		for( var i in this.mulle.states ){
			this.state.add( i, this.mulle.states[i] );
		}

		this.state.start('boot');

	}

}

export default MulleGame;