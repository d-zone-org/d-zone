import { RequestListener } from 'http'
import { DatabasePluginInterface } from './database'

export abstract class AbstractAPIPlugin {
	abstract init(database: DatabasePluginInterface): Promise<RequestListener>
}
