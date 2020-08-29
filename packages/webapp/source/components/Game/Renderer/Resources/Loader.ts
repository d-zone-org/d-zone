import * as PIXI from 'pixi.js-legacy'
import spriteConfig from '../../../../art/sprite-config.json'

interface FrameConfig {
	w: number
	h: number
	animation?: boolean
	anchor?: { x: number; y: number }
}

function parseSheet(sheet: any, next: () => void) {
	if (sheet.extension === 'json') {
		sheet.onComplete.once((res: any) => {
			if (!res.data) return
			let animations: any = {}
			for (let frameKey of Object.keys(res.data.frames as any)) {
				let layer = frameKey.split(':')[0]
				let frame = res.data.frames![frameKey as keyof typeof res.data.frames]
				let config: FrameConfig =
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

export function initLoader() {
	loader = new PIXI.Loader()
	loader.add('./img/sprites.json')
	loader.pre(parseSheet)
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
