import { Configuration } from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCSSExtactWebpackPlugin from 'mini-css-extract-plugin'
// @ts-expect-error No types
import PNPWebpackPlugin from 'pnp-webpack-plugin'
import tailwindcss from 'tailwindcss'

import { join } from 'path'
export const root = (path = '') => join(process.cwd(), '../web', path)
const glob = (path: string) => root().replace('\\', '/') + path

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
			{
				test: /\.css$/,

				use: [
					MiniCSSExtactWebpackPlugin.loader,
					require.resolve('css-loader'),
					{
						loader: require.resolve('postcss-loader'),
						options: {
							implementation: require('postcss'),

							postcssOptions: {
								plugins: [
									require('autoprefixer'),

									tailwindcss({
										...require(root('../tailwind.config')),

										purge: [glob('/**/*.tsx'), glob('./**/*.html')],
									}),
								],
							},
						},
					},
				],
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
		// @ts-expect-error Webpack V4 and V5 types do not match
		new MiniCSSExtactWebpackPlugin(),
	],

	resolve: {
		plugins: [PNPWebpackPlugin],
		extensions: ['.js', '.ts', '.tsx', '.json'],
	},

	resolveLoader: { plugins: [PNPWebpackPlugin.moduleLoader(module)] },
})

export default configuration
