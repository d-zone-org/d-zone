export type OnlyKeys<T> = {
	[K in keyof T]: T[K] extends Record<string, unknown>
		? OnlyKeys<T[K]>
		: unknown
}
