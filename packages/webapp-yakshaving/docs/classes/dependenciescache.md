[yakshaving - v0.4.1](../README.md) › [DependenciesCache](dependenciescache.md)

# Class: DependenciesCache

Small wrapper around dependencies cache

## Hierarchy

* **DependenciesCache**

## Index

### Properties

* [#cacheFilePath](dependenciescache.md#optional-private-#cachefilepath)
* [#newCache](dependenciescache.md#private-#newcache)
* [#prevCache](dependenciescache.md#private-#prevcache)

### Methods

* [cacheDependency](dependenciescache.md#cachedependency)
* [dependencyIsCached](dependenciescache.md#dependencyiscached)
* [init](dependenciescache.md#init)
* [write](dependenciescache.md#write)

## Properties

### `Optional` `Private` #cacheFilePath

• **#cacheFilePath**? : *undefined | string*

*Defined in [packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts:15](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts#L15)*

___

### `Private` #newCache

• **#newCache**: *Record‹string, [CacheDependencyData](../interfaces/cachedependencydata.md)›*

*Defined in [packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts:13](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts#L13)*

___

### `Private` #prevCache

• **#prevCache**: *Record‹string, [CacheDependencyData](../interfaces/cachedependencydata.md)›*

*Defined in [packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts:12](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts#L12)*

## Methods

###  cacheDependency

▸ **cacheDependency**(`dependencyId`: string, `descriptor`: string): *void*

*Defined in [packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts:49](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts#L49)*

Mark the dependency as cached

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dependencyId` | string | Dependency id |
`descriptor` | string | Dependency descriptor  |

**Returns:** *void*

___

###  dependencyIsCached

▸ **dependencyIsCached**(`dependencyId`: string, `descriptor`: string): *boolean*

*Defined in [packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts:37](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts#L37)*

Check if dependency is cached

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dependencyId` | string | Dependency id |
`descriptor` | string | Dependency descriptor  |

**Returns:** *boolean*

___

###  init

▸ **init**(`rootDirectory`: string): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts:21](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts#L21)*

Initialize cache, extend previous cache if exists

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rootDirectory` | string | Directory to initialize cache in  |

**Returns:** *Promise‹void›*

___

###  write

▸ **write**(): *Promise‹void›*

*Defined in [packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts:57](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/modes/development/dependencies-bundle-cache.ts#L57)*

Write the cache file to disk

**Returns:** *Promise‹void›*
