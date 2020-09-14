[yakshaving - v0.4.1](../README.md) › [PluginAndOptions](pluginandoptions.md)

# Interface: PluginAndOptions ‹**P**›

Plugins and their environment specific options.

**`property`** plugin - Plugin factory function

**`property`** config- Configuration

**`property`** config.common - Used in both modes

**`property`** config.development - Used in development mode

**`property`** config.production - Used in production mode

## Type parameters

▪ **P**: *PluginImpl‹any›*

## Hierarchy

* **PluginAndOptions**

## Index

### Properties

* [config](pluginandoptions.md#optional-config)
* [plugin](pluginandoptions.md#plugin)

## Properties

### `Optional` config

• **config**? : *undefined | object*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:31

___

###  plugin

• **plugin**: *P*

Defined in packages/webapp-yakshaving/source/modules/configuration/user-schema-types.ts:29
