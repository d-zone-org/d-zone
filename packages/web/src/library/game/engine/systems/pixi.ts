import { Query, System } from 'ape-ecs'
import Texture from '../components/texture'
import Graphic from '../components/graphic'
import Draw from '../components/draw'
import PixiObject from '../components/pixi-object'
import * as PIXI from 'pixi.js-legacy'
import type Renderer from '../../renderer'
import type { Viewport } from 'pixi-viewport'
import type { SpatialHash } from 'pixi-cull'
import type { Textures } from '../../typings'

/** Creates and updates [[PixiObject]] components based on [[Draw]] components. */
export default class PixiSystem extends System {
	private renderer!: Renderer
	private textures!: Textures
	private view!: Viewport
	private cull!: SpatialHash
	private pixiObjectQuery!: Query
	private pixiObjectAddQuery!: Query
	private pixiObjectRemoveQuery!: Query
	private needCull = false

	init(textures: Textures, renderer: Renderer) {
		this.textures = textures
		this.renderer = renderer
		this.view = this.renderer.view
		this.cull = this.renderer.cull
		this.pixiObjectQuery = this.createQuery({
			all: [Draw, PixiObject],
			only: [Texture, Graphic],
			persist: true,
		})
		this.pixiObjectAddQuery = this.createQuery({
			all: [Draw],
			only: [Texture, Graphic],
			not: [PixiObject],
			persist: true,
		})
		this.pixiObjectRemoveQuery = this.createQuery({
			all: [PixiObject],
			not: [Draw],
			persist: true,
		})
	}

	update(tick: number) {
		this.needCull = false
		this.updatePixiObjects(tick)
		this.addPixiObjects()
		this.removePixiObjects()
		if (this.needCull) this.cull.cull(this.view.getVisibleBounds())
	}

	/**
	 * Copies all sprite or graphic component changes to the PIXI object.
	 *
	 * @private
	 * @param tick - The current game engine tick.
	 */
	private updatePixiObjects(tick: number) {
		this.pixiObjectQuery.execute().forEach((entity) => {
			const draw = entity.c[Draw.key] as Draw
			const { object: pixiObject } = entity.c[PixiObject.key] as PixiObject
			if (draw._meta.updated === tick) {
				this.updateDraw(draw, pixiObject)
			}
			const texture = entity.c[Texture.key] as Texture | undefined
			if (texture && texture._meta.updated === tick) {
				this.updateTexture(texture, pixiObject as PIXI.Sprite)
			}
			const graphic = entity.c[Graphic.key] as Graphic | undefined
			if (graphic && graphic._meta.updated === tick) {
				PixiSystem.updateGraphic(graphic, pixiObject as PIXI.Graphics)
			}
		})
	}

	/**
	 * Updates a PIXI object from a Draw component.
	 *
	 * @private
	 * @param draw - The Draw component used to update the PIXI object.
	 * @param object - The PIXI object being updated.
	 */
	private updateDraw(draw: Draw, object: PixiObject['object']): void {
		object.setTransform(draw.x, draw.y)
		object.zIndex = draw.zIndex
		this.cull.updateObject(object)
		this.needCull = true
	}

	/**
	 * Updates a PIXI sprite from a Texture component.
	 *
	 * @private
	 * @param texture - The Texture component used to update the PIXI sprite.
	 * @param sprite - The PIXI sprite being updated.
	 */
	private updateTexture(texture: Texture, sprite: PIXI.Sprite): void {
		sprite.texture = this.textures[texture.name]
		sprite.anchor.set(
			texture.anchorX / sprite.texture.width,
			texture.anchorY / sprite.texture.height
		)
	}

	/**
	 * Updates a PIXI graphics object from a Graphic component.
	 *
	 * @private
	 * @param __namedParameters - The Graphic component used to update the PIXI
	 *   graphics object.
	 * @param graphics - The PIXI graphics object being updated.
	 */
	private static updateGraphic(
		{ color, width, height, anchorX, anchorY }: Graphic,
		graphics: PIXI.Graphics
	): void {
		graphics.clear()
		graphics.beginFill(color)
		graphics.drawRect(-anchorX, -anchorY, width, height)
	}

	/**
	 * Instantiates PIXI objects for entities that have [[Texture]] or [[Graphic]]
	 * components.
	 *
	 * @private
	 */
	private addPixiObjects() {
		this.pixiObjectAddQuery.execute().forEach((entity) => {
			let pixiObject: PIXI.Graphics | PIXI.Sprite | undefined
			const texture = entity.c[Texture.key] as Texture | undefined
			if (texture) {
				pixiObject = new PIXI.Sprite(this.textures[texture.name])
				this.updateTexture(texture, pixiObject)
			}
			const graphic = entity.c[Graphic.key] as Graphic | undefined
			if (graphic) {
				pixiObject = new PIXI.Graphics()
				PixiSystem.updateGraphic(graphic, pixiObject)
			}
			if (!pixiObject) return
			const draw = entity.c[Draw.key] as Draw
			this.view.addChild(pixiObject)
			this.updateDraw(draw, pixiObject)
			entity.addComponent({
				type: PixiObject.typeName,
				key: PixiObject.key,
				object: pixiObject,
			})
		})
	}

	/**
	 * Removes PIXI objects for entities that no longer have [[Texture]] or
	 * [[Graphic]] components.
	 *
	 * @private
	 */
	private removePixiObjects() {
		this.pixiObjectRemoveQuery.execute().forEach((entity) => {
			const pixiObject = entity.c[PixiObject.key] as PixiObject
			entity.removeComponent(pixiObject)
			this.needCull = true
		})
	}
}
