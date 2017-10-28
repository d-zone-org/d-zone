var webpack = require("webpack");
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var path = require('path');

module.exports = (env = {}, argv) => ({
        entry: './script-client/main.js',
            output: {
        path: path.resolve(__dirname, '../web'),
            filename: 'bundle.js'
    },
        resolve: {
            modules: [
                'script-client',
                'script-client/common',
                'script-client/components',
                'script-client/managers',
                'script-client/systems',
                'node_modules'
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                }
            ],
                noParse: [
                /[\/\\]node_modules[\/\\]localforage[\/\\]dist[\/\\]localforage\.js$/,
                /[\/\\]node_modules[\/\\]discord\.io[\/\\]lib[\/\\]index\.js$/
            ]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'webpack/index.ejs',
                inject: 'body'
            })
        ],
    devtool: (() => {
        if(env.production) return undefined;
        else return 'eval-source-map'
    })(),
    devServer: (() => {
        if(env.production) return undefined;
        else return {
            https: true,
            stats: 'minimal',
            historyApiFallback: true,
            contentBase: './web',
            host: '0.0.0.0',
            port: 7778
        }
    })()
    
});