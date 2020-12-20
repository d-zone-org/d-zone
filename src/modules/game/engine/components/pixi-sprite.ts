import { Component } from 'ape-ecs'
import type * as PIXI from 'pixi.js-legacy'

/** Data for an entity's PIXI sprite instance. */
export default class PixiSprite extends Component {
	/** The PIXI sprite instance. */
	sprite!: PIXI.Sprite
	static typeName = 'PixiSprite'
	static key = 'pixiSprite'
	static properties = {
		sprite: null,
	}
}
