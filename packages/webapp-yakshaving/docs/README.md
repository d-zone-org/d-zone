**[yakshaving - v0.5.1](README.md)**

> Globals

# yakshaving - v0.5.1

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

* [DependenciesBundleOptions](README.md#dependenciesbundleoptions)
* [RollupSucraseOptions](README.md#rollupsucraseoptions)
* [WatchModeOptions](README.md#watchmodeoptions)

### Variables

* [userConfigurationSchema](README.md#userconfigurationschema)

### Functions

* [configure](README.md#configure)
* [createDependenciesBundle](README.md#createdependenciesbundle)
* [developmentMode](README.md#developmentmode)
* [extractUserInformation](README.md#extractuserinformation)
* [getRequiredModules](README.md#getrequiredmodules)
* [interfaceObject](README.md#interfaceobject)
* [isObject](README.md#isobject)
* [listenToWatcher](README.md#listentowatcher)
* [parseConfiguration](README.md#parseconfiguration)
* [productionMode](README.md#productionmode)
* [startWatchMode](README.md#startwatchmode)
* [validateConfiguration](README.md#validateconfiguration)

## Type aliases

### DependenciesBundleOptions

Ƭ  **DependenciesBundleOptions**: Parameters\<*typeof* createDependenciesBundle>[0]

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/index.ts:4](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/index.ts#L4)*

___

### RollupSucraseOptions

Ƭ  **RollupSucraseOptions**: Parameters\<*typeof* RollupPluginSucrase>[0]

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:24](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L24)*

___

### WatchModeOptions

Ƭ  **WatchModeOptions**: Parameters\<*typeof* startWatchMode>[0]

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/index.ts:5](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/index.ts#L5)*

## Variables

### userConfigurationSchema

• `Const` **userConfigurationSchema**: Struct\<[Configuration](interfaces/configuration.md)> = object({ projectRoot: string(), entryPoint: union([string(), array(string()), record(string(), string())]), outputDirectory: string(), additionalPlugins: array(any()), advanced: optional( object({ ignoredDependencies: optional(array(string())), rollupOptions: optional( object({ input: optional( interfaceObject\<RollupInputOptions>('RollupInputOptions') ), output: optional( interfaceObject\<RollupOutputOptions>('RollupOutputOptions') ), }) ), pluginOptions: optional( object({ commonJs: optional( interfaceObject\<RollupCommonJSOptions>('CommonJSPluginOptions') ), nodeResolve: optional( interfaceObject\<RollupNodeResolveOptions>( 'NodeResolvePluginOptions' ) ), typescript: optional( interfaceObject\<RollupTypescriptOptions>('TypescriptPluginOptions') ), sucrase: optional( interfaceObject\<RollupSucraseOptions>('SucrasePluginOptions') ), terser: optional( interfaceObject\<TerserOptions>('TerserPluginOptions') ), replace: optional(record(string(), string())), }) ), }) ),})

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:79](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L79)*

## Functions

### configure

▸ **configure**(`configurationFactory`: (devMode: boolean) => [Configuration](interfaces/configuration.md) \| Promise\<[Configuration](interfaces/configuration.md)>): Promise\<void>

*Defined in [packages/webapp-yakshaving/source/index.ts:19](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/index.ts#L19)*

Configure bundler. Import this function in your configuration file
and call it with your configuration factory. Run your configuration file
like any other node application. Add `--dev` flag for development mode.
Check out `Configuration` interface for description of the properties.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`configurationFactory` | (devMode: boolean) => [Configuration](interfaces/configuration.md) \| Promise\<[Configuration](interfaces/configuration.md)> | Factory for configuration.  |

**Returns:** Promise\<void>

___

### createDependenciesBundle

▸ **createDependenciesBundle**(`__namedParameters`: { dependencies: [string, string][] ; outputDirectory: string ; plugins: { pluginCommonJs: commonjs ; pluginNodeResolve: nodeResolve ; pluginReplace: replace  } ; rollup: rollup ; userRequire: NodeRequire  }): Promise\<Record\<string, string>>

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle.ts:24](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle.ts#L24)*

Create bundle of dependencies

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { dependencies: [string, string][] ; outputDirectory: string ; plugins: { pluginCommonJs: commonjs ; pluginNodeResolve: nodeResolve ; pluginReplace: replace  } ; rollup: rollup ; userRequire: NodeRequire  } |

**Returns:** Promise\<Record\<string, string>>

Dependencies and their relative paths map

___

### developmentMode

▸ **developmentMode**(`__namedParameters`: { dependenciesBundleOptions: Pick\<{ dependencies: [string, string][] ; outputDirectory: string ; plugins: { pluginCommonJs: *typeof* PluginCommonJs ; pluginNodeResolve: *typeof* PluginNodeResolve ; pluginReplace: *typeof* PluginReplace  } ; rollup: *typeof* RollupFn ; userRequire: NodeRequire  }, \"rollup\" \| \"dependencies\" \| \"userRequire\" \| \"plugins\"> ; outputDirectory: string ; watchModeOptions: Pick\<{ additionalRollupSettings?: undefined \| { input?: RollupInputOptions ; output?: RollupOutputOptions  } ; dependenciesMap: Record\<string, string> ; entryPoint: InputOption ; extraPlugins: Plugin[] ; outputDirectory: string ; requiredPlugins: { commonJs: [*typeof* PluginCommonJs, undefined \| RollupCommonJSOptions] ; nodeResolve: [*typeof* PluginNodeResolve, undefined \| RollupNodeResolveOptions] ; sucrase: [*typeof* PluginSucrase, undefined \| Options] ; typescript: [*typeof* PluginTypescript, undefined \| RollupTypescriptPluginOptions & Partial\<CompilerOptions> \| RollupTypescriptPluginOptions & Partial\<JsonCompilerOptions>]  } ; watch: *typeof* WatchFn  }, \"entryPoint\" \| \"requiredPlugins\" \| \"extraPlugins\" \| \"watch\" \| \"additionalRollupSettings\">  }): Promise\<void>

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/index.ts:14](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/index.ts#L14)*

Start development mode

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { dependenciesBundleOptions: Pick\<{ dependencies: [string, string][] ; outputDirectory: string ; plugins: { pluginCommonJs: *typeof* PluginCommonJs ; pluginNodeResolve: *typeof* PluginNodeResolve ; pluginReplace: *typeof* PluginReplace  } ; rollup: *typeof* RollupFn ; userRequire: NodeRequire  }, \"rollup\" \| \"dependencies\" \| \"userRequire\" \| \"plugins\"> ; outputDirectory: string ; watchModeOptions: Pick\<{ additionalRollupSettings?: undefined \| { input?: RollupInputOptions ; output?: RollupOutputOptions  } ; dependenciesMap: Record\<string, string> ; entryPoint: InputOption ; extraPlugins: Plugin[] ; outputDirectory: string ; requiredPlugins: { commonJs: [*typeof* PluginCommonJs, undefined \| RollupCommonJSOptions] ; nodeResolve: [*typeof* PluginNodeResolve, undefined \| RollupNodeResolveOptions] ; sucrase: [*typeof* PluginSucrase, undefined \| Options] ; typescript: [*typeof* PluginTypescript, undefined \| RollupTypescriptPluginOptions & Partial\<CompilerOptions> \| RollupTypescriptPluginOptions & Partial\<JsonCompilerOptions>]  } ; watch: *typeof* WatchFn  }, \"entryPoint\" \| \"requiredPlugins\" \| \"extraPlugins\" \| \"watch\" \| \"additionalRollupSettings\">  } |

**Returns:** Promise\<void>

___

### extractUserInformation

▸ **extractUserInformation**(`projectRoot`: string, `ignoredDependencies`: string[]): [UserInformation](interfaces/userinformation.md)

*Defined in [packages/webapp-yakshaving/source/modules/configuration/extract-information.ts:22](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/configuration/extract-information.ts#L22)*

Extracts user information from `package.json`
and creates helper methods

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`projectRoot` | string | Users root directory |
`ignoredDependencies` | string[] | Ignored dependencies  |

**Returns:** [UserInformation](interfaces/userinformation.md)

___

### getRequiredModules

▸ **getRequiredModules**(...`requires`: NodeRequire[]): object

*Defined in [packages/webapp-yakshaving/source/modules/utilities/get-module.ts:12](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/utilities/get-module.ts#L12)*

Get required modules using the requires provided

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`...requires` | NodeRequire[] | NodeRequires to use to get the module  |

**Returns:** object

Name | Type |
------ | ------ |
`pluginCommonJs` | commonjs |
`pluginNodeResolve` | nodeResolve |
`pluginReplace` | replace |
`pluginSucrase` | PluginImpl\<Options> |
`pluginTerser` | terser |
`pluginTypescript` | typescript |
`rollup` | "D:/Projects/d-zone/.yarn/cache/rollup-npm-2.32.1-d2d2a2aab7-b231dfa7b0.zip/node\_modules/rollup/dist/rollup" |

___

### interfaceObject

▸ `Const`**interfaceObject**\<T>(`name`: string): Struct\<T, null>

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:30](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L30)*

#### Type parameters:

Name | Type |
------ | ------ |
`T` | unknown |

#### Parameters:

Name | Type |
------ | ------ |
`name` | string |

**Returns:** Struct\<T, null>

___

### isObject

▸ `Const`**isObject**(`val`: unknown): boolean

*Defined in [packages/webapp-yakshaving/source/modules/configuration/schema-types.ts:28](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/configuration/schema-types.ts#L28)*

#### Parameters:

Name | Type |
------ | ------ |
`val` | unknown |

**Returns:** boolean

___

### listenToWatcher

▸ **listenToWatcher**(`watcher`: RollupWatcher): void

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts:119](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts#L119)*

#### Parameters:

Name | Type |
------ | ------ |
`watcher` | RollupWatcher |

**Returns:** void

___

### parseConfiguration

▸ **parseConfiguration**(`configuration`: [Configuration](interfaces/configuration.md)): object

*Defined in [packages/webapp-yakshaving/source/modules/configuration/index.ts:5](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/configuration/index.ts#L5)*

#### Parameters:

Name | Type |
------ | ------ |
`configuration` | [Configuration](interfaces/configuration.md) |

**Returns:** object

Name | Type |
------ | ------ |
`configuration` | [Configuration](interfaces/configuration.md) |
`user` | [UserInformation](interfaces/userinformation.md) |

___

### productionMode

▸ **productionMode**(`__namedParameters`: { additionalRollupSettings: undefined \| { input?: RollupInputOptions ; output?: RollupOutputOptions  } ; entryPoint: InputOption ; extraPlugins: Plugin[] ; outputDirectory: string ; requiredPlugins: { commonJs: [commonjs, undefined \| RollupCommonJSOptions] ; nodeResolve: [nodeResolve, undefined \| RollupNodeResolveOptions] ; replace: [replace, undefined \| Record\<string, string>] ; terser: [terser, undefined \| Options] ; typescript: [typescript, undefined \| RollupTypescriptPluginOptions & Partial\<CompilerOptions> \| RollupTypescriptPluginOptions & Partial\<JsonCompilerOptions>]  } ; rollup: rollup  }): Promise\<void>

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/production/index.ts:24](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/production/index.ts#L24)*

Start production mode

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { additionalRollupSettings: undefined \| { input?: RollupInputOptions ; output?: RollupOutputOptions  } ; entryPoint: InputOption ; extraPlugins: Plugin[] ; outputDirectory: string ; requiredPlugins: { commonJs: [commonjs, undefined \| RollupCommonJSOptions] ; nodeResolve: [nodeResolve, undefined \| RollupNodeResolveOptions] ; replace: [replace, undefined \| Record\<string, string>] ; terser: [terser, undefined \| Options] ; typescript: [typescript, undefined \| RollupTypescriptPluginOptions & Partial\<CompilerOptions> \| RollupTypescriptPluginOptions & Partial\<JsonCompilerOptions>]  } ; rollup: rollup  } |

**Returns:** Promise\<void>

___

### startWatchMode

▸ **startWatchMode**(`__namedParameters`: { additionalRollupSettings: undefined \| { input?: RollupInputOptions ; output?: RollupOutputOptions  } ; dependenciesMap: Record\<string, string> ; entryPoint: InputOption ; extraPlugins: Plugin[] ; outputDirectory: string ; requiredPlugins: { commonJs: [*typeof* PluginCommonJs, undefined \| RollupCommonJSOptions] ; nodeResolve: [*typeof* PluginNodeResolve, undefined \| RollupNodeResolveOptions] ; sucrase: [*typeof* PluginSucrase, undefined \| Options] ; typescript: [*typeof* PluginTypescript, undefined \| RollupTypescriptPluginOptions & Partial\<CompilerOptions> \| RollupTypescriptPluginOptions & Partial\<JsonCompilerOptions>]  } ; watch: watch  }): Promise\<void>

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts:25](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/watch-mode.ts#L25)*

Start watch mode for application

#### Parameters:

Name | Type |
------ | ------ |
`__namedParameters` | { additionalRollupSettings: undefined \| { input?: RollupInputOptions ; output?: RollupOutputOptions  } ; dependenciesMap: Record\<string, string> ; entryPoint: InputOption ; extraPlugins: Plugin[] ; outputDirectory: string ; requiredPlugins: { commonJs: [*typeof* PluginCommonJs, undefined \| RollupCommonJSOptions] ; nodeResolve: [*typeof* PluginNodeResolve, undefined \| RollupNodeResolveOptions] ; sucrase: [*typeof* PluginSucrase, undefined \| Options] ; typescript: [*typeof* PluginTypescript, undefined \| RollupTypescriptPluginOptions & Partial\<CompilerOptions> \| RollupTypescriptPluginOptions & Partial\<JsonCompilerOptions>]  } ; watch: watch  } |

**Returns:** Promise\<void>

___

### validateConfiguration

▸ **validateConfiguration**(`userConfiguration`: [Configuration](interfaces/configuration.md)): [Configuration](interfaces/configuration.md)

*Defined in [packages/webapp-yakshaving/source/modules/configuration/validate.ts:10](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/configuration/validate.ts#L10)*

Validate configuration

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userConfiguration` | [Configuration](interfaces/configuration.md) | Configuration  |

**Returns:** [Configuration](interfaces/configuration.md)
