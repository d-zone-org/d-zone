import tw from 'twin.macro'

import { useStore, StoreState } from '../library/store'

const Heading = tw.h1`text-2xl font-semibold font-sans`

const Home = () => {
	const user = useStore((state) => state.user)

	return <Heading>Hello {user?.username}</Heading>
}

export function getServerSideProps() {
	return {
		props: {
			store: {
				user: {
					id: 'unknown-id',
					username: 'UnknownPerson',
					servers: [],
				},
			} as StoreState,
		},
	}
}

export default Home
