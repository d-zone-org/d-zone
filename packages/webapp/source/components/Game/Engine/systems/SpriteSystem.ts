import { Attributes, Not, System } from 'ecsy'
import Sprite from '../components/Sprite'
import PixiSprite from '../components/PixiSprite'
import * as PIXI from 'pixi.js-legacy'
import type { Viewport } from 'pixi-viewport'
import type { SpatialHash } from 'pixi-cull'
import type Resources from '../../Renderer/Resources/Resources'
import type Renderer from '../../Renderer/Renderer'

export default class SpriteSystem extends System {
	private resources!: Resources
	private renderer!: Renderer
	private view?: Viewport
	private cull?: SpatialHash
	init(attributes: Attributes): void {
		this.resources = attributes.resources
		this.renderer = attributes.renderer
		this.view = this.renderer.view
		this.cull = this.renderer.cull
	}
	execute(_delta: number, _time: number): void {
		const textures = this.resources.sheet?.textures as PIXI.ITextureDictionary
		const updated = this.queries.updated.changed
		if (updated) {
			for (let i = updated.length - 1; i >= 0; i--) {
				const entity = updated[i]
				const sprite = entity.getComponent(Sprite) as Sprite
				const { value: pixiSprite } = entity.getComponent(
					PixiSprite
				) as PixiSprite
				pixiSprite.setTransform(sprite.x, sprite.y)
				pixiSprite.zIndex = sprite.zIndex
				pixiSprite.texture = textures[sprite.texture]
				pixiSprite.anchor = pixiSprite.texture.defaultAnchor
				this.cull?.updateObject(pixiSprite)
			}
			this.cull?.cull(this.view?.getVisibleBounds())
		}

		const added = this.queries.added.results
		for (let i = added.length - 1; i >= 0; i--) {
			const entity = added[i]
			const sprite = entity.getComponent(Sprite) as Sprite
			const pixiSprite = new PIXI.Sprite(textures[sprite.texture])
			pixiSprite.setTransform(sprite.x, sprite.y)
			pixiSprite.zIndex = sprite.zIndex
			this.view?.addChild(pixiSprite)
			entity.addComponent(PixiSprite, { value: pixiSprite })
		}

		const removed = this.queries.removed.results
		for (let i = removed.length - 1; i >= 0; i--) {
			const entity = removed[i]
			const pixiSprite = entity.getComponent(PixiSprite) as PixiSprite
			this.view?.removeChild(pixiSprite.value)
			pixiSprite.value.destroy()
			entity.removeComponent(PixiSprite)
		}
	}
}
SpriteSystem.queries = {
	added: { components: [Sprite, Not(PixiSprite)] },
	removed: { components: [Not(Sprite), PixiSprite] },
	updated: { components: [Sprite, PixiSprite], listen: { changed: [Sprite] } },
}
