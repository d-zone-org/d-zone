import * as PIXI from 'pixi.js'
import cubeImage from './cube.png'

// Global PIXI settings
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// Initialize when svelte mounts PIXI component containing canvas
export function init(canvas: HTMLCanvasElement) {
	let app: PIXI.Application

	app = new PIXI.Application({
		width: 800,
		height: 600,
		backgroundColor: 0x000000,
		view: canvas,
	})

	const sprite = PIXI.Sprite.from(cubeImage);
	sprite.setTransform(280, 180, 16, 16);
	app.stage.addChild(sprite);
}
