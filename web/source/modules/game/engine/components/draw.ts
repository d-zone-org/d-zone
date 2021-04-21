import { Component } from 'ape-ecs'

/**
 * Data for an entity's visual representation on the screen. Systems should
 * manipulate this component instead of the [[PixiObject]] component. Changes
 * made to this component will be copied to the PIXI object.
 */
export default class Draw extends Component {
	/** The screen X coordinate of the object. */
	x!: number
	/** The screen Y coordinate of the object. */
	y!: number
	/**
	 * The Z-index of the object. This determines the order in which objects are
	 * drawn to the screen.
	 */
	zIndex!: number
	static typeName = 'Draw'
	static key = 'draw'
	static properties = {
		x: 0,
		y: 0,
		zIndex: 0,
	}
}
