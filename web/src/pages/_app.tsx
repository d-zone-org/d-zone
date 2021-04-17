import React from 'react'
import { AppProps } from 'next/app'

// eslint-disable-next-line jsdoc/require-jsdoc
export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}
