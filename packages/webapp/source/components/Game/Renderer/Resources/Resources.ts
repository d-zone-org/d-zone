import { initLoader, runLoader } from './Loader'

export default class Resources {
	sheet: any = {}

	constructor() {
		initLoader()
	}

	async load() {
		let loader: any = await runLoader()
		Object.keys(loader).forEach((resourceKey) => {
			if (resourceKey === './img/sprites.json') this.sheet = loader[resourceKey]
		})
	}
}
