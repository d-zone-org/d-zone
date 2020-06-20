module.exports = {
	clearMocks: true,

	coverageDirectory: '../coverage',

	coverageReporters: ['json', 'text'],

	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.test.json',
			packageJson: 'package.json',
		},
	},

	moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

	preset: 'ts-jest',

	rootDir: 'src',

	setupFiles: ['jest-canvas-mock'],
}
