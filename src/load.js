import MullePartData from 'struct/partdata';

class LoadState extends Phaser.State {

	preload(){

		// static data
		this.load.json('MapsDB', 'data/maps.hash.json');
		this.load.json('MissionsDB', 'data/missions.hash.json');
		this.load.json('ObjectsDB', 'data/objects.hash.json');
		this.load.json('PartsDB', 'data/parts.hash.json');
		this.load.json('WorldsDB', 'data/worlds.hash.json');

		// this.load.atlas('garage-0', 'assets/garage-0.png', 'assets/garage-0.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		// this.load.atlas('carparts-0', 'assets/carparts-0.png', 'assets/carparts-0.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		// this.load.atlas('carparts-1', 'assets/carparts-1.png', 'assets/carparts-1.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		
		this.game.load.pack('cutscenes', 'assets/cutscenes.json', null, this);

		this.game.load.pack('characters', 'assets/characters.json', null, this);

		this.game.load.pack('carparts', 'assets/carparts.json', null, this);

		this.game.load.pack('shared', 'assets/shared.json', null, this);
		// this.game.load.pack('voices', 'assets_new/voices.json', null, this);
		this.game.load.pack('ui', 'assets/ui.json', null, this);
	
		// this.game.load.onPackComplete.add(handleMulleArchive, this);
		// this.game.load.onFileComplete.add(this.game.mulle.hijackFile, this);
		// this.game.load.onLoadComplete.add(this.game.mulle.hijackLoad, this);
	
		this.game.load.onLoadComplete.add(this.loadComplete, this);


		this.progress = game.add.graphics(0, 0);
		this.loadImage = this.game.add.sprite(320-(235/2), 240-(189/2), 'loading');

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


	create(){

		var parts = this.game.cache.getJSON('PartsDB');

		for( var id in parts ){
			this.game.mulle.PartsDB[id] = new MullePartData( this.game, id, parts[id] );
		}

		this.game.mulle.MapsDB = this.game.cache.getJSON('MapsDB');


		this.game.mulle.WorldsDB = this.game.cache.getJSON('WorldsDB');

		/*
		this.game.mulle.WorldsDB = {};
		for( var id in worlds ){
			this.game.mulle.WorldsDB[id] = new MulleWorld( this.game, id );
			this.game.mulle.WorldsDB[id].fromJSON( worlds[id] );
		}
		*/

		this.game.mulle.ObjectsDB = this.game.cache.getJSON('ObjectsDB');

		// this.loadText = this.game.add.text(32, 32, 'Loading...', { fill: '#ffffff' });

		this.game.mulle.addAudio('shared');

		this.game.mulle.addAudio('carparts');

		this.game.mulle.loadData();
	
	}

	loadComplete(){
		this.ready = true;
	}

	fileComplete( progress, cacheKey, success, totalLoaded, totalFiles ){
		
		// this.loadText.setText("Loading " + totalLoaded + "/" + totalFiles + " files, " + progress + "% done.");

		// console.log('File loaded', cacheKey);

	}

	update(){
		if( this.ready ) this.game.state.start( window.location.hash ? window.location.hash.substr(1) : 'menu' );
	}

	shutdown(){

		if( this.loadImage ){
			this.loadImage.destroy();
		}

		if( this.progress ){
			this.progress.destroy();
		}

	}

}

export default LoadState;