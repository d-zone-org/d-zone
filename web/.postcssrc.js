module.exports = {
	plugins: [
		require('autoprefixer'),
		require('tailwindcss')(require('./tailwind.config')),
	],
}
