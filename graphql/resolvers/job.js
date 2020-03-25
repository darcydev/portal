const Job = require('../../models/job');

const { transformJob } = require('./merge');

module.exports = {
  jobs: async () => {
    try {
      const jobs = await Job.find();
      return jobs.map((job) => transformJob(job));
    } catch (error) {
      throw error;
    }
  },
  createJob: async (args, req) => {
    // check user is auth
    /// if (!req.isAuth) throw new Error('User is not authenticated');
    // ensure code is unique
    const existingCode = await Job.findOne({ code: args.jobInput.code });
    if (existingCode) throw new Error('Job code already exists');

    const job = new Job({
      client: args.jobInput.client,
      code: args.jobInput.code,
      title: args.jobInput.title,
      description: args.jobInput.description,
      tags: args.jobInput.tags,
      colors: args.jobInput.colors,
      files: args.jobInput.files
    });

    try {
      const result = await job.save();
      createdJob = transformJob(result);
      return createdJob;
    } catch (error) {
      throw error;
    }
  }
};
