#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, getopt, struct

from subprocess import call

from enum import Enum

import json

import wave, aifc, sunau

import glob

from PIL import Image, ImageDraw, ImagePalette, ImageChops

from PyTexturePacker import Packer
from PyTexturePacker import ImageRect
from PyTexturePacker import Utils as PyTexturePackerUtils

# import ImageChops

from audiosprite import AudioSprite

class MulleResource:

	def __init__(self, name):

		self.name = name
		self.files = []

		self.opaque = False

	def addFile( self, opt ):

		if type(opt['num']) is str and '-' in opt['num']:
			
			f = opt['num'].split('-')

			for i in range( int(f[0]), int(f[1]) + 1 ):
				self.addFile({ 'dir': opt['dir'], 'lib': opt['lib'], 'num': i });

		else:

			self.files.append(opt)

optimizeImages = int(sys.argv[1])


MulleResources = []


resMenu = MulleResource('menu')
resMenu.addFile({ 'dir': '10.DXR', 'lib': 'Internal', 'num': 2 })
resMenu.addFile({ 'dir': '10.DXR', 'lib': 'Internal', 'num': '115-123' }) # face
resMenu.addFile({ 'dir': '10.DXR', 'lib': 'Internal', 'num': '125-138' }) # mulle
resMenu.addFile({ 'dir': '10.DXR', 'lib': 'Internal', 'num': '156-163' }) # buffa
resMenu.addFile({ 'dir': '10.DXR', 'lib': 'Internal', 'num': '169-170' }) # toilet
resMenu.addFile({ 'dir': '10.DXR', 'lib': 'Internal', 'num': '287-292' }) # intro audio
resMenu.addFile({ 'dir': '10.DXR', 'lib': 'Internal', 'num': '300-307' }) # menu audio
MulleResources.append(resMenu)


resParts = MulleResource('carparts')
resParts.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '239-496' })
resParts.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '838-917' })
resParts.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '966-1018' })
resParts.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '1213-1390' }) # audio
MulleResources.append(resParts)


resMap = MulleResource('map')
resMap.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '629-658' })
resMap.opaque = True
MulleResources.append(resMap)


resDriving = MulleResource('driving')
resDriving.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '497-514' }) # images
resDriving.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '565-598' }) # audio
resDriving.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '599-624' }) # images
resDriving.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': 625 }) # audio
resDriving.addFile({ 'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '626-628' }) # images

resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': 21 }) # ui
resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': 25 }) # dashboard

resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '27-42' }) # fuel meter

resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': 46 }) # speed meter

resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': 53 }) # menu

# resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '69-75' }) # medals

resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '77-157' }) # car

resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '161-192' }) # pointer

resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '233-249' }) # voices
# resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '265-266' }) # skid
resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '269-275' }) # horns
resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '294-369' }) # engine



MulleResources.append(resDriving)


resGarage = MulleResource('garage')
resGarage.addFile({ 'dir': '03.DXR', 'lib': 'Internal', 'num': 33 }) # back
resGarage.addFile({ 'dir': '03.DXR', 'lib': 'Internal', 'num': '34-39' }) # doors

resGarage.addFile({ 'dir': '03.DXR', 'lib': 'Internal', 'num': '81-93' }) # figge
resGarage.addFile({ 'dir': '03.DXR', 'lib': 'Internal', 'num': '107-108' }) # figge truck

resGarage.addFile({ 'dir': '03.DXR', 'lib': 'Internal', 'num': 101 }) # phone
resGarage.addFile({ 'dir': '03.DXR', 'lib': 'Internal', 'num': '181-183' }) # ui sounds
resGarage.addFile({ 'dir': '03.DXR', 'lib': 'Internal', 'num': '208-264' }) # voices
MulleResources.append(resGarage)


resYard = MulleResource('yard')
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': '13-14' })
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': 16 })
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': 27 })
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': 30 })
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': 37 })
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': '40-44' })
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': '116-118' })
resYard.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': '228-230' })
MulleResources.append(resYard)


resCutscenes = MulleResource('cutscenes')
resCutscenes.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': '66-76' })
resCutscenes.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': 81 })
resCutscenes.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': '83-86' })
MulleResources.append(resCutscenes)


resUI = MulleResource('ui')
resUI.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': 97 })
resUI.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': '109-117' })
MulleResources.append(resUI)


resCharacters = MulleResource('characters')
resCharacters.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': '214-227' }) # buffa
resCharacters.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': '245-263' }) # car
resCharacters.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': '271-302' }) # car
MulleResources.append(resCharacters)


