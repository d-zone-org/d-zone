import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from '../../pages/Home'
import NotFound from '../../pages/Not-Found'

const AppStyles: React.CSSProperties = {
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
}

export const ThemeStyles: React.CSSProperties = {}

export const App = () => {
	return (
		<div style={AppStyles} id="app">
			<Router basename="/">
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="*">
						<NotFound />
					</Route>
				</Switch>
			</Router>
		</div>
	)
}
