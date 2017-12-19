import os
import json
from pydub import AudioSegment

from .exceptions import (
        InvalidSource
)

#ffmpeg -y -f mp3 -i test/data/test1.mp3 -c:a libfaac test1.aac
class AudioSprite(object):
   
    """ Uses list of AudioSegment objects to maintain sprite
    """

    EXPORT_FORMATS = [
        'ogg', 'mp3', 'm4a'
    ]

    SILENCE_DURATION = 1000

    def __init__(self, id, data=None, *args, **kwargs):
        self._data = data
        self._files = []
        self._id = id
        self._useSilence = True
        self._silenceDuration = self.SILENCE_DURATION
        self._maxLevel = -1

        super(AudioSprite, self).__init__(*args, **kwargs)

    def __len__(self):
        return sum(len(f['seg']) for f in self._realFiles())
    
    def __iter__(self):
        return (self._files[i] for i in xrange(len(self._files)))

    def __getitem__(self, idx):
        return self._files[idx]

    def findIndexOf(self, path):
        return map(lambda f: f['path'], self).index(path)

    def setMaxAudioLevel(self, level):
        self._maxLevel = level

    def addAudio(self, filePath, volume=None, isLooped=False, cuePoints=[], extraData={}):
        """ Main interface for adding audio to the sprite.
        Takes any audio format that ffmpeg supports
        """
        fileName, fileExtension = os.path.splitext(filePath)
        try:
            seg = AudioSegment.from_file(filePath, fileExtension[1:])
        except:
            raise InvalidSource("Invalid audio source: " + filePath)

        # Add silence in between audio tracks
        if (self._useSilence and len(self._files) > 0): 
            self._files.append({
                'id': 'SILENCE',
                'length': self._calcSilenceLen()
                })

        config = {
            'id': os.path.splitext(os.path.basename(filePath))[0],
            'seg': seg, 
            'path': filePath,
            'volume': volume,
            'params': None,
            'loop': isLooped,
            'data': extraData
            }

        if volume != None:
            config['vratio'] = self._getVolumeRatio(volume)
            if config['vratio'] != None:
                config['params'] = self._getAdjustedAudioVolumeParams(config['vratio'])

        # print("Added: " + str(config))
        self._files.append(config)

        return config

    def changeFileVolume(self, file_path, volume_change):
        """
        Changes a single file's volume by volume_change (+ or -)
        Specify file by path
        @return new gain value, -1 if not found
        """
        idx = self.findIndexOf(file_path)
        if idx >= 0:
            self._files[idx]['seg'] = self._files[idx]['seg'] + volume_change
            return self._files[idx]['seg'].rms

        return -1

    def setSilence(self, onOrOff, duration=0):
        self._useSilence = onOrOff
        if duration > 0:
            self._silenceDuration = duration

    def save(self, saveDir, outfile, formats=EXPORT_FORMATS, save_source=False, bitrate=None, parameters=None, tags=None, id3v2_version='4'):
        """ Generates audiosprite files and control data JSON file

        saveDir (string):
            Path to destination files

        outfile (string):
            destination filename (without extension)

        formats (list)
            Formats for destination audio file. ('mp3', 'mp4', 'ogg' or other ffmpeg/avconv supported files)

        save_source (bool):
            Generates 1 file per source per format when saving

        bitrate (string)
            Bitrate used when encoding destination file. (128, 256, 312k...)

        parameters (string)
            Aditional ffmpeg/avconv parameters

        tags (dict)
            Set metadata information to destination files usually used as tags. ({title='Song Title', artist='Song Artist'})

        id3v2_version (string)
            Set ID3v2 version for tags. (default: '4')
        """
        # create save dir if necessary
        if not os.path.exists(saveDir):
            os.makedirs(saveDir)

        fileBase = os.path.join(saveDir, outfile)

        if self._generateAudioSprite(outfile, saveDir, formats, save_source, bitrate, parameters, tags, id3v2_version): 
            return self._generateDataFile(fileBase)

        return False

    def _getAdjustedAudioVolumeParams(self, ratio):
        # First generate adjusted volume file with converter
        # Then load the converted file back into memory and save it in our config
        return '-af volume=' + str(ratio)


    def _generateAudioSprite(self, fileBase, saveDir, formats, save_source, bitrate, parameters, tags, id3v2_version):

        #print "formats: " + str(formats)
        # Generate one sprite per audio format
        for fmt in formats:
            print("Converting format " + str(fmt))
            
            # Export individual files to the output format if requested
            if save_source:
                for f in self._realFiles():
                    print("converting " + str(f))
                    basename = os.path.splitext(os.path.basename(f['path']))[0]
                    fname = os.path.join(saveDir, fmt, basename + '.' + fmt)
                    if not os.path.exists(os.path.dirname(fname)):
                        os.makedirs(os.path.dirname(fname))

                    # Convert wav->format with adjusted volume
                    print("fname: " + fname)
                    print("params: " + str(f['params']))
                    out = f['seg'].export(fname, format=fmt, bitrate=bitrate, parameters=f['params'], tags=tags, id3v2_version=id3v2_version)

                    # out should contain the volume adjusted file converted to the target format
                    print("*** Exported " + str(out.name) + '?')
                    # If volume was adjusted, convert from adjusted volume file->wav
                    if 'vratio' in f and f['vratio'] != None:
                        try:
                            f['seg'] = AudioSegment.from_file(out.name)
                        except:
                            raise Exception("Failed to load " + out.name)

        # save 1st wav

        print("Generating final sprites...")
        for fmt in formats:
            out = self._files[0]['seg']
            # concat all teh sounds - they are volume adjusted already
            for f in self._files[1:]:
                if self._isSilence(f):
                    out = out + AudioSegment.silent(f['length'])
                else: 
                    out = out + f['seg']

            fname = os.path.join(saveDir, fileBase + '.' + fmt)
            print("Exporting to " + fname)
            out.export(fname, format=fmt, bitrate=bitrate, parameters=parameters, tags=tags, id3v2_version=id3v2_version) 

        return True

    def _realFiles(self):
        return filter(lambda f: not self._isSilence(f), self._files)

    def _calcSilenceLen(self):
        # TODO: Dynamic duration may be desired
        return self._silenceDuration

    def _isSilence(self, config):
        return config['id'] == 'SILENCE'

    def _getVolumeRatio(self, volume):
       # """ Sets the volume on an AudioSegment using an externally defined volume level
       #  Requires setMaxAudioLevel() to have been called first!
       # """

       if self._maxLevel == -1:
           raise "Attempting to set volume without a maximum level.  Call setMaxAudioLevel() first"

       # Ignore if already at max
       if volume == None or volume == self._maxLevel:
           return None

       # Figure out the scaled volume
       ratio = (volume / float(self._maxLevel))
       #  We want to do apply_gain(db_to_float(float(volume_change))))??
       print("Adjusted rms: " + str(ratio))

       return ratio

    def _generateDataFile(self, fileBase):
        # generate the JSON data and write to file
        with open(fileBase + '.json', 'w') as outfile:
            json.dump(self._genSpriteData(), outfile)

        return True

    def _genSpriteData(self):
        self._data = {'resources': ['assets/' + self._id + '-audio.ogg'], 'spritemap': {}}
        start = 0

        for f in self._files:
            if not self._isSilence(f):
                sound_data = {} # self._getSoundData(f)
                sound_data['start'] = start / 1000
                sound_data['end'] = ( start + len(f['seg']) ) / 1000
                sound_data['loop'] = f['loop']
                sound_data['data'] = f['data']
                self._data['spritemap'][ f['id'] ] = sound_data
                start += len(f['seg'])
            else:
                # Add silence duration for next track's start time
                start += f['length']

        return self._data

    def _getSoundData(self, item):
        seg = item['seg']

        return {'id': item['id'],
                'url': item['path'], 
                'duration': len(seg),
                'duration_sec': seg.duration_seconds,
                #'channels': seg.channels,
                ##'frame_rate': seg.frame_rate,
                #'frame_width': seg.frame_width,
                #'sample_width': seg.sample_width,
                'rms': seg.rms,
                'dBFS': seg.dBFS,
                'max': seg.max,
                'max_amp': seg.max_possible_amplitude
                }

