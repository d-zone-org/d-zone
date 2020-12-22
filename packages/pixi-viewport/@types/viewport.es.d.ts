export type ViewportTouch = {
	id: number
	last: PIXI.Point
}
export type BuiltInPlugins = {
	drag: Drag
	pinch: Pinch
	wheel: Wheel
	follow: Follow
	'mouse-edges': MouseEdges
	decelerate: Decelerate
	bounce: Bounce
	'snap-zoom': SnapZoom
	'clamp-zoom': ClampZoom
	snap: Snap
	clamp: Clamp
}
export type LastDrag = {
	x: number
	y: number
	parent: PIXI.Point
}
export type DragOptions = {
	/** Direction to drag */
	direction?: string
	/** Whether click to drag is active */
	pressDrag?: boolean
	/** Use wheel to scroll in direction (unless wheel plugin is active) */
	wheel?: boolean
	/** Number of pixels to scroll with each wheel spin */
	wheelScroll?: number
	/** Reverse the direction of the wheel scroll */
	reverse?: boolean
	/** Clamp wheel(to avoid weird bounce with mouse wheel) */
	clampWheel?: boolean | string
	/** Where to place world if too small for screen */
	underflow?: string
	/** Factor to multiply drag to increase the speed of movement */
	factor?: number
	/**
	 * Changes which mouse buttons trigger drag, use: 'all', 'left', right'
	 * 'middle', or some combination, like, 'middle-right'; you may want to set
	 * viewport.options.disableOnContextMenu if you want to use right-click dragging
	 */
	mouseButtons?: string
	/**
	 * Array containing {@link
	 * key|https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
	 * codes of keys that can be pressed for the drag to be triggered, e.g.:
	 * ['ShiftLeft', 'ShiftRight'}.
	 */
	keyToPress?: string[]
	/** Ignore keyToPress for touch events */
	ignoreKeyToPressOnTouch?: boolean
}
export type PinchOptions = {
	/** Disable two-finger dragging */
	noDrag?: boolean
	/** Percent to modify pinch speed */
	percent?: number
	/** Factor to multiply two-finger drag to increase the speed of movement */
	factor?: number
	/** Place this point at center during zoom instead of center of two fingers */
	center?: PIXI.Point
}
export type ClampOptions = {
	/** Clamp left; true = 0 */
	left?: number | boolean
	/** Clamp right; true = viewport.worldWidth */
	right?: number | boolean
	/** Clamp top; true = 0 */
	top?: number | boolean
	/** Clamp bottom; true = viewport.worldHeight */
	bottom?: number | boolean
	/**
	 * (all, x, or y) using clamps of [0,
	 * viewport.worldWidth/viewport.worldHeight]; replaces left/right/top/bottom if set
	 */
	direction?: string
	/**
	 * Where to place world if too small for screen (e.g., top-right, center, none,
	 * bottomleft)
	 */
	underflow?: string
}
/** Use either minimum width/height or minimum scale */
export type ClampZoomOptions = {
	/** Minimum width */
	minWidth?: number
	/** Minimum height */
	minHeight?: number
	/** Maximum width */
	maxWidth?: number
	/** Maximum height */
	maxHeight?: number
	/** Minimum scale */
	minScale?: number
	/** Minimum scale */
	maxScale?: number
}
export type DecelerateOptions = {
	/** Percent to decelerate after movement */
	friction?: number
	/**
	 * Percent to decelerate when past boundaries (only applicable when
	 * viewport.bounce() is active)
	 */
	bounce?: number
	/** Minimum velocity before stopping/reversing acceleration */
	minSpeed?: number
}
export type BounceOptions = any
export type SnapOptions = {
	/** Snap to the top-left of viewport instead of center */
	topLeft?: boolean
	/** Friction/frame to apply if decelerate is active */
	friction?: number
	time?: number
	/** Ease function or name (see http://easings.net/ for supported names) */
	ease?: string | Function
	/** Pause snapping with any user input on the viewport */
	interrupt?: boolean
	/** Removes this plugin after snapping is complete */
	removeOnComplete?: boolean
	/** Removes this plugin if interrupted by any user input */
	removeOnInterrupt?: boolean
	/**
	 * Starts the snap immediately regardless of whether the viewport is at the
	 * desired location
	 */
	forceStart?: boolean
}
export type SnapZoomOptions = {
	/** The desired width to snap (to maintain aspect ratio, choose only width or height) */
	width?: number
	/** The desired height to snap (to maintain aspect ratio, choose only width or height) */
	height?: number
	/** Time for snapping in ms */
	time?: number
	/** Ease function or name (see http://easings.net/ for supported names) */
	ease?: string | Function
	/** Place this point at center during zoom instead of center of the viewport */
	center?: PIXI.Point
	/** Pause snapping with any user input on the viewport */
	interrupt?: boolean
	/** Removes this plugin after snapping is complete */
	removeOnComplete?: boolean
	/** Removes this plugin if interrupted by any user input */
	removeOnInterrupt?: boolean
	/** Starts the snap immediately regardless of whether the viewport is at the desired zoom */
	forceStart?: boolean
	/** Zoom but do not move */
	noMove?: boolean
}
export type FollowOptions = {
	/** To follow in pixels/frame (0=teleport to location) */
	speed?: number
	/**
	 * Set acceleration to accelerate and decelerate at this rate; speed cannot be
	 * 0 to use acceleration
	 */
	acceleration?: number
	/**
	 * Radius (in world coordinates) of center circle where movement is allowed
	 * without moving the viewport
	 */
	radius?: number
}
/**
 * The default event listener for 'wheel' event is document.body. Use
 * `Viewport.options.divWheel` to change this default
 */
