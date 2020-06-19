module.exports = {
	clearMocks: true,

	coverageDirectory: '../coverage',

	coverageReporters: ['json', 'text'],

	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json',
			packageJson: 'package.json',
		},
	},

	preset: 'ts-jest',

	rootDir: 'src',

	testEnvironment: 'node',

}
