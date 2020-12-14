export interface IResources {
	sheet: Sheet
}

export type Sheet = {
	spritesheet: {
		animations: Animations
	}
	textures: Textures
}
export type Animations = Record<string, PIXI.BaseTexture[]>
export type Textures = Record<string, PIXI.Texture>

export enum Direction {
	North = 'north',
	South = 'south',
	East = 'east',
	West = 'west',
}

export interface Grid {
	x: number
	y: number
	z: number
}

export interface GridDirection extends Grid {
	direction: Direction
}

export interface ISpriteDefinition {
	w: number
	h: number
	animation?: boolean
	anchor?: { x: number; y: number }
}
