import { Component } from 'ecs-lib'

export type Sprite = {
	x: number
	y: number
	width: number
	height: number
	sheet: string
	sheetX: number
	sheetY: number
	render: boolean
	dirty: boolean
}

export const SpriteComponent = Component.register<Sprite>()
