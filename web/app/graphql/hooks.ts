import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `BigInt` scalar type represents non-fractional signed whole numeric values.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
   */
  BigInt: any;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Bytes: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** An arbitrary-precision Decimal type */
  Decimal: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  Json: any;
};

export type Message = {
  __typename?: 'Message';
  author?: Maybe<User>;
  content?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateUser?: Maybe<User>;
};

export type Query = {
  __typename?: 'Query';
  GetAllServers?: Maybe<Array<Maybe<Server>>>;
  GetServer?: Maybe<Server>;
  GetSessionUser?: Maybe<User>;
  GetUser?: Maybe<User>;
};


export type QueryGetServerArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type Server = {
  __typename?: 'Server';
  id: Scalars['ID'];
  members: Array<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  ServerMessages?: Maybe<Message>;
};


export type SubscriptionServerMessagesArgs = {
  id: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  accentColor?: Maybe<Scalars['Int']>;
  avatar: Scalars['String'];
  discriminator: Scalars['String'];
  id: Scalars['ID'];
  registered?: Maybe<Scalars['Boolean']>;
  servers: Array<Maybe<Server>>;
  username: Scalars['String'];
};

export type CreateAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateAccountMutation = { __typename?: 'Mutation', CreateUser?: { __typename?: 'User', id: string, username: string, discriminator: string, avatar: string, accentColor?: number | null } | null };

export type UserDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserDetailsQuery = { __typename?: 'Query', GetSessionUser?: { __typename?: 'User', id: string, username: string, discriminator: string, avatar: string, accentColor?: number | null, registered?: boolean | null } | null };


export const CreateAccountDocument = gql`
    mutation CreateAccount {
  CreateUser {
    id
    username
    discriminator
    avatar
    accentColor
  }
}
    `;

export function useCreateAccountMutation() {
  return Urql.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument);
};
export const UserDetailsDocument = gql`
    query UserDetails {
  GetSessionUser {
    id
    username
    discriminator
    avatar
    accentColor
    registered
  }
}
    `;

export function useUserDetailsQuery(options?: Omit<Urql.UseQueryArgs<UserDetailsQueryVariables>, 'query'>) {
  return Urql.useQuery<UserDetailsQuery>({ query: UserDetailsDocument, ...options });
};