resShared = MulleResource('shared')
resShared.addFile({ 'dir': '00.CXT', 'lib': 'Standalone', 'num': '416-493' }) # misc audio
resShared.addFile({ 'dir': '04.DXR', 'lib': 'Internal', 'num': '48-49' }) # mailbox audio
MulleResources.append(resShared)


resJunk = MulleResource('junk')
resJunk.addFile({ 'dir': '02.DXR', 'lib': 'Internal', 'num': '66-72' }) # bg
resJunk.addFile({ 'dir': '02.DXR', 'lib': 'Internal', 'num': '85-96' }) # doors
resJunk.addFile({ 'dir': '02.DXR', 'lib': 'Internal', 'num': '162-185' }) # arrows
MulleResources.append(resJunk)


resRoadDog = MulleResource('roaddog')
resRoadDog.addFile({ 'dir': '85.DXR', 'lib': 'Internal', 'num': 25 }) # images
resRoadDog.addFile({ 'dir': '85.DXR', 'lib': 'Internal', 'num': '190-201' }) # audio
resRoadDog.addFile({ 'dir': '85.DXR', 'lib': 'Internal', 'num': '26-34' }) # salka right
MulleResources.append(resRoadDog)


resRoadThing = MulleResource('roadthing')
resRoadThing.addFile({ 'dir': '84.DXR', 'lib': 'Internal', 'num': 25 }) # images
resRoadThing.addFile({ 'dir': '84.DXR', 'lib': 'Internal', 'num': 201 }) # audio
MulleResources.append(resRoadThing)


resFiggeFerrum = MulleResource('figgeferrum')
resFiggeFerrum.addFile({ 'dir': '92.DXR', 'lib': 'Internal', 'num': '1-205' })
resFiggeFerrum.addFile({ 'dir': '92.DXR', 'lib': 'Internal', 'num': '40-44' }) # salka left
MulleResources.append(resFiggeFerrum)


resStureStortand = MulleResource('sturestortand')
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '16-24' }) # tube
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': 32 }) # bg 1
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': 40 }) # bg 2
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '33-39' }) # sture 1
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '41-47' }) # sture 2
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '92-93' }) # kids 1
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '96-97' }) # kids 2
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '100-101' }) # kids 3
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '92-93' }) # kids 1
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': 181 }) # bg loop
resStureStortand.addFile({ 'dir': '88.DXR', 'lib': 'Internal', 'num': '199-204' }) # audio
MulleResources.append(resStureStortand)


resSaftfabrik = MulleResource('saftfabrik')
resSaftfabrik.addFile({ 'dir': '87.DXR', 'lib': 'Internal', 'num': '15-18' }) # gaston
resSaftfabrik.addFile({ 'dir': '87.DXR', 'lib': 'Internal', 'num': '26-29' }) # splash
resSaftfabrik.addFile({ 'dir': '87.DXR', 'lib': 'Internal', 'num': 185 }) # bg loop
resSaftfabrik.addFile({ 'dir': '87.DXR', 'lib': 'Internal', 'num': '200-206' }) # audio
resSaftfabrik.addFile({ 'dir': '87.DXR', 'lib': 'Internal', 'num': 208 }) # bg image
MulleResources.append(resSaftfabrik)


resCarShow = MulleResource('carshow')
resCarShow.addFile({ 'dir': '94.DXR', 'lib': 'Internal', 'num': '17-21' }) # numbers
resCarShow.addFile({ 'dir': '94.DXR', 'lib': 'Internal', 'num': '31-47' }) # judge
resCarShow.addFile({ 'dir': '94.DXR', 'lib': 'Internal', 'num': 185 }) # bg noise
resCarShow.addFile({ 'dir': '94.DXR', 'lib': 'Internal', 'num': 200 }) # bg image
resCarShow.addFile({ 'dir': '94.DXR', 'lib': 'Internal', 'num': '201-209' }) # speech
MulleResources.append(resCarShow)

resSolhem = MulleResource('solhem')
resSolhem.addFile({ 'dir': '86.DXR', 'lib': 'Internal', 'num': 1 })
resSolhem.addFile({ 'dir': '86.DXR', 'lib': 'Internal', 'num': 3 })
resSolhem.addFile({ 'dir': '86.DXR', 'lib': 'Internal', 'num': 21 })
resSolhem.addFile({ 'dir': '86.DXR', 'lib': 'Internal', 'num': '30-74' })
resSolhem.addFile({ 'dir': '86.DXR', 'lib': 'Internal', 'num': '181-185' })
resSolhem.addFile({ 'dir': '86.DXR', 'lib': 'Internal', 'num': '200-206' })
MulleResources.append(resSolhem)


