const webpack = require("webpack");
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	
	entry: './src/index.js',

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},

	module: {

		rules: [{ 

			test: /\.js$/,

			exclude: /(node_modules|bower_components)/,

			use: {

				loader: "babel-loader",
			
				options: {
					presets: ['env']
				}

			}

		}]
		
	},

	plugins: [

	],
	
	resolve: {
		modules: [
			"node_modules",
			path.resolve(__dirname, "src")
		]
	}
	
}