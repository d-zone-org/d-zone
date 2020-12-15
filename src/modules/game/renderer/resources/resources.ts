import { initLoader, runLoader } from './loader'
import { IResources, Sheet } from '../../typings'
import { LoaderResource } from 'pixi.js-legacy'
import { SPRITE_JSON_PATH } from '../../config/sprite'

export default class Resources implements IResources {
	sheet!: Sheet

	constructor() {
		initLoader()
	}

	async load() {
		const loader: Partial<Record<string, LoaderResource>> = await runLoader()
		Object.keys(loader).forEach((resourceKey) => {
			if (resourceKey === SPRITE_JSON_PATH)
				this.sheet = loader[resourceKey] as Sheet
		})
	}
}
