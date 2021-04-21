export type Nullable<T> = T | null

export type FunctionType<A extends unknown[] = unknown[], R = unknown> = (
	...args: A
) => R
