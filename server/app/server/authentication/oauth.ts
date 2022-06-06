import Axios from 'axios'
import { z } from 'zod'
import { AuthorizationCode } from 'simple-oauth2'
import * as Discord from 'discord-api-types/v10'

import { configuration } from '$/config'

const tokenURL = new URL(Discord.OAuth2Routes.tokenURL)
const authorizeURL = new URL(Discord.OAuth2Routes.authorizationURL)
const revokeURL = new URL(Discord.OAuth2Routes.tokenRevocationURL)

const SCOPES = [Discord.OAuth2Scopes.Identify]
const redirectURL = configuration.get('discord.redirectPath')

const client = new AuthorizationCode({
	auth: {
		tokenHost: tokenURL.origin,
		tokenPath: tokenURL.pathname,
		authorizeHost: authorizeURL.origin,
		authorizePath: authorizeURL.pathname,
		revokePath: revokeURL.pathname,
	},

	client: {
		id: configuration.get('discord.id'),
		secret: configuration.get('discord.secret'),
	},
})

export interface User {
	id: string
	username: string
	discriminator: string
	avatar: string
	accentColor?: number
}

export function getAuthRedirectURL(state: string) {
	return client.authorizeURL({
		state,
		scope: SCOPES,
		redirect_uri: redirectURL,
	})
}

export async function getUser(code: string) {
	const { token } = await client.getToken({
		code,
		scope: SCOPES,
		redirect_uri: configuration.get('discord.redirectPath'),
	})

	const axios = Axios.create({
		baseURL: Discord.RouteBases.api,
		headers: { Authorization: `${token.token_type} ${token.access_token}` },
		validateStatus: (status) => status === 200,
	})

	const schema = z.object({
		id: z.string(),
		username: z.string(),
		avatar: z.string(),
		discriminator: z.string(),
		accent_color: z.number().optional(),
	})

	return await axios
		.get<Discord.RESTGetAPICurrentUserResult>(Discord.Routes.user())
		.then((response) => schema.parseAsync(response.data))
		.then(({ accent_color, ...user }) => ({
			...user,
			accentColor: accent_color,
		}))
}
