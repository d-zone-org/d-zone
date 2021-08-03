export interface IResources {
	sheet: Sheet
	animations: Animations
}

export type Sheet = {
	spritesheet: {
		animations: Record<string, PIXI.BaseTexture[]>
	}
	textures: Textures
}

export type Textures = Record<string, PIXI.Texture>

export type Animations = Record<string, ITexture[]>

export enum Direction {
	North = 'north',
	South = 'south',
	East = 'east',
	West = 'west',
}

export interface ITexture {
	anchorX: number
	anchorY: number
	name: string
}

export interface IGrid {
	x: number
	y: number
	z: number
}

export interface IGridDirection extends IGrid {
	direction: Direction
}

export interface ISpriteDefinition {
	w: number
	h: number
	animation?: boolean
	anchor: { x: number; y: number }
}
