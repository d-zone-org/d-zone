import { Component, Types } from 'ecsy'

export default class SpriteComponent extends Component<any> {}

SpriteComponent.schema = {
	x: { type: Types.Number },
	y: { type: Types.Number },
	width: { type: Types.Number },
	height: { type: Types.Number },
	sheet: { type: Types.String },
	render: { type: Types.Boolean },
	dirty: { type: Types.Boolean },
	zIndex: { type: Types.Number },
}
