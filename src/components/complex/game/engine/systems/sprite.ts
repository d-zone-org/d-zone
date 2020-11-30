import { Query, System } from 'ape-ecs'
import Sprite from '../components/sprite'
import PixiSprite from '../components/pixi-sprite'
import * as PIXI from 'pixi.js-legacy'

export default class SpriteSystem extends System {
	private resources: any
	private renderer: any
	private textures: any
	private view: any
	private cull: any
	private spriteQuery!: Query
	init(resources: any, renderer: any) {
		this.resources = resources
		this.textures = this.resources.sheet.textures
		this.renderer = renderer
		this.view = this.renderer.view
		this.cull = this.renderer.cull
		this.spriteQuery = this.createQuery().fromAll(Sprite).persist(true, true)
	}
	update(tick: number) {
		const updatedSprites = this.spriteQuery.execute({ updatedValues: tick })
		updatedSprites.forEach((entity) => {
			let sprite = entity.c.sprite
			let { sprite: pixiSprite } = entity.c.pixiSprite
			pixiSprite.setTransform(sprite.x, sprite.y)
			pixiSprite.zIndex = sprite.zIndex
			pixiSprite.texture = this.textures[sprite.texture]
			pixiSprite.anchor = pixiSprite.texture.defaultAnchor
			this.cull.updateObject(pixiSprite)
		})
		if (updatedSprites.size > 0) {
			this.cull.cull(this.view.getVisibleBounds())
		}

		this.spriteQuery.added.forEach((entity) => {
			let sprite = entity.c.sprite
			let pixiSprite = new PIXI.Sprite(
				this.resources.sheet.textures[sprite.texture]
			)
			pixiSprite.setTransform(sprite.x, sprite.y)
			pixiSprite.zIndex = sprite.zIndex
			this.view.addChild(pixiSprite)
			entity.addComponent({
				type: PixiSprite,
				key: 'pixiSprite',
				sprite: pixiSprite,
			})
		})

		this.spriteQuery.removed.forEach((entity) => {
			let pixiSprite = entity.c.pixiSprite
			this.view.removeChild(pixiSprite.value)
			pixiSprite.value.destroy()
			entity.removeComponent(typeof PixiSprite)
		})
	}
}
