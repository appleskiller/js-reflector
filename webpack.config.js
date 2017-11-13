var webpack = require("webpack");

module.exports = {
	entry: './src/reflection.ts',
	output: {
	  filename: 'dist/reflection.js'
	},
	resolve: {
	   extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
	  loaders: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader'
			}
	  ]
	},
	devtool: "source-map"
}