export interface IResources {
	sheet: {
		spritesheet: {
			animations: Animations
		}
	}
}

export type Animations = Record<string, PIXI.BaseTexture[]>
