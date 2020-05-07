import { Component } from 'ecs-lib'

export type Hop = {
	x: number
	y: number
	z: number
}

export const HopComponent = Component.register<Hop>()
