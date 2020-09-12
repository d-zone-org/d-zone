import * as PIXI from 'pixi.js-legacy'
import spriteConfig from '../../../../art/sprite-config.json'

interface FrameConfig {
	w: number
	h: number
	animation?: boolean
	anchor?: { x: number; y: number }
}

interface LoaderResource extends PIXI.LoaderResource {
	// I don't know why ts thinks this property doesn't exist
	onComplete: {
		once: (process: (res: PIXI.LoaderResource) => void) => void
	}
}

function parseSheet(sheet: LoaderResource, next: () => void) {
	console.log(sheet)
	if (sheet.extension === 'json') {
		sheet.onComplete.once((res: PIXI.LoaderResource) => {
			if (!res.data) return
			const animations: Record<string, string[]> = {}
			for (const frameKey of Object.keys(res.data.frames as string[])) {
				const layer = frameKey.split(':')[0]
				const frame = res.data.frames[frameKey as keyof typeof res.data.frames]
				const config: FrameConfig =
					spriteConfig.frames[layer as keyof typeof spriteConfig.frames]
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

export function initLoader(): void {
	loader = new PIXI.Loader()
	loader.add('./img/sprites.json')
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
