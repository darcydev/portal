const express = require('express');
const graphqlHttp = require('express-graphql');

const graphqlRouter = express.Router();

const graphQlSchema = require('../graphql/schema/index');
const graphQlResolvers = require('../graphql/resolvers/index');

graphqlRouter.use(
  '/',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

module.exports = graphqlRouter;
