import { validate } from 'superstruct'

import { YakError } from '../utilities/error'
import { Configuration, userConfigurationSchema } from './schema-types'

/**
 * Validate configuration
 * @param userConfiguration - Configuration
 */
export function validateConfiguration(
	userConfiguration: Configuration
): Configuration {
	const [error, parsedConfiguration] = validate(
		userConfiguration,
		userConfigurationSchema
	)

	if (error) {
		const { value, type, path } = error
		const key = path.join('.')

		let message = `${key} is invalid`

		if (value === undefined) message = `${key} is required`
		if (type === 'never') message = `${key} is an unknown property`

		throw new YakError('INVALID_CONFIGURATION', message, {
			internal: false,
			isOperational: false,
			error,
		})
	} else return parsedConfiguration as Configuration
}
