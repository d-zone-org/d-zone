import * as PIXI from 'pixi.js-legacy'
import sizes from '../../../../art/sprite-sizes.json'

function parseSheet(sheet: PIXI.LoaderResource, next: () => void) {
	if (sheet.extension === 'json') {
		let frames = sheet.data.frames
		for (let frameKey of Object.keys(frames)) {
			let layer = frameKey.split(':')[0]
			let frame = frames[frameKey as keyof typeof frames]
			frame.sourceSize = sizes[layer as keyof typeof sizes]
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
