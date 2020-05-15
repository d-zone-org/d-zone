import Engine from '../Engine'
import ActorEntity from '../entities/ActorEntity'
import { Sprite, SpriteComponent } from '../components/SpriteComponent'
import { Transform, TransformComponent } from '../components/TransformComponent'
import { Component, Entity } from 'ecs-lib'
import TransformSystem from './TransformSystem'

const testEntity: Entity = new ActorEntity(
	{
		userID: '123',
		username: 'Tester',
		color: 0,
	},
	{
		x: 0,
		y: 0,
		z: 0,
	}
)

let testEngine: Engine

describe('Transform system', () => {
	beforeEach(() => {
		testEngine = new Engine()
		testEngine.init([new TransformSystem()])
		testEngine.world.addEntity(testEntity)
		testEngine.update()
	})
	test('sprite not marked dirty when transform unchanged', () => {
		let sprite: Component<Sprite> = SpriteComponent.oneFrom(testEntity)
		testEngine.update()
		expect(sprite.data.dirty).toEqual(false)
	})
	test('sprite is marked dirty when transform changes', () => {
		let sprite: Component<Sprite> = SpriteComponent.oneFrom(testEntity)
		let transform: Component<Transform> = TransformComponent.oneFrom(testEntity)
		transform.data.x++
		testEngine.update()
		expect(sprite.data.dirty).toEqual(true)
	})
})