assetOutPath = "./dist/assets"
assetWebPath = "assets"
resourcePath = '<<<<<<<<<<CST STORAGE PATH>>>>>>>>>>'
meta = {}

assetIndex = {}

for res in MulleResources:

	resName = res.name

	assetIndex[ resName ] = { 'files': [] }
	
	print("")
	print("- " + resName)

	atlasData = {}
	soundSprite = {}

	imageRects = []

	packFiles = {}
	packFiles[ resName ] = []

	for f in res.files:

		dirPath = resourcePath + '\\' + f['dir']

		j = None

		if f['dir'] in meta:
			j = meta[ f['dir'] ]
		else:
			# j = require( dirPath + '\\metadata.json');
			
			with open(dirPath + '\\metadata.json') as data_file:
				j = json.load( data_file )

			meta[ f['dir'] ] = j
		
		lib = j['libraries'][0]
		
		if str(f['num']) in lib['members']:
			mem = lib['members'][ str(f['num']) ]
		else:
			print("[" + res.name + "] Invalid file " + f['dir'] + " " + str(lib['name']) + " " + str(f['num']) )
			continue


		libPath = dirPath + '\\' + lib['name']
		
		fileBasePath = libPath + '\\' + str(f['num'])

		if mem['castType'] == 1:

			filePath = fileBasePath + ".png"

			intName = str( len(atlasData) + 1 )

			p = {}

			p['path'] = filePath;

			p['width'] = mem['imageWidth'];
			p['height'] = mem['imageHeight'];

			p['data'] = {}

			# p['data']['name'] = (atlasData.length + 1).toString();

			p['data']['pivotX'] = mem['imageRegX']
			p['data']['pivotY'] = mem['imageRegY']

			p['data']['dirFile'] = f['dir']
			p['data']['dirName'] = mem['name']			
			p['data']['dirNum'] = f['num']

			# atlasData.push( p );
			atlasData[ intName ] = p

			assetIndex[resName]['files'].append( { 'type': 'image', 'dirFile': f['dir'], 'dirName': mem['name'], 'dirNum': f['num'] } )


			image_rect = ImageRect.ImageRect( filePath )

			original = None

			for v in imageRects:
				# print("compare " + str( p['data']['dirFile'] ) + " " + str( p['data']['dirNum'] ) + " == " + str( v.dirFile ) + " " + str( v.dirNum ) )
				# diff = ImageChops.difference(image_rect.image, v.image)
				# print("diff " + str(diff))
				if mem['imageHash'] == v.hash:
					original = v
					break

			if original is not None:

				# print("found duplicate")

				dupe = {}

				dupe['pivot'] = { 'x': p['data']['pivotX'], 'y': p['data']['pivotY'] }
				
				dupe['baseName'] = intName
				
				dupe['dirFile'] = p['data']['dirFile']
				dupe['dirName'] = p['data']['dirName']
				dupe['dirNum'] = p['data']['dirNum']

				original.dupes.append( dupe )

				# image_rect = None

			else:
				
				image_rect.pivot = { 'x': p['data']['pivotX'], 'y': p['data']['pivotY'] }
				
				image_rect.baseName = intName
				
				image_rect.dirFile = p['data']['dirFile']
				image_rect.dirName = p['data']['dirName']
				image_rect.dirNum = p['data']['dirNum']

				image_rect.hash = mem['imageHash']

				image_rect.dupes = []

				imageRects.append(image_rect)

			# print("image " + f['dir'] + " " + str(lib['name']) + " " + str(f['num']))


		if mem['castType'] == 6:
			
			filePath = fileBasePath + ".wav"

			p = {}
			p['path'] = filePath

			if 'soundLooped' in mem:
				p['loop'] = mem['soundLooped']
			else:
				p['loop'] = False

			p['data'] = {}
			p['data']['dirName'] = mem['name']

			p['data']['dirFile'] = f['dir']
			p['data']['dirNum'] = f['num']

			if 'soundCuePoints' in mem and len(mem['soundCuePoints']) > 0:
				p['data']['cue'] = mem['soundCuePoints']

			soundSprite[ str( len(soundSprite) + 1 ) ] = p

			assetIndex[resName]['files'].append( { 'type': 'sound', 'dirFile': f['dir'], 'dirName': mem['name'], 'dirNum': f['num'] } )

			# print("audio " + f['dir'] + " " + str(lib['name']) + " " + str(f['num']))

	print("Images: " + str( len(imageRects) ) )
	print("Sounds: " + str( len(soundSprite) ) )
	
	if len(imageRects) > 0:

		if res.opaque:
			packer = Packer.create( max_width=2048, max_height=2048, bg_color=0xffffffff, trim_mode=1, enable_rotated=False )
		else:
			packer = Packer.create( max_width=2048, max_height=2048, bg_color=0x00ffffff, trim_mode=1, enable_rotated=False )

		atlas_list = packer._pack(imageRects)

		for i, atlas in enumerate(atlas_list):

			print("Pack image " + str(i))

			fSprites = {}
			fSprites['frames'] = {}

			packed_image = atlas.dump_image(packer.bg_color)

			atlasName = resName + '-sprites-' + str(i)

			PyTexturePackerUtils.save_image(packed_image, assetOutPath + "/" + atlasName + '.png')

			if optimizeImages > 0:
				call('optipng.exe -o' + str( optimizeImages ) + ' ' + assetOutPath + "/" + atlasName + '.png')
			
			# make json
			for image_rect in atlas.image_rect_list:
				width, height = (image_rect.width, image_rect.height) if not image_rect.rotated \
					else (image_rect.height, image_rect.width)

				center_offset = (0, 0)
				if image_rect.trimmed:
					center_offset = (image_rect.source_box[0] + width / 2. - image_rect.source_size[0] / 2.,
									 - (image_rect.source_box[1] + height / 2. - image_rect.source_size[1] / 2.))

				
				m = {}
				m['frame'] = { "x": image_rect.x, "y": image_rect.y, "w": width, "h": height }
				m['regpoint'] = image_rect.pivot
				m['dirFile'] = image_rect.dirFile
				m['dirName'] = image_rect.dirName
				m['dirNum'] = image_rect.dirNum

				fSprites['frames'][ image_rect.baseName ] = m

				
				if len(image_rect.dupes) > 0:
					for dupe in image_rect.dupes:
						
						n = {}
						n['frame'] = { "x": image_rect.x, "y": image_rect.y, "w": width, "h": height }
						n['regpoint'] = dupe['pivot']
						n['dirFile'] = dupe['dirFile']
						n['dirName'] = dupe['dirName']
						n['dirNum'] = dupe['dirNum']

						fSprites['frames'][ dupe['baseName'] ] = n

						# print("dupe handled: " + dupe['dirFile'] + " - " + str(dupe['dirNum']) )


			fSprites['meta'] = {
				"size": {"w": packed_image.size[0], "h": packed_image.size[1] },
				"image": assetWebPath + '/' + atlasName + '.png',
				"scale": "1",
			}
			
			fSpritesOut = open( assetOutPath + "/" + atlasName + ".json", "w")
			fSpritesOut.write( json.dumps( fSprites ) )
			fSpritesOut.close()

			packFiles[ resName ].append({
				"type": "atlasJSONHash",
				"key": atlasName,
				"textureURL": assetWebPath + '/' + atlasName + '.png',
				"atlasURL": assetWebPath + '/' + atlasName + '.json',
				"atlasData": None
			})


	if len(soundSprite) > 0:

		sprite = AudioSprite( resName )

		for s in soundSprite:

			sprite.addAudio( soundSprite[s]['path'], isLooped=soundSprite[s]['loop'], extraData=soundSprite[s]['data'] )

		outSprite = sprite.save( assetOutPath, resName + '-audio', formats=['ogg'], bitrate='32k', parameters=['-ar', '22050'] )

		# print("audiosprite done")
		# print(outSprite)

		packFiles[ resName ].append({
			"type": "audiosprite",
			"key": resName + "-audio",
			"urls": assetWebPath + '/' + resName + '-audio.ogg',
			"jsonURL": assetWebPath + '/' + resName + '-audio.json',
			"jsonData": None
		})

	fPackOut = open( assetOutPath + "/" + resName + ".json", "w")
	fPackOut.write( json.dumps( packFiles ) )
	fPackOut.close()


fIndexOut = open( assetOutPath + "/index.json", "w")
fIndexOut.write( json.dumps( assetIndex ) )
fIndexOut.close()