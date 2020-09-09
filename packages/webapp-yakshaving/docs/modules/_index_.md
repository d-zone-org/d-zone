[yakshaving - v0.3.0](../README.md) › ["index"](_index_.md)

# Module: "index"

## Index

### Interfaces

* [ConfigurationOptions](../interfaces/_index_.configurationoptions.md)
* [RequiredPlugin](../interfaces/_index_.requiredplugin.md)

### Functions

* [configure](_index_.md#configure)

## Functions

###  configure

▸ **configure**(`options`: [ConfigurationOptions](../interfaces/_index_.configurationoptions.md)): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/index.ts:98](https://github.com/d-zone-org/d-zone/blob/4365347/packages/webapp-yakshaving/source/index.ts#L98)*

Configure bundler. Import this function in your configuration file
and call it with your configuration. Run your configuration file
like any other node application. Add `--dev` flag for development mode.
Check out `ConfigurationOptions` interface for description of the properties.
The function might emit error, please handle it properly.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [ConfigurationOptions](../interfaces/_index_.configurationoptions.md) | Configuration Options  |

**Returns:** *Promise‹void›*
