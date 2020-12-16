import type { Entity, World } from 'ape-ecs'
import type { IGrid, IGridDirection } from '../../typings'
import type Map3D from '../../common/map-3d'
import { Cell3D } from '../../common/cell-3d'
import Transform from '../components/transform'
import Sprite from '../components/sprite'
import Actor from '../components/actor'
import MapCell from '../components/map-cell'
import Hop from '../components/hop'
import { randomColor, randomHop, randomString } from '../seed-dev'

const HOP_Z_LEVELS = [0, 1, -1] as const

export function createActor(world: World, grid: IGrid, map: Map3D): Entity {
	return world.createEntity({
		c: {
			[Transform.key]: {
				type: Transform.typeName,
				...grid,
			},
			[Sprite.key]: {
				type: Sprite.typeName,
				texture: 'cube:0',
			},
			[Actor.key]: {
				type: Actor.typeName,
				userID: randomString([48, 57], 18),
				username: randomString([32, 126], Math.floor(Math.random() * 12) + 3),
				color: randomColor(),
			},
			[MapCell.key]: {
				type: MapCell.typeName,
				cell: new Cell3D({
					map,
					...grid,
					properties: { solid: true, platform: true },
				}),
			},
		},
	})
}

export function hopActor(actor: Entity, direction?: IGridDirection) {
	if (actor.has(Hop.typeName)) return // Already hopping
	actor.addComponent({
		type: Hop.typeName,
		key: Hop.key,
		...(direction || randomHop()),
	})
}

export function reserveTarget(cell: Cell3D, target: IGrid): void {
	cell.spread(target, { solid: true })
}

export function getHopTarget(cell: Cell3D, target: IGrid): IGrid | false {
	const aboveNeighbor = cell.getCellsAtNeighbor({ x: 0, y: 0, z: 1 })
	if (aboveNeighbor.some((cell) => cell.properties.solid)) return false
	const newTarget = { ...target }
	for (const z of HOP_Z_LEVELS) {
		newTarget.z = z
		const newTargetCells = cell.getCellsAtNeighbor(newTarget)
		if (
			gridIsAbovePlatform(cell.map, target) &&
			!newTargetCells.some((cell) => cell.properties.solid)
		) {
			return newTarget
		}
	}
	return false
}

function gridIsAbovePlatform(map: Map3D, grid: IGrid): boolean {
	if (grid.z <= 0) return true
	const underNewTarget = map.getCellsAtGrid({
		...grid,
		z: grid.z - 1,
	})
	return underNewTarget.some((cell) => cell.properties.platform)
}
