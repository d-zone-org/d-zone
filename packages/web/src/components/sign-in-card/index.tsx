import tw, { styled } from 'twin.macro'
import Image from 'next/image'

import Heading from '../basic/heading'
import Container from './container'
import Button from './button'

const Text = styled.p`
	font-family: 'Open Sans', sans-serif;
	font-size: 16px;

	${tw`flex items-center justify-center font-semibold text-white`}
`

const ButtonContainer = tw.div`flex flex-col gap-4`

const SignIn = ({ className }: { className?: string }) => (
	<Container tw="z-10" className={className}>
		<Heading tw="z-20">dzone</Heading>

		<Image tw="z-20" src="/dzcube.svg" height={200} width={200}></Image>

		<ButtonContainer tw="z-20">
			<Text>Bring your server to life</Text>
			<Button>Sign In With Discord</Button>
		</ButtonContainer>
	</Container>
)

export default styled(SignIn)``
