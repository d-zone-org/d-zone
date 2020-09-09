[yakshaving - v0.3.0](../README.md) › ["index"](../modules/_index_.md) › [ConfigurationOptions](_index_.configurationoptions.md)

# Interface: ConfigurationOptions

Congfiguration Options

**`property`** options.projectRoot - Your projects root directory

**`property`** options.entryPoint - Entry files path, relative to `projectRoot`

**`property`** options.outputDirectory - Output directory, relative to `projectRoot`

**`property`** options.rollup - `rollup` method from rollup

**`property`** options.watch - `watch` method from rollup

**`property`** options.requiredPlugins - Required plugins

**`property`** options.development - Development mode settings

**`property`** options.development.ignoredDependencies - Dependencies to be not bundled seperately

**`property`** options.development.additionalPlugins - Additonal plugins to be used in dev mode

**`property`** options.development.additionalRollupSettings - Add development mode specific rollup settings

**`property`** options.production - Production mode settings

**`property`** options.production.additionalPlugins - Additional plugins to be used in prod mode

**`property`** options.production.additionalRollupSettings - Add production mode specific rollup settings

## Hierarchy

- **ConfigurationOptions**

## Index

### Properties

- [development](_index_.configurationoptions.md#optional-development)
- [entryPoint](_index_.configurationoptions.md#entrypoint)
- [outputDirectory](_index_.configurationoptions.md#outputdirectory)
- [production](_index_.configurationoptions.md#optional-production)
- [projectRoot](_index_.configurationoptions.md#projectroot)
- [requiredPlugins](_index_.configurationoptions.md#requiredplugins)
- [rollup](_index_.configurationoptions.md#rollup)
- [watch](_index_.configurationoptions.md#watch)

## Properties

### `Optional` development

• **development**? : _undefined | object_

_Defined in [index.ts:56](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L56)_

---

### entryPoint

• **entryPoint**: _string_

_Defined in [index.ts:41](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L41)_

---

### outputDirectory

• **outputDirectory**: _string_

_Defined in [index.ts:42](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L42)_

---

### `Optional` production

• **production**? : _undefined | object_

_Defined in [index.ts:65](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L65)_

---

### projectRoot

• **projectRoot**: _string_

_Defined in [index.ts:40](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L40)_

---

### requiredPlugins

• **requiredPlugins**: _object_

_Defined in [index.ts:47](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L47)_

#### Type declaration:

- **commonJs**: _[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginCommonJs›_

- **nodeResolve**: _[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginNodeResolve›_

- **replace**(): _object_

  - **plugin**: _typeof PluginReplace_

- **sucrase**: _[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginSucrase›_

- **terser**: _[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginTerser›_

- **typescript**: _[RequiredPlugin](_index_.requiredplugin.md)‹typeof PluginTypescript›_

---

### rollup

• **rollup**: _typeof RollupFn_

_Defined in [index.ts:44](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L44)_

---

### watch

• **watch**: _typeof WatchFn_

_Defined in [index.ts:45](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L45)_
