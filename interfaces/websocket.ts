interface Payload<T extends string, D extends Record<string, unknown>> {
	type: T
	data: D
}

// FROM CLIENT

type ClientPayload<
	T extends `CLIENT_${string}`,
	D extends Record<string, unknown>
> = Payload<T, D>

export type ClientPayloads = ClientPayload<
	'CLIENT_UNKNOWN',
	{ unknown: unknown }
>

// FROM SERVER

type ServerPayload<
	T extends `SERVER_${string}`,
	D extends Record<string, unknown>
> = Payload<T, D>

export type ServerPayloads = ServerPayload<
	'SERVER_MESSAGE',
	{ message: string }
>
