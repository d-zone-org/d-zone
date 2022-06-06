import { useUserDetailsQuery } from '~/graphql/hooks'

export default function Index() {
	const [user] = useUserDetailsQuery()

	if (user.fetching) return <h1>Loading</h1>
	else if (user.data?.GetSessionUser?.registered)
		return (
			<main>
				<h1>Hey there {user.data.GetSessionUser.username}</h1>
				<a href="/api/oauth/logout">Logout</a>
			</main>
		)
	else if (user.error)
		return (
			<pre>
				<code>{JSON.stringify(user.error, null, 2)}</code>
			</pre>
		)
	else
		return (
			<main>
				<h1>Login</h1>
				<a href="/api/oauth/login?redirect=%2F" target="_self">
					Login with discord
				</a>
				OR
				<a href="/create-account">Create account</a>
			</main>
		)
}
