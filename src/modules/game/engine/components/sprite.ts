import { Component } from 'ape-ecs'

/**
 * Data for an entity's sprite. Systems should manipulate this component instead
 * of the [[PixiSprite | PIXI sprite component]]. Changes made to this
 * component will be copied to the PIXI sprite.
 */
export default class Sprite extends Component {
	/** The screen X coordinate of the sprite. */
	x!: number
	/** The screen Y coordinate of the sprite. */
	y!: number
	/** The texture name for the sprite. */
	texture!: string
	/**
	 * The Z-index of the sprite. This determines the order in which sprites are
	 * drawn to the screen.
	 */
	zIndex!: number
	static typeName = 'Sprite'
	static key = 'sprite'
	static properties = {
		x: 0,
		y: 0,
		texture: '',
		zIndex: 0,
	}
}
