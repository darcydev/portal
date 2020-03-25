const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* 
  client: Client!
  code: String!
  title: String!
  description: String!
  tags: [String!]!
  colors: String
  files: String
*/

const jobSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client'
    },
    code: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    colors: {
      type: String,
      required: false
    },
    files: {
      type: Array,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', jobSchema);
