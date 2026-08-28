const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  dsa_topic: { type: String, required: true },
  company_tags: [String],
  description: { type: String, required: true },
  sample_input: String,
  sample_output: String,
  acceptance_rate: { type: Number, default: 75.0 }
}, { timestamps: true });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
