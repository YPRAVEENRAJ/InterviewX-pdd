const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  job_role: { type: String, required: true },
  company: { type: String, required: true },
  difficulty: { type: String, default: 'Medium' },
  interview_type: { type: String, default: 'Technical' },
  programming_language: { type: String, default: 'JavaScript' },
  interview_language: { type: String, default: 'English' },
  questions: [{
    question_number: Number,
    question_text: String,
    user_answer: String,
    ai_feedback: {
      clarity: Number,
      correctness: Number,
      confidence: Number,
      ai_remark: String
    }
  }],
  overall_score: { type: Number, default: 85 },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
