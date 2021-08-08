import Head from 'next/head'
import { AppProps } from 'next/app'
import { GlobalStyles } from 'twin.macro'

import { StoreProvider, useHydratedStore } from '@d-zone/web/src/library/store'

const App = ({ Component, pageProps }: AppProps) => {
	const store = useHydratedStore(pageProps.store || {})

	return (
		<>
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,600;0,800;1,900&family=Open+Sans:wght@400;600&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<GlobalStyles />

			<StoreProvider createStore={() => store}>
				<Component {...pageProps} />
			</StoreProvider>
		</>
	)
}

export default App
