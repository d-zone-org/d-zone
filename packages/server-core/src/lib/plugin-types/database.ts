export type DatabasePluginClass<Options> = new (
	options: Options
) => DatabasePluginInterface

export interface DatabasePluginInterface {
	guilds: DocumentManager<GuildSchema>
	users: DocumentManager<UserSchema>
}

export interface DocumentManager<DocumentSchema> {
	getById(id: string): Promise<DocumentSchema>
	updateById(id: string, doc: Partial<DocumentSchema>): Promise<DocumentSchema>
	deleteById(id: string): Promise<DocumentSchema>
}

export interface GuildSchema {
	id: string
}

export interface UserSchema {
	id: string
}
