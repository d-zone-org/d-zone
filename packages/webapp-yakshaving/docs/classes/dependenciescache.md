[yakshaving - v0.4.1](../README.md) › [DependenciesCache](dependenciescache.md)

# Class: DependenciesCache

Small wrapper around dependencies cache

## Hierarchy

* **DependenciesCache**

## Index

### Methods

* [cacheDependency](dependenciescache.md#cachedependency)
* [dependencyIsCached](dependenciescache.md#dependencyiscached)
* [init](dependenciescache.md#init)
* [write](dependenciescache.md#write)

## Methods

###  cacheDependency

▸ **cacheDependency**(`dependencyId`: string, `descriptor`: string): *void*

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:49

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

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:37

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

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:21

Initialize cache, extend previous cache if exists

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rootDirectory` | string | Directory to initialize cache in  |

**Returns:** *Promise‹void›*

___

###  write

▸ **write**(): *Promise‹void›*

Defined in packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:57

Write the cache file to disk

**Returns:** *Promise‹void›*
