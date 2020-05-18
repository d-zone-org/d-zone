import * as PIXI from 'pixi.js'
import Resources from './Resources/Resources'
import { Sprite } from '../Engine/components/SpriteComponent'
import { Component } from 'ecs-lib'

// Global PIXI settings
PIXI.settings.RESOLUTION = window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

// let cubeBaseTexture: PIXI.BaseTexture = PIXI.BaseTexture.from(cubeImage)
// PIXI.BaseTexture.addToCache(cubeBaseTexture, 'cube')
// let cubeTexture = new PIXI.Texture(cubeBaseTexture)

export default class Renderer {
	app: PIXI.Application
	resources: Resources
	constructor(canvas: HTMLCanvasElement) {
		this.app = new PIXI.Application({
			width: 800,
			height: 600,
			backgroundColor: 0x1d171f,
			view: canvas,
		})
		this.app.stage.sortableChildren = true
		this.resources = new Resources()
	}

	async load() {
		await this.resources.load()
	}

	pushSpritesToRenderer({
		added,
		changed,
		removed,
	}: Record<string, Component<Sprite>[]>): void {
		for (let add of added) {
			let sprite = this.createPixiSprite(add)
			add.attr.pixiSprite = sprite
			this.updatePixiSpriteFromComponent(add)
			this.app.stage.addChild(sprite)
		}
		for (let change of changed) {
			this.updatePixiSpriteFromComponent(change)
		}
		for (let remove of removed) {
			this.app.stage.removeChild(remove.attr.pixiSprite)
			remove.attr.pixiSprite.destroy()
		}
	}

	updatePixiSpriteFromComponent(component: Component<Sprite>) {
		let { x, y, zIndex } = component.data
		component.attr.pixiSprite.setTransform(x, y)
		component.attr.pixiSprite.zIndex = zIndex
	}

	createPixiSprite(spriteComponent: Component<Sprite>): PIXI.Sprite {
		return new PIXI.Sprite(this.resources.textures[spriteComponent.data.sheet])
	}
}
