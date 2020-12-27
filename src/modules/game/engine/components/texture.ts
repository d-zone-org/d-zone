import { Component } from 'ape-ecs'
import { ITexture } from '../../typings'

/** Data for an entity's texture. */
export default class Texture extends Component implements ITexture {
	/** The texture's X anchor coordinate, in pixels. */
	anchorX!: number
	/** The texture's Y anchor coordinate, in pixels. */
	anchorY!: number
	/** The texture name. */
	name!: string
	static typeName = 'Texture'
	static key = 'texture'
	static properties = {
		anchorX: 0,
		anchorY: 0,
		name: '',
	}
}
