/**
 * Handle errors throughout App
 *
 * @param error - Error
 */
export function handleError(error: Error) {
	console.error(error)

	if (error instanceof AppError && error.isOperational) return
	else process.exit(1)
}

/**
 * Wrap error-able async functions
 *
 * @param asyncFn - Function to be wrapped
 * @returns Error safe function proxy
 */
export function handleErrorProneFn<
	A extends unknown[],
	T extends (...args: A) => Promise<unknown>
>(asyncFn: T) {
	return (...args: A): void => {
		asyncFn(...args).catch(handleError)
	}
}

/**
 * App Error - Used for representing internal errors
 *
 * @see {@link https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md}
 */
export class AppError extends Error {
	public readonly name: string
	public readonly isOperational: boolean
	public readonly cause?: Error

	constructor(
		name: string,
		description: string,
		isOperational: boolean,
		cause?: Error
	) {
		super(description)

		Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

		this.name = name
		this.isOperational = isOperational
		this.cause = cause

		// Works only on V8
		Error.captureStackTrace(this)
	}
}
