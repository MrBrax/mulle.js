/**
 * MulleActor object
 * @module objects/actor
 */
"use strict";

import MulleSprite from 'objects/sprite';

/**
 * Mulle actor, extension of mulle sprite + phaser sprite
 * @extends MulleSprite
 */
class MulleActor extends MulleSprite {

	/**
	 * Create
	 * @param	{Phaser.Game} game 	Main game
	 * @param	{number} x			x coordinate
	 * @param	{number} y			y coordinate
	 * @param	{string} name		Hardcoded actor name
	 * @return	{void}
	 */
	constructor( game, x, y, name ){

		super( game, x, y );

		this.actorName = name;

		var b = '00.CXT';

		if( this.actorName == 'mulleDefault' ){

			this.setDirectorMember(b, 271);
			
			this.addAnimation('idle', [ [b, 271] ], 10, true, false);


			this.addAnimation('scratchChin', [ [b, 271],  [b, 272],  [b, 273],  [b, 274],  [b, 275],  [b, 276] ], 10, false, false);

			this.addAnimation('scratchHead', [ [b, 277],  [b, 278],  [b, 279],  [b, 280],  [b, 281],  [b, 282] ], 10, false, false);


			this.addAnimation('lookPlayer', [ [b, 287], [b, 288] ], 10, true, false);

			this.addAnimation('talkPlayer', [ [b, 289], [b, 290], [b, 291], [b, 292], [b, 293], [b, 294], [b, 295] ], 10, true, false);
			
			this.addAnimation('talkRegular', [ [b, 296],  [b, 297],  [b, 298],  [b, 299],  [b, 300],  [b, 301],  [b, 302] ], 10, true, false);

			// this.addAnimation('turnLeft', [ [b, 283] ], 10, true, false);
			this.addAnimation('lookLeft', [ [b, 283] ], 10, true, false);

			// this.addAnimation('turnRight', [ [b, 286],  [b, 287], ], 10, true, false);
			

			this.addAnimation('turnBack', [ [b, 285] ], 10, true, false);

		}else if( this.actorName == 'mulleSit' ){

			this.setDirectorMember(b, 245);

			this.addAnimation('idle', [ [b, 245] ], 0, true, false);

			this.addAnimation('wave', [ [b, 246], [b, 247], [b, 248], [b, 249], [b, 250], [b, 251], [b, 252], [b, 251], [b, 250], [b, 249], [b, 248], [b, 247] ], 10, true, false);

			this.addAnimation('lookPlayer', [ [b, 253] ], 0, true, false);

			this.addAnimation('talkPlayer', [ [b, 253],  [b, 254],  [b, 255],  [b, 256],  [b, 257],  [b, 258],  [b, 259],  [b, 260] ], 10, true, false);

			this.addAnimation('smilePlayer', [ [b, 261],  [b, 262],  [b, 263] ], 5, true, false);

		}else if( this.actorName == 'mulleMenuHead' ){

			var ten = '10.DXR';

			this.setDirectorMember(ten, 126);

			this.addAnimation('idle', [ [ten, 126] ], 0, true, false);

			this.addAnimation('point', [
				[ten, 136],
				[ten, 137],
				[ten, 137],
				[ten, 137],
				[ten, 137],
				[ten, 137],
				[ten, 137],
				[ten, 137],
				[ten, 137],
				[ten, 136],
				[ten, 126]
			], 10, false, false);

		}else if( this.actorName == 'mulleMenuMouth' ){

			b = '10.DXR';

			this.setDirectorMember(b, 115);

			this.addAnimation('idle', [ [b, 115] ], 5, true, false);

			this.addAnimation('blink', [ [b, 123] ], 5, true, false);

			this.addAnimation('lookPlayer', [ [b, 115] ], 5, true, false);

			this.addAnimation('talkPlayer', [ [b, 115], [b, 116], [b, 117], [b, 118], [b, 119], [b, 120], [b, 121], [b, 122] ], 10, true, false);

		}else if( this.actorName == 'figge' ){

			b = '92.DXR';

			this.setDirectorMember(b, 17);
			this.addAnimation('idle', [ [b, 17] ]);
			this.addAnimation('talkPlayer', [ [b, 17], [b, 18], [b, 19], [b, 20], [b, 21], [b, 22], [b, 23], [b, 24], [b, 25] ], 10, true, false);
		
		}else if( this.actorName == 'salkaRight' ){

			b = '85.DXR';

			this.setDirectorMember(b, 26);
			this.addAnimation('idle', [ [b, 26], [b, 27], [b, 28], [b, 29], [b, 30], [b, 29], [b, 28], [b, 27] ], 15, true, false);

		}else if( this.actorName == 'salkaLeft' ){

			b = '92.DXR';

			this.setDirectorMember(b, 40);
			this.addAnimation('idle', [ [b, 40], [b, 41], [b, 42], [b, 43], [b, 44], [b, 43], [b, 42], [b, 41] ], 15, true, false);

		}else if( this.actorName == 'buffa' ){
			
			this.setDirectorMember(b, 214);
			this.addAnimation('idle', [ [b, 214 ] ], 10, true, false);
			this.addAnimation('scratch1', [ [b, 214 ], [b, 215] ], 10, true, false);
			this.addAnimation('sleep_intro', [ [b, 214 ], [b, 216], [b, 217], [b, 218] ], 10, false, false);
			this.addAnimation('sleep_loop', [ [b, 219 ], [b, 220] ], 1, false, false);
			this.addAnimation('bark', [ [b, 222 ], [b, 223] ], 10, true, false);
		
		}else if( this.actorName == 'judge' ){

			b = '94.DXR';

			this.setDirectorMember(b, 31);

			this.addAnimation('idle', [ [b, 31 ] ], 10, true);

			this.addAnimation('talk', [ [b, 43 ], [b, 44 ], [b, 45 ], [b, 46 ], [b, 47 ] ], 10, true);

			var raise = this.addAnimation('raiseScore', [ [b, 32 ], [b, 33 ], [b, 34 ], [b, 35 ] ], 5, false);
			raise.onComplete.add( () => {
				console.log('raise hook');
				this.silenceAnimation = 'idleScore';
				this.talkAnimation = 'talkScore';
				this.animations.play('idleScore');
				this.displayScore();
			});

			this.addAnimation('idleScore', [ [b, 36 ] ], 10, false);

			this.addAnimation('talkScore', [ [b, 37 ], [b, 38 ], [b, 39 ], /* [b, 40 ], */ [b, 41 ], [b, 42 ] ], 10, true);

			var lower = this.addAnimation('lowerScore', [ [b, 35 ], [b, 34 ], [b, 33 ], [b, 32 ] ], 5, false);
			lower.onComplete.add( () => {
				console.log('lower hook');
				this.silenceAnimation = 'idle';
				this.talkAnimation = 'talk';
				this.animations.play('idle');
			});


		}else if( this.actorName == 'figgeDoor' ){

			b = '03.DXR';

			this.setDirectorMember(b, 81);

			var enter = this.addAnimation('enter', [ [b, 81 ], [b, 82 ], [b, 83 ], [b, 84 ], [b, 85 ] ], 10, false);
			enter.onComplete.add(() => {
				this.animations.play('entered');
			});

			this.addAnimation('entered', [ [b, 86 ] ], 10, true);

			this.addAnimation('exit', [ [b, 85 ], [b, 84 ], [b, 83 ], [b, 82 ], [b, 81 ] ], 10, false);

			this.addAnimation('talk', [ [b, 86 ], [b, 87 ], [b, 88 ], [b, 89 ], [b, 90 ], [b, 91], [b, 92], [b, 93] ], 10, true);

			this.talkAnimation = 'talk';
			this.silenceAnimation = 'entered';

		}else if( this.actorName == 'stureSad' ){

			b = '88.DXR';

			this.setDirectorMember(b, 42);

			this.addAnimation('idle', [ [b, 42] ], 10, false);

			this.addAnimation('talk', [ [b, 43], [b, 44], [b, 45], [b, 46], [b, 47] ], 10, true);

		}else if( this.actorName == 'stureHappy' ){

			b = '88.DXR';

			this.setDirectorMember(b, 34);

			this.addAnimation('idle', [ [b, 34] ], 10, false);

			this.addAnimation('talk', [ [b, 35], [b, 36], [b, 37], [b, 38], [b, 39] ], 8, true);

		}else if( this.actorName == 'garson' ){

			b = '87.DXR';

			this.setDirectorMember(b, 15);

			this.addAnimation('idle', [ [b, 15] ], 10, false);

			this.addAnimation('talk', [ [b, 16], [b, 17], [b, 18] ], 8, true);

		}else if( this.actorName == 'miaBody' ){

			b = '86.DXR';

			this.setDirectorMember(b, 55);

			this.addAnimation('idle', [ [b, 55] ], 10, false);

			this.addAnimation('catchIntro', [ [b, 55], [b, 56], [b, 57], [b, 58] ], 10, false);

			this.addAnimation('catchEnd', [ [b, 47], [b, 48], [b, 49], [b, 50] ], 10, false);

		}else if( this.actorName == 'miaHead' ){

			b = '86.DXR';

			this.setDirectorMember(b, 62);

			this.addAnimation('idle', [ [b, 62] ], 10, false);
			this.addAnimation('talk', [ [b, 63], [b, 64], [b, 65], [b, 66], [b, 67] ], 10, true);

			this.addAnimation('idleCat', [ [b, 69] ], 10, false);
			this.addAnimation('talkCat', [ [b, 69], [b, 70], [b, 71], [b, 72], [b, 73], [b, 74] ], 10, true);

		}else if( this.actorName == 'cat' ){

			b = '86.DXR';

			this.setDirectorMember(b, 30);

			this.addAnimation('idle', [ [b, 30] ], 10, false);

			var f = [];
			for( var i = 0; i < 12; i++ ) f.push([b, 31 + i]);
			this.addAnimation('jump1', f, 10, false);

			var f = [];
			for( var i = 0; i < 4; i++ ) f.push([b, 42 + i]);
			this.addAnimation('jump2', f, 10, false);


		}else{

			console.error('invalid actor', this.actorName);

		}

		this.onCue = new Phaser.Signal();

		this.isTalking = false;

		this.sentenceNum = 0;

	}

