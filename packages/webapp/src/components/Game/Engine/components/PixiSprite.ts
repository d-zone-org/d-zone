import { Component, Types } from 'ecsy'

export default class PixiSprite extends Component<PixiSprite> {
	value!: PIXI.Sprite
}

PixiSprite.schema = {
	value: { type: Types.Ref },
}
