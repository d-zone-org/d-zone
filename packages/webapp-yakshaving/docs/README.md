[yakshaving - v0.4.1](README.md)

# yakshaving - v0.4.1

## Index

### Classes

* [DependenciesCache](classes/dependenciescache.md)
* [YakError](classes/yakerror.md)

### Interfaces

* [CacheDependencyData](interfaces/cachedependencydata.md)
* [ConfigurationOptions](interfaces/configurationoptions.md)
* [PluginAndOptions](interfaces/pluginandoptions.md)
* [YakErrorContext](interfaces/yakerrorcontext.md)

### Type aliases

* [RecursivePartial](README.md#recursivepartial)
* [UserConfigurationOptions](README.md#userconfigurationoptions)

### Variables

* [plugin](README.md#const-plugin)
* [pluginAndOptionsSchema](README.md#const-pluginandoptionsschema)
* [userConfigurationOptionsSchema](README.md#const-userconfigurationoptionsschema)

### Functions

* [configure](README.md#configure)
* [createDependenciesBundle](README.md#createdependenciesbundle)
* [developmentMode](README.md#developmentmode)
* [extractUserInformation](README.md#extractuserinformation)
* [listenTheWatcher](README.md#listenthewatcher)
* [parseConfiguration](README.md#parseconfiguration)
* [parseUserConfiguration](README.md#parseuserconfiguration)
* [productionMode](README.md#productionmode)
* [startWatchMode](README.md#startwatchmode)

### Object literals

* [DEFAULT_CONFIGURATION](README.md#const-default_configuration)

## Type aliases

###  RecursivePartial

Ƭ **RecursivePartial**: *object*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:102

#### Type declaration:

___

###  UserConfigurationOptions

Ƭ **UserConfigurationOptions**: *Omit‹[ConfigurationOptions](interfaces/configurationoptions.md), "advanced"› & [RecursivePartial](README.md#recursivepartial)‹Pick‹[ConfigurationOptions](interfaces/configurationoptions.md), "advanced"››*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:109

Similar to `ConfigurationOptions` but advanced options are all optional

## Variables

### `Const` plugin

• **plugin**: *ZodFunction‹ZodTuple‹[ZodAny‹›]›, ZodAny‹››* = z.function(z.tuple([z.any()]), z.any())

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:38

___

### `Const` pluginAndOptionsSchema

• **pluginAndOptionsSchema**: *ZodObject‹object, object, object›* = z
	.object({
		plugin,

		config: z
			.object({
				common: z.any(),
				development: z.any(),
				production: z.any(),
			})
			.optional(),
	})
	.deepPartial()

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:39

___

### `Const` userConfigurationOptionsSchema

• **userConfigurationOptionsSchema**: *ZodObject‹object, object, object›* = z.object({
	projectRoot: z.string(),
	entryPoint: z.string(),
	outputDirectory: z.string(),

	ignoredDepsBundleDependencies: z.array(z.string()).optional(),
	additionalPlugins: z
		.function(
			z.tuple([z.boolean()]),
			z.union([z.promise(z.array(z.any())), z.array(z.any())])
		)
		.optional(),

	advanced: z
		.object({
			rollup: z.union([
				z.tuple([
					z
						.object({
							input: z.record(z.unknown()),
							output: z.record(z.unknown()),
						})
						.partial(),
				]),
				z.tuple([
					z
						.object({
							input: z.record(z.unknown()),
							output: z.record(z.unknown()),
						})
						.partial(),
					z.function(z.tuple([z.any()]), z.promise(z.any())),
				]),
			]),
			watch: z.union([
				z.tuple([z.record(z.unknown())]),
				z.tuple([
					z.record(z.unknown()),
					z.function(z.tuple([z.any()]), z.any()),
				]),
			]),

			corePluginsAndOptions: z.object({
				commonJs: pluginAndOptionsSchema,
				nodeResolve: pluginAndOptionsSchema,
				replace: z.object({ plugin }),
				sucrase: pluginAndOptionsSchema,
				typescript: pluginAndOptionsSchema,
				terser: pluginAndOptionsSchema,
			}),
		})
		.deepPartial()
		.optional(),
})

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:112

## Functions

###  configure

▸ **configure**(`options`: [UserConfigurationOptions](README.md#userconfigurationoptions)): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/index.ts:12](https://github.com/d-zone-org/d-zone/blob/fd51575/packages/webapp-yakshaving/source/index.ts#L12)*

Configure bundler. Import this function in your configuration file
and call it with your configuration. Run your configuration file
like any other node application. Add `--dev` flag for development mode.
Check out `ConfigurationOptions` interface for description of the properties.
The function might emit error, please handle it properly.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [UserConfigurationOptions](README.md#userconfigurationoptions) | Configuration Options  |

**Returns:** *Promise‹void›*

___

###  createDependenciesBundle

▸ **createDependenciesBundle**(`__namedParameters`: object): *Promise‹void›*

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle.ts:23

Create bundle of dependencies

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`dependencies` | [string, string][] |
`outputDirectory` | string |
`plugins` | [commonjs, nodeResolve, replace] |
`rollup` | rollup |
`userRequire` | NodeRequire |

**Returns:** *Promise‹void›*

___

###  developmentMode

▸ **developmentMode**(`__namedParameters`: object): *Promise‹void›*

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/index.ts:10

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

▸ **extractUserInformation**(`projectRoot`: string, `ignoredDependencies`: string[]): *object*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-extract.ts:11

Extracts user information from `package.json`
and creates helper methods

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectRoot` | string | Users root directory |
`ignoredDependencies` | string[] | Ignored dependencies  |

**Returns:** *object*

* **dependencies**: *[string, string][]* = Object.entries(manifest.dependencies).filter(
			([dependencyId]) => !ignoredDependencies.includes(dependencyId)
		)

* **manifest**(): *object*

  * **dependencies**: *Record‹string, string›*

* **require**: *NodeRequire* = module.createRequire(manifestPath)

* **root**: *root*

___

###  listenTheWatcher

▸ **listenTheWatcher**(`watcher`: RollupWatcher): *void*

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts:115

**Parameters:**

Name | Type |
------ | ------ |
`watcher` | RollupWatcher |

**Returns:** *void*

___

###  parseConfiguration

▸ **parseConfiguration**(`userConfiguration`: [UserConfigurationOptions](README.md#userconfigurationoptions)): *object*

Defined in packages/webapp-yakshaving/source/modules/configuration/index.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`userConfiguration` | [UserConfigurationOptions](README.md#userconfigurationoptions) |

**Returns:** *object*

* **configuration**: *[ConfigurationOptions](interfaces/configurationoptions.md)* = parsedConfiguration

* **user**(): *object*

  * **dependencies**: *[string, string][]* = Object.entries(manifest.dependencies).filter(
			([dependencyId]) => !ignoredDependencies.includes(dependencyId)
		)

  * **manifest**(): *object*

    * **dependencies**: *Record‹string, string›*

  * **require**: *NodeRequire* = module.createRequire(manifestPath)

  * **root**: *root*

___

###  parseUserConfiguration

▸ **parseUserConfiguration**(`userConfiguration`: [UserConfigurationOptions](README.md#userconfigurationoptions)): *[ConfigurationOptions](interfaces/configurationoptions.md)*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-parse.ts:38

Parse user configuration and deep merge the defaults

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`userConfiguration` | [UserConfigurationOptions](README.md#userconfigurationoptions) | Configuration  |

**Returns:** *[ConfigurationOptions](interfaces/configurationoptions.md)*

___

###  productionMode

▸ **productionMode**(`__namedParameters`: object): *Promise‹void›*

Defined in packages/webapp-yakshaving/source/modules/build-modes/production/index.ts:24

Start production mode

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`additionalRollupSettings` | undefined &#124; object |
`entryPoint` | string |
`extraPlugins` | Plugin‹›[] |
`outputDirectory` | string |
`requiredPlugins` | object |
`rollup` | rollup |

**Returns:** *Promise‹void›*

___

###  startWatchMode

▸ **startWatchMode**(`__namedParameters`: object): *Promise‹void›*

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts:24

Start watch mode for application

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`additionalRollupSettings` | undefined &#124; object |
`dependencyMap` | Record‹string, string› |
`entryPoint` | string |
`extraPlugins` | Plugin‹›[] |
`outputDirectory` | string |
`requiredPlugins` | object |
`watch` | watch |

**Returns:** *Promise‹void›*

## Object literals

### `Const` DEFAULT_CONFIGURATION

### ▪ **DEFAULT_CONFIGURATION**: *object*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-parse.ts:11

▪ **advanced**: *object*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-parse.ts:12

* **rollup**: *[object, any]* = [{}, require('rollup').rollup]

* **watch**: *[object, any]* = [{}, require('rollup').watch]

* **corePluginsAndOptions**: *object*

  * **commonJs**: *object*

    * **plugin**: *any* = require('@rollup/plugin-commonjs')

  * **nodeResolve**: *object*

    * **plugin**: *any* = require('@rollup/plugin-node-resolve').nodeResolve

    * **config**: *object*

      * **common**: *object*

        * **extensions**: *string[]* = ['.mjs', '.js', '.json', '.node', '.ts', '.tsx']

  * **replace**: *object*

    * **plugin**: *any* = require('@rollup/plugin-replace')

  * **sucrase**: *object*

    * **plugin**: *any* = require('@rollup/plugin-sucrase')

  * **terser**: *object*

    * **plugin**: *any* = require('rollup-plugin-terser').terser

  * **typescript**: *object*

    * **plugin**: *any* = require('@rollup/plugin-typescript')