export type WheelOptions = {
	/** Percent to scroll with each spin */
	percent?: number
	/** Smooth the zooming by providing the number of frames to zoom between wheel spins */
	smooth?: number
	/** Stop smoothing with any user input on the viewport */
	interrupt?: boolean
	/** Reverse the direction of the scroll */
	reverse?: boolean
	/** Place this point at center during zoom instead of current mouse position */
	center?: PIXI.Point
	/** Scaling factor for non-DOM_DELTA_PIXEL scrolling events */
	lineHeight?: number
}
export type MouseEdgesOptions = {
	/** Distance from center of screen in screen pixels */
	radius?: number
	/** Distance from all sides in screen pixels */
	distance?: number
	/** Alternatively, set top distance (leave unset for no top scroll) */
	top?: number
	/** Alternatively, set bottom distance (leave unset for no top scroll) */
	bottom?: number
	/** Alternatively, set left distance (leave unset for no top scroll) */
	left?: number
	/** Alternatively, set right distance (leave unset for no top scroll) */
	right?: number
	/** Speed in pixels/frame to scroll viewport */
	speed?: number
	/** Reverse direction of scroll */
	reverse?: boolean
	/** Don't use decelerate plugin even if it's installed */
	noDecelerate?: boolean
	/**
	 * If using radius, use linear movement (+/- 1, +/- 1) instead of angled
	 * movement (Math.cos(angle from center), Math.sin(angle from center))
	 */
	linear?: boolean
	/** Allows plugin to continue working even when there's a mousedown event */
	allowButtons?: boolean
}
/**
 * To set the zoom level, use: (1) scale, (2) scaleX and scaleY, or (3) width
 * and/or height
 */
export type AnimateOptions = any
export type ViewportOptions = {
	screenWidth?: number
	screenHeight?: number
	worldWidth?: number
	worldHeight?: number
	/**
	 * Number of pixels to move to trigger an input event (e.g., drag, pinch) or
	 * disable a clicked event
	 */
	threshold?: number
	/**
	 * Whether the 'wheel' event is set to passive (note: if false,
	 * e.preventDefault() will be called when wheel is used over the viewport)
	 */
	passiveWheel?: boolean
	/**
	 * Whether to stopPropagation of events that impact the viewport (except wheel
	 * events, see options.passiveWheel)
	 */
	stopPropagation?: boolean
	/** Change the default hitArea from world size to a new value */
	forceHitArea?: any
	/** Set this if you want to manually call update() function on each frame */
	noTicker?: boolean
	/** Use this PIXI.ticker for updates */
	ticker?: PIXI.Ticker
	/**
	 * InteractionManager, available from instantiated
	 * WebGLRenderer/CanvasRenderer.plugins.interaction - used to calculate
	 * pointer postion relative to canvas location on screen
	 */
	interaction?: PIXI.InteractionManager
	/** Div to attach the wheel event */
	divWheel?: HTMLElement
	/** Remove oncontextmenu=() => {} from the divWheel element */
	disableOnContextMenu?: boolean
}
/** {(PIXI.Rectangle | PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.RoundedRectangle)} */
export type HitArea = any
export type OutOfBounds = any
export type LastViewport = any
/** Derive this class to create user-defined plugins */
export class Plugin {
	/** @param {Viewport} parent */
	constructor(parent: Viewport<any>)
	parent: Viewport<any>
	paused: boolean
	/** Called when plugin is removed */
	destroy(): void
	/**
	 * Handler for pointerdown PIXI event
	 *
	 * @param {PIXI.InteractionEvent} event
	 * @returns {boolean | void}
	 */
	down(): boolean | void
	/**
	 * Handler for pointermove PIXI event
	 *
	 * @param {PIXI.InteractionEvent} event
	 * @returns {boolean | void}
	 */
	move(): boolean | void
	/**
	 * Handler for pointerup PIXI event
	 *
	 * @param {PIXI.InteractionEvent} event
	 * @returns {boolean | void}
	 */
	up(): boolean | void
	/**
	 * Handler for wheel event on div
	 *
	 * @param {WheelEvent} event
	 * @returns {boolean | void}
	 */
	wheel(event: WheelEvent): boolean | void
	/**
	 * Called on each tick
	 *
	 * @param {number} elapsed Time in millisecond since last update
	 */
	update(): void
	/** Called when the viewport is resized */
	resize(): void
	/** Called when the viewport is manually moved */
	reset(): void
	/** Pause the plugin */
	pause(): void
	/** Un-pause the plugin */
	resume(): void
}
/**
 * Main class to use when creating a Viewport
 *
 * @template {BuiltInPlugins} Plugins
 */
