import { initLoader, runLoader } from './loader'
import { Animations, IResources } from '../../typings'

export default class Resources implements IResources {
	sheet!: { spritesheet: { animations: Animations } }

	constructor() {
		initLoader()
	}

	async load() {
		const loader: any = await runLoader()
		Object.keys(loader).forEach((resourceKey) => {
			if (resourceKey === './img/sprites.json') this.sheet = loader[resourceKey]
		})
	}
}
