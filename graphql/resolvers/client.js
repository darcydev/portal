const Client = require('../../models/client');

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
  clientById: async (args, req) => {
    try {
      const client = await Client.findById(args.id);
      if (!client) throw new Error('Client by code not found');
      return transformClient(client);
    } catch (error) {
      throw error;
    }
  },
  createClient: async (args, req) => {
    if (!req.isAuth) throw new Error('User is not authenticated');
    const existingName = await Client.findOne({ code: args.clientInput.name });
    if (existingName) throw new Error('Client name already exists');

    const client = new Client({
      code: args.clientInput.code,
      name: args.clientInput.name,
    });

    try {
      const result = await client.save();
      return transformClient(result);
    } catch (error) {
      throw error;
    }
  },
  updateClient: async (args, req) => {
    if (!req.isAuth) throw new Error('User is not authenticated');
    const { code, name } = args.clientUpdate;
    const client = await Client.findOne({ name: name });
    if (!client) throw new Error('Client name not found');

    if (code) client.code = code;

    try {
      const result = await client.save();
      return transformClient(result);
    } catch (error) {
      throw error;
    }
  },
};
