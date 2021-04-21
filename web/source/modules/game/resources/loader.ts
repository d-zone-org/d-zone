import * as PIXI from 'pixi.js-legacy'
import { SPRITE_DEFINITIONS, SPRITE_JSON_PATH } from '../config/sprite'

/**
 * Parses resources loaded into PIXI.
 *
 * @param sheet - The sprite sheet being parsed.
 * @param next - The method called when parsing of the current sheet is complete.
 */
function parseSheet(sheet: PIXI.LoaderResource, next: () => void) {
	if (sheet.extension === 'json') {
		// @ts-expect-error "onComplete" event emitter does, in fact, exist
		sheet.onComplete.once((res: PIXI.LoaderResource) => {
			if (!res.data) return
			const animations: Record<string, string[]> = {}
			for (const frameKey of Object.keys(res.data.frames)) {
				const layer = frameKey.split(':')[0]
				const frame = res.data.frames[frameKey as keyof typeof res.data.frames]
				// There is extra data about our sprites that is not included in the generated sprite export file.
				const config = SPRITE_DEFINITIONS[layer]
				frame.sourceSize.w = config.w
				frame.sourceSize.h = config.h
				// The anchor is the center point of the sprite. This is necessary when sprites transition to a texture with a different size, such as an actor changing to a hop texture.
				if (config.anchor) {
					frame.anchor = {
						x: config.anchor.x / config.w, // Normalize to [0,1]
						y: config.anchor.y / config.h,
					}
				}
				// Some sprites are part of animations, and we need to tell PIXI about them.
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

/** Initializes a PIXI loader instance and adds resources and parsers to it. */
export function initLoader() {
	loader = new PIXI.Loader()
	loader.add(SPRITE_JSON_PATH)
	loader.pre(parseSheet)
}

/**
 * Loads and parses the resources as set up by [[initLoader]].
 *
 * @returns - A promise that resolves when all resources have been loaded and parsed.
 */
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
