var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: './dist/bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    plugins: [
        new UglifyJSPlugin({ sourceMap: true })
    ],
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};