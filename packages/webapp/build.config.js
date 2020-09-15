const { configure } = require('yakshaving')

const pluginReplace = require('@rollup/plugin-replace')
const pluginJson = require('@rollup/plugin-json')
const pluginClearDirectory = require('rollup-plugin-clear')
const pluginLiveReload = require('rollup-plugin-livereload')
const pluginServe = require('rollup-plugin-serve')

const path = require('path')
const root = (...args) => path.join(__dirname, ...args)

const replaceBasename = {
	values: {
		'process.env.BASENAME': `'${process.env.BASENAME}'`,
	},
}

configure((devMode) => ({
	projectRoot: __dirname,
	entryPoint: 'source/index.tsx',
	outputDirectory: 'public/build',

	additionalPlugins: devMode
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
		rollupOptions: {
			input: { preserveEntrySignatures: false },
		},
	},
})).catch((err) => {
	console.dir(err, { depth: 10 })
	process.exit(1)
})
