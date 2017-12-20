const WebSocket = require('ws');
const readline = require('readline');
const moment = require('moment');
const colors = require('colors');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const maxConnections = 5;

class MulleServer {

	constructor(){

		this.totalClients = 0;

		this.raceTimes = [];

		this.ipClients = {};

		this.blockInfo = {
			map: true,
			scene: true,
			parts: true
		};

	}

	log( text ){

		var date = moment().format('YYYY-MM-DD HH:mm:ss');

		console.log( ( "[" + date + "] " ).gray + text );

	}

	pclient( ws ){

		if(!ws) return 'ERROR';

		if( ws.playerName ){

			return '"' + ws.playerName + '" (#' + ws.clientId + ( ws.clientIP ? ' ' + ws.clientIP : '' ) + ')';

		}else{

			return '#' + ws.clientId;

		}

	}

	start(){

		this.log('Starting...');

		// server
		this.wss = new WebSocket.Server({ port: 8765 });

		// client connection
		this.wss.on('connection', (ws, req) => {

			const clientIP = req.connection.remoteAddress;

			ws.clientIP = clientIP;

			ws.isAlive = true;

			
			if( this.ipClients[ clientIP ] ){

				if( this.ipClients[ clientIP ] > maxConnections ){

					this.log( ('Client ' + this.pclient( ws ) + ' connection limit from ' + clientIP + '').red );

					ws.send( JSON.stringify( { error: 'too many connections from ip' } ) );

					ws.terminate();

					return;
				}

				this.ipClients[ clientIP ]++;

			}else{

				this.ipClients[ clientIP ] = 0;

			}
			

			ws.clientId = ++this.totalClients;

			// var clientId = ws.clientId;

			ws.playerName = 'Player' + ws.clientId;

			if(!this.blockInfo['connect']) this.log( ('Client ' + this.pclient( ws ) + ' connected.').gray );

			ws.on('close', ( ev ) => {

				if(!this.blockInfo['disconnect']) this.log( ('Client ' + this.pclient( ws ) + ' disconnected.').gray );

				this.wss.clients.forEach( (client) => {
							
					if ( client !== ws && client.readyState === WebSocket.OPEN ) {

						client.send( JSON.stringify( { leave: ws.clientId } ) );

					}

				});

				this.broadcast('Spelare "' + ( ws.playerName ? ws.playerName : ws.clientId ) + '" kopplade från.', true);

				this.ipClients[ clientIP ]--;

			});
		  
			ws.on('message', (message) => {
				
				// console.log('received');
				
				var j = JSON.parse(message);

				// update player name
				if( j.name ){

					if(!this.blockInfo['name']) this.log( ('Client ' + this.pclient( ws ) + ' set their name to "' + j.name + '".').cyan );

					ws.playerName = j.name;

				// update car parts
				}else if( j.parts ){

					ws.carParts = j.parts;

					if(!this.blockInfo['parts']) this.log( 'Client ' + this.pclient( ws ) + ' updated their parts: ' + ws.carParts );

				// change scene
				}else if( j.scene ){

					// enter world
					if( ws.currentScene != 'world' && j.scene == 'world' ){

						this.wss.clients.forEach( (client) => {
							
							if (client !== ws && client.readyState === WebSocket.OPEN) {
								
								// client.send('joined');

								client.send( JSON.stringify( { join: ws.clientId } ) );

							}

						});

						// console.log('player joined');

						this.broadcast('Spelare "' + ( ws.playerName ? ws.playerName : ws.clientId ) + '" anslöt till världen.', true);

						ws.isInWorld = true;

					// leave world
					}else if( ws.currentScene == 'world' && j.scene != 'world' ){

						this.wss.clients.forEach( (client) => {
							
							if (client !== ws && client.readyState === WebSocket.OPEN) {
								
								// client.send('left');

								client.send( JSON.stringify( { leave: ws.clientId } ) );

							}

						});

						ws.isInWorld = false;

						// console.log('player left');

						this.broadcast('Spelare "' + ( ws.playerName ? ws.playerName : ws.clientId ) + '" lämnade världen.', true);

					}

					if(!this.blockInfo['scene']) this.log( ('Client ' + this.pclient( ws ) + ' changed scene to "' + j.scene + '".').gray );

					ws.currentScene = j.scene;
				

				// change map (optimization)
				}else if( j.map ){
										
					// for the current player
					
					if( ws.currentMap && ws.currentMap == j.map ){
						this.log( ('Client ' + this.pclient( ws ) + ' spamming map #' + j.map + '.').red );
						return;
					}
					
					var visibleClients = {};
					this.wss.clients.forEach( (client) => {
						
						if ( client.readyState === WebSocket.OPEN && client.currentScene == 'world' && client.currentMap == j.map ) {
							
							visibleClients[ client.clientId ] = {
								
								x: client.currentX,
								y: client.currentY,
								d: client.currentDir,

								n: client.playerName,

								p: client.carParts

							};

						}

					});

					ws.send( JSON.stringify( { c: visibleClients } ) );

					ws.currentMap = j.map;


					// for the other players

					this.wss.clients.forEach( (client) => {

						if( client.readyState !== WebSocket.OPEN ){
						
							return;
						}

						// if( client.currentMap != j.map ) return;

						var visibleClients = {};

						this.wss.clients.forEach( (sub) => {
							
							if ( client !== sub && sub.readyState === WebSocket.OPEN && sub.currentScene == 'world' && sub.currentMap == client.currentMap ) {
								
								visibleClients[ sub.clientId ] = {
									
									x: sub.currentX,
									y: sub.currentY,
									d: sub.currentDir,

									n: sub.playerName,

									p: sub.carParts

								};

							}

						});

						client.send(
							JSON.stringify( {
								c: visibleClients
							} )
						);

					});

					// race times
					if( j.map == 28 ){
						this.sendRaceTimes(ws);
					}


					if(!this.blockInfo['map']) this.log( ('Client ' + this.pclient( ws ) + ' changed map to ' + j.map + '.').gray );
				

				// change position
				}else if( j.x && j.y ){

					this.wss.clients.forEach( (client) => {
						
						if (
							client !== ws &&
							client.readyState === WebSocket.OPEN &&
							client.currentScene == 'world' &&
							client.currentMap == ws.currentMap
						) {

							// console.log('pos send', j.x, j.y);

							client.send(
								JSON.stringify( {
									i: ws.clientId,
									x: j.x,
									y: j.y,
									d: j.d
								} )
							);

						}

					});

					ws.currentX = j.x;
					ws.currentY = j.y;
					ws.currentDir = j.d;

					// console.log('pos update', j.x, j.y);

					// console.log('[pos]', ws.clientId, j.x, j.y );
				

				// recieve message
				}else if( j.msg ){

					if( j.msg.length > 140 ) return;

					// broadcast to everyone
					this.wss.clients.forEach( (client) => {
						
						if ( client.readyState === WebSocket.OPEN && client.currentScene == 'world' ) {

							client.send(
								JSON.stringify( {
									p: ws.playerName,
									i: ws.clientId,
									msg: j.msg
								} )
							);

						}

					});

					// log message
					if(!this.blockInfo['msg']) this.log( ( 'Client ' + this.pclient( ws ) + ' wrote: ' + j.msg ).white );
				

				// race time
				}else if( j.race ){

					this.raceTimes.push({
						name: ws.playerName,
						client: ws.clientId,
						time: j.race
					});

					this.raceTimes.sort(function(a, b){
						return a.time > b.time;
					});

					if( this.raceTimes.length > 10 ){
						this.raceTimes.splice( this.raceTimes.length - 1, 1);
					}

					if(!this.blockInfo['race']) this.log( 'Client ' + this.pclient( ws ) + ' finished a race: ' + j.race );

					this.sendRaceTimes();

				}else{

					// main log
					this.log( ( 'Client ' + this.pclient( ws ) + ' sent unhandled data: ' ).red );
					console.log( j )

				}
			

			});

			ws.on('pong', (heartbeat) => {

				ws.isAlive = true;

				// this.log( ('Client ' + this.pclient( ws ) + ' heartbeat!').gray )

			});

			ws.on('error', (err) => {

				console.log('Client error', err);

			});

			ws.send( JSON.stringify( { msg: 'welcome' } ) );

		});
	
		// listen message
		this.wss.on('listening', (s) => {

			this.log( 'Server started!'.green );

		});

		
		// timeout
		this.interval = setInterval( () => {
  			
  			this.wss.clients.forEach( (ws) => {
    
    			if (ws.isAlive === false){

    				this.log( ('Client ' + this.pclient( ws ) + ' timed out.').red );

    				return ws.terminate();

    			}

    			ws.isAlive = false;
   				ws.ping('', false, true);

  			} );

		}, 30000);
		


	}

