/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createHvData = /* GraphQL */ `
  mutation CreateHvData(
    $input: CreateHvDataInput!
    $condition: ModelHvDataConditionInput
  ) {
    createHvData(input: $input, condition: $condition) {
      id
      html
      author
      title
      createdAt
      updatedAt
    }
  }
`;
export const updateHvData = /* GraphQL */ `
  mutation UpdateHvData(
    $input: UpdateHvDataInput!
    $condition: ModelHvDataConditionInput
  ) {
    updateHvData(input: $input, condition: $condition) {
      id
      html
      author
      title
      createdAt
      updatedAt
    }
  }
`;
export const deleteHvData = /* GraphQL */ `
  mutation DeleteHvData(
    $input: DeleteHvDataInput!
    $condition: ModelHvDataConditionInput
  ) {
    deleteHvData(input: $input, condition: $condition) {
      id
      html
      author
      title
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createShareComp = /* GraphQL */ `
  mutation CreateShareComp(
    $input: CreateShareCompInput!
    $condition: ModelShareCompConditionInput
  ) {
    createShareComp(input: $input, condition: $condition) {
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
export const updateShareComp = /* GraphQL */ `
  mutation UpdateShareComp(
    $input: UpdateShareCompInput!
    $condition: ModelShareCompConditionInput
  ) {
    updateShareComp(input: $input, condition: $condition) {
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
export const deleteShareComp = /* GraphQL */ `
  mutation DeleteShareComp(
    $input: DeleteShareCompInput!
    $condition: ModelShareCompConditionInput
  ) {
    deleteShareComp(input: $input, condition: $condition) {
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
