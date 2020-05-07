import { Component } from 'ecs-lib'

export type Speak = {
	channel: string
	message: string
	timestamp: number
}

export const SpeakComponent = Component.register<Speak>()
