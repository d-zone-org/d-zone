import * as PIXI from 'pixi.js'
import Resources from './Resources/Resources'
import { Sprite } from '../Engine/components/SpriteComponent'
import { Component } from 'ecs-lib'

// Global PIXI settings
PIXI.settings.RESOLUTION = window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

let app: PIXI.Application
const resources: Resources = new Resources()

// let cubeBaseTexture: PIXI.BaseTexture = PIXI.BaseTexture.from(cubeImage)
// PIXI.BaseTexture.addToCache(cubeBaseTexture, 'cube')
// let cubeTexture = new PIXI.Texture(cubeBaseTexture)

export async function initRenderer(canvas: HTMLCanvasElement) {
	app = new PIXI.Application({
		width: 800,
		height: 600,
		backgroundColor: 0x1d171f,
		view: canvas,
	})

	await resources.load()
}

export function getRenderer(): PIXI.Application {
	return app
}

export function createSprite(spriteComponent: Component<Sprite>): PIXI.Sprite {
	return new PIXI.Sprite(resources.textures[spriteComponent.data.sheet])
}
