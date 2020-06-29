import { RequestListener } from 'http'
import { DatabasePluginInterface } from './database'

export type APIPluginClass = new (
	database: DatabasePluginInterface
) => APIPluginInterface

export interface APIPluginInterface {
	getRequestListener: () => RequestListener
}