export class Viewport<Plugins extends BuiltInPlugins> extends PIXI.Container {
	/**
	 * @fires clicked
	 * @fires drag-start
	 * @fires drag-end
	 * @fires drag-remove
	 * @fires pinch-start
	 * @fires pinch-end
	 * @fires pinch-remove
	 * @fires snap-start
	 * @fires snap-end
	 * @fires snap-remove
	 * @fires snap-zoom-start
	 * @fires snap-zoom-end
	 * @fires snap-zoom-remove
	 * @fires bounce-x-start
	 * @fires bounce-x-end
	 * @fires bounce-y-start
	 * @fires bounce-y-end
	 * @fires bounce-remove
	 * @fires wheel
	 * @fires wheel-remove
	 * @fires wheel-scroll
	 * @fires wheel-scroll-remove
	 * @fires mouse-edge-start
	 * @fires mouse-edge-end
	 * @fires mouse-edge-remove
	 * @fires moved
	 * @fires moved-end
	 * @fires zoomed
	 * @fires zoomed-end
	 * @fires frame-end
	 * @param {ViewportOptions} [options]
	 */
	constructor(options?: ViewportOptions)
	/** @type {ViewportOptions} */
	options: ViewportOptions
	/** @type {number} */
	screenWidth: number
	/** @type {number} */
	screenHeight: number
	_worldWidth: number
	_worldHeight: number
	set forceHitArea(arg: any)
	/**
	 * Permanently changes the Viewport's hitArea NOTE: if not set then hitArea =
	 * PIXI.Rectangle(Viewport.left, Viewport.top, Viewport.worldScreenWidth,
	 * Viewport.worldScreenHeight)
	 *
	 * @returns {HitArea}
	 */
	get forceHitArea(): any
	/**
	 * Number of pixels to move to trigger an input event (e.g., drag, pinch) or
	 * disable a clicked event
	 *
	 * @type {number}
	 */
	threshold: number
	tickerFunction: () => void
	/** @type {InputManager} */
	input: InputManager
	/**
	 * Use this to add user plugins or access existing plugins (e.g., to pause,
	 * resume, or remove them)
	 *
	 * @type {PluginManager<Plugins>}
	 */
	plugins: PluginManager<Plugins>
	/**
	 * Update viewport on each frame by default, you do not need to call this
	 * unless you set options.noTicker=true
	 *
	 * @param {number} elapsed Time in milliseconds since last update
	 */
	update(elapsed: number): void
	moving: boolean
	zooming: boolean
	_hitAreaDefault: PIXI.Rectangle
	_dirty: any
	lastViewport: any
	/**
	 * Use this to set screen and world sizes--needed for pinch/wheel/clamp/bounce
	 *
	 * @param {number} [screenWidth] Default is `window.innerWidth`
	 * @param {number} [screenHeight] Default is `window.innerHeight`
	 * @param {number} [worldWidth]
	 * @param {number} [worldHeight]
	 */
	resize(
		screenWidth?: number,
		screenHeight?: number,
		worldWidth?: number,
		worldHeight?: number
	): void
	set dirty(arg: boolean)
	/**
	 * Determines whether the viewport is dirty (i.e., needs to be renderered to
	 * the screen because of a change)
	 *
	 * @type {boolean}
	 */
	get dirty(): boolean
	set worldWidth(arg: number)
	/**
	 * World width in pixels
	 *
	 * @type {number}
	 */
	get worldWidth(): number
	set worldHeight(arg: number)
	/**
	 * World height in pixels
	 *
	 * @type {number}
	 */
	get worldHeight(): number
	/**
	 * Get visible bounds of viewport
	 *
	 * @returns {PIXI.Rectangle}
	 */
	getVisibleBounds(): PIXI.Rectangle
	/**
	 * Change coordinates from screen to world
	 *
	 * @param {number | PIXI.Point} x Or point
	 * @param {number} [y]
	 * @returns {PIXI.Point}
	 */
	toWorld(x: number | PIXI.Point, y?: number, ...args: any[]): PIXI.Point
	/**
	 * Change coordinates from world to screen
	 *
	 * @param {number | PIXI.Point} x Or point
	 * @param {number} [y]
	 * @returns {PIXI.Point}
	 */
	toScreen(x: number | PIXI.Point, y?: number, ...args: any[]): PIXI.Point
	/**
	 * Screen width in world coordinates
	 *
	 * @type {number}
	 */
	get worldScreenWidth(): number
	/**
	 * Screen height in world coordinates
	 *
	 * @type {number}
	 */
	get worldScreenHeight(): number
	/**
	 * World width in screen coordinates
	 *
	 * @type {number}
	 */
	get screenWorldWidth(): number
	/**
	 * World height in screen coordinates
	 *
	 * @type {number}
	 */
	get screenWorldHeight(): number
	set center(arg: PIXI.Point)
	/**
	 * Center of screen in world coordinates
	 *
	 * @type {PIXI.Point}
	 */
	get center(): PIXI.Point
	/**
	 * Move center of viewport to point
	 *
	 * @param {number | PIXI.Point} x Or point
	 * @param {number} [y]
	 * @returns {Viewport} This
	 */
	moveCenter(...args: any[]): Viewport<any>
	set corner(arg: PIXI.Point)
	/**
	 * Top-left corner of Viewport
	 *
	 * @type {PIXI.Point}
	 */
	get corner(): PIXI.Point
	/**
	 * Move viewport's top-left corner; also clamps and resets decelerate and
	 * bounce (as needed)
	 *
	 * @param {number | PIXI.Point} x Or point
	 * @param {number} [y]
	 * @returns {Viewport} This
	 */
	moveCorner(x: number | PIXI.Point, y?: number, ...args: any[]): Viewport<any>
	/**
	 * Get how many world pixels fit in screen's width
	 *
	 * @type {number}
	 */
	get screenWidthInWorldPixels(): number
	/**
	 * Get how many world pixels fit on screen's height
	 *
	 * @type {number}
	 */
	get screenHeightInWorldPixels(): number
	/**
	 * Find the scale value that fits a world width on the screen does not change
	 * the viewport (use fit... to change)
	 *
	 * @param {number} width In world pixels
	 * @returns {number} Scale
	 */
	findFitWidth(width: number): number
	/**
	 * Finds the scale value that fits a world height on the screens does not
	 * change the viewport (use fit... to change)
	 *
	 * @param {number} height In world pixels
	 * @returns {number} Scale
	 */
	findFitHeight(height: number): number
	/**
	 * Finds the scale value that fits the smaller of a world width and world
	 * height on the screen does not change the viewport (use fit... to change)
	 *
	 * @param {number} width In world pixels
	 * @param {number} height In world pixels
	 * @returns {number} Scale
	 */
	findFit(width: number, height: number): number
	/**
	 * Finds the scale value that fits the larger of a world width and world height
	 * on the screen does not change the viewport (use fit... to change)
	 *
	 * @param {number} width In world pixels
	 * @param {number} height In world pixels
	 * @returns {number} Scale
	 */
	findCover(width: number, height: number): number
	/**
	 * Change zoom so the width fits in the viewport
	 *
	 * @param {number} [width] In world coordinates Default is `this.worldWidth`
	 * @param {boolean} [center] Maintain the same center
	 * @param {boolean} [scaleY] Whether to set scaleY=scaleX Default is `true`
	 * @param {boolean} [noClamp] Whether to disable clamp-zoom
	 * @returns {Viewport} This
	 */
	fitWidth(
		width?: number,
		center?: boolean,
		scaleY?: boolean,
		noClamp?: boolean
	): Viewport<any>
	/**
	 * Change zoom so the height fits in the viewport
	 *
	 * @param {number} [height] In world coordinates Default is `this.worldHeight`
	 * @param {boolean} [center] Maintain the same center of the screen after zoom
	 * @param {boolean} [scaleX] Whether to set scaleX = scaleY Default is `true`
	 * @param {boolean} [noClamp] Whether to disable clamp-zoom
	 * @returns {Viewport} This
	 */
	fitHeight(
		height?: number,
		center?: boolean,
		scaleX?: boolean,
		noClamp?: boolean
	): Viewport<any>
	/**
	 * Change zoom so it fits the entire world in the viewport
	 *
	 * @param {boolean} center Maintain the same center of the screen after zoom
	 * @returns {Viewport} This
	 */
	fitWorld(center: boolean): Viewport<any>
	/**
	 * Change zoom so it fits the size or the entire world in the viewport
	 *
	 * @param {boolean} [center] Maintain the same center of the screen after zoom
	 * @param {number} [width] Desired width Default is `this.worldWidth`
	 * @param {number} [height] Desired height Default is `this.worldHeight`
	 * @returns {Viewport} This
	 */
	fit(center?: boolean, width?: number, height?: number): Viewport<any>
	/**
	 * Zoom viewport to specific value
	 *
	 * @param {number} scale Value (e.g., 1 would be 100%, 0.25 would be 25%)
	 * @param {boolean} [center] Maintain the same center of the screen after zoom
	 * @returns {Viewport} This
	 */
	setZoom(scale: number, center?: boolean): Viewport<any>
	/**
	 * Zoom viewport by a certain percent (in both x and y direction)
	 *
	 * @param {number} percent Change (e.g., 0.25 would increase a starting scale
	 *     of 1.0 to 1.25)
	 * @param {boolean} [center] Maintain the same center of the screen after zoom
	 * @returns {Viewport} This
	 */
	zoomPercent(percent: number, center?: boolean): Viewport<any>
	/**
	 * Zoom viewport by increasing/decreasing width by a certain number of pixels
	 *
	 * @param {number} change In pixels
	 * @param {boolean} [center] Maintain the same center of the screen after zoom
	 * @returns {Viewport} This
	 */
	zoom(change: number, center?: boolean): Viewport<any>
	/**
	 * Changes scale of viewport and maintains center of viewport
	 *
	 * @type {number}
	 */
	set scaled(arg: number)
	get scaled(): number
	/** @param {SnapZoomOptions} options */
	snapZoom(options: SnapZoomOptions): Viewport<Plugins>
	/**
	 * Is container out of world bounds
	 *
	 * @returns {OutOfBounds}
	 */
	OOB(): OutOfBounds
	set right(arg: number)
	/**
	 * World coordinates of the right edge of the screen
	 *
	 * @type {number}
	 */
	get right(): number
	set left(arg: number)
	/**
	 * World coordinates of the left edge of the screen
	 *
	 * @type {number}
	 */
	get left(): number
	set top(arg: number)
	/**
	 * World coordinates of the top edge of the screen
	 *
	 * @type {number}
	 */
	get top(): number
	set bottom(arg: number)
	/**
	 * World coordinates of the bottom edge of the screen
	 *
	 * @type {number}
	 */
	get bottom(): number
	_forceHitArea: any
	/**
	 * Enable one-finger touch to drag NOTE: if you expect users to use right-click
	 * dragging, you should enable viewport.options.disableOnContextMenu to avoid
	 * the context menu popping up on each right-click drag
	 *
	 * @param {DragOptions} [options]
	 * @returns {Viewport} This
	 */
	drag(options?: DragOptions): Viewport<any>
	/**
	 * Clamp to world boundaries or other provided boundaries NOTES: clamp is
	 * disabled if called with no options; use { direction: 'all' } for all edge
	 * clamping screenWidth, screenHeight, worldWidth, and worldHeight needs to be
	 * set for this to work properly
	 *
	 * @param {ClampOptions} [options]
	 * @returns {Viewport} This
	 */
	clamp(options?: ClampOptions): Viewport<any>
	/**
	 * Decelerate after a move NOTE: this fires 'moved' event during deceleration
	 *
	 * @param {DecelerateOptions} [options]
	 * @returns {Viewport} This
	 */
	decelerate(options?: DecelerateOptions): Viewport<any>
	/**
	 * Bounce on borders NOTES:
	 *     screenWidth, screenHeight, worldWidth, and worldHeight needs to be set for
	 * this to work properly
	 *     fires 'moved', 'bounce-x-start', 'bounce-y-start', 'bounce-x-end', and
	 * 'bounce-y-end' events
	 *
	 * @param {object} [options]
	 * @param {string} [options.sides] All, horizontal, vertical, or combination of
	 *     top, bottom, right, left (e.g., 'top-bottom-right') Default is `all`
	 * @param {number} [options.friction] Friction to apply to decelerate if active
	 *     Default is `0.5`
	 * @param {number} [options.time] Time in ms to finish bounce Default is `150`
	 * @param {object} [options.bounceBox] Use this bounceBox instead of (0, 0,
	 *     viewport.worldWidth, viewport.worldHeight)
	 * @param {number} [options.bounceBox.x] Default is `0`
	 * @param {number} [options.bounceBox.y] Default is `0`
	 * @param {number} [options.bounceBox.width] Default is `viewport.worldWidth`
	 * @param {number} [options.bounceBox.height] Default is `viewport.worldHeight`
	 * @param {string | function} [options.ease] Ease function or name (see
	 *     http://easings.net/ for supported names) Default is `easeInOutSine`
	 * @param {string} [options.underflow] (top/bottom/center and
	 *     left/right/center, or center) where to place world if too small for
	 *     screen Default is `center`
	 * @returns {Viewport} This
	 */
	bounce(options?: {
		sides: string
		friction: number
		time: number
		bounceBox: {
			x: number
			y: number
			width: number
			height: number
		}
		ease: string | Function
		underflow: string
	}): Viewport<any>
	/**
	 * Enable pinch to zoom and two-finger touch to drag
	 *
	 * @param {PinchOptions} [options]
	 * @returns {Viewport} This
	 */
	pinch(options?: PinchOptions): Viewport<any>
	/**
	 * Snap to a point
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {SnapOptions} [options]
	 * @returns {Viewport} This
	 */
	snap(x: number, y: number, options?: SnapOptions): Viewport<any>
	/**
	 * Follow a target NOTES:
	 *     uses the (x, y) as the center to follow; for PIXI.Sprite to work properly,
	 * use sprite.anchor.set(0.5)
	 *     options.acceleration is not perfect as it doesn't know the velocity of the target
	 *     it adds acceleration to the start of movement and deceleration to the end of
	 * movement when the target is stopped
	 *     fires 'moved' event
	 *
	 * @param {PIXI.DisplayObject} target To follow
	 * @param {FollowOptions} [options]
	 * @returns {Viewport} This
	 */
	follow(target: PIXI.DisplayObject, options?: FollowOptions): Viewport<any>
	/**
	 * Zoom using mouse wheel
	 *
	 * @param {WheelOptions} [options]
	 * @returns {Viewport} This
	 */
	wheel(options?: WheelOptions): Viewport<any>
	/**
	 * Animate the position and/or scale of the viewport
	 *
	 * @param {AnimateOptions} options
	 * @returns {Viewport} This
	 */
	animate(options: any): Viewport<any>
	/**
	 * The minWidth/Height settings are how small the world can get (as it would
	 * appear on the screen) before clamping. The maxWidth/maxHeight is how larger
	 * the world can scale (as it would appear on the screen) before clamping.
	 *
	 * For example, if you have a world size of 1000 x 1000 and a screen size of
	 * 100 x 100, if you set minWidth/Height = 100 then the world will not be able
	 * to zoom smaller than the screen size (ie, zooming out so it appears smaller
	 * than the screen). Similarly, if you set maxWidth/Height = 100 the world
	 * will not be able to zoom larger than the screen size (ie, zooming in so it
	 * appears larger than the screen). enable clamping of zoom to constraints
	 *
	 * @param {ClampZoomOptions} [options]
	 * @returns {Viewport} This
	 */
	clampZoom(options?: ClampZoomOptions): Viewport<any>
	/**
	 * Scroll viewport when mouse hovers near one of the edges or radius-distance
	 * from center of screen. NOTE: fires 'moved' event
	 *
	 * @param {MouseEdgesOptions} [options]
	 */
	mouseEdges(options?: MouseEdgesOptions): Viewport<Plugins>
	set pause(arg: boolean)
	/**
	 * Pause viewport (including animation updates such as decelerate)
	 *
	 * @type {boolean}
	 */
	get pause(): boolean
	_pause: boolean
	/**
	 * Move the viewport so the bounding box is visible
	 *
	 * @param {number} x - Left
	 * @param {number} y - Top
	 * @param {number} width
	 * @param {number} height
	 * @param {boolean} [resizeToFit] Resize the viewport so the box fits within the viewport
	 */
	ensureVisible(
		x: number,
		y: number,
		width: number,
		height: number,
		resizeToFit?: boolean
	): void
}
import * as PIXI from 'pixi.js'
import { Point } from 'pixi.js'
/** @private */
declare class Drag extends Plugin {
	/**
	 * @param {Viewport} parent
	 * @param {DragOptions} options
	 */
	constructor(parent: Viewport<any>, options?: DragOptions)
	options: {
		direction: string
		pressDrag: boolean
		wheel: boolean
		wheelScroll: number
		reverse: boolean
		clampWheel: boolean
		underflow: string
		factor: number
		mouseButtons: string
		keyToPress: any
		ignoreKeyToPressOnTouch: boolean
	} & DragOptions
	moved: boolean
	reverse: number
	xDirection: boolean
	yDirection: boolean
	keyIsPressed: boolean
	/**
	 * Handles keypress events and set the keyIsPressed boolean accordingly
	 *
	 * @param {array} codes - Key codes that can be used to trigger drag event
	 */
	handleKeyPresses(codes: any[]): void
	/**
	 * Initialize mousebuttons array
	 *
	 * @param {string} buttons
	 */
	mouseButtons(buttons: string): void
	mouse: boolean[]
	parseUnderflow(): void
	underflowX: number
	underflowY: number
	/**
	 * @param {PIXI.InteractionEvent} event
	 * @returns {boolean}
	 */
	checkButtons(event: PIXI.InteractionEvent): boolean
	/**
	 * @param {PIXI.InteractionEvent} event
	 * @returns {boolean}
	 */
	checkKeyPress(event: PIXI.InteractionEvent): boolean
	last: {
		x: number
		y: number
	}
	current: number
	get active(): boolean
	clamp(): void
}
declare class Pinch extends Plugin {
	/**
	 * @private
	 * @param {Viewport} parent
	 * @param {PinchOptions} [options]
	 */
	private constructor()
	options: {
		noDrag: boolean
		percent: number
		center: any
		factor: number
	} & PinchOptions
	active: boolean
	lastCenter: {
		x: number
		y: number
	}
	moved: boolean
	pinching: boolean
}
declare class Wheel extends Plugin {
	/**
	 * @private
	 * @param {Viewport} parent
	 * @param {WheelOptions} [options]
	 * @event wheel({wheel: {dx, dy, dz}, event, viewport})
	 */
	private constructor()
	options: never
	smoothing: any
	smoothingCount: number
	smoothingCenter: PIXI.Point
}
declare class Follow extends Plugin {
	/**
	 * @private
	 * @param {Viewport} parent
	 * @param {PIXI.DisplayObject} target To follow
	 * @param {FollowOptions} [options]
	 */
	private constructor()
	target: PIXI.DisplayObject
	options: {
		speed: number
		acceleration: any
		radius: any
	} & FollowOptions
	velocity: {
		x: number
		y: number
	}
}
declare class MouseEdges extends Plugin {
	/**
	 * Scroll viewport when mouse hovers near one of the edges.
	 *
	 * @private
	 * @param {Viewport} parent
	 * @param {MouseEdgeOptions} [options]
	 * @event mouse-edge-start(Viewport) emitted when mouse-edge starts
	 * @event mouse-edge-end(Viewport) emitted when mouse-edge ends
	 */
	private constructor()
	options: any
	reverse: number
	radiusSquared: number
	left: any
	top: any
	right: number
	bottom: number
	horizontal: number
	vertical: number
	decelerateHorizontal(): void
	decelerateVertical(): void
}
declare class Decelerate extends Plugin {
	/**
	 * @private
	 * @param {Viewport} parent
	 * @param {DecelerateOptions} [options]
	 */
	private constructor()
	options: {
		friction: number
		bounce: number
		minSpeed: number
	} & DecelerateOptions
	saved: any[]
	timeSinceRelease: number
	x: number | boolean
	y: number | boolean
	isActive(): number | boolean
	moved(data: any): void
	percentChangeX: number
	percentChangeY: number
	/**
	 * Manually activate plugin
	 *
	 * @param {object} options
	 * @param {number} [options.x]
	 * @param {number} [options.y]
	 */
	activate(options: { x: number; y: number }): void
}
declare class Bounce extends Plugin {
	/**
	 * @private
	 * @fires bounce-start-x
	 * @fires bounce.end-x
	 * @fires bounce-start-y
	 * @fires bounce-end-y
	 * @param {Viewport} parent
	 * @param {BounceOptions} [options]
	 */
	private constructor()
	options: any
	ease: any
	top: boolean
	bottom: boolean
	left: boolean
	right: boolean
	last: {}
	parseUnderflow(): void
	underflowX: number
	underflowY: number
	isActive(): boolean
	toX: {
		time: number
		start: number
		delta: number
		end: number
	}
	toY: {
		time: number
		start: number
		delta: number
		end: number
	}
	calcUnderflowX(): number
	calcUnderflowY(): number
	oob(): {
		left: boolean
		right: boolean
		top: boolean
		bottom: boolean
		topLeft: PIXI.Point
		bottomRight: PIXI.Point
	}
	bounce(): void
}
declare class SnapZoom extends Plugin {
	/**
	 * @param {Viewport} parent
	 * @param {SnapZoomOptions} options
	 * @event snap-zoom-start(Viewport) emitted each time a fit animation starts
	 * @event snap-zoom-end(Viewport) emitted each time fit reaches its target
	 * @event snap-zoom-end(Viewport) emitted each time fit reaches its target
	 */
	constructor(parent: Viewport<any>, options?: SnapZoomOptions)
	options: {
		width: number
		height: number
		time: number
		ease: string
		center: any
		interrupt: boolean
		removeOnComplete: boolean
		removeOnInterrupts: boolean
		forceStart: boolean
		noMove: boolean
	} & SnapZoomOptions
	ease: any
	xScale: number
	yScale: number
	xIndependent: boolean
	yIndependent: boolean
	createSnapping(): void
	snapping: {
		time: number
		startX: number
		startY: number
		deltaX: number
		deltaY: number
	}
}
declare class ClampZoom extends Plugin {
	/**
	 * @private
	 * @param {Viewport} parent
	 * @param {ClampZoomOptions} [options]
	 */
	private constructor()
	options: {
		minWidth: any
		minHeight: any
		maxWidth: any
		maxHeight: any
		minScale: any
		maxScale: any
	} & ClampZoomOptions
	clamp(): void
}
declare class Snap extends Plugin {
	/**
	 * @private
	 * @param {Viewport} parent
	 * @param {number} x
	 * @param {number} y
	 * @param {SnapOptions} [options]
	 * @event snap-start(Viewport) emitted each time a snap animation starts
	 * @event snap-restart(Viewport) emitted each time a snap resets because of
	 *     a
	 *
	 *
	 *          change in viewport size
	 * @event snap-end(Viewport) emitted each time snap reaches its target
	 * @event snap-remove(Viewport) emitted if snap plugin is removed
	 */
	private constructor()
	options: {
		topLeft: boolean
		friction: number
		time: number
		ease: string
		interrupt: boolean
		removeOnComplete: boolean
		removeOnInterrupt: boolean
		forceStart: boolean
	} & SnapOptions
	ease: any
	x: number
	y: number
	snapStart(): void
	percent: number
	snapping: {
		time: number
	}
	deltaX: number
	deltaY: number
	startX: number
	startY: number
}
declare class Clamp extends Plugin {
	/**
	 * @private
	 * @param {Viewport} parent
	 * @param {ClampOptions} [options]
	 */
	private constructor()
	options: {
		left: boolean
		right: boolean
		top: boolean
		bottom: boolean
		direction: any
		underflow: string
	} & ClampOptions
	last: {
		x: any
		y: any
		scaleX: any
		scaleY: any
	}
	parseUnderflow(): void
	noUnderflow: boolean
	underflowX: number
	underflowY: number
}
/**
 * @typedef ViewportTouch
 * @property {number} id
 * @property {PIXI.Point} last
 */
