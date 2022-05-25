import { useLayoutEffect } from 'react'
import create, { UseStore } from 'zustand'
import createContext from 'zustand/context'

import { defaultState, StoreState } from './type'

const { Provider, useStore } = createContext<StoreState>()

let store = null as null | UseStore<StoreState>

/**
 * Creates a new store
 *
 * @param initState - Initial state
 * @returns New store
 */
export function createNewStore(initState: StoreState) {
	return create<StoreState>(() => Object.assign({ ...defaultState }, initState))
}

/**
 * Creates a new store or returns the existing based on environment then hydrates
 * it again when dom loads
 *
 * @param state - Store state
 * @returns Hydrated store
 */
export function useHydratedStore(state: StoreState) {
	if (typeof window === 'undefined') return createNewStore(state)
	else {
		store = store || createNewStore(state)

		useLayoutEffect(() => {
			if (store)
				store.setState({
					...store.getState(),
					...state,
				})
		}, [])

		return store
	}
}

export { useStore, Provider as StoreProvider }
export type { StoreState } from './type'
