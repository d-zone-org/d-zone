export type DatabasePluginClass<Options> = new (
	options: Options
) => DatabasePluginInterface

export interface DatabasePluginInterface {
	guilds: DatabaseDocumentManager<GuildSchema>
	users: DatabaseDocumentManager<UserSchema>
}

export interface DatabaseDocumentManager<DocumentSchema> {
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
