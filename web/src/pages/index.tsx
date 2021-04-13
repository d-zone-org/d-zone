import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const Game = dynamic(() => import('root/components/game'), {
	ssr: false,
})

/**
 * Home page
 *
 * @returns Page
 */
export default function Home() {
	return (
		<>
			<Head>
				<title>D-Zone</title>
			</Head>

			<div>
				<h1>Hey there</h1>
				<Game />
			</div>
		</>
	)
}
