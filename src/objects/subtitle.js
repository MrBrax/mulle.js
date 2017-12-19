"use strict";

class MulleSubtitle {

	constructor( game ){

		this.game = game;

		this.textLines = [];

		this.lastLine = null;

		var s = '- ';

		this.database = {
			swedish: {},
			english: {}
		};


		this.setLines("20d124v0", 'swedish', [
			s + "Bra hjul, på riktiga fälgar."
		], 'mulle');

		this.setLines("03d012v0", 'swedish', [
			s + "Inga hjul, inge kul, inge snurr och inge rull."
		], 'mulle');

		this.setLines("03d013v0", 'swedish', [
			s + "Det verkar som om liksom själva motorn fattas."
		], 'mulle');

		this.setLines("03d014v0", 'swedish', [
			s + "Batteriet som ska ge ström, var är det?"
		], 'mulle');

		this.setLines("03d015v0", 'swedish', [
			s + "Soppa saknas!",
			s + "Tanken är inte bara tom,",
			s + "den finns ju inte ens!"
		], 'mulle');

		this.setLines("03d016v0", 'swedish', [
			s + "Hördu, här fattas ju växellådan!",
			s + "Det är ju den som ser till att motorn kan driva hjulen."
		], 'mulle');

		this.setLines("03d017v0", 'swedish', [
			s + "Ratten kallas femte hjulet.",
			s + "Med den styr man i sol som mulet."
		], 'mulle');

		this.setLines("03d018v0", 'swedish', [
			s + "Stopp, stopp stopp! Hur ska du bromsa?"
		], 'mulle');

		



		this.setLines("20d124v0", 'english', [
			s + "Good wheels, on real rims."
		], 'mulle');

		this.setLines("03d012v0", 'english', [
			s + "No wheels, no fun, no spin, no roll."
		], 'mulle');

		this.setLines("03d013v0", 'english', [
			s + "It seems as if the engine itself is missing."
		], 'mulle');

		this.setLines("03d014v0", 'english', [
			s + "The battery that's gonna supply power, where's that?"
		], 'mulle');

		this.setLines("03d015v0", 'english', [
			s + "No juice!",
			s + "The tank isn't just empty,",
			s + "it doesn't exist!"
		], 'mulle');

		this.setLines("03d016v0", 'english', [
			s + "Hey! The transmission is missing!",
			s + "It's the one making it possible for the engine to spin the wheels."
		], 'mulle');

		this.setLines("03d017v0", 'english', [
			s + "The steering wheel",
			s + "is called the fifth wheel.",
			s + "With it, you steer whether it's sunny or cloudy."
		], 'mulle');

		this.setLines("03d018v0", 'english', [
			s + "Stop, stop stop! How are you going to brake?"
		], 'mulle');


		this.actorColors = {
			'mulle': '#CDE7CF'
		};

	}

	makeObject(){

		if( this.textObject ) this.textObject.destroy();

		this.textObject = new Phaser.Text( this.game, 0, 0, '', {
			font: '20px arial',

			fill: '#ffffff',

			stroke: '#000000',
			strokeThickness: 3,

			backgroundColor: 'rgba(0, 0, 0, .6)',

			align: 'center',
			boundsAlignH: 'center',
			boundsAlignV: 'bottom'
		} );

		this.textObject.setTextBounds( 0, 420, 640, 40 );
		this.textObject.lineSpacing = -8;

		this.game.add.existing( this.textObject );

		console.log('add text', this.textObject);

	}

	showLine( text, actor ){

		if(!text){
			console.error('subtitle line with no text');
			return false;
		}

		if( !this.textObject ){
			// this.game.mulle.subtitle = new MulleSubtitle( this.game );
			// this.game.add.existing( this.game.mulle.subtitle );
			this.makeObject();
		}

		console.debug('[subtitle]', text, actor);

		var k = this.textLines.push( {
			text: text,
			time: Date.now(),
			actor: actor
		} );
		
		var del = 1000 * Math.log( text.length );

		// console.log('delay', text, text.length, del);

		this.game.time.events.add( del, () => {
			console.log('remove line', k);
			this.textLines.splice(0, 1);
			this.refresh();
		});

		// if( this.textLines.length >= 3 ) this.textLines.splice(0, 1);

		this.refresh();

		this.lastLine = Date.now();

		return true;

	}

	getData( file, language ){

		if(!language) language = this.game.mulle.user ? this.game.mulle.user.language : this.game.mulle.defaultLanguage;

		if( !this.database[ language ] || !this.database[ language ][ file ] ) return false;

		return this.database[ language ][ file ];

	}

	setLines( file, language, lines, actor ){

		if(!this.database[ language ]) return false;

		console.debug('[sub-add]', file, language, lines, actor);

		this.database[ language ][ file ] = {
			lines: lines,
			actor: actor
		};

		return true;

	}

	refresh(){

		this.textObject.clearColors();		

		let text = "";

		for( let i in this.textLines ){

			let line = this.textLines[i].text;

			/*
			if( this.textLines[i].actor && this.actorColors[ this.textLines[i].actor ] ){
				this.textObject.addColor(this.actorColors[ this.textLines[i].actor ], text.length);
			}else{
				this.textObject.addColor('#ffffff', text.length);
			}
			*/
			
			/*
			var hReg = /\{([A-Za-z0-9]+)\}/g;
		
			var hlMatch;
			while( ( hlMatch = hReg.exec( this.textLines[i].text ) ) !== null ){

				console.log('hlMatch', hlMatch);				

				this.textObject.addColor('#88B14E', text.length + hlMatch.index);

				this.textObject.addColor('#FFFFFF', text.length + hlMatch.index + hlMatch[0].length);


			}
			*/
			
			
			line = line.replace(/\{([A-Za-z0-9\s]+)\}/g, (match, group, index) => {
				// console.log('group', match, group, index);
				this.textObject.addColor('#88B14E', ( text.length - i ) + index);
				this.textObject.addColor('#FFFFFF', ( text.length - i ) + index + group.length);
				return group;
			});
			

			text += line;

			text += '\n';

		}

		text = text.trim('\n');

		this.textObject.text = text;

		this.textObject.visible = text != '';

	}

}

export default MulleSubtitle;