import type { Entity, World } from 'ape-ecs'
import type { IGrid, IGridDirection } from '../../typings'
import Map3D from '../../common/map-3d'
import Transform from '../components/transform'
import Sprite from '../components/sprite'
import Actor from '../components/actor'
import Map from '../components/map'
import Hop from '../components/hop'
import { Tags } from '../'
import { randomColor, randomHop, randomString } from '../seed-dev'

/** An ordered list of relative Z levels (heights) to try hopping to. */
const HOP_Z_LEVELS = [0, 1, -1] as const

/**
 * Creates an actor entity.
 *
 * @param world - The ECS world instance to create the actor entity in.
 * @param grid - The grid location to create the actor map cell at.
 * @param map - The map instance to add the actor map cell to.
 * @returns - The created actor entity.
 */
export function createActor(
	world: World,
	grid: IGrid,
	map: Map3D<Entity>
): Entity {
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
			[Map.key]: {
				type: Map.typeName,
				map,
			},
		},
		tags: [Tags.Solid, Tags.Platform],
	})
}

/**
 * Adds a [[Hop]] component to the input actor entity.
 *
 * Note: If the actor already has a hop component, this will not add another.
 *
 * @param actor - The actor entity to hop.
 * @param direction - The direction of the hop. If not provided, a random
 *     direction will be chosen.
 */
export function hopActor(actor: Entity, direction?: IGridDirection) {
	if (actor.has(Hop.typeName)) return // Already hopping
	actor.addComponent({
		type: Hop.typeName,
		key: Hop.key,
		...(direction || randomHop()),
	})
}

/**
 * Checks for the validity of an actor's hop.
 *
 * @param actor - The grid location of the actor attempting to hop.
 * @param hop - The relative grid location of the hop.
 * @param map - The map containing the actor entity.
 * @returns - A valid hop target or `false` if one cannot be found.
 */
export function getValidHop(
	actor: IGrid,
	hop: IGrid,
	map: Map3D<Entity>
): IGrid | false {
	const cellsAboveGrid = map.getCellsAtGrid({ ...actor, z: actor.z + 1 })
	if ([...cellsAboveGrid].some((cell) => cell.has(Tags.Solid))) return false
	const target = { x: actor.x + hop.x, y: actor.y + hop.y, z: actor.z }
	for (const z of HOP_Z_LEVELS) {
		target.z = actor.z + z
		if (gridIsAbovePlatform(map, target) && gridIsEmpty(map, target)) {
			return { ...hop, z }
		}
	}
	return false
}

/**
 * Checks that a grid location is not solid.
 *
 * @param map - The map instance to check in.
 * @param grid - The grid location to check.
 * @returns - Grid locations containing no solids will return true.
 */
function gridIsEmpty(map: Map3D<Entity>, grid: IGrid): boolean {
	// If grid is below ground, it's not empty
	if (grid.z < 0) return false
	const cells = [...map.getCellsAtGrid(grid)]
	return !cells.some((cell) => cell.has(Tags.Solid))
}

/**
 * Checks that a grid location is above a platform.
 *
 * @param map - The map instance to check in.
 * @param grid - The grid location to check.
 * @returns - Grid locations that are one unit above a platform will return true.
 */
function gridIsAbovePlatform(map: Map3D<Entity>, grid: IGrid): boolean {
	// If grid is at ground level, it's on a platform
	if (grid.z <= 0) return true
	const underNewTarget = [
		...map.getCellsAtGrid({
			...grid,
			z: grid.z - 1,
		}),
	]
	return underNewTarget.some((cell) => cell.has(Tags.Platform))
}
