[yakshaving - v0.4.1](../README.md) › [ConfigurationOptions](configurationoptions.md)

# Interface: ConfigurationOptions

Configuration Options

**`property`** options.projectRoot - Projects root directory

**`property`** options.entryPoint - Entry point(s) to your application

**`property`** options.outputDirectory - Projects output directory

**`property`** options.ignoredDepsBundleDependencies - Dependencies to be ignored in dev dependencies bundle

**`property`** options.additionalPlugins - Function (can be async) resolving additional plugins

**`property`** options.advanced - Advanced configuration

**`property`** options.advanced.rollup - Tuple with rollup config and optionally rollup method

**`property`** options.advanced.watch - Tuple with watcher config and optionally watch method

**`property`** options.advanced.corePluginAndOptions - Core plugins and options

**`property`** options.advanced.corePluginAndOptions.commonJs - CommonJs plugin and options

**`property`** options.advanced.corePluginAndOptions.nodeResolve - Node resolve plugin and options

**`property`** options.advanced.corePluginAndOptions.replace - Replace plugin

**`property`** options.advanced.corePluginAndOptions.sucrase - Sucrase plugin and options

**`property`** options.advanced.corePluginAndOptions.typescript - Typescript plugin and options

**`property`** options.advanced.corePluginAndOptions.terser - Terser plugin and options

## Hierarchy

* **ConfigurationOptions**

## Index

### Properties

* [additionalPlugins](configurationoptions.md#additionalplugins)
* [advanced](configurationoptions.md#advanced)
* [entryPoint](configurationoptions.md#entrypoint)
* [ignoredDepsBundleDependencies](configurationoptions.md#ignoreddepsbundledependencies)
* [outputDirectory](configurationoptions.md#outputdirectory)
* [projectRoot](configurationoptions.md#projectroot)

## Properties

###  additionalPlugins

• **additionalPlugins**: *function*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:82

#### Type declaration:

▸ (`devMode`: boolean): *Promise‹Plugin[]› | Plugin[]*

**Parameters:**

Name | Type |
------ | ------ |
`devMode` | boolean |

___

###  advanced

• **advanced**: *object*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:84

#### Type declaration:

* **corePluginsAndOptions**(): *object*

  * **commonJs**: *[PluginAndOptions](pluginandoptions.md)‹typeof PluginCommonJs›*

  * **nodeResolve**: *[PluginAndOptions](pluginandoptions.md)‹typeof PluginNodeResolve›*

  * **replace**(): *object*

    * **plugin**: *typeof PluginReplace*

  * **sucrase**: *[PluginAndOptions](pluginandoptions.md)‹typeof PluginSucrase›*

  * **terser**: *[PluginAndOptions](pluginandoptions.md)‹typeof PluginTerser›*

  * **typescript**: *[PluginAndOptions](pluginandoptions.md)‹typeof PluginTypescript›*

* **rollup**: *[object, typeof RollupFn]*

* **watch**: *[RollupWatchOptions, typeof WatchFn]*

___

###  entryPoint

• **entryPoint**: *string | Record‹string, string›*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:78

___

###  ignoredDepsBundleDependencies

• **ignoredDepsBundleDependencies**: *string[]*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:81

___

###  outputDirectory

• **outputDirectory**: *string*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:79

___

###  projectRoot

• **projectRoot**: *string*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:77
