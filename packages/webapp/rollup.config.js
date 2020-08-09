import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import sucrase from '@rollup/plugin-sucrase'
import url from '@rollup/plugin-url'

import { main, dependencies as deps } from './package.json'

const dev = process.env.ROLLUP_WATCH

const plugins = [
	resolve({
		extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
	}),
	commonjs(),

	url({
		destDir: 'public/assets',
		fileName: '[dirname][hash][extname]',
		sourceDir: '/assets',
	}),
]

if (dev)
	plugins.push(
		sucrase({
			transforms: ['typescript', 'jsx'],
		}),
		serve({
			contentBase: 'public',
			port: 5000,
			historyApiFallback: '/index.html',
		}),
		livereload('public')
	)
else
	plugins.push(
		typescript({ tsconfig: 'tsconfig.json', exclude: ['source/__tests__/**'] }),
		terser()
	)

const config = {
	input: main,
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'public/build',

		paths: {
			ecsy:
				'https://unpkg.com/ecsy' +
				`@${deps.ecsy}/build/ecsy.module${dev ? '' : '.min'}.js`,

			react:
				'https://unpkg.com/es-react' +
				`@${deps.react}${dev ? '/dev' : ''}/react.js`,

			'react-dom':
				'https://unpkg.com/es-react' +
				`@${deps['react-dom']}${dev ? '/dev' : ''}/react-dom.js`,
		},
	},

	context: 'window',

	// All dependencies are treated as external
	// Except a few which are very small
	external: Object.keys(deps).filter((d) => !['regexparam'].includes(d)),

	plugins,

	watch: {
		clearScreen: false,
	},
}

export default config
