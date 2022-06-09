import http from 'http'

import koa from 'koa'
import Router from '@koa/router'
import { z } from 'zod'
import { nanoid } from 'nanoid'

import { PrismaClient } from '$/database'
import { sessionHandler } from '$/server/session'
import { getAuthRedirectURL, getUser } from './oauth'

export function startAuthenticationServer(
	http: http.Server,
	prisma: PrismaClient
) {
	const server = new koa()
	const router = new Router()
	const getSession = sessionHandler({ prisma })

	router.get('/api/oauth/login', async function login(context) {
		const session = await getSession(context.req, context.cookies)
		const initialSession = await session.get()

		const querySchema = z.union([
			z.object({
				code: z.string(),
				state: z.literal(initialSession.state),
			}),

			z.object({
				redirect: z.string().optional(),
			}),
		])

		const query = await querySchema.parseAsync(context.query)

		// Fetch user and initiate session
		if ('code' in query) {
			const user = await getUser(query.code)
			const redirect = initialSession.redirect || '/'
			await session.set({ user })
			context.redirect(redirect)
		}

		// Redirect user to discord authorization page
		else {
			const state = nanoid()
			await session.set({ state, redirect: query.redirect })
			context.redirect(getAuthRedirectURL(state))
		}
	})

	router.get('/api/oauth/logout', async function logout(context) {
		const session = await getSession(context.req, context.cookies)
		await session.set({})
		context.redirect('/')
	})

	server.use(router.routes())
	server.use(router.allowedMethods())

	http.addListener('request', server.callback())
}
