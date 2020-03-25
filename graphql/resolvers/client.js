const Client = require('../../models/client');
const User = require('../../models/user');

const { transformClient } = require('./merge');

module.exports = {
  clients: async () => {
    try {
      const clients = await Client.find();
      return clients.map((client) => transformClient(client));
    } catch (error) {
      throw err;
    }
  },
  createClient: async (args, req) => {
    // check user is auth
    /// if (!req.isAuth) throw new Error('User is not authenticated');

    // TODO check code is unique
    const existingCode = await Client.findOne({ code: args.clientInput.code });
    if (existingCode) throw new Error('Client code already exists');

    const client = new Client({
      code: args.clientInput.code,
      name: args.clientInput.name
    });

    try {
      const result = await client.save();
      createdClient = transformClient(result);
      return createdClient;
    } catch (error) {
      throw error;
    }
  }
};
