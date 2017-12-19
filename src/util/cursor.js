class MulleCursor {

	constructor( game ) {

		this.game = game;

		this.cursorName = null;

		this.activator = null;

		this.default = 'Standard';

		this._current = null;

		this._previous = null;

		this._history = [];

		// this.bindings = { over: [], out: [] };

	}

	get current(){
		return this._current;
	}

	set current(val){

		
		
		// this.game.canvas.className = 'C_' + ( val ? val : ( this._previous ? this._previous : this.default ) );
		
		// this._previous = this._current;

		if(!val){
			this._history.splice(-1, 1);
		}else{
			this._history.push( val );
		}

		this.refresh();

		this._current = val;

		// console.debug('[cursor]', 'current', val, this._history);

	}

	reset(){
		this._history = [];
		this._current = null;
		this.refresh();
	}

	add( name ){

		if( this._history.indexOf( name ) === -1 ) this._history.push( name );

		this.refresh();

	}

	remove( name ){

		var i = this._history.indexOf( name ) !== -1;

		if( i ) this._history.splice( i, 1 );

		this.refresh();

	}

	refresh(){

		if( this._history.length > 0 ){
			this.game.canvas.className = 'C_' + this._history[ this._history.length - 1];
		}else{
			this.game.canvas.className = 'C_' + this.default;
		}

	}

	setCursor( activator, name ){

		if(name){

			console.debug('[cursor]', 'set', activator, name);

			this.activator = activator;

			this.cursorName = name;

			this.game.canvas.className = 'cursor-' + this.cursorName;

		}else{

			console.debug('[cursor]', 'default', activator);

			this.activator = null;

			this.cursorName = null;

			this.game.canvas.className = '';

		}

	}

	addHook( obj, callback ){

		// var over = 
		obj.events.onInputOver.add( this.cursorOver, this, null, callback );

		// var out = 
		obj.events.onInputOut.add( this.cursorOut, this, null, callback );

		// this.bindings.over.push(over);

		// this.bindings.out.push(out);

		// console.log( this.bindings );

	}

	cursorOver( obj, pointer, callback ){
		
		// console.log( 'cursorOver', obj, pointer, d );
		
		if(callback){
			
			var ret = callback( obj, 'over', pointer );
			
			if(ret){
				this.setCursor(obj, ret);
			}else{
				this.setCursor(obj, null);
			}

		}

	}

	cursorOut( obj, pointer, callback ){
		
		// console.log( 'cursorOut', obj, pointer, d );
		
		if(callback){
			
			var ret = callback( obj, 'out', pointer );

			if(ret){
				this.setCursor(obj, ret);
			}else{
				this.setCursor(obj, null);
			}

		}

	}

}

export default MulleCursor;