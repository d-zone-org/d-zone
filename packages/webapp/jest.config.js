module.exports = {
	clearMocks: true,

	coverageDirectory: '../coverage',

	coverageReporters: ['json', 'text'],

	moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

	rootDir: 'source',

	setupFiles: [
		/*'jest-canvas-mock'*/
	],

	transform: {
		'.(js|jsx|ts|tsx)': '@sucrase/jest-plugin',
	},
}
