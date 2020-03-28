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
  clientByCode: async (args, req) => {
    try {
      const client = await Client.findOne({ code: args.code });
      if (!client) throw new Error('Client by code not found');
      return transformClient(client);
    } catch (error) {
      throw error;
    }
  },
  createClient: async (args, req) => {
    // check user is auth
    if (!req.isAuth) throw new Error('User is not authenticated');

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
