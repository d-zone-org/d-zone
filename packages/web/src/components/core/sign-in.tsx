import Image from 'next/image'
import tw, { styled } from 'twin.macro'

import Button from '../ui/button'
import Heading from '../ui/heading'

const BackgroundArt = styled.span`
	font-size: 288px;
	line-height: 76%;
	color: rgba(255, 255, 255, 0.1);
	writing-mode: vertical-rl;

	${tw`
		absolute -right-1/2 -top-1/2
		flex items-center justify-center break-all
		uppercase font-black italic cursor-default`}
`

const SignInContainer = styled.div`
	width: 350px;
	height: 700px;

	background-color: #5865f2;
	box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3);
	border-radius: 20px;

	${tw`
		relative z-30 m-10
		flex flex-col justify-between p-8 pb-10 gap-4
		overflow-hidden`}

	& > ${Button}, ${Heading}, .image {
		${tw`z-50`}
	}

	& > ${BackgroundArt} {
		${tw`z-40`}
	}
`

const Text = styled.p`
	font-family: 'Open Sans', sans-serif;
	font-size: 16px;

	${tw`flex items-center justify-center font-semibold text-white`}
`

const ButtonContainer = tw.div`flex flex-col gap-4`

const SignIn = () => (
	<SignInContainer>
		<Heading>dzone</Heading>

		<Image
			className="image"
			src="/dz-cube.svg"
			height={195}
			width={195}
		></Image>

		<ButtonContainer>
			<Text>Bring your server to life</Text>

			<Button>
				<Image src="/discord-logo-black.svg" height={22} width={30}></Image>
				<p>Sign In With Discord</p>
			</Button>
		</ButtonContainer>

		<BackgroundArt>Sign in with discord</BackgroundArt>
	</SignInContainer>
)

export default styled(SignIn)``
