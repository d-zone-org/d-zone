import * as PIXI from 'pixi.js-legacy'
import { SPRITE_DEFINITIONS, SPRITE_JSON_PATH } from '../../config/sprite'

function parseSheet(sheet: PIXI.LoaderResource, next: () => void) {
	if (sheet.extension === 'json') {
		// @ts-expect-error "onComplete" event emitter does, in fact, exist
		sheet.onComplete.once((res: PIXI.LoaderResource) => {
			if (!res.data) return
			const animations: Record<string, string[]> = {}
			for (const frameKey of Object.keys(res.data.frames)) {
				const layer = frameKey.split(':')[0]
				const frame = res.data.frames[frameKey as keyof typeof res.data.frames]
				const config = SPRITE_DEFINITIONS[layer]
				frame.sourceSize.w = config.w
				frame.sourceSize.h = config.h
				if (config.anchor) {
					frame.anchor = {
						x: config.anchor.x / config.w, // Normalize to [0,1]
						y: config.anchor.y / config.h,
					}
				}
				if (config.animation) {
					animations[layer] = animations[layer] || []
					animations[layer].push(frameKey)
				}
			}
			sheet.data.animations = animations
		})
	}
	next()
}

let loader: PIXI.Loader

export function initLoader() {
	loader = new PIXI.Loader()
	loader.add(SPRITE_JSON_PATH)
	loader.pre(parseSheet)
}

export async function runLoader(): Promise<
	Partial<Record<string, PIXI.LoaderResource>>
> {
	return new Promise((resolve, reject) => {
		loader.load((_loader, resources) => {
			Object.keys(resources).forEach((resourceKey) => {
				const resource = resources[resourceKey]
				if (resource && resource.error) reject(resource.error)
			})
			resolve(resources)
		})
	})
}
