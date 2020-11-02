**[yakshaving - v0.5.1](../README.md)**

> [Globals](../README.md) / DependenciesCache

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

### cacheDependency

▸ **cacheDependency**(`dependencyId`: string, `descriptor`: string): void

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:49](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts#L49)*

Mark the dependency as cached

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`dependencyId` | string | Dependency id |
`descriptor` | string | Dependency descriptor  |

**Returns:** void

___

### dependencyIsCached

▸ **dependencyIsCached**(`dependencyId`: string, `descriptor`: string): boolean

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:37](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts#L37)*

Check if dependency is cached

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`dependencyId` | string | Dependency id |
`descriptor` | string | Dependency descriptor  |

**Returns:** boolean

___

### init

▸ **init**(`rootDirectory`: string): Promise\<void>

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:21](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts#L21)*

Initialize cache, extend previous cache if exists

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`rootDirectory` | string | Directory to initialize cache in  |

**Returns:** Promise\<void>

___

### write

▸ **write**(): Promise\<void>

*Defined in [packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts:57](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/build-modes/development/dependencies-bundle-cache.ts#L57)*

Write the cache file to disk

**Returns:** Promise\<void>
