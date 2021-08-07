import axios from 'axios'

import {
	OAuth2Routes,
	OAuth2Scopes,
	RESTGetAPIUserResult,
	RESTPostOAuth2AccessTokenResult,
	RouteBases,
	Routes,
} from 'discord-api-types/v9'

import { URL, URLSearchParams } from 'url'

import { DZoneInternalError } from './error'

/**
 * Generates the discord redirect url
 *
 * @param clientId - Application client id
 * @param callbackUrl - Application callback url
 * @returns Url as string
 */
export function generateDiscordRedirectUrl(
	clientId: string,
	callbackUrl: string
) {
	const url = new URL(OAuth2Routes.authorizationURL)

	const params = {
		client_id: clientId,
		redirect_uri: callbackUrl,
		response_type: 'code',
		scope: `${OAuth2Scopes.Identify} ${OAuth2Scopes.Guilds}`,
		prompt: 'none',
	}

	for (const key in params)
		url.searchParams.set(key, params[key as keyof typeof params])

	return url.toString()
}

/**
 * Requests a new user token
 *
 * @param options - Discord token request options
 * @returns Token
 */
export async function requestDiscordToken(options: {
	code: string
	clientId: string
	clientSecret: string
	redirectUri: string
}) {
	const body = new URLSearchParams({
		code: options.code,
		client_id: options.clientId,
		client_secret: options.clientSecret,
		grant_type: 'authorization_code',
		redirect_uri: options.redirectUri,
	})

	return axios
		.post<RESTPostOAuth2AccessTokenResult>(OAuth2Routes.tokenURL, body)
		.then((res) => res.data.access_token)
		.catch((error) => {
			throw DZoneInternalError.fromAxiosError(error, true)
		})
}

/**
 * Get the user
 *
 * @param token - Token of user
 * @returns User
 */
export function getUser(token: string) {
	return axios
		.get<RESTGetAPIUserResult>(RouteBases.api + Routes.user(), {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res.data)
		.catch((error) => {
			throw DZoneInternalError.fromAxiosError(error, true)
		})
}
