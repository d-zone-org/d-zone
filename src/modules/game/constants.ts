import { Direction, IGridDirection } from './typings'

export const DIRECTIONS: Record<Direction, IGridDirection> = {
	east: { x: 1, y: 0, z: 0, direction: Direction.East },
	west: { x: -1, y: 0, z: 0, direction: Direction.West },
	south: { y: 1, x: 0, z: 0, direction: Direction.South },
	north: { y: -1, x: 0, z: 0, direction: Direction.North },
} as const
