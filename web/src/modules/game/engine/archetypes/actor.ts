import type { Entity, World } from 'ape-ecs'
import type { Animations, IGrid, IGridDirection, ITexture } from '../../typings'
import Map3D from '../../common/map-3d'
import Transform from '../components/transform'
import Texture from '../components/texture'
import Draw from '../components/draw'
import Actor from '../components/actor'
import Map from '../components/map'
import Hop from '../components/hop'
import { Tags } from '../'
import { randomColor, getRandomDirection, randomString } from '../seed-dev'
import { HOP_TICKS_PER_FRAME, SPRITE_DEFINITIONS } from '../../config/sprite'
import { Direction } from '../../typings'
import Animation from 'root/modules/game/engine/components/animation'

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
	const actor = world.createEntity({
		c: {
			[Transform.key]: {
				type: Transform.typeName,
				...grid,
			},
			[Texture.key]: {
				type: Texture.typeName,
				anchorX: SPRITE_DEFINITIONS.cube.anchor.x,
				anchorY: SPRITE_DEFINITIONS.cube.anchor.y,
				name: getCubeTextureName(getRandomDirection().direction),
			},
			[Draw.key]: {
				type: Draw.typeName,
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
	map.addCellToGrid(actor, grid)
	return actor
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
export function addHopComponent(
	actor: Entity,
	direction?: IGridDirection
): void {
	if (actor.has(Hop.typeName)) return // Already hopping
	actor.addComponent({
		type: Hop.typeName,
		key: Hop.key,
		...(direction || getRandomDirection()),
	})
}

/**
 * Adds an [[Animation]] component to the input actor entity based on the
 * actor's [[Hop]] component.
 *
 * @param actor - The actor entity to animate.
 * @param hop - The actor's hop component.
 * @param animations - The animations object from [[Resources]].
 */
export function addHopAnimationComponent(
	actor: Entity,
	hop: Hop,
	animations: Animations
): void {
	let animationName = `hop-${hop.direction}`
	if (hop.z > 0) animationName += '-up'
	if (hop.z < 0) animationName += '-down'
	actor.addComponent({
		type: Animation.typeName,
		key: Animation.key,
		ticksPerFrame: HOP_TICKS_PER_FRAME,
		frames: animations[animationName],
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

/**
 * Gets a cube texture based on direction.
 *
 * @param direction - The direction of the actor.
 * @returns - The texture corresponding to the input direction.
 */
export function getDirectionalCubeTexture(direction: Direction): ITexture {
	return {
		anchorX: SPRITE_DEFINITIONS.cube.anchor.x,
		anchorY: SPRITE_DEFINITIONS.cube.anchor.y,
		name: getCubeTextureName(direction),
	}
}

/**
 * Gets a directional cube texture name.
 *
 * @param direction - The direction of the actor.
 * @returns - The texture name corresponding to the input direction.
 */
function getCubeTextureName(
	direction: Direction
): 'cube:0' | 'cube:1' | 'cube:2' {
	switch (direction) {
		case Direction.East:
			return 'cube:0'
		case Direction.South:
			return 'cube:1'
		case Direction.North:
		case Direction.West:
			return 'cube:2'
	}
}
