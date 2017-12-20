#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, getopt, struct, math

from subprocess import Popen, PIPE, STDOUT

import json

from ShockwaveParser import ShockwaveParser, CastType

from listparser import ShockwaveListParser

rawData = {
	"objects": [],
	"maps": [],
	"missions": [],
	"parts": [],
	"worlds": []
}

parsedData = {
	"objects": [],
	"maps": [],
	"missions": [],
	"parts": [],
	"worlds": []
}

hashData = {
	"objects": {},
	"maps": {},
	"missions": {},
	"parts": {},
	"worlds": {}
}

def addFile( p, l ):
	print("add file: " + str(p) )
	with open(p, "r") as data_file:
		lingoList = data_file.read()
		l.append( lingoList )


print("start work")

bpath = 'cst_out_new/CDDATA.CXT'

mpath = bpath + '/metadata.json'

with open(mpath) as data_file:

	data = json.load( data_file )

	for lib in data['libraries']:

		for num in lib['members']:

			mem = lib['members'][num]

			fpath = bpath + "/" + lib['name'] + "/" + num + ".txt"

			if mem['name'][:4] == "part":
				addFile(fpath, rawData["parts"])

			if mem['name'][:7] == "mission":
				addFile(fpath, rawData["missions"])

			if mem['name'][:6] == "object":
				addFile(fpath, rawData["objects"])

			if mem['name'][:3] == "map":
				addFile(fpath, rawData["maps"])

			if mem['name'][:5] == "world":
				addFile(fpath, rawData["worlds"])


# print( rawData )

fRawOut = open( "gamedata/all_raw.json", "w")
fRawOut.write( json.dumps( rawData ) )
fRawOut.close()

for sec, data in rawData.items():

	i = 1
	for lingo in data:

		cmd = "node node-listparser.js"
		p = Popen(cmd, stdout=PIPE, stdin=PIPE, stderr=STDOUT)    
		grep_stdout = p.communicate( input = bytes(lingo, 'utf-8') )[0]
		parsed = json.loads( grep_stdout )

		parsedData[sec].append(parsed)

		print( "parsed: " + str(sec) + " - " + str(i) + " (" + str( round( ( i / len(data) ) * 100 ) ) + "%)" )

		i += 1

	fArrayOut = open( "gamedata/" + str(sec) + ".array.json", "w")
	fArrayOut.write( json.dumps( parsedData[sec] ) )
	fArrayOut.close()

	for parsed in parsedData[sec]:

		if 'MapId' in parsed:
			hashData[sec][ parsed['MapId'] ] = parsed

		if 'MissionId' in parsed:
			hashData[sec][ parsed['MissionId'] ] = parsed

		if 'ObjectId' in parsed:
			hashData[sec][ parsed['ObjectId'] ] = parsed

		if 'partId' in parsed:
			hashData[sec][ parsed['partId'] ] = parsed

		if 'WorldId' in parsed:
			hashData[sec][ parsed['WorldId'] ] = parsed

	fHashOut = open( "gamedata/" + str(sec) + ".hash.json", "w")
	fHashOut.write( json.dumps( hashData[sec] ) )
	fHashOut.close()

	
fParsedOut = open( "gamedata/all_parsed.json", "w")
fParsedOut.write( json.dumps( parsedData ) )
fParsedOut.close()

print("finished")


# t = rawData['objects'][0]

# lp = ShockwaveListParser()

# print( lp.parseList( t ) )




'''
files = ['CDDATA.CXT', '03.DXR', '04.DXR', '05.DXR', '00.CXT']

offsets = {}

for f in files:

	fpath = 'cst_out_new/' + f + '/metadata.json'

	with open(fpath) as data_file:

		data = json.load( data_file )

		# print( data )
		
		for lib in data['libraries']:

			for num in lib['members']:

				mem = lib['members'][num]

				if 'imageRegY' in mem:

					if len(mem['name']) <= 3:
						continue

					if mem['name'] in offsets:
						print("Collision with '" + str( mem['name'] ) + "' (" + f + ")")

					offsets[ mem['name'] ] = { 'x': mem['imageRegX'], 'y': mem['imageRegY'] }


				# print(mem)

			# print(lib)
		

	# print(fpath)

offOut = open( "offsets.json", "w")
offOut.write( json.dumps( offsets ) )
offOut.close()

'''

#print(offsets)