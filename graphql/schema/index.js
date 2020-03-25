const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
  _id: ID!
  email: String!
  password: String!
  isClient: Boolean!
  createdAt: String!
  updatedAt: String!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type Client {
  _id: ID!
  user: User!
  code: String!
  name: String!
  createdAt: String!
  updatedAt: String!
}

type Job {
  _id: ID!
  client: Client!
  code: String!
  title: String!
  description: String!
  tags: [String!]!
  colors: String
  files: String
  createdAt: String!
  updatedAt: String!
}

input UserInput {
  email: String!
  password: String!
  isClient: Boolean!
}

input ClientInput {
  user: ID!
  code: String!
  name: String!
}

input JobInput {
  client: ID!
  code: String!
  title: String!
  description: String!
  tags: [String!]!
  colors: String
  files: String
}

type RootQuery {
    login(email: String!, password: String!, isClient: Boolean!): AuthData!
    clients: [Client!]!
    jobs: [Job!]!
}

type RootMutation {
  createUser(userInput: UserInput): User
  createClient(clientInput: ClientInput): Client
  createJob(jobInput: JobInput): Job
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