	/**
	 * Make actor talk
	 * @param  {string}   id    Sound name/ID
	 * @param  {function} onEnd End callback
	 * @return {void}       
	 */
	talk( id, onEnd, onCue ){

		// console.log('talk', id, onEnd);

		this.isTalking = true;

		if( this.talkAudio ){
			console.warn('talk while already talking');
			this.resetTalk();
		}

		console.debug('[talk]', this.actorName, id);

		if( onCue ){

			this.onCue.add( onCue );

		}else{

			this.onCue.add( (v) => {

				if( v[1].toLowerCase() == 'silence' ) this.animations.play( this.silenceAnimation ? this.silenceAnimation : 'lookPlayer', 0);
				if( v[1].toLowerCase() == 'talk' ) this.animations.play( this.talkAnimation ? this.talkAnimation : 'talkPlayer' );

			});

		}

		this.talkAudio = this.game.mulle.playAudio(id);

		if(!this.talkAudio){
			console.error('invalid talk audio', this, id);
			this.talkAudio = null;
			return false;
		}

		var subData = this.game.mulle.subtitle.getData(id);

		if( subData ){

			var cueAmount = 1;

			var lines = subData.lines;

			// var lines = this.game.mulle.subtitle.database[ this.game.mulle.user.language ][ id ];

			var lineAmount = lines.length;

			if( this.talkAudio.extraData && this.talkAudio.extraData.cue ){
				
				var onlyTalk = this.talkAudio.extraData.cue.find(function(v){ return v[1].toLowerCase() == 'talk'; });

				cueAmount = onlyTalk ? onlyTalk.length : 1;

			}

			console.debug('[talk-sub]', 'sentences', cueAmount);

			if( cueAmount == 1 ){

				if( lineAmount > 1 ){

					console.debug('[talk-sub]', this.actorName, 'only one cue, but multiple lines');


					/*
						// add all at once
						for( var t of lines ){
							this.game.mulle.subtitle.showLine( t );
						}
					*/

					for( var i in lines ){

						if( i == 0 ){
							this.game.mulle.subtitle.showLine( lines[ i ], subData.actor );
						}else{

							var del = 900 * Math.log( lines[i].length );
						
							this.game.time.events.add( del, () => {
								this.game.mulle.subtitle.showLine( lines[ i ], subData.actor );
							});

						}
					
					}


				}else{

					console.debug('[talk-sub]', this.actorName, 'only one sentence');

					this.game.mulle.subtitle.showLine( lines[ 0 ], subData.actor );

				}

			}else{

				console.debug('[talk-sub]', this.actorName, this.talkAudio.extraData.cue );

				this.onCue.add( (v) => {
					
					if( v[1].toLowerCase() == 'talk' ){
						this.game.mulle.subtitle.showLine( lines[ this.sentenceNum ], subData.actor );
						this.sentenceNum++;
					}

				});

			}

			// this.game.mulle.subtitle.text = this.game.mulle.subtitles[id][0];

		}else{
			console.warn('no subtitle', id);
		}


		// if(!this.talkAudio.cuePoints) return;

		this.cuesCompleted = {};

		if(!this.talkAudio.isDecoded){
			this.talkAudio.onPlay.add(this.onAudioPlay, this);
		}else{
			this.onAudioPlay();
		}

		this.onEnd = onEnd;
		if( this.onEnd ) this.talkAudio.onStop.add(this.onEnd);

		this.talkAudio.onStop.add(this.onAudioStop, this);

		this.talkAudio.onResume.add(function(){ console.log('resume'); }, this);

		// console.log( 'talk audio', this.talkAudio );

	}

