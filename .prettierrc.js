const jsdocPlugin = require('prettier-plugin-jsdoc')

/** @type {import('prettier').Options} */
const config = {
	trailingComma: 'es5',
	useTabs: true,
	tabWidth: 2,
	semi: false,
	singleQuote: true,
	plugins: [jsdocPlugin],
}

module.exports = config
