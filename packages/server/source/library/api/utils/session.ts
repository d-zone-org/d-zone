import Koa, { DefaultContext, DefaultState, Middleware } from 'koa'
import session, { Session } from 'koa-session'

interface DZoneSession extends Session {
	userId?: string
}

export interface DZoneContext extends DefaultContext {
	session: DZoneSession
}

export type SessionMiddleware = Middleware<DefaultState, DZoneContext>

export function withSession<State = DefaultState, Context = DefaultContext>(
	koa: Koa<State, Context>
) {
	return koa.use(
		session(
			{ maxAge: 1000 * 60 * 15, rolling: true },
			koa as unknown as Koa<DefaultState, DefaultContext>
		) as SessionMiddleware
	)
}
