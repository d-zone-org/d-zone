import { Configuration } from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
// @ts-expect-error No types
import PNPWebpackPlugin from 'pnp-webpack-plugin'

import { join } from 'path'
export const root = (path = '') => join(process.cwd(), '../web', path)

const configuration = (dev: boolean): Configuration => ({
	mode: dev ? 'development' : 'production',

	entry: [root('./source/main.tsx')],

	devtool: dev ? 'inline-source-map' : 'source-map',

	output: {
		path: root('./dist'),
		publicPath: '/',
	},

	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /node-modules/,

				use: {
					loader: require.resolve('babel-loader'),
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript',
						],
					},
				},
			},
		],
	},

	plugins: [
		new HTMLWebpackPlugin({ template: root('./source/index.html') }),
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				configFile: root('./tsconfig.json'),
				diagnosticOptions: { semantic: true, syntactic: true },
				typescriptPath: require.resolve('typescript'),
			},
		}),
	],

	resolve: {
		plugins: [PNPWebpackPlugin],
		extensions: ['.js', '.ts', '.tsx', '.json'],
	},

	resolveLoader: { plugins: [PNPWebpackPlugin.moduleLoader(module)] },
})

export default configuration
