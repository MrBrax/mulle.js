"use strict";

class MullePartData {

	constructor( game, partId, partData ){

		this.game = game;

		this.partId = parseInt(partId);

		this.data = partData; // game.mulle.PartsDB[ partId ];

		this.junkView 	= this.data.junkView;
		this.UseView 	= this.data.UseView;
		this.UseView2 	= this.data.UseView2;

		this.description = this.data.description;

		this.Requires = this.data.Requires;
		this.Covers = this.data.Covers;

		if(this.data.master != 0){
			this.master = this.data.master;
			// this.master = new MulleCarpart( this._master );
		}else{
			this.master = false;
		}

		this.MorphsTo = this.data.MorphsTo ? this.data.MorphsTo : false;

		this.new = [];
		if(this.data.new){
			for (var i = 0; i < this.data.new.length; i++) {
				var e = this.data.new[i];
				this.new.push({
					id: e[0],
					fg: e[1][0],
					bg: e[1][1],
					offset: new Phaser.Point(e[2][0], e[2][1])
				});
			}
		}

		// car offset
		this.offset = new Phaser.Point(this.data.offset[0], this.data.offset[1]);

		// lowercase properties, thanks lingo
		this.properties = {};

		if( this.data.Properties ){
			for( var n in this.data.Properties ){
				this.properties[ n.toLowerCase() ] = this.data.Properties[n];
			}
		}

	}

	getProperty( name, defVal = null ){

		/*
		if(!this.data) return false;

		// quick lookup
		if( this.data.Properties[ name ] ) return this.data.Properties[ name ];

		// case insensitive lookup
		for( var n in this.data.Properties ){
			if( name.toLocaleString() == n.toLowerCase() ){
				return this.data.Properties[n];
			}
		}
		*/
	
		name = name.toLowerCase();
		
		if( this.properties[ name ] ) return this.properties[ name ];

		// traverse
		if(this.MorphsTo){

			for( var i in this.MorphsTo ){

				var m = this.game.mulle.getPart( this.MorphsTo[i] );

				if(!m){
					console.error('invalid part', this.MorphsTo[i]);
					continue;
				}

				if( m.getProperty(name, defVal) ) return m.getProperty(name, defVal);

			}

		}

		return defVal;		

	}

}

export default MullePartData;