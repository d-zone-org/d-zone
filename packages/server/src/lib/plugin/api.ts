import { RequestListener } from 'http'
import { AbstractDatabasePlugin } from './database'

export abstract class AbstractAPIPlugin {
	abstract init(database: AbstractDatabasePlugin): Promise<RequestListener>
}
