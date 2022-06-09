import WebSocket from 'isomorphic-ws'

import {
	createClient as createURQLClient,
	Provider as URQLProvider,
	dedupExchange,
	cacheExchange,
	subscriptionExchange,
} from 'urql'

import { refocusExchange } from '@urql/exchange-refocus'

import { createClient as createGraphQLWSClient } from 'graphql-ws'

export function GraphQL({
	domain,
	children,
}: {
	domain: string
	children: React.ReactNode
}) {
	const wsClient = createGraphQLWSClient({
		url: `ws://${domain}/graphql`,
		webSocketImpl: WebSocket,
	})

	const client = createURQLClient({
		url: `http://${domain}/graphql`,
		exchanges: [
			dedupExchange,
			refocusExchange(),
			cacheExchange,
			subscriptionExchange({
				enableAllOperations: true,
				forwardSubscription: (operation) => ({
					subscribe: (sink) => ({
						unsubscribe: wsClient.subscribe(operation, sink),
					}),
				}),
			}),
		],
	})

	return <URQLProvider value={client}>{children}</URQLProvider>
}
