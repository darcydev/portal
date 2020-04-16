const File = require('../../models/file');

// const { transformClient } = require('./merge');

module.exports = {
  files: async () => {
    try {
      const files = await File.find();
      // return clients.map((client) => transformClient(client));
      return files;
    } catch (error) {
      throw err;
    }
  },
};
