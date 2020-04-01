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
  jobByCode: async (args, req) => {
    try {
      const job = await Job.findOne({ code: args.code });
      if (!job) throw new Error('Job by code not found');
      return transformJob(job);
    } catch (error) {
      throw error;
    }
  },
  jobsByClientId: async (args, req) => {
    try {
      const jobs = await Job.find({ client: { _id: args.clientId } });
      if (!jobs) throw new Error('No jobs found');
      return jobs.map((job) => transformJob(job));
    } catch (error) {
      throw error;
    }
  },
  createJob: async (args, req) => {
    // check user is auth
    if (!req.isAuth) throw new Error('User is not authenticated');
    // ensure code is unique
    const existingCode = await Job.findOne({ code: args.jobInput.code });
    if (existingCode) throw new Error('Job code already exists');

    // TODO check that code and title aren't null

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
      return transformJob(result);
    } catch (error) {
      throw error;
    }
  },
  updateJob: async (args, req) => {
    const job = await Job.findOne({ code: args.jobUpdate.code });
    if (!job) throw new Error('Job not found');

    const { title, description, tags, colors, files } = args.jobUpdate;
    if (title) job.title = title;
    if (description) job.description = description;
    if (tags) job.tags.push(tags);
    if (colors) job.colors = colors; // TODO create array for colors
    if (files) job.files.push(files);

    try {
      const result = await job.save();
      updatedJob = transformJob(result);
      return updatedJob;
    } catch (error) {
      throw error;
    }
  }
};
