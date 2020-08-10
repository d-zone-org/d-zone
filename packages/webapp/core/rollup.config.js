import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import sucrase from '@rollup/plugin-sucrase'

const dev = process.env.ROLLUP_WATCH

const plugins = [
	resolve({
		extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
	}),
	commonjs(),
]

if (dev)
	plugins.push(
		sucrase({
			transforms: ['typescript', 'jsx'],
		}),
		livereload('public')
	)
else plugins.push(typescript(), terser())

const config = {
	input: 'source/index.tsx',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'build',
	},

	context: 'window',

	external: ['deps'],

	plugins,

	watch: {
		clearScreen: false,
	},
}

export default config
