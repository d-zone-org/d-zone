import http from 'http'

import c from 'cookie'
import koa from 'koa'
import { nanoid } from 'nanoid'
import type { Jsonify } from 'type-fest'

import type { PrismaClient } from '$/database'
import type { User } from './authentication/oauth'

export interface Session {
	redirect?: string
	user?: User
	state?: string
}

export interface SessionOptions {
	prisma: PrismaClient
}

const MAX_AGE = 1000 * 60 * 2

export function sessionHandler({ prisma }: SessionOptions) {
	return (
		request: http.IncomingMessage,
		responseCookies?: koa.Context['cookies']
	) => {
		const cookies = c.parse(request.headers.cookie || '')

		const id = 'dzId' in cookies ? cookies.dzId : nanoid()

		return {
			async get() {
				await prisma.session.deleteMany({
					where: { expires: { lte: new Date() } },
				})

				const session = await prisma.session.findUnique({ where: { id } })
				if (!session) return {}

				const data = session.data as Session
				const expires = new Date(Date.now() + MAX_AGE)
				await prisma.session.update({ where: { id }, data: { expires } })
				return data
			},

			async set(data: Jsonify<Session>) {
				const expires = new Date(Date.now() + MAX_AGE)
				const session = await prisma.session.upsert({
					where: { id },
					create: { id, data, expires },
					update: { id, data, expires },
				})

				responseCookies?.set('dzId', id, {
					httpOnly: true,
					maxAge: MAX_AGE,
					sameSite: 'lax',
				})

				const updatedData = session.data as Session
				return updatedData
			},
		}
	}
}
