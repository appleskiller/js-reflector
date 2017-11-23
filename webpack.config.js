var webpack = require("webpack");

module.exports = {
    entry: './src/reflector.ts',
    output: {
      filename: 'dist/reflector.js'
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