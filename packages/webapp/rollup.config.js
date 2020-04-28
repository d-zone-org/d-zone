import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import svelteConfig from './svelte.config'
import typescript from '@rollup/plugin-typescript'

const production = !process.env.ROLLUP_WATCH

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
		globals: {
			'pixi.js': 'PIXI'
		},
	},
	external: ['pixi.js'],
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			...svelteConfig,
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({ tsconfig: './tsconfig.json' }),

		// In dev mode, serve on port 5000...
		!production &&
			serve({
				contentBase: 'public',
				port: 5000,
				historyApiFallback: '/index.html',
			}),

		// ...and reload when the app changes
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
}
