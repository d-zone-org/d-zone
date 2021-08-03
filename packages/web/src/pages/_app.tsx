import { AppProps } from 'next/app'
import { GlobalStyles } from 'twin.macro'

import { StoreProvider, useHydratedStore } from '@d-zone/web/src/library/store'

const App = ({ Component, pageProps }: AppProps) => {
	const store = useHydratedStore(pageProps.store || {})

	return (
		<>
			<GlobalStyles />

			<StoreProvider createStore={() => store}>
				<Component {...pageProps} />
			</StoreProvider>
		</>
	)
}

export default App
