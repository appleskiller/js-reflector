module.exports = {
	entry: './src/test.ts',
	output: {
	  filename: 'dist/reflection.js'
	},
	resolve: {
	   extensions: ['.webpack.js', '.web.js', '.ts', '.js']
	},
	module: {
	  loaders: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			}
	  ]
	},
	devtool: "source-map"
}