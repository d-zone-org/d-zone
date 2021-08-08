import { ReactNode } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

const BasePage = tw.div`w-screen min-h-screen bg-white flex flex-col`

const BackgroundArt = styled.span`
	font-size: 500px;
	line-height: 400px;
	font-family: Montserrat, sans-serif;
	color: rgba(128, 138, 255, 0.1);

	${tw`
    uppercase cursor-default
    h-screen w-screen
    fixed left-0 bottom-0 transform -rotate-12
    flex items-center content-center
    font-extrabold break-all`}
`

const Brand = styled.h3`
	font-family: Montserrat, sans-serif;
	font-size: 24px;

	${tw`font-semibold pt-4 pl-6 left-0 top-0 fixed cursor-default`}
`

const Page = ({ children }: { children: ReactNode }) => (
	<BasePage>
		{children}

		<BackgroundArt>dzone is really good</BackgroundArt>
		<Brand>DZone</Brand>
	</BasePage>
)

export default styled(Page)``