/**
 * Handles all input for Viewport
 *
 * @private
 */
declare class InputManager {
	constructor(viewport: any)
	viewport: any
	/**
	 * List of active touches on viewport
	 *
	 * @type {ViewportTouch[]}
	 */
	touches: ViewportTouch[]
	/**
	 * Add input listeners
	 *
	 * @private
	 */
	private addListeners
	wheelFunction: (e: any) => void
	isMouseDown: boolean
	/**
	 * Removes all event listeners from viewport (useful for cleanup of wheel when
	 * removing viewport)
	 */
	destroy(): void
	/**
	 * Handle down events for viewport
	 *
	 * @param {PIXI.InteractionEvent} event
	 */
	down(event: PIXI.InteractionEvent): void
	last: PIXI.Point
	clickedAvailable: boolean
	/** Clears all pointer events */
	clear(): void
	/**
	 * @param {number} change
	 * @returns Whether change exceeds threshold
	 */
	checkThreshold(change: number): boolean
	/**
	 * Handle move events for viewport
	 *
	 * @param {PIXI.InteractionEvent} event
	 */
	move(event: PIXI.InteractionEvent): void
	/**
	 * Handle up events for viewport
	 *
	 * @param {PIXI.InteractionEvent} event
	 */
	up(event: PIXI.InteractionEvent): void
	/**
	 * Gets pointer position if this.interaction is set
	 *
	 * @param {WheelEvent} event
	 * @returns {PIXI.Point}
	 */
	getPointerPosition(event: WheelEvent): PIXI.Point
	/**
	 * Handle wheel events
	 *
	 * @param {WheelEvent} event
	 */
	handleWheel(event: WheelEvent): void
	pause(): void
	/**
	 * Get touch by id
	 *
	 * @param {number} id
	 * @returns {ViewportTouch}
	 */
	get(id: number): ViewportTouch
	/**
	 * Remove touch by number
	 *
	 * @param {number} id
	 */
	remove(id: number): void
	/** @returns {number} Count of mouse/touch pointers that are down on the viewport */
	count(): number
}
/**
 * @typedef {object} BuiltInPlugins
 * @property {Drag} drag
 * @property {Pinch} pinch
 * @property {Wheel} wheel
 * @property {Follow} follow
 * @property {MouseEdges} mouse-edges
 * @property {Decelerate} decelerate
 * @property {Bounce} bounce
 * @property {SnapZoom} snap-zoom
 * @property {ClampZoom} clamp-zoom
 * @property {Snap} snap
 * @property {Clamp} clamp
 */
