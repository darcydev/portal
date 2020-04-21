const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
  tags: { type: Array, required: true },
});

module.exports = mongoose.model('File', fileSchema);
