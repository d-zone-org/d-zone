
/**
 * Client
**/

import * as runtime from './runtime';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model ChatChannel
 */

export type ChatChannel = {
  id: string
  module: string
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ChatChannels
 * const chatChannels = await prisma.chatChannel.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js (ORM replacement)
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ChatChannels
   * const chatChannels = await prisma.chatChannel.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<any>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

  /**
   * Executes a raw query and returns the number of affected rows
   * @example
   * ```
   * // With parameters use prisma.executeRaw``, values will be escaped automatically
   * const result = await prisma.executeRaw`UPDATE User SET cool = ${true} WHERE id = ${1};`
   * // Or
   * const result = await prisma.executeRaw('UPDATE User SET cool = $1 WHERE id = $2 ;', true, 1)
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $executeRaw < T = any > (query: string | TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a raw query and returns the SELECT data
   * @example
   * ```
   * // With parameters use prisma.queryRaw``, values will be escaped automatically
   * const result = await prisma.queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'ema.il'};`
   * // Or
   * const result = await prisma.queryRaw('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'ema.il')
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $queryRaw < T = any > (query: string | TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>

      /**
   * `prisma.chatChannel`: Exposes CRUD operations for the **ChatChannel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatChannels
    * const chatChannels = await prisma.chatChannel.findMany()
    * ```
    */
  get chatChannel(): Prisma.ChatChannelDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  /**
   * Prisma Client JS version: 2.20.1
   * Query Engine version: 60ba6551f29b17d7d6ce479e5733c70d9c00860e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}
 
  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}
 
  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | null | JsonObject | JsonArray

  /**
   * Same as JsonObject, but allows undefined
   */
  export type InputJsonObject = {[Key in string]?: JsonValue}
 
  export interface InputJsonArray extends Array<JsonValue> {}
 
  export type InputJsonValue = undefined |  string | number | boolean | null | InputJsonObject | InputJsonArray
   type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Buffer
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  export type Union = any

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, 'avg' | 'sum' | 'count' | 'min' | 'max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    ChatChannel: 'ChatChannel'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends boolean
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     *  * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined; 
  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model ChatChannel
   */


  export type AggregateChatChannel = {
    count: ChatChannelCountAggregateOutputType | null
    min: ChatChannelMinAggregateOutputType | null
    max: ChatChannelMaxAggregateOutputType | null
  }

  export type ChatChannelMinAggregateOutputType = {
    id: string | null
    module: string | null
  }

  export type ChatChannelMaxAggregateOutputType = {
    id: string | null
    module: string | null
  }

  export type ChatChannelCountAggregateOutputType = {
    id: number | null
    module: number | null
    _all: number
  }


  export type ChatChannelMinAggregateInputType = {
    id?: true
    module?: true
  }

  export type ChatChannelMaxAggregateInputType = {
    id?: true
    module?: true
  }

  export type ChatChannelCountAggregateInputType = {
    id?: true
    module?: true
    _all?: true
  }

  export type ChatChannelAggregateArgs = {
    /**
     * Filter which ChatChannel to aggregate.
    **/
    where?: ChatChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatChannels to fetch.
    **/
    orderBy?: Enumerable<ChatChannelOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: ChatChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatChannels from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatChannels.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatChannels
    **/
    count?: true | ChatChannelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: ChatChannelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: ChatChannelMaxAggregateInputType
  }

  export type GetChatChannelAggregateType<T extends ChatChannelAggregateArgs> = {
    [P in keyof T & keyof AggregateChatChannel]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatChannel[P]>
      : GetScalarType<T[P], AggregateChatChannel[P]>
  }


    
    
  export type ChatChannelGroupByArgs = {
    where?: ChatChannelWhereInput
    orderBy?: Enumerable<ChatChannelOrderByInput>
    by: Array<ChatChannelScalarFieldEnum>
    having?: ChatChannelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    count?: ChatChannelCountAggregateInputType | true
    min?: ChatChannelMinAggregateInputType
    max?: ChatChannelMaxAggregateInputType
  }


  export type ChatChannelGroupByOutputType = {
    id: string
    module: string
    count: ChatChannelCountAggregateOutputType | null
    min: ChatChannelMinAggregateOutputType | null
    max: ChatChannelMaxAggregateOutputType | null
  }

  type GetChatChannelGroupByPayload<T extends ChatChannelGroupByArgs> = Promise<Array<
    PickArray<ChatChannelGroupByOutputType, T['by']> & {
      [P in ((keyof T) & (keyof ChatChannelGroupByOutputType))]: GetScalarType<T[P], ChatChannelGroupByOutputType[P]>
    }
  >>
    

  export type ChatChannelSelect = {
    id?: boolean
    module?: boolean
  }

  export type ChatChannelGetPayload<
    S extends boolean | null | undefined | ChatChannelArgs,
    U = keyof S
      > = S extends true
        ? ChatChannel
    : S extends undefined
    ? never
    : S extends ChatChannelArgs | ChatChannelFindManyArgs
    ?'include' extends U
    ? ChatChannel 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof ChatChannel ?ChatChannel [P]
  : 
     never
  } 
    : ChatChannel
  : ChatChannel


  type ChatChannelCountArgs = Merge<
    Omit<ChatChannelFindManyArgs, 'select' | 'include'> & {
      select?: ChatChannelCountAggregateInputType | true
    }
  >

  export interface ChatChannelDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one ChatChannel that matches the filter.
     * @param {ChatChannelFindUniqueArgs} args - Arguments to find a ChatChannel
     * @example
     * // Get one ChatChannel
     * const chatChannel = await prisma.chatChannel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ChatChannelFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ChatChannelFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ChatChannel'> extends True ? CheckSelect<T, Prisma__ChatChannelClient<ChatChannel>, Prisma__ChatChannelClient<ChatChannelGetPayload<T>>> : CheckSelect<T, Prisma__ChatChannelClient<ChatChannel | null >, Prisma__ChatChannelClient<ChatChannelGetPayload<T> | null >>

    /**
     * Find the first ChatChannel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatChannelFindFirstArgs} args - Arguments to find a ChatChannel
     * @example
     * // Get one ChatChannel
     * const chatChannel = await prisma.chatChannel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ChatChannelFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ChatChannelFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ChatChannel'> extends True ? CheckSelect<T, Prisma__ChatChannelClient<ChatChannel>, Prisma__ChatChannelClient<ChatChannelGetPayload<T>>> : CheckSelect<T, Prisma__ChatChannelClient<ChatChannel | null >, Prisma__ChatChannelClient<ChatChannelGetPayload<T> | null >>

    /**
     * Find zero or more ChatChannels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatChannelFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatChannels
     * const chatChannels = await prisma.chatChannel.findMany()
     * 
     * // Get first 10 ChatChannels
     * const chatChannels = await prisma.chatChannel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatChannelWithIdOnly = await prisma.chatChannel.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ChatChannelFindManyArgs>(
      args?: SelectSubset<T, ChatChannelFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<ChatChannel>>, PrismaPromise<Array<ChatChannelGetPayload<T>>>>

    /**
     * Create a ChatChannel.
     * @param {ChatChannelCreateArgs} args - Arguments to create a ChatChannel.
     * @example
     * // Create one ChatChannel
     * const ChatChannel = await prisma.chatChannel.create({
     *   data: {
     *     // ... data to create a ChatChannel
     *   }
     * })
     * 
    **/
    create<T extends ChatChannelCreateArgs>(
      args: SelectSubset<T, ChatChannelCreateArgs>
    ): CheckSelect<T, Prisma__ChatChannelClient<ChatChannel>, Prisma__ChatChannelClient<ChatChannelGetPayload<T>>>

    /**
     * Delete a ChatChannel.
     * @param {ChatChannelDeleteArgs} args - Arguments to delete one ChatChannel.
     * @example
     * // Delete one ChatChannel
     * const ChatChannel = await prisma.chatChannel.delete({
     *   where: {
     *     // ... filter to delete one ChatChannel
     *   }
     * })
     * 
    **/
    delete<T extends ChatChannelDeleteArgs>(
      args: SelectSubset<T, ChatChannelDeleteArgs>
    ): CheckSelect<T, Prisma__ChatChannelClient<ChatChannel>, Prisma__ChatChannelClient<ChatChannelGetPayload<T>>>

    /**
     * Update one ChatChannel.
     * @param {ChatChannelUpdateArgs} args - Arguments to update one ChatChannel.
     * @example
     * // Update one ChatChannel
     * const chatChannel = await prisma.chatChannel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ChatChannelUpdateArgs>(
      args: SelectSubset<T, ChatChannelUpdateArgs>
    ): CheckSelect<T, Prisma__ChatChannelClient<ChatChannel>, Prisma__ChatChannelClient<ChatChannelGetPayload<T>>>

    /**
     * Delete zero or more ChatChannels.
     * @param {ChatChannelDeleteManyArgs} args - Arguments to filter ChatChannels to delete.
     * @example
     * // Delete a few ChatChannels
     * const { count } = await prisma.chatChannel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ChatChannelDeleteManyArgs>(
      args?: SelectSubset<T, ChatChannelDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatChannelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatChannels
     * const chatChannel = await prisma.chatChannel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ChatChannelUpdateManyArgs>(
      args: SelectSubset<T, ChatChannelUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatChannel.
     * @param {ChatChannelUpsertArgs} args - Arguments to update or create a ChatChannel.
     * @example
     * // Update or create a ChatChannel
     * const chatChannel = await prisma.chatChannel.upsert({
     *   create: {
     *     // ... data to create a ChatChannel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatChannel we want to update
     *   }
     * })
    **/
    upsert<T extends ChatChannelUpsertArgs>(
      args: SelectSubset<T, ChatChannelUpsertArgs>
    ): CheckSelect<T, Prisma__ChatChannelClient<ChatChannel>, Prisma__ChatChannelClient<ChatChannelGetPayload<T>>>

    /**
     * Count the number of ChatChannels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatChannelCountArgs} args - Arguments to filter ChatChannels to count.
     * @example
     * // Count the number of ChatChannels
     * const count = await prisma.chatChannel.count({
     *   where: {
     *     // ... the filter for the ChatChannels we want to count
     *   }
     * })
    **/
    count<T extends ChatChannelCountArgs>(
      args?: Subset<T, ChatChannelCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatChannelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatChannelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatChannelAggregateArgs>(args: Subset<T, ChatChannelAggregateArgs>): PrismaPromise<GetChatChannelAggregateType<T>>

    /**
     * Group by ChatChannel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatChannelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatChannelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatChannelGroupByArgs['orderBy'] }
        : { orderBy?: ChatChannelGroupByArgs['orderBy'] },
      OrderFields extends Keys<MaybeTupleToUnion<T['orderBy']>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatChannelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatChannelGroupByPayload<T> : Promise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatChannel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ChatChannelClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * ChatChannel findUnique
   */
  export type ChatChannelFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
    /**
     * Throw an Error if a ChatChannel can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which ChatChannel to fetch.
    **/
    where: ChatChannelWhereUniqueInput
  }


  /**
   * ChatChannel findFirst
   */
  export type ChatChannelFindFirstArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
    /**
     * Throw an Error if a ChatChannel can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which ChatChannel to fetch.
    **/
    where?: ChatChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatChannels to fetch.
    **/
    orderBy?: Enumerable<ChatChannelOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatChannels.
    **/
    cursor?: ChatChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatChannels from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatChannels.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatChannels.
    **/
    distinct?: Enumerable<ChatChannelScalarFieldEnum>
  }


  /**
   * ChatChannel findMany
   */
  export type ChatChannelFindManyArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
    /**
     * Filter, which ChatChannels to fetch.
    **/
    where?: ChatChannelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatChannels to fetch.
    **/
    orderBy?: Enumerable<ChatChannelOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatChannels.
    **/
    cursor?: ChatChannelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatChannels from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatChannels.
    **/
    skip?: number
    distinct?: Enumerable<ChatChannelScalarFieldEnum>
  }


  /**
   * ChatChannel create
   */
  export type ChatChannelCreateArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
    /**
     * The data needed to create a ChatChannel.
    **/
    data: XOR<ChatChannelCreateInput, ChatChannelUncheckedCreateInput>
  }


  /**
   * ChatChannel update
   */
  export type ChatChannelUpdateArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
    /**
     * The data needed to update a ChatChannel.
    **/
    data: XOR<ChatChannelUpdateInput, ChatChannelUncheckedUpdateInput>
    /**
     * Choose, which ChatChannel to update.
    **/
    where: ChatChannelWhereUniqueInput
  }


  /**
   * ChatChannel updateMany
   */
  export type ChatChannelUpdateManyArgs = {
    data: XOR<ChatChannelUpdateManyMutationInput, ChatChannelUncheckedUpdateManyInput>
    where?: ChatChannelWhereInput
  }


  /**
   * ChatChannel upsert
   */
  export type ChatChannelUpsertArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
    /**
     * The filter to search for the ChatChannel to update in case it exists.
    **/
    where: ChatChannelWhereUniqueInput
    /**
     * In case the ChatChannel found by the `where` argument doesn't exist, create a new ChatChannel with this data.
    **/
    create: XOR<ChatChannelCreateInput, ChatChannelUncheckedCreateInput>
    /**
     * In case the ChatChannel was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<ChatChannelUpdateInput, ChatChannelUncheckedUpdateInput>
  }


  /**
   * ChatChannel delete
   */
  export type ChatChannelDeleteArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
    /**
     * Filter which ChatChannel to delete.
    **/
    where: ChatChannelWhereUniqueInput
  }


  /**
   * ChatChannel deleteMany
   */
  export type ChatChannelDeleteManyArgs = {
    where?: ChatChannelWhereInput
  }


  /**
   * ChatChannel without action
   */
  export type ChatChannelArgs = {
    /**
     * Select specific fields to fetch from the ChatChannel
    **/
    select?: ChatChannelSelect | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const ChatChannelScalarFieldEnum: {
    id: 'id',
    module: 'module'
  };

  export type ChatChannelScalarFieldEnum = (typeof ChatChannelScalarFieldEnum)[keyof typeof ChatChannelScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Deep Input Types
   */


  export type ChatChannelWhereInput = {
    AND?: Enumerable<ChatChannelWhereInput>
    OR?: Enumerable<ChatChannelWhereInput>
    NOT?: Enumerable<ChatChannelWhereInput>
    id?: StringFilter | string
    module?: StringFilter | string
  }

  export type ChatChannelOrderByInput = {
    id?: SortOrder
    module?: SortOrder
  }

  export type ChatChannelWhereUniqueInput = {
    id?: string
  }

  export type ChatChannelScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ChatChannelScalarWhereWithAggregatesInput>
    OR?: Enumerable<ChatChannelScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ChatChannelScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    module?: StringWithAggregatesFilter | string
  }

  export type ChatChannelCreateInput = {
    id: string
    module: string
  }

  export type ChatChannelUncheckedCreateInput = {
    id: string
    module: string
  }

  export type ChatChannelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
  }

  export type ChatChannelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
  }

  export type ChatChannelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
  }

  export type ChatChannelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    count?: NestedIntFilter
    min?: NestedStringFilter
    max?: NestedStringFilter
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    count?: NestedIntFilter
    min?: NestedStringFilter
    max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}