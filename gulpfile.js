var gulp = require('gulp');
var webpack = require('webpack-stream');
var gutil = require("gulp-util");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var sass = require('gulp-sass');

// var WebpackDevServer = require("webpack-dev-server");

var WebpackDev = require("./webpack.dev.js");

var WebpackProd = require("./webpack.prod.js");


gulp.task('phaser', function(){
	
	var exclude = [
		'gamepad',
		// 'rendertexture',
		'bitmaptext',
		'retrofont',
		'rope',
		'tilesprite',
		'flexgrid',
		'ninja',
		'p2',
		'tilemaps',
		'particles',
		'weapon',
		'creature',
		'video'
	];

	var cmd = [
		'grunt',
		'custom',
		'--gruntfile ./node_modules/phaser-ce/Gruntfile.js',
		'--exclude=' + exclude.join(','),
		'--uglify',
		'--sourcemap'
	];

	/*
	var shl = spawn('grunt', cmd, { stdio: 'inherit' });

	shl.stdout.on('data', function(data){
		console.log('grunt stdout: ' + data.toString());
	});
	*/

	exec(cmd.join(' '), function(err, stdout, stderr){

		console.log('phaser err: ' + err);
		console.log('phaser stdout: ' + stdout);
		console.log('phaser stderr: ' + stderr);

		gulp.src('./node_modules/phaser-ce/dist/phaser.min.js').pipe( gulp.dest('dist/') );
		gulp.src('./node_modules/phaser-ce/dist/phaser.map').pipe( gulp.dest('dist/') );

	});

	// grunt custom --exclude=ninja,p2,tilemaps,particles,weapon,creature,video --uglify --sourcemap

	// return gulp.src('./node_modules/phaser-ce/build/phaser.min.js').pipe( gulp.dest('dist/') );

});


gulp.task('html', function(){
	gulp.src('./progress/**').pipe( gulp.dest('dist/progress/') );
	gulp.src('./info/**').pipe( gulp.dest('dist/info/') );
	gulp.src('./src/index.html').pipe( gulp.dest('dist/') );
});


gulp.task('css', function(){
	return gulp.src('./src/style.scss').pipe( sass({ /* outputStyle: 'compressed' */ }).on('error', sass.logError) ).pipe( gulp.dest('dist/') );
});


gulp.task('data', function(){

	gulp.src('./loading.png').pipe( gulp.dest('dist/') );
	gulp.src('./data/*.json').pipe( gulp.dest('dist/data/') );

	gulp.src('./ui/*').pipe( gulp.dest('dist/ui/') );

	gulp.src('./topography/*').pipe( gulp.dest('dist/assets/topography/') );

});


gulp.task('assets-dev', function(){

	console.log('do assets dev');

	return exec('python assets.py 0', function(err, stdout, stderr){

		console.log(stdout);
		console.log(stderr);

	});

});

gulp.task('assets-prod', function(){

	console.log('do assets prod');

	/*
	return exec('python assets.py 7', function(err, stdout, stderr){

		console.log(stdout);
		console.log(stderr);

	});
	*/

	var cmd = spawn('python', ['assets.py', '7'], { stdio: 'inherit' });

	cmd.stdout.on('data', function(data){
		console.log('stdout: ' + data.toString());
	});


});

gulp.task('js-dev', function(){
	
	return gulp.src('src/index.js').pipe(
		webpack( WebpackDev )
	).pipe(
		gulp.dest('dist/')
	);

});

gulp.task('js-prod', function(){
	
	return gulp.src('src/index.js').pipe(
		webpack( WebpackProd )
	).pipe(
		gulp.dest('dist/')
	);

});

/*
gulp.task("start", function(callback) {

	var myConfig = Object.create( WebpackDev );
	
	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});

});
*/

gulp.task('build-dev', [ 'phaser', 'js-dev', 'html', 'css' ]);
gulp.task('build-prod', [ 'phaser', 'js-prod', 'html', 'css' ]);

gulp.task('build-full', [ 'phaser', 'js-prod', 'html', 'css', 'assets-prod', 'data' ]);

gulp.task('default', [ 'build-dev', 'assets-dev', 'data' ]);