import { initLoader, runLoader } from './Loader'

export default class Resources {
	resources: any
	textures: any = {}

	constructor() {
		initLoader()
	}

	async load() {
		this.resources = await runLoader()
		Object.keys(this.resources).forEach((resourceKey) => {
			this.textures[resourceKey] = this.resources[resourceKey]
			let baseTexture: PIXI.BaseTexture = PIXI.BaseTexture.from(
				this.resources[resourceKey].data
			)
			this.textures[resourceKey] = new PIXI.Texture(baseTexture)
		})
	}
}
