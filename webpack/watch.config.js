var webpack = require('webpack');
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
    }
};