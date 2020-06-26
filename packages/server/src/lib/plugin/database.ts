export abstract class AbstractDatabasePlugin {
	abstract init(): Promise<void>

	abstract guilds: AbstractDocumentManager<GuildSchema>
	abstract users: AbstractDocumentManager<UserSchema>
}

export abstract class AbstractDocumentManager<DocumentSchema> {

	abstract getById(id: string): Promise<DocumentSchema>

	abstract updateById(
		id: string,
		doc: Partial<DocumentSchema>
	): Promise<DocumentSchema>

	abstract deleteById(id: string): Promise<DocumentSchema>
}

export interface GuildSchema {
	id: string
}

export interface UserSchema {
	id: string
}
