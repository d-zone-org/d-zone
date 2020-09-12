declare module 'pixi-cull' {
	class SpatialHash {
		addContainer: (container) => void
		cull: (container) => void
		updateObject: (sprite) => void
	}
}
