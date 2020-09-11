[yakshaving - v0.3.0](../README.md) › ["error"](../modules/_error_.md) › [YakError](_error_.yakerror.md)

# Class: YakError

Errors thrown by Yakshaving

## Hierarchy

* [Error](_error_.yakerror.md#static-error)

  ↳ **YakError**

## Index

### Constructors

* [constructor](_error_.yakerror.md#constructor)

### Properties

* [context](_error_.yakerror.md#optional-readonly-context)
* [message](_error_.yakerror.md#message)
* [name](_error_.yakerror.md#readonly-name)
* [stack](_error_.yakerror.md#optional-stack)
* [Error](_error_.yakerror.md#static-error)

## Constructors

###  constructor

\+ **new YakError**(`name`: string, `description`: string, `context?`: Record‹string, unknown›): *[YakError](_error_.yakerror.md)*

*Defined in [packages/webapp-yakshaving/source/error.ts:7](https://github.com/d-zone-org/d-zone/blob/85b6f01/packages/webapp-yakshaving/source/error.ts#L7)*

Throw a new yak error

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Errors name |
`description` | string | Errors description |
`context?` | Record‹string, unknown› | Error context  |

**Returns:** *[YakError](_error_.yakerror.md)*

## Properties

### `Optional` `Readonly` context

• **context**? : *Record‹string, unknown›*

*Defined in [packages/webapp-yakshaving/source/error.ts:7](https://github.com/d-zone-org/d-zone/blob/85b6f01/packages/webapp-yakshaving/source/error.ts#L7)*

___

###  message

• **message**: *string*

*Inherited from [YakError](_error_.yakerror.md).[message](_error_.yakerror.md#message)*

Defined in .yarn/cache/typescript-patch-edef266e49-b8b689ef99.zip/node_modules/typescript/lib/lib.es5.d.ts:974

___

### `Readonly` name

• **name**: *string*

*Overrides void*

*Defined in [packages/webapp-yakshaving/source/error.ts:6](https://github.com/d-zone-org/d-zone/blob/85b6f01/packages/webapp-yakshaving/source/error.ts#L6)*

___

### `Optional` stack

• **stack**? : *undefined | string*

*Inherited from [YakError](_error_.yakerror.md).[stack](_error_.yakerror.md#optional-stack)*

Defined in .yarn/cache/typescript-patch-edef266e49-b8b689ef99.zip/node_modules/typescript/lib/lib.es5.d.ts:975

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

Defined in .yarn/cache/typescript-patch-edef266e49-b8b689ef99.zip/node_modules/typescript/lib/lib.es5.d.ts:984
