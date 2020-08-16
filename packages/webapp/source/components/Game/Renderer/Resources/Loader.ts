import * as PIXI from 'pixi.js-legacy'

let loader: PIXI.Loader

export function initLoader() {
	loader = new PIXI.Loader()
	loader.add('cube', './img/cube.png')
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
