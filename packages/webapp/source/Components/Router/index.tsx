import React, { FC, ReactNode, useState, useEffect } from 'react'
import regexparam from 'regexparam'

export interface RouterProps {
	routes: { path: string; component: () => Promise<{ default: ReactNode }> }[]
}

const parsedRoutes: {
	pattern: RegExp
	paramKeys: string[]
	cachedComponent?: ReactNode
	componentImportFn: () => Promise<{ default: ReactNode }>
}[] = []

export const Router: FC<RouterProps> = ({ routes }) => {
	const [currentCommponent, updateComponent] = useState<ReactNode>(undefined)
	const [_, updateState] = useState<
		'Loading' | 'Not Found' | 'Loaded' | 'Error'
	>('Loading')

	// On intial render, parse the paths
	useEffect(() => {
		for (const { path, component } of routes) {
			const { pattern, keys } = regexparam(path)
			parsedRoutes.push({
				pattern,
				paramKeys: keys,
				componentImportFn: component,
			})
		}
	}, [])

	// Everytime path changes or parsed routes array changes
	useEffect(() => {
		updateState('Loading')

		const idx = parsedRoutes.findIndex(({ pattern }) =>
			pattern.test(location.pathname)
		)
		if (idx <= -1) return updateState('Not Found')

		const { cachedComponent, componentImportFn } = parsedRoutes[idx]

		if (cachedComponent) return updateComponent(cachedComponent)
		else
			componentImportFn()
				.then((c) => {
					parsedRoutes[idx].cachedComponent = c.default
					updateComponent(c.default)
					updateState('Loaded')
				})
				.catch((err) => {
					console.error(err)
					updateState('Error')
				})
	}, [location.pathname, parsedRoutes.length])

	return <>{currentCommponent}</>
}
