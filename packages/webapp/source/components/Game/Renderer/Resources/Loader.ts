import * as PIXI from 'pixi.js-legacy'
import sheet from './Sprites'

console.log(sheet.meta.app)

let loader: PIXI.Loader

export function initLoader() {
	loader = new PIXI.Loader()
	loader.add('cube', './img/cube.png')
	loader.add('./img/sprites.json')
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
