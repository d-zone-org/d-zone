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
