class MulleCar {

	constructor( game, data ){

		this.game = game;

		this.properties = {};
		this.quickProperties = {};
		this.criteria = {};

		if( data ){

			this.Parts		= data.Parts;
			this.Name		= data.Name;
			this.Medals		= data.Medals;
			this.CacheList	= data.CacheList;

		}else{

			this.Parts		= [1, 82, 133, 152]; // [1, 12, 82, 133, 152, 7, 307, 142, 145, 122, 201];
			this.Name		= "";
			this.Medals		= [];
			this.CacheList	= [];

		}

		// console.log('cardata created');

	}

	getParts(){

		var l = [];

		this.Parts.forEach((v) => {
			l.push( this.game.mulle.PartsDB[ v ] );
		});

		return l;

	}

	hasPart( partId ){
		return this.Parts.indexOf( parseInt( partId ) ) !== -1;
	}

	hasCache( name ){
		return this.CacheList.indexOf( name ) !== -1;
	}

	addCache( name ){

		if( this.hasCache( name ) ) return false;

		console.debug('[cachelist]', 'add', name);

		this.CacheList.push(name);

		return true;

	}

	removeCache( name ){

		var i = this.CacheList.indexOf( name );

		if( i === -1 ) return false;

		console.debug('[cachelist]', 'remove', name);

		this.CacheList.splice(i, 1);

		return true;

	}

	resetCache(){
		this.CacheList = [];
	}

	set Parts(val){
		this._Parts = val;
		console.debug( '[parts]', 'set', val );
		this.updateStats();
	}

	get Parts(){
		return this._Parts;
	}

	getProperty( name, defVal = null ){
		return this.properties[ name.toLowerCase() ] !== undefined ? this.properties[ name.toLowerCase() ] : defVal;
	}

	getQuickProperty( name, defVal = null ){
		return this.quickProperties[ name.toLowerCase() ] !== undefined ? this.quickProperties[ name.toLowerCase() ] : defVal;
	}

