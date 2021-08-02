const HTMLWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCSSExtractWebpackPlugin = require('mini-css-extract-plugin')

const path = require('path')

const prod = process.env.NODE_ENV === 'production'

/**
 * @type import('webpack').Configuration & { devServer?:
 *   import('webpack-dev-server').Configuration }
 */
const configuration = {
	mode: prod ? 'production' : 'development',

	entry: './source/main.tsx',

	devtool: prod ? 'source-map' : 'inline-source-map',

	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
	},

	devServer: {
		contentBase: path.join(__dirname, 'public'),
		overlay: true,
		port: 7070,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				pathRewrite: { '^/api': '' },
			},
		},
	},

	module: {
		rules: [
			{
				test: /\.(js|ts)x?$/,
				exclude: /node-modules/,
				loader: 'babel-loader',
			},

			{
				test: /\.css$/,
				use: [
					MiniCSSExtractWebpackPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: { postcssOptions: { config: './.postcssrc.js' } },
					},
				],
			},
		],
	},

	plugins: [
		new HTMLWebpackPlugin({ template: './source/index.html' }),

		new ForkTsCheckerWebpackPlugin({
			typescript: {
				configFile: './tsconfig.json',
				diagnosticOptions: { semantic: true, syntactic: true },
			},
		}),

		// @ts-expect-error types seem to be messed up
		new MiniCSSExtractWebpackPlugin(),
	],

	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.json', '.css'],
	},
}

module.exports = configuration
