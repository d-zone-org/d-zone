const { configure } = require('yakshaving')

const pluginJson = require('@rollup/plugin-json')
const pluginClearDirectory = require('rollup-plugin-clear')
const pluginLiveReload = require('rollup-plugin-livereload')
const pluginServe = require('rollup-plugin-serve')

const path = require('path')
const root = (...args) => path.join(__dirname, ...args)

configure((devMode) => ({
	projectRoot: __dirname,
	entryPoint: 'source/index.tsx',
	outputDirectory: 'public/build',

	additionalPlugins: devMode
		? [
				pluginJson(),
				pluginServe({
					contentBase: root('public'),
					port: 5000,
					historyApiFallback: '/index.html',
				}),
				pluginLiveReload(root('public')),
		  ]
		: [pluginJson(), pluginClearDirectory({ targets: [root('public/build')] })],

	advanced: {
		rollupOptions: {
			input: { preserveEntrySignatures: false },
		},

		pluginOptions: {
			replace: {
				'process.env.BASENAME': `'${process.env.BASENAME || ''}'`,
			},
		},
	},
}))
