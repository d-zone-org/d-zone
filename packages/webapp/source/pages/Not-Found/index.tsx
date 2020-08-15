import React from 'react'

const WrapperStyle: React.CSSProperties = {
	flexGrow: 100,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'center',
	padding: '1em',
}

const HeadingStyle: React.CSSProperties = {
	fontSize: '48pt',
	margin: 0,
	marginBottom: '0.5em',
}

export default () => (
	<div style={WrapperStyle}>
		<h1 style={HeadingStyle}>404 Not Found</h1>
		<img
			src="https://media.giphy.com/media/18hKuycmFuwaQ/giphy.gif"
			alt="cat hides"
		/>
	</div>
)
