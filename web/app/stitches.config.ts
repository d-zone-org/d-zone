import { createStitches } from '@stitches/react'

export const {
	styled,
	css,
	globalCss,
	keyframes,
	getCssText,
	theme,
	createTheme,
	config,
} = createStitches({
	theme: {
		fonts: {},
		colors: {},
	},
})

export const globalStyles = globalCss({
	// '@import': [
	// 	'url(https://fonts.googleapis.com/css2?family=Open+Sans&display=swap)',
	// ],
	// img: { maxWidth: '100%' },
	// 'ol, ul': { listStyle: 'none' },
	// textarea: { whiteSpace: 'revert' },
	// table: { borderCollapse: 'collapse' },
	// '*, *::before, *::after': { boxSizing: 'border-box' },
	// '*:where(:not(iframe, canvas, img, svg, video):not(svg *))': {
	// 	all: 'unset',
	// 	display: 'revert',
	// },
	// html: {
	// 	fontSize: '18px',
	// 	fontFamily: "'Open Sans', sans-serif",
	// },
})
