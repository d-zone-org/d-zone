import { Component } from 'ape-ecs'
import type * as PIXI from 'pixi.js-legacy'

export default class PixiSprite extends Component {
	sprite!: PIXI.Sprite
	static typeName = 'PixiSprite'
	static key = 'pixiSprite'
	static properties = {
		sprite: null,
	}
}
