var stdin = process.stdin, stdout = process.stdout;

var ShockwaveListParser = require('./listparser.js').ShockwaveListParser;

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function(data) {

	var lp = new ShockwaveListParser();
	var parsed = lp.parseList(data);

	stdout.write( JSON.stringify( parsed ) );

});