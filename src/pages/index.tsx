import Head from 'next/head'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

const Layout = styled.div`
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Title = styled.h1`
	font-size: 4em;
	font-family: sans-serif;
`

const Game = dynamic(() => import('web/components/complex/game'), {
	ssr: false,
})

export default function Home() {
	return (
		<>
			<Head>
				<title>D-Zone</title>
			</Head>

			<Layout>
				{' '}
				<Title>Hey there!</Title>
				<Game></Game>
			</Layout>
		</>
	)
}
