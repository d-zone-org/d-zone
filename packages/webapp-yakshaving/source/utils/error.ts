interface YakErrorContext {
	isOperational: boolean
	internal: boolean
	[prop: string]: unknown
}

/**
 * Errors thrown by Yakshaving
 */
export class YakError extends Error {
	public readonly name: string
	public readonly context: YakErrorContext

	/**
	 * Throw a new yak error
	 * @param name - Errors name
	 * @param description - Errors description
	 * @param context Error context
	 */
	constructor(name: string, description: string, context: YakErrorContext) {
		super(description)

		Object.setPrototypeOf(this, new.target.prototype)

		this.name = name
		this.context = context

		Error.captureStackTrace(this)
	}
}
