import { Component } from 'ape-ecs'
import { ITexture } from '../../typings'

/** Data for an entity's animation. */
export default class Animation extends Component {
	/** The animation speed in ticks per frame. */
	ticksPerFrame!: number
	/** The texture objects to use in each frame of the animation. */
	frames!: ITexture[]
	/** The current tick number of the animation. */
	tick!: number
	/** The current frame number of the animation. */
	frame!: number
	/** Whether the animation is paused. */
	paused!: boolean
	/** Whether to repeat the animation indefinitely. */
	loop!: boolean
	static typeName = 'Animation'
	static key = 'animation'
	static properties = {
		ticksPerFrame: 0,
		frames: [],
		tick: 0,
		frame: 0,
		paused: false,
		loop: false,
	}
}
