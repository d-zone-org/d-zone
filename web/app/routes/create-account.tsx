import { useEffect, useState } from 'react'
import {
	UserDetailsQuery,
	useCreateAccountMutation,
	useUserDetailsQuery,
} from '~/graphql/hooks'

type User = Exclude<UserDetailsQuery['GetSessionUser'], null | undefined>

function Loading() {
	return (
		<main>
			<h1>Loading</h1>
		</main>
	)
}

function LogIn() {
	return (
		<main>
			<h1>Join DZone</h1>
			<a href="/api/oauth/login?redirect=%2Fcreate-account" target="_self">
				continue with discord
			</a>
		</main>
	)
}

function Continue({ user }: { user: User }) {
	const [mutation, createAccount] = useCreateAccountMutation()

	return (
		<main>
			{mutation.error && (
				<code>
					<pre>{JSON.stringify(mutation.error, null, 2)}</pre>
				</code>
			)}
			{mutation.data && <h1>Created account</h1>}
			{mutation.fetching && <h1>Creating account</h1>}
			{!mutation.data && (
				<>
					<h1>Use this account?</h1>
					<button onClick={() => createAccount()}>
						Continue as {user.username}
					</button>
					<a href="/api/oauth/login?redirect=%2Fcreate-account" target="_self">
						use another account
					</a>
				</>
			)}
		</main>
	)
}

export default function CreateAccount() {
	enum Status {
		NO_DETAILS,
		FETCHING_DETAILS,
		FETCHED_DETAILS,
	}

	const [query] = useUserDetailsQuery()
	const [status, setStatus] = useState<Status>(Status.FETCHING_DETAILS)
	const user = query.data?.GetSessionUser

	useEffect(() => {
		if (query.data?.GetSessionUser) setStatus(Status.FETCHED_DETAILS)
		else setStatus(Status.NO_DETAILS)
	}, [query])

	if (user?.registered) location.pathname = '/'

	return (
		<>
			{status === Status.FETCHING_DETAILS && <Loading />}
			{status === Status.NO_DETAILS && <LogIn />}
			{status === Status.FETCHED_DETAILS && <Continue user={user!} />}
		</>
	)
}
