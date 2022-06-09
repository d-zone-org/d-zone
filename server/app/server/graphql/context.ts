import { Client } from 'eris'
import { PrismaClient } from '@d-zone/server/.gen/prisma'
import { Session } from '$/server/session'

export interface Context {
	prisma: PrismaClient
	client: Client
	session: Session
}
