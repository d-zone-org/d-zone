import React from 'react'
import regexparam from 'regexparam'

export type ComponentImportFn = () => Promise<{ default: React.ReactNode }>

export interface RouterProps {
	routes: { path: string; component: ComponentImportFn }[]
}

export type RouterRoutes = RouterProps['routes']

const parsedRoutes: {
	pattern: RegExp
	paramKeys: string[]
	cachedComponent?: React.ReactNode
	componentImportFn: ComponentImportFn
}[] = []

export const Router: React.FC<RouterProps> = ({ routes }) => {
	const [currentCommponent, updateComponent] = React.useState<React.ReactNode>(
		undefined
	)
	const [state, updateState] = React.useState<
		'Loading' | 'Not Found' | 'Loaded' | 'Error'
	>('Loading')

	// On intial render, parse the paths
	React.useEffect(() => {
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
	React.useEffect(() => {
		updateState('Loading')

		const idx = parsedRoutes.findIndex(({ pattern }) =>
			pattern.test(location.pathname)
		)
		if (idx <= -1) return updateState('Not Found')

		const { cachedComponent, componentImportFn } = parsedRoutes[idx]

		// Only on initial load component is actually imported
		// After that the component is cached
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

	React.useEffect(() => console.log(`Router State - ${state}`), [state])

	return <>{currentCommponent}</>
}
