var webpack = require("webpack");
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './script-client/main.js',
    devtool: 'source-map',
    output: {
        path: './web',
        filename: 'bundle.js',
        sourceMapFilename: '[file].map'
    },
    resolve: {
        extensions: ['.js',''],
        root: path.resolve('./script-client'),
        modulesDirectories: [
            'node_modules',
            'common',
            'components',
            'managers',
            'managers/ui',
            'managers/view',
            'managers/world',
            'systems'
        ]
    },
    devServer: {
        historyApiFallback: true,
        hot: false,
        inline: true,
        progress: true,
        contentBase: './web',
        host: '0.0.0.0',
        port: 7778
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'webpack/index.ejs',
            inject: 'body'
        })
    ]
};