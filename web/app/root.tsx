import { json, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'

import { GraphQL } from '~/graphql/provider'
import { globalStyles } from '~/stitches.config'

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'd-zone',
	viewport: 'width=device-width,initial-scale=1',
})

interface Configuration {
	domain: string
}

export async function loader() {
	return json<Configuration>({
		domain: 'localhost:5000',
	})
}

export default function App() {
	const data = useLoaderData<Configuration>()

	globalStyles()

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
				{typeof document === 'undefined' ? '__STYLES__' : null}
			</head>
			<body>
				<GraphQL domain={data.domain}>
					<Outlet></Outlet>
				</GraphQL>

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
