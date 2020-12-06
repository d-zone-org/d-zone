import { Plugin, Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js-legacy'
import { Plugins } from './renderer'

const wheelSteppedOptions = {
	smooth: false,
	interrupt: false,
	reverse: false,
	center: null,
	steps: [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8],
}

function getClosestIndex(arr: number[], target: number): number {
	let closest = 0
	arr.forEach((value, index) => {
		if (Math.abs(value - target) < Math.abs(arr[closest] - target))
			closest = index
	})
	return closest
}

export default class WheelStepped extends Plugin {
	private options: {
		smooth: boolean | number
		interrupt: boolean
		reverse: boolean
		center: null | PIXI.Point
		steps: number[]
	}

	private smoothing: { x: number; y: number } | null = null
	private smoothingCenter: { x: number; y: number } = { x: 0, y: 0 }
	private smoothingCount = 0
	private targetZoomLevel = 0

	constructor(parent: Viewport<Plugins>, options = {}) {
		super(parent)
		this.options = { ...wheelSteppedOptions, ...options }
	}

	down() {
		if (this.options.interrupt) {
			this.smoothing = null
		}
	}

	update() {
		if (this.smoothing) {
			const point = this.smoothingCenter
			const change = this.smoothing
			const oldPoint: PIXI.Point | null = !this.options.center
				? this.parent.toLocal(point)
				: null

			this.parent.scale.x += change.x
			this.parent.scale.y += change.y
			this.parent.emit('zoomed', { viewport: this.parent, type: 'wheel' })

			const clamp = this.parent.plugins.get('clamp-zoom')
			if (clamp) clamp.clamp()

			if (this.options.center) {
				this.parent.moveCenter(this.options.center)
			} else {
				const newPoint = this.parent.toGlobal(oldPoint as PIXI.Point)
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
		if (this.paused || this.smoothing) return

		const inputManager = this.parent.input
		const point = inputManager.getPointerPosition(e)
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
			const oldPoint = !this.options.center ? this.parent.toLocal(point) : null

			this.parent.scale.x = targetScale
			this.parent.scale.y = targetScale

			this.parent.emit('zoomed', { viewport: this.parent, type: 'wheel' })

			const clamp = this.parent.plugins.get('clamp-zoom')
			if (clamp) clamp.clamp()

			if (this.options.center) {
				this.parent.moveCenter(this.options.center)
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

		const parentViewportOptions = this.parent.options
		return !parentViewportOptions.passiveWheel
	}
}
