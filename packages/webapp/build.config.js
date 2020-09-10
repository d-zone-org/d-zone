const { configure } = require('yakshaving')
const { rollup, watch } = require('rollup')

const pluginCommonJs = require('@rollup/plugin-commonjs')
const pluginNodeResolve = require('@rollup/plugin-node-resolve').nodeResolve
const pluginReplace = require('@rollup/plugin-replace')
const pluginSucrase = require('@rollup/plugin-sucrase')
const pluginTypescript = require('@rollup/plugin-typescript')
const pluginJson = require('@rollup/plugin-json')
const pluginClearDirectory = require('rollup-plugin-clear')
const pluginLiveReload = require('rollup-plugin-livereload')
const pluginServe = require('rollup-plugin-serve')
const pluginTerser = require('rollup-plugin-terser').terser

const path = require('path')
const root = (...args) => path.join(__dirname, ...args)

const additionalRollupSettings = {
	input: { preserveEntrySignatures: false },
}

const replaceBasename = {
	values: {
		'process.env.BASENAME': `'${process.env.BASENAME}'`,
	},
}

configure({
	projectRoot: __dirname,
	entryPoint: 'source/index.tsx',
	outputDirectory: 'public/build',

	requiredPlugins: {
		commonJs: { plugin: pluginCommonJs },
		nodeResolve: { plugin: pluginNodeResolve },
		replace: { plugin: pluginReplace },
		sucrase: { plugin: pluginSucrase },
		typescript: {
			plugin: pluginTypescript,
			devConfig: { tsconfig: root('tsconfig.build.json') },
			prodConfig: { tsconfig: root('tsconfig.build.json') },
		},
		terser: { plugin: pluginTerser },
	},

	rollup,
	watch,

	development: {
		additionalPlugins: () => [
			pluginReplace(replaceBasename),
			pluginJson(),
			pluginServe({
				contentBase: root('public'),
				port: 5000,
				historyApiFallback: '/index.html',
			}),
			pluginLiveReload(root('public')),
		],
		additionalRollupSettings,
	},

	production: {
		additionalPlugins: () => [
			pluginReplace(replaceBasename),
			pluginJson(),
			pluginClearDirectory({ targets: [root('public/build')] }),
		],
		additionalRollupSettings,
	},
}).catch((err) => {
	console.error(err)
	process.exit(1)
})
