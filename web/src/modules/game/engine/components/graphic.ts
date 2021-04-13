import { Component } from 'ape-ecs'

/** Data for an entity's graphic. */
export default class Graphic extends Component {
	/** The numeric color value for the graphic. */
	color!: number
	/** The width of the graphic, in pixels. */
	width!: number
	/** The height of the graphic, in pixels. */
	height!: number
	/** The graphic's X anchor coordinate, in pixels. */
	anchorX!: number
	/** The graphic's Y anchor coordinate, in pixels. */
	anchorY!: number
	static typeName = 'Graphic'
	static key = 'graphic'
	static properties = {
		color: 0,
		width: 0,
		height: 0,
		anchorX: 0,
		anchorY: 0,
	}
}
