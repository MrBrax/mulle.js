/*
console.log('Import Phaser');
import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
*/

// import Phaser from 'phaser-ce';

console.debug('Import Game');
import MulleGame from 'game';

console.debug('Create game');
var game = new MulleGame();


console.debug('Override atlas');
Phaser.AnimationParser.JSONDataHash = function (game, json) {

	//  Malformed?
	if (!json['frames'])
	{
		console.warn("Phaser.AnimationParser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object");
		console.log(json);
		return;
	}

	//  Let's create some frames then
	var data = new Phaser.FrameData();

	//  By this stage frames is a fully parsed array
	var frames = json['frames'];
	var newFrame;
	var i = 0;

	// console.log('json hash hijack', json['meta']['image'], frames);

	for (var key in frames)
	{
		newFrame = data.addFrame(new Phaser.Frame(
			i,
			frames[key].frame.x,
			frames[key].frame.y,
			frames[key].frame.w,
			frames[key].frame.h,
			key
		));

		if (frames[key].trimmed)
		{
			newFrame.setTrim(
				frames[key].trimmed,
				frames[key].sourceSize.w,
				frames[key].sourceSize.h,
				frames[key].spriteSourceSize.x,
				frames[key].spriteSourceSize.y,
				frames[key].spriteSourceSize.w,
				frames[key].spriteSourceSize.h
			);
		}

		if (frames[key].rotated)
		{
			newFrame.rotated = true;
		}

		if( frames[key].regpoint ){
			newFrame.regpoint = new Phaser.Point( frames[key].regpoint.x, frames[key].regpoint.y );
		}

		newFrame.dirName = frames[key].dirName;
		newFrame.dirFile = frames[key].dirFile;
		newFrame.dirNum = frames[key].dirNum;

		if( frames[key].id ){
			newFrame.id = frames[key].id;
		}

		i++;
	}

	return data;

};

window.addEventListener("beforeunload", function(e){
	console.debug('Unload shutdown');
	game.state.states[game.state.current].shutdown();
});

window.game = game;

// module.exports = game;