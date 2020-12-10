import { initLoader, runLoader } from './loader'
import { IResources, Sheet } from '../../typings'
import { LoaderResource } from 'pixi.js-legacy'

export default class Resources implements IResources {
	sheet!: Sheet

	constructor() {
		initLoader()
	}

	async load() {
		const loader: Partial<Record<string, LoaderResource>> = await runLoader()
		Object.keys(loader).forEach((resourceKey) => {
			if (resourceKey === './img/sprites.json')
				this.sheet = loader[resourceKey] as Sheet
		})
	}
}
