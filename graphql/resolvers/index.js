const authResolver = require('./auth');
const clientResolver = require('./client');
const jobResolver = require('./job');

const rootResolver = {
  ...authResolver,
  ...clientResolver,
  ...jobResolver
};

module.exports = rootResolver;
