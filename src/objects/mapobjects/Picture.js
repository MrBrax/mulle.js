"use strict";

// import MulleSprite from 'objects/sprite';

var MapObject = {};


MapObject.onCreate = function(){

	this.setDirectorMember(this.def.FrameList.normal[0]);

	// this.addAnimation('idle', [ [ 'CDDATA.CXT', this.def.FrameList.normal[0] ] ], 1, true);
	// this.animations.play('idle');

	// console.log('picture', this);

	// this.bringToTop();

	if( this.SpriteInfo.Over ){

		this.bringToTop();

	}

};


MapObject.onEnterInner = function(){

};

export default MapObject;