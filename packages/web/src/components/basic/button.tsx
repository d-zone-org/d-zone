import tw, { styled } from 'twin.macro'

const Button = styled.button`
	border-radius: 9px;
	font-family: 'Open Sans', sans-serif;
	box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
	gap: 1ch;

	&:hover {
		box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
	}

	${tw`
		flex flex-row items-center justify-center 
		py-4 px-6
		border-none bg-white
		text-black font-normal`}
`

export default Button
