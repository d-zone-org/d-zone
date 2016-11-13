var webpack = require("webpack");
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var merge = require('webpack-merge');
var path = require('path');

var TARGET = process.env.npm_lifecycle_event;

var common = {
    entry: './script-client/main.js',
    output: {
        path: './web',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js',''],
        root: path.resolve('./script-client'),
        modulesDirectories: [
            'node_modules',
            'common',
            'components',
            'managers',
            'systems'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'webpack/index.ejs',
            inject: 'body'
        })
    ]
};

if(TARGET === 'build') {
    module.exports = merge(common, {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                sourceMap: false,
                compress: {
                    warnings: false
                }
            })
        ]
    });
}

if(TARGET === 'watch') {
    module.exports = merge(common, {
        devtool: 'inline-source-map'
    });
}

if(TARGET === 'dev') {
    module.exports = merge(common, {
        devtool: 'eval',
        devServer: {
            stats: 'minimal',
            historyApiFallback: true,
            inline: true,
            contentBase: './web',
            host: '0.0.0.0',
            port: 7778
        }
    });
}