import { AxiosError } from 'axios'

export class DZoneInternalError extends Error {
	public readonly isOperational: boolean
	public readonly cause?: Error
	public readonly additionalProps: { [additionalProps: string]: unknown }

	constructor({
		message,
		isOperational,
		cause,
		...additionalProps
	}: {
		message: string
		isOperational: boolean
		cause?: Error
		[additionalProps: string]: unknown
	}) {
		super(message)

		Object.setPrototypeOf(this, new.target.prototype)

		this.name = 'DZoneInternalError'
		this.isOperational = isOperational
		this.cause = cause
		this.additionalProps = additionalProps

		if (Error.captureStackTrace) Error.captureStackTrace(this)
	}

	static fromAxiosError(error: AxiosError, isOperational: boolean) {
		const response = {
			body: error.response?.data,
			headers: error.response?.headers,
			status: error.response?.status,
		}

		const request = {
			body: error.config.data,
			headers: error.config.headers,
		}

		return new DZoneInternalError({
			message: 'Axios Error',
			isOperational,
			response,
			request,
			axiosMessage: error.message,
		})
	}
}

export function handleError(error: Error) {
	console.error(error)

	if (error instanceof DZoneInternalError && error.isOperational) return
	else process.exit(1)
}

export function handleAsync<T extends unknown[]>(
	asyncFunction: (...args: T) => Promise<void>
) {
	return (...args: T) => {
		asyncFunction(...(args || [])).catch(handleError)
	}
}
