[yakshaving - v0.3.0](../README.md) › ["index"](../modules/_index_.md) › [ConfigurationOptions](_index_.configurationoptions.md)

# Interface: ConfigurationOptions

Configuration Options

**`property`** options.projectRoot - Your project's root directory

**`property`** options.entryPoint - Path to entry file, relative to `projectRoot`

**`property`** options.outputDirectory - Output directory, relative to `projectRoot`

**`property`** options.rollup - `rollup` method from rollup

**`property`** options.watch - `watch` method from rollup

**`property`** options.requiredPlugins - Required plugins

**`property`** options.development - Development mode settings

**`property`** options.development.ignoredDependencies - Dependencies to be not bundled separately

**`property`** options.development.additionalPlugins - Additional plugins to be used in dev mode

**`property`** options.development.additionalRollupSettings - Add development mode specific rollup settings

**`property`** options.production - Production mode settings

**`property`** options.production.additionalPlugins - Additional plugins to be used in prod mode

**`property`** options.production.additionalRollupSettings - Add production mode specific rollup settings

## Hierarchy

* **ConfigurationOptions**

## Index

### Properties

* [development](_index_.configurationoptions.md#optional-development)
* [entryPoint](_index_.configurationoptions.md#entrypoint)
* [outputDirectory](_index_.configurationoptions.md#outputdirectory)
* [production](_index_.configurationoptions.md#optional-production)
* [projectRoot](_index_.configurationoptions.md#projectroot)
* [requiredPlugins](_index_.configurationoptions.md#requiredplugins)
* [rollup](_index_.configurationoptions.md#rollup)
* [watch](_index_.configurationoptions.md#watch)

## Properties

### `Optional` development

• **development**? : *undefined | object*

*Defined in [packages/webapp-yakshaving/source/index.ts:59](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L59)*

___

###  entryPoint

• **entryPoint**: *string*

*Defined in [packages/webapp-yakshaving/source/index.ts:44](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L44)*

___

###  outputDirectory

• **outputDirectory**: *string*

*Defined in [packages/webapp-yakshaving/source/index.ts:45](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L45)*

___

### `Optional` production

• **production**? : *undefined | object*

*Defined in [packages/webapp-yakshaving/source/index.ts:68](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L68)*

___

###  projectRoot

• **projectRoot**: *string*

*Defined in [packages/webapp-yakshaving/source/index.ts:43](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L43)*

___

###  requiredPlugins

• **requiredPlugins**: *object*

*Defined in [packages/webapp-yakshaving/source/index.ts:50](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L50)*

#### Type declaration:

* **commonJs**: *[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginCommonJs›*

* **nodeResolve**: *[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginNodeResolve›*

* **replace**(): *object*

  * **plugin**: *typeof PluginReplace*

* **sucrase**: *[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginSucrase›*

* **terser**: *[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginTerser›*

* **typescript**: *[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginTypescript›*

___

###  rollup

• **rollup**: *typeof RollupFn*

*Defined in [packages/webapp-yakshaving/source/index.ts:47](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L47)*

___

###  watch

• **watch**: *typeof WatchFn*

*Defined in [packages/webapp-yakshaving/source/index.ts:48](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L48)*
