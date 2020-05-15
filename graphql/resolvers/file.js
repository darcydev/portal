const File = require('../../models/file');

const { transformFile } = require('./merge');

module.exports = {
  files: async () => {
    try {
      const files = await File.find();
      return files.map((file) => transformFile(file));
    } catch (error) {
      throw err;
    }
  },
  filesByJobId: async (args, req) => {
    try {
      const files = await File.find({ job: { _id: args.jobId } });
      if (!files) throw new Error('No files found for this job Id');
      return files.map((file) => transformFile(file));
    } catch (error) {
      throw error;
    }
  },
  uploadFile: async (args, req) => {
    if (!req.isAuth) throw new Error('User is not authenticated');

    const file = new File({
      url: args.fileInput.url,
      name: args.fileInput.name,
      type: args.fileInput.type,
      updatedAt: args.fileInput.updatedAt,
      job: args.fileInput.job,
      tags: args.fileInput.tags,
      delivered: args.fileInput.delivered,
      description: args.fileInput.description,
    });

    try {
      const result = await file.save();
      return transformFile(result);
    } catch (error) {
      throw error;
    }
  },
};