	broadcast( text, noLog = false ){

		this.wss.clients.forEach( (client) => {

			if( client.readyState === WebSocket.OPEN && client.currentScene == 'world' ){

				client.send(
					JSON.stringify( {
						p: 'console',
						i: 0,
						msg: text
					})
				);

			}

		});

		if( !this.blockInfo['broadcast'] && !noLog ) this.log( ( 'Broadcast message: ' + text ).yellow );

	}

	sendRaceTimes( cl ){

		// console.log('Race times: ' + this.raceTimes );

		if( cl ){

			cl.send( JSON.stringify( { race: this.raceTimes } ) );

		}else{

			this.wss.clients.forEach( (client) => {
						
				if( client.readyState === WebSocket.OPEN && client.currentScene == 'world' && client.currentMap == 28 ) {
					
					client.send( JSON.stringify( { race: this.raceTimes } ) );

				}

			});

		}

	}

}

console.log('Mulle.js online server');

var ms = new MulleServer();
ms.start();

ms.log('Start executed!');

rl.on('line', (line) => {

	var args = line.split(' ');

	var mainArg = args[0];

	if(!mainArg) return;

	if( mainArg == 'status' ){

		ms.log( 'Connected players: ', Object.keys( ms.wss.clients ).length );

		if( !args[1] || args[1] == 'all' ){

			ms.wss.clients.forEach( (client) => {

				ms.log(' ' + client.clientId + ' | ' + client.playerName + ' | ' + client.currentScene );

				if( client.currentScene == 'world' ){

					ms.log('  ' + client.currentMap + ' - ' + client.currentX + ',' + client.currentY );

				}

			});

		}else if( args[1] == 'world' ){

			ms.wss.clients.forEach( (client) => {

				if( client.currentScene == 'world' ){

					ms.log(' ' + client.clientId + ' | ' + client.playerName + ' | ' + client.currentScene );

					ms.log('  ' + client.currentMap + ' - ' + client.currentX + ',' + client.currentY );

				}

			});

		}
		
		return;
	}

	if( mainArg == 'msg' ){

		var text = line.substr(4);

		ms.broadcast(text);

		ms.log( '[admin-msg]', text );
		
		return;
	}

	if( mainArg == 'block' ){

		var mod = args[1];

		if( ms.blockInfo[ mod ] ){

			delete ms.blockInfo[ mod ];

			ms.log( 'Now showing "' + mod + '"' );

		}else{

			ms.blockInfo[ mod ] = true;

			ms.log( 'Now blocking "' + mod + '"' );

		}
		
		return;
	}

	
	if( mainArg == 'kick' ){

		var id = parseInt( args[1] );

		if(!id) return;

		ms.wss.clients.forEach( (client) => {

			if( client.clientId && client.clientId == id ){

				client.terminate();

				ms.log('[kicked]', id);

			}

		});
		
		ms.log('[kick]', id);
		
		return;
	}
	

	ms.log( ( 'Invalid command: ' + line ).red );

});