const authResolver = require('./auth');
const clientResolver = require('./client');
const jobResolver = require('./job');
const fileResolver = require('./file');

const rootResolver = {
  ...authResolver,
  ...clientResolver,
  ...jobResolver,
  ...fileResolver,
};

module.exports = rootResolver;
