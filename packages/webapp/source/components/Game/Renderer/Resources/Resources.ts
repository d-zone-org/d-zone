import { initLoader, runLoader } from './Loader'

export default class Resources {
	sheet: PIXI.LoaderResource | undefined

	constructor() {
		initLoader()
	}

	async load(): Promise<void> {
		const loader: Partial<Record<
			string,
			PIXI.LoaderResource
		>> = await runLoader()
		Object.keys(loader).forEach((resourceKey) => {
			if (resourceKey === './img/sprites.json') this.sheet = loader[resourceKey]
		})
	}
}
