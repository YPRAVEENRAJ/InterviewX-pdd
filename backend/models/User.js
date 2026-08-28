const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  is_email_verified: {
    type: Boolean,
    default: true
  },
  profile: {
    college: { type: String, default: '' },
    designation: { type: String, default: '' },
    experience: { type: String, default: '0' },
    skills: { type: String, default: '' },
    targetRole: { type: String, default: 'Software Engineer' },
    preferredProgLang: { type: String, default: 'Python' },
    preferredInterviewLang: { type: String, default: 'English' },
    goals: { type: String, default: '' }
  }
}, { timestamps: true });

// Password Hash Pre-save hook for Mongoose
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
