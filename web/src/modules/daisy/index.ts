import { useEffect, useRef } from 'react'

import { Communication } from '../communication'
import { Game } from '../game'
import { Nullable } from 'root/typings/util'

export const useDaisy = () => {
	const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null)
	const communicationRef = useRef<Nullable<Communication>>(null)
	const gameRef = useRef<Nullable<Game>>(null)

	// Run only on component mount
	useEffect(() => {
		const communication = new Communication()
		const game = new Game()

		communicationRef.current = communication
		gameRef.current = game

		const asyncWrapper = async () => {
			if (!canvasRef.current) throw new Error('No canvas found')

			await Promise.all([game.init(canvasRef.current), communication.init()])

			const { users } = await communication.join('700890186883530844')
			game.addUsers(users)
		}

		asyncWrapper().catch(console.error)

		// Clean up function
		// Run when component is unmounted
		return () => {
			game.exit()

			communicationRef.current = null
			gameRef.current = null
		}
	}, [])

	return { canvasRef, gameRef }
}