	/**
	 * Internal audio play hook
	 * @return {void}
	 */
	onAudioPlay(){

		// console.log('audio play');

		this.animations.play( this.talkAnimation ? this.talkAnimation : 'talkPlayer' );

		this.talkLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 15, () => {
			
			// console.log('talk loop', this.talkAudio.currentTime);
			
			if( !this.talkAudio.extraData || !this.talkAudio.extraData.cue ){
				console.warn('no cue points', this.talkAudio);
				return;
			}

			this.talkAudio.extraData.cue.forEach( (v, k) => {				
				
				if( !this.cuesCompleted[k] && this.talkAudio.currentTime >= v[0] ){
					
					this.onCue.dispatch( v );

					this.cuesCompleted[k] = true;

				}

			});
		
		}, this);

	}

	/**
	 * Internal audio stop hook
	 * @return {void}
	 */
	onAudioStop(){

		// console.log('audio stop');

		this.animations.play( this.silenceAnimation );
			
		this.resetTalk();

		this.isTalking = false;

	}

	/**
	 * Stop talking, remove audio, and reset animation
	 * @return {void}
	 */
	resetTalk(){

		// console.log('reset talk');

		this.sentenceNum = 0;

		if( this.talkAudio ){
			
			this.talkAudio.onPlay.remove( this.onAudioPlay, this );

			this.talkAudio.onStop.remove( this.onAudioStop, this );

			if( this.onEnd ) this.talkAudio.onStop.remove( this.onEnd );
			
			this.talkAudio.stop();
			this.talkAudio = null;

			// console.log('removed events');

		}

		if( this.talkLoop ){
			this.game.time.events.remove( this.talkLoop );
			this.talkLoop = null;
		}

		this.onCue.removeAll();

	}

	destroy(){

		this.resetTalk();

		super.destroy();

	}

}

export default MulleActor;