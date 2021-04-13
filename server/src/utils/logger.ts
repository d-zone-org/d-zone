import { inspect, InspectOptions } from 'util'

export type Loggable =
	| string
	| boolean
	| number
	| undefined
	| null
	| unknown[]
	| Record<string, unknown>

// To keep track of last log
const consoleStack: Logger[] = []

export class Logger {
	constructor(public readonly name: string, private readonly parent?: Logger) {}

	public log(message: Loggable, options: InspectOptions = { depth: 10 }) {
		const [time, timeStr] = this.date()

		this.group()

		const stringifiedMessage =
			typeof message === 'object'
				? inspect(message, options)
				: message !== undefined
				? message.toString()
				: 'undefined'

		console.log(timeStr, 'INFO', stringifiedMessage)

		// Push to stack
		consoleStack.unshift(this)
		return time
	}

	public error(error: Error) {
		const [time, timeStr] = this.date()

		this.group()

		console.error(timeStr, 'ERROR', error)

		// Push to stack
		consoleStack.unshift(this)
		return time
	}

	public getFormattedName(): string {
		if (this.parent) return `${this.parent.getFormattedName()} > ${this.name} `
		else return this.name + ' '
	}

	private date() {
		const time = new Date()
		return [time, time.toLocaleTimeString()]
	}

	private group() {
		if (consoleStack.shift() !== this) {
			console.groupEnd()
			console.group(this.getFormattedName())
		}
	}
}