/**
 * Use this to access current plugins or add user-defined plugins
 *
 * @template {BuiltInPlugins} Plugins
 */
declare class PluginManager<Plugins extends BuiltInPlugins> {
	/**
	 * Instantiated by Viewport
	 *
	 * @param {Viewport} viewport
	 */
	constructor(viewport: Viewport<any>)
	viewport: Viewport<any>
	list: any[]
	plugins: {}
	/**
	 * Inserts a named plugin or a user plugin into the viewport default plugin
	 * order: 'drag', 'pinch', 'wheel', 'follow', 'mouse-edges', 'decelerate',
	 * 'bounce', 'snap-zoom', 'clamp-zoom', 'snap', 'clamp'
	 *
	 * @param {keyof Plugins} name - Name of plugin
	 * @param {Plugin} plugin - Instantiated Plugin class
	 * @param {number} index - To insert userPlugin (otherwise inserts it at the end)
	 */
	add(name: keyof Plugins, plugin: Plugin, index?: number): void
	/**
	 * Get plugin
	 *
	 * @template {keyof Plugins} T extends keyof Plugins
	 * @param {T} name - Of plugin
	 * @param {boolean} [ignorePaused] - Return null if plugin is paused
	 * @returns {Plugins[T] | null}
	 */
	get<T extends keyof Plugins>(name: T, ignorePaused?: boolean): Plugins[T]
	/**
	 * Update all active plugins
	 *
	 * @param {number} elapsed Type in milliseconds since last update
	 * @ignore
	 */
	update(elapsed: number): void
	/**
	 * Resize all active plugins
	 *
	 * @ignore
	 */
	resize(): void
	/** Clamps and resets bounce and decelerate (as needed) after manually moving viewport */
	reset(): void
	/**
	 * Removes installed plugin
	 *
	 * @param {keyof Plugins} name Name of plugin
	 */
	remove(name: keyof Plugins): void
	/**
	 * Pause plugin
	 *
	 * @param {keyof Plugins} name Name of plugin
	 */
	pause(name: keyof Plugins): void
	/**
	 * Resume plugin
	 *
	 * @param {keyof Plugins} name Name of plugin
	 */
	resume(name: keyof Plugins): void
	/**
	 * Sort plugins according to PLUGIN_ORDER
	 *
	 * @ignore
	 */
	sort(): void
	/**
	 * Handle down for all plugins
	 *
	 * @param {PIXI.InteractionEvent} event
	 * @ignore
	 * @returns {boolean}
	 */
	down(event: PIXI.InteractionEvent): boolean
	/**
	 * Handle move for all plugins
	 *
	 * @param {PIXI.InteractionEvent} event
	 * @ignore
	 * @returns {boolean}
	 */
	move(event: PIXI.InteractionEvent): boolean
	/**
	 * Handle up for all plugins
	 *
	 * @param {PIXI.InteractionEvent} event
	 * @ignore
	 * @returns {boolean}
	 */
	up(event: PIXI.InteractionEvent): boolean
	/**
	 * Handle wheel event for all plugins
	 *
	 * @param {WheelEvent} event
	 * @ignore
	 * @returns {boolean}
	 */
	wheel(e: any): boolean
}
import { Rectangle } from 'pixi.js'
export {}
