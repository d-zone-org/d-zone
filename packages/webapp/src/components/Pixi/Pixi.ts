import { onMount } from 'svelte'
import * as PIXI from 'pixi.js'

export function init(canvas: HTMLCanvasElement) {
	let app: PIXI.Application

	onMount(() => {
		app = new PIXI.Application({
			width: 800,
			height: 600,
			backgroundColor: 0x000000,
			view: canvas,
		})
	})
}
