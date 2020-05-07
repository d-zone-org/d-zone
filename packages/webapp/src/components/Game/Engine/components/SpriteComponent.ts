import { Component } from 'ecs-lib'

export type Sprite = {
	x: number
	y: number
	width: number
	height: number
	sheet: string
	sheetX: number
	sheetY: number
}

export const SpriteComponent = Component.register<Sprite>()
