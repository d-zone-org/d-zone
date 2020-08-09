import { Component, Types } from 'ecsy'
import PIXI from 'es/pixi'

export default class PixiSprite extends Component<PixiSprite> {
	value!: PIXI.Sprite
}

PixiSprite.schema = {
	value: { type: Types.Ref },
}
