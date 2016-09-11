var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './script-client/main.js',
    output: {
        path: './web',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourceMap: false,
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['.js',''],
        root: path.resolve('./script-client'),
        modulesDirectories: [
            'node_modules', 'common', 'components', 'managers', 'ui', 'view', 'world', 'systems'
        ]
    }
};