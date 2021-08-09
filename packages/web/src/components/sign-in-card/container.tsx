import { ReactNode } from 'react'
import tw, { styled } from 'twin.macro'

const Container = styled.div`
	width: 350px;
	height: 700px;

	background-color: #5865f2;
	box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3);
	border-radius: 20px;

	${tw`
		relative m-10
		flex flex-col justify-between p-8 pb-10 gap-4
		overflow-hidden`}
`
const BackgroundArt = styled.span`
	font-size: 288px;
	line-height: 76%;
	color: rgba(255, 255, 255, 0.1);
	writing-mode: vertical-rl;

	${tw`
		absolute -right-1/2 -top-1/2
		flex items-center justify-center break-all
		uppercase font-black italic cursor-default
		z-0`}
`

const SignInContainer = ({
	className,
	children,
}: {
	className?: string
	children: ReactNode
}) => (
	<Container className={className}>
		{children}

		<BackgroundArt>Sign in with discord</BackgroundArt>
	</Container>
)

export default SignInContainer
