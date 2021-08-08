import styled from 'styled-components'
import tw from 'twin.macro'

import { useStore } from '../library/store'

import SignIn from '../components/core/sign-in'
import Page from '../components/ui/page'

const SignInSection = styled.section`
	${tw`h-screen w-screen flex flex-row items-center justify-around`}
`

const Demo = styled.div`
	width: 60vw;
	height: 70vh;
`

const Home = () => {
	const state = useStore((state) => state)

	if (!state.user)
		return (
			<Page>
				<SignInSection>
					<Demo></Demo>
					<SignIn></SignIn>
				</SignInSection>
			</Page>
		)

	return <Page>Hey {state.user?.username}</Page>
}

export default Home
