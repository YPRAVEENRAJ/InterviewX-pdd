const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  ats_score: { type: Number, default: 85 },
  resume_score: { type: Number, default: 90 },
  matched_keywords: [String],
  missing_keywords: [String],
  missing_skills: [String],
  project_suggestions: [String],
  improvement_tips: [String]
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
