import * as PIXI from 'pixi.js-legacy'
import sizes from '../../../../art/sprite-sizes.json'

function parseSheet(sheet: PIXI.LoaderResource, next: () => void) {
	if (sheet.extension === 'json') {
		for (let frameKey of Object.keys(sheet.textures as any)) {
			let layer = frameKey.split(':')[0]
			let texture = sheet.textures![frameKey as keyof typeof sheet.textures]
			let actualSize = sizes[layer as keyof typeof sizes]
			texture.orig.width = actualSize.w
			texture.orig.height = actualSize.h
		}
	}
	next()
}

let loader: PIXI.Loader

export function initLoader() {
	loader = new PIXI.Loader()
	loader.add('./img/sprites.json')
	loader.use(parseSheet)
}

export async function runLoader() {
	return new Promise((resolve, reject) => {
		loader.load((_loader, resources) => {
			Object.keys(resources).forEach((resourceKey) => {
				let resource = resources[resourceKey]
				if (resource && resource.error) reject(resource.error)
			})
			resolve(resources)
		})
	})
}