	updateStats(){

		var lst = this.getParts();

		var attributes = [
			'weight',
			'break',
			'durability',
			'grip',
			'steering',
			'acceleration',
			'speed',
			'strength',
			'fuelconsumption',
			'fuelvolume',
			'electricconsumption',
			'electricvolume',
			'comfort',
			'funnyfactor',
			'horn',
			'exhaustpipe',
			'lamps',
			'loadcapacity',
			'enginetype',
			'horntype',
			'pedals'
		];

		this.properties = {};
		this.quickProperties = {};

		attributes.forEach((a) => {
			this.properties[a] = 0;
			this.quickProperties[a] = 0;
		});


		// regular
		lst.forEach( (l) => {

			// console.log(l.properties);

			this.properties.weight += l.getProperty('weight', 0);
			this.properties.break += l.getProperty('break', 0);
			
			this.properties.durability = Math.max( l.getProperty('durability', 0), this.properties.durability );

			this.properties.grip += l.getProperty('grip', 0);

			this.properties.steering = Math.max( l.getProperty('steering', 0), this.properties.steering );
			this.properties.acceleration = Math.max( l.getProperty('acceleration', 0), this.properties.acceleration );
			this.properties.speed = Math.max( l.getProperty('speed', 0), this.properties.speed );

			this.properties.strength += l.getProperty('strength', 0);
			this.properties.fuelconsumption += l.getProperty('fuelconsumption', 0);
			this.properties.fuelvolume += l.getProperty('fuelvolume', 0);
			this.properties.electricconsumption += l.getProperty('electricconsumption', 0);
			this.properties.electricvolume += l.getProperty('electricvolume', 0);
			this.properties.comfort += l.getProperty('comfort', 0);
			this.properties.funnyfactor += l.getProperty('funnyfactor', 0);

			if( l.getProperty('horn', 0) ) this.properties.horn = 1;
			if( l.getProperty('exhaustpipe', 0) ) this.properties.exhaustpipe = 1;
			if( l.getProperty('lamps', 0) ) this.properties.lamps = 1;
			if( l.getProperty('pedals', 0) ) this.properties.pedals = 1;

			this.properties.loadcapacity += l.getProperty('loadcapacity', 0);

			this.properties.enginetype = Math.max( l.getProperty('enginetype', 0), this.properties.enginetype );

			this.properties.horntype = Math.max( l.getProperty('horntype', 0), this.properties.horntype );

		});

		// quick
		if( this.properties.speed == 5 ){
			this.quickProperties.speed = this.properties.speed * 27 / 25;
		}else{
			this.quickProperties.speed = this.properties.speed * 20 / 25;
		}

		this.quickProperties.break = this.properties.break * 3 / 100;

		if( this.quickProperties.acceleration == 0 ){
			this.quickProperties.acceleration = 1;
		}

		this.quickProperties.acceleration = this.properties.acceleration * 2 / 100;

		this.quickProperties.steering = this.properties.steering + 3 * 2 / 20 * 70;

		this.quickProperties.fuelvolume = this.properties.fuelvolume * 12;

		this.quickProperties.fuelconsumption = this.properties.fuelconsumption;



		// criteria
		this.criteria = { MudGrip: 8, HolesDurability: 3, BigHill: 3, SmallHill: 2 };

		this.criteria.MudGrip = this.getQuickProperty('grip', 0) > this.criteria.MudGrip ? 1 : 0;

		this.criteria.HolesDurability = this.getQuickProperty('durability', 0) > this.criteria.HolesDurability ? 1 : 0;

		this.criteria.BigHill = this.getQuickProperty('strength', 0) > this.criteria.BigHill ? 1 : 0;

		this.criteria.SmallHill = this.getQuickProperty('strength', 0) > this.criteria.SmallHill ? 1 : 0;



		console.debug( '[props]', 'updated', this.properties );
		console.debug( '[quickprops]', 'updated', this.quickProperties );

	}

	isRoadLegal( talk = false ){

		if(!this.getProperty('enginetype')){
			if(talk) this.game.mulle.actors.mulle.talk('03d013v0');
			return false;
		}

		var tires = 0;

		this.getParts().forEach( v => {

			if( v.getProperty('grip') ) tires++;

		} );

		// tires
		if( tires < 2 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d012v0');
			return false;
		}

		// 03d018v0 brakes
		if( this.getProperty('break') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d018v0');
			return false;
		}

		// consumption
		if( this.getProperty('fuelconsumption') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d013v0');
			return false;
		}

		// 03d014v0 battery
		if( this.getProperty('electricvolume') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d014v0');
			return false;
		}
		
		// 03d015v0 fuel
		if( this.getProperty('fuelvolume') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d015v0');
			return false;
		}

		// 03d016v0 gearbox
		if( this.getProperty('acceleration') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d016v0');
			return false;
		}

		// 03d017v0 steering wheel
		if( this.getProperty('steering') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d017v0');
			return false;
		}

		// 03d019v0 horn
		/*
		if( this.getProperty('horn') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d019v0');
			return false;
		}
		*/

		// 03d020v0 exhaust
		/*
		if( this.getProperty('exhaustpipe') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d020v0');
			return false;
		}
		*/


		// 03d021v0 lamps
		/*
		if( this.getProperty('lamps') == 0 ){
			if(talk) this.game.mulle.actors.mulle.talk('03d021v0');
			return false;
		}
		*/

		/*
		if(!this.getProperty('grip')){
			if(talk) this.game.mulle.actors.mulle.talk('03d012v0');
			return false;
		}
		*/
	
		return true;

	}

	toJSON(){

		return {
			Parts: this.Parts,
			Name: this.Name,
			Medals: this.Medals,
			CacheList: this.CacheList
		};

	}

}

export default MulleCar;