import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'

const plugins = [
	resolve({
		extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
		preferBuiltins: false,
	}),
	commonjs(),
	typescript(),
]

const config = {
	input: 'source/index.ts',
	output: [
		{
			format: 'es',
			dir: 'build',
			entryFileNames: 'bundle.js',
		},
		{
			format: 'es',
			dir: 'build',
			sourceMap: true,
			entryFileNames: 'bundle.prod.js',
			plugins: [terser()],
		},
	],

	context: 'window',

	plugins,

	watch: {
		clearScreen: false,
	},
}

export default config
