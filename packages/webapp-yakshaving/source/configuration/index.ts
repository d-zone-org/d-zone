import { UserConfigurationOptions } from './user-schema-types'
import { parseUserConfiguration } from './user-parse'
import { extractUserInformation } from './user-extract'

export function parseConfiguration(
	userConfiguration: UserConfigurationOptions
) {
	const parsedConfiguration = parseUserConfiguration(userConfiguration)
	const userInformation = extractUserInformation(
		parsedConfiguration.projectRoot,
		parsedConfiguration.ignoredDepsBundleDependencies
	)

	return { configuration: parsedConfiguration, user: userInformation }
}

export {
	UserConfigurationOptions,
	ConfigurationOptions,
} from './user-schema-types'
