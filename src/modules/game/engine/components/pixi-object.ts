import { Component } from 'ape-ecs'
import type * as PIXI from 'pixi.js-legacy'

/** Data for an entity's PIXI display object instance. */
export default class PixiObject extends Component {
	/** The PIXI display object instance. */
	object!: PIXI.Sprite | PIXI.Graphics
	static typeName = 'PixiObject'
	static key = 'pixiObject'
	static properties = {
		object: null,
	}
	preDestroy() {
		// Destroy the PIXI object when this component is destroyed
		this.object.destroy()
	}
}
