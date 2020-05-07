import { Component } from 'ecs-lib'

export type Transform = {
	x: number;
	y: number;
	z: number;
}

export const TransformComponent = Component.register<Transform>()
