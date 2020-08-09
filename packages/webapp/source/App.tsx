import React from 'react'
import { Router } from './Components/Router'

export default () => (
	<Router
		routes={[
			{ path: '/', component: () => import('./Pages/Home') },
			{ path: '/home', component: () => import('./Pages/Home') },
			{ path: '*', component: () => import('./Pages/404') },
		]}
	/>
)
