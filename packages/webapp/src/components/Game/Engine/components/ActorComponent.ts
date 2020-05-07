import { Component } from 'ecs-lib'

export type Actor = {
	userID: string
	username: string
	color: number
}

export const ActorComponent = Component.register<Actor>()
