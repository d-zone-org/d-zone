import React from 'react'
import { Router, RouterRoutes } from '../Router'

const AppStyles: React.CSSProperties = {
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
}

export const ThemeStyles: React.CSSProperties = {}

export const App = () => {
	const routes: RouterRoutes = [
		{ path: '/', component: () => import('../../pages/Home') },
		{ path: '*', component: () => import('../../pages/Not-Found') },
	]

	return (
		<div style={AppStyles} id="app">
			<Router routes={routes}></Router>
		</div>
	)
}
