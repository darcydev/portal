const Client = require('../../models/client');
const { dateToString } = require('../../helpers/date');

const client = async (clientId) => {
  try {
    const client = await Client.findById(clientId);
    return {
      ...client._doc,
      _id: client.id,
    };
  } catch (error) {
    throw error;
  }
};

const job = async (jobId) => {
  try {
    const job = await job.findById(jobId);
    return {
      ...job._doc,
      _id: job.id,
    };
  } catch (error) {
    throw error;
  }
};

const transformClient = (client) => {
  return {
    ...client._doc,
    _id: client.id,
    createdAt: dateToString(client._doc.createdAt),
    updatedAt: dateToString(client._doc.updatedAt),
  };
};

const transformJob = (job) => {
  return {
    ...job._doc,
    _id: job.id,
    client: client.bind(this, job._doc.client),
    createdAt: dateToString(job._doc.createdAt),
    updatedAt: dateToString(job._doc.updatedAt),
  };
};

const transformFile = (file) => {
  return {
    ...file._doc,
    _id: file.id,
    job: job.bind(this, file._doc.job),
  };
};

exports.transformClient = transformClient;
exports.transformJob = transformJob;
exports.transformFile = transformFile;
