import Koa, { DefaultContext, DefaultState } from 'koa'
import { Session } from 'koa-session'
import { APIUser } from 'discord-api-types'
import { Logger } from 'tslog'

interface DZoneSession extends Session {
	user?: APIUser
}

export interface DZoneContext extends DefaultContext {
	session: DZoneSession
	logger: Logger
}

export type Server = Koa<DefaultState, DZoneContext>
