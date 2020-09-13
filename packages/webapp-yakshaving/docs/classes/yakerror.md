[yakshaving - v0.4.1](../README.md) › [YakError](yakerror.md)

# Class: YakError

Errors thrown by Yakshaving

## Hierarchy

* [Error](yakerror.md#static-error)

  ↳ **YakError**

## Index

### Constructors

* [constructor](yakerror.md#constructor)

### Properties

* [context](yakerror.md#readonly-context)
* [message](yakerror.md#message)
* [name](yakerror.md#readonly-name)
* [stack](yakerror.md#optional-stack)
* [Error](yakerror.md#static-error)

## Constructors

###  constructor

\+ **new YakError**(`name`: string, `description`: string, `context`: [YakErrorContext](../interfaces/yakerrorcontext.md)): *[YakError](yakerror.md)*

*Defined in [packages/webapp-yakshaving/source/utils/error.ts:12](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/utils/error.ts#L12)*

Throw a new yak error

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Errors name |
`description` | string | Errors description |
`context` | [YakErrorContext](../interfaces/yakerrorcontext.md) | Error context  |

**Returns:** *[YakError](yakerror.md)*

## Properties

### `Readonly` context

• **context**: *[YakErrorContext](../interfaces/yakerrorcontext.md)*

*Defined in [packages/webapp-yakshaving/source/utils/error.ts:12](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/utils/error.ts#L12)*

___

###  message

• **message**: *string*

*Inherited from [YakError](yakerror.md).[message](yakerror.md#message)*

Defined in .yarn/cache/typescript-patch-edef266e49-b8b689ef99.zip/node_modules/typescript/lib/lib.es5.d.ts:974

___

### `Readonly` name

• **name**: *string*

*Overrides void*

*Defined in [packages/webapp-yakshaving/source/utils/error.ts:11](https://github.com/d-zone-org/d-zone/blob/4c95adb/packages/webapp-yakshaving/source/utils/error.ts#L11)*

___

### `Optional` stack

• **stack**? : *undefined | string*

*Inherited from [YakError](yakerror.md).[stack](yakerror.md#optional-stack)*

Defined in .yarn/cache/typescript-patch-edef266e49-b8b689ef99.zip/node_modules/typescript/lib/lib.es5.d.ts:975

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

Defined in .yarn/cache/typescript-patch-edef266e49-b8b689ef99.zip/node_modules/typescript/lib/lib.es5.d.ts:984
