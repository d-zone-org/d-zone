const { configure } = require('yakshaving')

const pluginReplace = require('@rollup/plugin-replace')
const pluginJson = require('@rollup/plugin-json')
const pluginClearDirectory = require('rollup-plugin-clear')
const pluginLiveReload = require('rollup-plugin-livereload')
const pluginServe = require('rollup-plugin-serve')

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

	ignoredDepsBundleDependencies: [],
	additionalPlugins: (devMode) =>
		devMode
			? [
					pluginReplace(replaceBasename),
					pluginJson(),
					pluginServe({
						contentBase: root('public'),
						port: 5000,
						historyApiFallback: '/index.html',
					}),
					pluginLiveReload(root('public')),
			  ]
			: [
					pluginReplace(replaceBasename),
					pluginJson(),
					pluginClearDirectory({ targets: [root('public/build')] }),
			  ],

	advanced: {
		rollup: [additionalRollupSettings],
		watch: [additionalRollupSettings],
	},
}).catch((err) => {
	console.dir(err, { depth: 10 })
	process.exit(1)
})
