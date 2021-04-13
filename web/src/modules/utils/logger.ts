import { TinyColor } from '@ctrl/tinycolor'

export class BrowserLogger {
	successfulColorRGB = getSuccessfulColor()

	constructor(public readonly name: string) {}

	public log(...message: unknown[]) {
		console.log(
			`%c${this.name}`,
			`background-color: ${this.successfulColorRGB.toRgbString()}; padding: 5px 10px;`,
			...message
		)
	}

	public warn(...message: unknown[]) {
		console.warn(
			`%c${this.name}`,
			'background-color: rgba(242, 146, 29, 0.3); padding: 5px 10px;',
			...message
		)
	}

	public error(error: Error) {
		console.error(
			`%c${this.name}`,
			'background-color: rgba(242, 29, 29, 0.3); padding: 5px 10px;',
			error
		)
	}
}

let hueOffset = 0

function getSuccessfulColor() {
	const newColor = new TinyColor({
		h: 80 + hueOffset + Math.random() * 8,
		s: 80 + Math.random() * 20,
		v: 80 + Math.random() * 20,
		a: 0.4,
	})
	hueOffset = (hueOffset + 24) % 108
	return newColor
}
