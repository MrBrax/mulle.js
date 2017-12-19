/**
 * BootState
 * @module boot
 */

class BootState extends Phaser.State {

	preload(){
		this.game.load.image('loading', 'loading.png');
	}

	create(){

		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.refresh();

		if( this.game.mulle.networkEnabled ){

			this.game.mulle.net.connect();

			// launch on connect
			this.game.mulle.net.socket.addEventListener('open', (event) => {
				
				if(this.game.state.current == 'boot'){
					
					this.game.state.start('load');

				}

			});

			this.game.mulle.net.socket.addEventListener('close', (event) => {

				if(this.game.state.current == 'boot'){

					alert('Server ej tillgänglig, multiplayer avstängt.');

					this.game.state.start('load');

				}else{
				
					alert('Anslutningen till servern avbröts.');

				}

			});

			// update state
			this.game.state.onStateChange.add( (s) => {
				
				this.game.mulle.net.send({ scene: s });

			});

		}else{

			this.game.state.start('load');


		}

	}

}

export default BootState;