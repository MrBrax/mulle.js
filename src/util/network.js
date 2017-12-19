/**
 * MulleNet
 * @module network
 */

class MulleNet {

	constructor(game){

		this.game = game;
	
	}

	connect(){

		if( this.connected ){
			console.error('Already connected');
			return false;
		}

		var address = process.env.NODE_ENV !== "production" ? this.game.mulle.networkDevServer : this.game.mulle.networkServer;
		
		console.log('[network]', 'connect', address);
		this.socket = new WebSocket( "ws://" + address );

		// launch on connect
		this.socket.addEventListener('open', (event) => {
			console.log('[network]', 'connected');
		});

		this.socket.addEventListener('close', (event) => {
			console.warn('[network]', 'disconnected', event);
			this.socket = null;
		});

	}

	disconnect(){

		this.socket.close();

	}

	send( data ){

		if(!this.socket) return false;

		if( this.socket.readyState !== WebSocket.OPEN ){
			console.debug('[network]', 'offline', data);
			return false;
		}

		console.debug('[network]', 'send', data);

		this.socket.send( JSON.stringify( data ) );

	}

	get connected(){

		return this.socket && this.socket.readyState === WebSocket.OPEN;

	}

}

export default MulleNet;