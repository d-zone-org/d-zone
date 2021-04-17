import { initLoader, runLoader } from './loader'
import { Animations, IResources, Sheet } from '../typings'
import { LoaderResource } from 'pixi.js-legacy'
import { SPRITE_JSON_PATH } from '../config/sprite'
<<<<<<< HEAD:web/src/modules/game/resources/index.ts
import { buildAnimations } from 'web/modules/game/resources/animations'
=======
import { buildAnimations } from 'root/modules/game/resources/animations'
>>>>>>> feat/comms:src/modules/game/renderer/resources/resources.ts

/** A manager for sprite-related resources. */
export default class Resources implements IResources {
	sheet!: Sheet
	animations!: Animations

	constructor() {
		initLoader()
	}

	async load() {
		const loader: Partial<Record<string, LoaderResource>> = await runLoader()
		Object.keys(loader).forEach((resourceKey) => {
			if (resourceKey === SPRITE_JSON_PATH) {
				this.sheet = loader[resourceKey] as Sheet
				this.animations = buildAnimations(this.sheet.spritesheet.animations)
			}
		})
	}
}
