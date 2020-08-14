// Imports
const rollup = require('rollup')
const yargs = require('yargs-parser')
const path = require('path')
const c = require('colorette')

// Rollup Plugins
const pluginCommonJS = require('@rollup/plugin-commonjs')
const pluginNodeResolve = require('@rollup/plugin-node-resolve').nodeResolve
const pluginTypescript = require('@rollup/plugin-typescript')
const pluginSucrase = require('@rollup/plugin-sucrase')
const pluginReplace = require('@rollup/plugin-replace')
const pluginLiveReload = require('rollup-plugin-livereload')
const pluginServe = require('rollup-plugin-serve')
const pluginTerser = require('rollup-plugin-terser').terser
const clear = require('rollup-plugin-clear')

const { dependencies, main } = require('../package.json')

const root = (...args) => path.resolve(__dirname, '..', ...args)

// Constants or Configuration
const dependenciesArr = Object.keys(dependencies)
const { DEV, TS, VERBOSE } = yargs(process.argv.slice(2), {
	alias: {
		DEV: ['dev', 'watch', 'd', 'w'],
		TS: ['typescript', 'ts'],
		VERBOSE: ['v', 'verbose'],
	},
	boolean: ['DEV', 'TS', 'VERBOSE'],
	default: { DEV: false, TS: false, VERBOSE: false },
})
const sourceEntryPoint = root(main)

console.log('\033c')
if (VERBOSE)
	console.log(
		c.yellow('Current Configuration:\n'),
		` Development Mode - ${DEV}\n`,
		` Typescript Mode - ${TS || !DEV}\n`,
		` Source Entry Point - ${sourceEntryPoint}\n`
	)

if (DEV) developmentBuild().catch(console.error)
else productionBuild().catch(console.error)

async function productionBuild() {
	if (VERBOSE) console.log(c.yellow('Started Production Build'))

	const plugins = [
		clear({
			targets: [root('public/build')],
		}),
		pluginCommonJS(),
		pluginNodeResolve({
			extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
			preferBuiltins: false,
		}),
		pluginTypescript({ tsconfig: root('tsconfig.json') }),
		pluginReplace({
			values: {
				'process.env.NODE_ENV': '"production"',
			},
		}),
		pluginTerser(),
	]

	const inputOptions = {
		input: sourceEntryPoint,
		context: 'window',
		plugins,
	}

	const outputOptions = {
		dir: root('public/build'),
		format: 'es',
		entryFileNames: 'bundle.js',
		sourcemap: true,
	}

	console.time(c.greenBright('Completed Production Build'))
	const bundle = await rollup.rollup(inputOptions)
	await bundle.write(outputOptions)
	console.timeEnd(c.greenBright('Completed Production Build'))
}

async function developmentBuild() {
	if (VERBOSE) console.log(c.yellow('Started Development Build'))

	console.time(c.greenBright('Created Dependencies Bundle'))
	await createDependenciesBundle()
	console.timeEnd(c.greenBright('Created Dependencies Bundle'))

	if (VERBOSE) console.log(c.yellow('\nStarting Watch Mode'))
	await startWatchMode()

	async function createDependenciesBundle() {
		const plugins = [
			clear({
				targets: [root('public/build')],
			}),
			pluginCommonJS(),
			pluginNodeResolve({ preferBuiltins: false }),
			pluginReplace({
				values: {
					'process.env.NODE_ENV': '"development"',
				},
			}),
		]

		// In case there are specific files we want to use instead
		// of the entry point mentioned in package.json
		const getEntryPointPath = (name) => {
			const path = require.resolve(
				name === 'react'
					? 'react/cjs/react.development.js'
					: name === 'react-dom'
					? 'react-dom/cjs/react-dom.development.js'
					: name === 'ecsy'
					? 'ecsy/build/ecsy.module.js'
					: name === 'pixi.js'
					? 'pixi.js/lib/pixi.es.js'
					: name === 'pixi-viewport'
					? 'pixi-viewport/dist/viewport.es.js'
					: name
			)

			if (VERBOSE) console.log(`Using ${c.cyan(name)}:`, c.gray(path))
			return path
		}

		const inputOptions = {
			input: Object.fromEntries(
				dependenciesArr.map((name) => [name, getEntryPointPath(name)])
			),
			context: 'window',
			plugins,
		}

		const outputOptions = {
			dir: root('public/build/dependencies'),
			format: 'es',
			entryFileNames: '[name].js',
			sourcemap: true,
			exports: 'named',
		}

		const bundle = await rollup.rollup(inputOptions)
		await bundle.write(outputOptions)
	}

	async function startWatchMode() {
		const plugins = [
			pluginCommonJS(),
			pluginNodeResolve({
				extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
				preferBuiltins: false,
			}),
			TS
				? pluginTypescript({ tsconfig: root('tsconfig.json') })
				: pluginSucrase({ transforms: ['typescript', 'jsx'] }),
			pluginServe({
				contentBase: root('public'),
				port: 5000,
				historyApiFallback: '/index.html',
			}),
			pluginLiveReload(root('public')),
		]

		const inputOptions = {
			input: sourceEntryPoint,
			context: 'window',
			plugins,
			external: dependenciesArr,
		}

		const outputOptions = {
			dir: root('public/build'),
			format: 'es',
			entryFileNames: 'bundle.js',
			sourcemap: true,
			paths: Object.fromEntries(
				dependenciesArr.map((k) => [k, `./dependencies/${k}.js`])
			),
		}

		const watchOptions = { clearScreen: false }

		const watcher = rollup.watch({
			...inputOptions,
			output: [outputOptions],
			watch: watchOptions,
		})

		watcher.on('event', ({ code, duration }) => {
			if (code === 'BUNDLE_START') console.log(c.yellow('\nFound Changes'))
			if (code === 'BUNDLE_END')
				console.log(
					c.greenBright(`Completed build: ${c.white(duration + 'ms')}`)
				)
		})
	}
}
