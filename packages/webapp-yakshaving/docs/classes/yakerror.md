**[yakshaving - v0.5.1](../README.md)**

> [Globals](../README.md) / YakError

# Class: YakError

Errors thrown by Yakshaving

## Hierarchy

* [Error](yakerror.md#error)

  ↳ **YakError**

## Index

### Constructors

* [constructor](yakerror.md#constructor)

### Properties

* [context](yakerror.md#context)
* [message](yakerror.md#message)
* [name](yakerror.md#name)
* [stack](yakerror.md#stack)
* [Error](yakerror.md#error)

## Constructors

### constructor

\+ **new YakError**(`name`: string, `description`: string, `context`: [YakErrorContext](../interfaces/yakerrorcontext.md)): [YakError](yakerror.md)

*Defined in [packages/webapp-yakshaving/source/modules/utilities/error.ts:12](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/utilities/error.ts#L12)*

Throw a new yak error

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Errors name |
`description` | string | Errors description |
`context` | [YakErrorContext](../interfaces/yakerrorcontext.md) | Error context  |

**Returns:** [YakError](yakerror.md)

## Properties

### context

• `Readonly` **context**: [YakErrorContext](../interfaces/yakerrorcontext.md)

*Defined in [packages/webapp-yakshaving/source/modules/utilities/error.ts:12](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/utilities/error.ts#L12)*

___

### message

•  **message**: string

*Inherited from [YakError](yakerror.md).[message](yakerror.md#message)*

*Defined in .yarn/cache/typescript-patch-16b73ffd55-ada6fea765.zip/node_modules/typescript/lib/lib.es5.d.ts:974*

___

### name

• `Readonly` **name**: string

*Overrides void*

*Defined in [packages/webapp-yakshaving/source/modules/utilities/error.ts:11](https://github.com/d-zone-org/d-zone/blob/e55b933/packages/webapp-yakshaving/source/modules/utilities/error.ts#L11)*

___

### stack

• `Optional` **stack**: undefined \| string

*Inherited from [YakError](yakerror.md).[stack](yakerror.md#stack)*

*Defined in .yarn/cache/typescript-patch-16b73ffd55-ada6fea765.zip/node_modules/typescript/lib/lib.es5.d.ts:975*

___

### Error

▪ `Static` **Error**: ErrorConstructor

*Defined in .yarn/cache/typescript-patch-16b73ffd55-ada6fea765.zip/node_modules/typescript/lib/lib.es5.d.ts:984*
