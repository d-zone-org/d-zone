[yakshaving - v0.3.0](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Interfaces

- [ConfigurationOptions](../interfaces/_index_.configurationoptions.md)
- [RequiredPlugin](../interfaces/_index_.requiredplugin.md)

### Functions

- [configure](_index_.md#configure)

## Functions

### configure

▸ **configure**(`__namedParameters`: object): _Promise‹void›_

_Defined in [index.ts:94](https://github.com/vegeta897/d-zone/blob/458baeb/packages/webapp-yakshaving/source/index.ts#L94)_

Configure bundler. Import this function in your configuration file
and call it with your configuration. Run your configuration file
like any other node application. Add `--dev` flag for development mode.
Check out `ConfigurationOptions` interface for description of the properties.

**Parameters:**

▪ **\_\_namedParameters**: _object_

| Name              | Type                    |
| ----------------- | ----------------------- |
| `development`     | undefined &#124; object |
| `entryPoint`      | string                  |
| `outputDirectory` | string                  |
| `production`      | undefined &#124; object |
| `projectRoot`     | string                  |
| `requiredPlugins` | object                  |
| `rollup`          | rollup                  |
| `watch`           | watch                   |

**Returns:** _Promise‹void›_
