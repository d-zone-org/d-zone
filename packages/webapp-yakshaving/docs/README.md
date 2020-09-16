[yakshaving - v0.5.0](README.md)

# yakshaving - v0.5.0

## Index

### Classes

* [DependenciesCache](classes/dependenciescache.md)
* [YakError](classes/yakerror.md)

### Interfaces

* [CacheDependencyData](interfaces/cachedependencydata.md)
* [Configuration](interfaces/configuration.md)
* [Manifest](interfaces/manifest.md)
* [UserInformation](interfaces/userinformation.md)
* [YakErrorContext](interfaces/yakerrorcontext.md)

### Type aliases

* [RollupSucraseOptions](README.md#rollupsucraseoptions)

### Variables

* [userConfigurationSchema](README.md#const-userconfigurationschema)

### Functions

* [configure](README.md#configure)
* [createDependenciesBundle](README.md#createdependenciesbundle)
* [developmentMode](README.md#developmentmode)
* [extractUserInformation](README.md#extractuserinformation)
* [getRequiredModules](README.md#getrequiredmodules)
* [interfaceObject](README.md#const-interfaceobject)
* [isObject](README.md#const-isobject)
* [listenTheWatcher](README.md#listenthewatcher)
* [parseConfiguration](README.md#parseconfiguration)
* [productionMode](README.md#productionmode)
* [startWatchMode](README.md#startwatchmode)
* [validateConfiguration](README.md#validateconfiguration)

## Type aliases

###  RollupSucraseOptions

Ƭ **RollupSucraseOptions**: *Parameters‹typeof RollupPluginSucrase›[0]*

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:24](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L24)*

## Variables

### `Const` userConfigurationSchema

• **userConfigurationSchema**: *Struct‹[Configuration](interfaces/configuration.md)›* = object({
	projectRoot: string(),
	entryPoint: union([string(), array(string()), record(string(), string())]),
	outputDirectory: string(),
	additionalPlugins: array(any()),

	advanced: optional(
		object({
			ignoredDependencies: optional(array(string())),

			rollupOptions: optional(
				object({
					input: optional(
						interfaceObject<RollupInputOptions>('RollupInputOptions')
					),
					output: optional(
						interfaceObject<RollupOutputOptions>('RollupOutputOptions')
					),
				})
			),

			pluginOptions: optional(
				object({
					commonJs: optional(
						interfaceObject<RollupCommonJSOptions>('CommonJSPluginOptions')
					),
					nodeResolve: optional(
						interfaceObject<RollupNodeResolveOptions>(
							'NodeResolvePluginOptions'
						)
					),
					typescript: optional(
						interfaceObject<RollupTypescriptOptions>('TypescriptPluginOptions')
					),
					sucrase: optional(
						interfaceObject<RollupSucraseOptions>('SucrasePluginOptions')
					),
					terser: optional(
						interfaceObject<TerserOptions>('TerserPluginOptions')
					),
					replace: optional(record(string(), string())),
				})
			),
		})
	),
})

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:79](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L79)*

## Functions

###  configure

▸ **configure**(`configurationFactory`: function): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/index.ts:21](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/index.ts#L21)*

Configure bundler. Import this function in your configuration file
and call it with your configuration factory. Run your configuration file
like any other node application. Add `--dev` flag for development mode.
Check out `Configuration` interface for description of the properties.

**Parameters:**

▪ **configurationFactory**: *function*

Factory for configuration.

▸ (`devMode`: boolean): *[Configuration](interfaces/configuration.md) | Promise‹[Configuration](interfaces/configuration.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`devMode` | boolean |

**Returns:** *Promise‹void›*

___

###  createDependenciesBundle

▸ **createDependenciesBundle**(`__namedParameters`: object): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle.ts:23](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle.ts#L23)*

Create bundle of dependencies

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`dependencies` | [string, string][] |
`outputDirectory` | string |
`plugins` | object |
`rollup` | rollup |
`userRequire` | NodeRequire |

**Returns:** *Promise‹void›*

___

###  developmentMode

▸ **developmentMode**(`__namedParameters`: object): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/index.ts:10](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/build-modes/development/index.ts#L10)*

Start development mode

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`dependenciesBundleOptions` | object |
`watchModeOptions` | object |

**Returns:** *Promise‹void›*

___

###  extractUserInformation

▸ **extractUserInformation**(`projectRoot`: string, `ignoredDependencies`: string[]): *[UserInformation](interfaces/userinformation.md)*

*Defined in [packages/webapp-yakshaving/source/modules/configuration/extract-information.ts:22](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/configuration/extract-information.ts#L22)*

Extracts user information from `package.json`
and creates helper methods

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectRoot` | string | Users root directory |
`ignoredDependencies` | string[] | Ignored dependencies  |

**Returns:** *[UserInformation](interfaces/userinformation.md)*

___

###  getRequiredModules

▸ **getRequiredModules**(...`requires`: NodeRequire[]): *object*

*Defined in [packages/webapp-yakshaving/source/modules/utilities/get-module.ts:12](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/utilities/get-module.ts#L12)*

Get required modules using the requires provided

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...requires` | NodeRequire[] | NodeRequires to use to get the module  |

**Returns:** *object*

* **pluginCommonJs**: *commonjs* = getModule<typeof pluginCommonJs>('@rollup/plugin-commonjs')

* **pluginNodeResolve**: *nodeResolve* = getModule<typeof import('@rollup/plugin-node-resolve')>(
			'@rollup/plugin-node-resolve'
		).nodeResolve

* **pluginReplace**: *replace* = getModule<typeof pluginReplace>('@rollup/plugin-replace')

* **pluginSucrase**: *PluginImpl‹Options›* = getModule<typeof pluginSucrase>('@rollup/plugin-sucrase')

* **pluginTerser**: *terser* = getModule<typeof import('rollup-plugin-terser')>(
			'rollup-plugin-terser'
		).terser

* **pluginTypescript**: *typescript* = getModule<typeof pluginTypescript>(
			'@rollup/plugin-typescript'
		)

* **rollup**: *"D:/Sagnik/Projects/d-zone/.yarn/cache/rollup-npm-2.26.11-64b5fb1f64-65759710ab.zip/node_modules/rollup/dist/rollup"* = getModule<typeof import('rollup')>('rollup')

___

### `Const` interfaceObject

▸ **interfaceObject**‹**T**›(`name`: string): *Struct‹T, null›*

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:30](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L30)*

**Type parameters:**

▪ **T**: *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *Struct‹T, null›*

___

### `Const` isObject

▸ **isObject**(`val`: unknown): *boolean*

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:28](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`val` | unknown |

**Returns:** *boolean*

___

###  listenTheWatcher

▸ **listenTheWatcher**(`watcher`: RollupWatcher): *void*

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts:119](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`watcher` | RollupWatcher |

**Returns:** *void*

___

###  parseConfiguration

▸ **parseConfiguration**(`configuration`: [Configuration](interfaces/configuration.md)): *object*

*Defined in [packages/webapp-yakshaving/source/modules/configuration/index.ts:5](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/configuration/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`configuration` | [Configuration](interfaces/configuration.md) |

**Returns:** *object*

* **configuration**: *[Configuration](interfaces/configuration.md)* = validatedConfiguration

* **user**: *[UserInformation](interfaces/userinformation.md)* = userInformation

___

###  productionMode

▸ **productionMode**(`__namedParameters`: object): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/production/index.ts:24](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/build-modes/production/index.ts#L24)*

Start production mode

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`additionalRollupSettings` | undefined &#124; object |
`entryPoint` | InputOption |
`extraPlugins` | Plugin‹›[] |
`outputDirectory` | string |
`requiredPlugins` | object |
`rollup` | rollup |

**Returns:** *Promise‹void›*

___

###  startWatchMode

▸ **startWatchMode**(`__namedParameters`: object): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts:25](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts#L25)*

Start watch mode for application

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`additionalRollupSettings` | undefined &#124; object |
`dependencyMap` | Record‹string, string› |
`entryPoint` | InputOption |
`extraPlugins` | Plugin‹›[] |
`outputDirectory` | string |
`requiredPlugins` | object |
`watch` | watch |

**Returns:** *Promise‹void›*

___

###  validateConfiguration

▸ **validateConfiguration**(`userConfiguration`: [Configuration](interfaces/configuration.md)): *[Configuration](interfaces/configuration.md)*

*Defined in [packages/webapp-yakshaving/source/modules/configuration/validate.ts:10](https://github.com/d-zone-org/d-zone/blob/cd5a088/packages/webapp-yakshaving/source/modules/configuration/validate.ts#L10)*

Validate configuration

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`userConfiguration` | [Configuration](interfaces/configuration.md) | Configuration  |

**Returns:** *[Configuration](interfaces/configuration.md)*
