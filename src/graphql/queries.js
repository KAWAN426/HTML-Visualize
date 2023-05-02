/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHvData = /* GraphQL */ `
  query GetHvData($id: ID!) {
    getHvData(id: $id) {
      id
      html
      author
      title
      createdAt
      updatedAt
    }
  }
`;
export const listHvData = /* GraphQL */ `
  query ListHvData(
    $filter: ModelHvDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHvData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        html
        author
        title
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      img
      joinId
      friends
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        img
        joinId
        friends
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getShareComp = /* GraphQL */ `
  query GetShareComp($id: ID!) {
    getShareComp(id: $id) {
      id
      html
      author
      name
      descript
      like
      createdAt
      updatedAt
    }
  }
`;
export const listShareComps = /* GraphQL */ `
  query ListShareComps(
    $filter: ModelShareCompFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listShareComps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        html
        author
        name
        descript
        like
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
