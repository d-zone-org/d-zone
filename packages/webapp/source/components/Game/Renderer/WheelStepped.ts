import { Plugin, Viewport, ViewportOptions } from 'pixi-viewport'
import * as PIXI from 'pixi.js-legacy'

const wheelSteppedOptions = {
	smooth: false,
	interrupt: false,
	reverse: false,
	center: null,
	steps: [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8],
}

interface Point {
	x: number
	y: number
}

interface MyViewport extends Viewport {
	input: { getPointerPosition: (e: WheelEvent) => Point }
	options: ViewportOptions
}

class MyPlugin extends Plugin {
	readonly parent: MyViewport
	constructor(viewport: Viewport) {
		super(viewport)
		this.parent = viewport as MyViewport
	}
}

function getClosestIndex(arr: number[], target: number): number {
	let closest = 0
	arr.forEach((value, index) => {
		if (Math.abs(value - target) < Math.abs(arr[closest] - target))
			closest = index
	})
	return closest
}

export default class WheelStepped extends MyPlugin {
	private options: {
		smooth: boolean | number
		interrupt: boolean
		reverse: boolean
		center: null
		steps: number[]
	}
	private smoothing: { x: number; y: number } | null = null
	private smoothingCenter: { x: number; y: number } = { x: 0, y: 0 }
	private paused = false
	private smoothingCount = 0
	private targetZoomLevel = 0
	constructor(parent: Viewport, options = {}) {
		super(parent)
		this.options = Object.assign({}, wheelSteppedOptions, options)
	}

	down(): void {
		if (this.options.interrupt) {
			this.smoothing = null
		}
	}

	update(): void {
		if (this.smoothing) {
			const point = this.smoothingCenter
			const change = this.smoothing
			let oldPoint: PIXI.Point
			if (!this.options.center) {
				oldPoint = this.parent.toLocal(point)
			}
			this.parent.scale.x += change.x
			this.parent.scale.y += change.y
			this.parent.emit('zoomed', { viewport: this.parent, type: 'wheel' })
			const clamp = this.parent.plugins.get('clamp-zoom') as MyPlugin
			if (clamp) {
				clamp.parent.clamp()
			}
			if (this.options.center) {
				this.parent.moveCenter(this.options.center!)
			} else {
				const newPoint = this.parent.toGlobal(oldPoint!)
				this.parent.x += point.x - newPoint.x
				this.parent.y += point.y - newPoint.y
			}
			this.parent.emit('moved', { viewport: this.parent, type: 'wheel' })
			this.smoothingCount++
			if (this.smoothingCount >= this.options.smooth) {
				this.parent.scale.x = this.options.steps[this.targetZoomLevel]
				this.parent.scale.y = this.options.steps[this.targetZoomLevel]
				this.smoothing = null
			}
		}
	}

	wheel(e: WheelEvent): boolean | undefined {
		if (this.paused || this.smoothing) {
			return
		}
		const point = this.parent.input.getPointerPosition(e)
		const sign = this.options.reverse ? -1 : 1
		const currentZoomLevel = getClosestIndex(
			this.options.steps,
			this.parent.scaled
		)
		this.targetZoomLevel = currentZoomLevel
		if (e.deltaY < 0 && currentZoomLevel < this.options.steps.length - 1) {
			this.targetZoomLevel += sign
		}
		if (e.deltaY > 0 && currentZoomLevel > 0) {
			this.targetZoomLevel -= sign
		}
		const targetScale = this.options.steps[this.targetZoomLevel]
		if (typeof this.options.smooth === 'number') {
			this.smoothing = {
				x: (targetScale - this.parent.scale.x) / this.options.smooth,
				y: (targetScale - this.parent.scale.y) / this.options.smooth,
			}
			this.smoothingCount = 0
			this.smoothingCenter = point
		} else {
			let oldPoint
			if (!this.options.center) {
				oldPoint = this.parent.toLocal(point)
			}
			this.parent.scale.x = targetScale
			this.parent.scale.y = targetScale
			this.parent.emit('zoomed', { viewport: this.parent, type: 'wheel' })
			const clamp = this.parent.plugins.get('clamp-zoom') as MyPlugin
			if (clamp) {
				clamp.parent.clamp()
			}
			if (this.options.center) {
				this.parent.moveCenter(this.options.center!)
			} else if (oldPoint) {
				const newPoint = this.parent.toGlobal(oldPoint)
				this.parent.x += point.x - newPoint.x
				this.parent.y += point.y - newPoint.y
			}
		}
		this.parent.emit('moved', { viewport: this.parent, type: 'wheel' })
		this.parent.emit('wheel', {
			wheel: { dx: e.deltaX, dy: e.deltaY, dz: e.deltaZ },
			event: e,
			viewport: this.parent,
		})
		return !this.parent.options.passiveWheel
	}
}
