import { Configuration } from './schema-types'
import { validateConfiguration } from './validate'
import { extractUserInformation } from './extract-information'

export function parseConfiguration(configuration: Configuration) {
	const validatedConfiguration = validateConfiguration(configuration)
	const userInformation = extractUserInformation(
		validatedConfiguration.projectRoot,
		validatedConfiguration.advanced?.ignoredDependencies || []
	)

	return { configuration: validatedConfiguration, user: userInformation }
}
