require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const User = require('./models/User');
const CodingProblem = require('./models/CodingProblem');

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr || connStr.includes('ENTER_YOUR_PASSWORD')) {
      console.log('⚠️ Please update your MONGODB_URI in backend/.env with your real MongoDB Atlas credentials before running seeder.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(connStr, {
      family: 4,
      serverSelectionTimeoutMS: 10000
    });
    console.log('🍃 Connected to MongoDB Atlas for Seeding!');

    // Clear existing collections
    await User.deleteMany({});
    await CodingProblem.deleteMany({});

    // Seed Users
    const adminUser = new User({
      full_name: 'Praveen (Admin)',
      email: 'praveen@interviewx.com',
      password: 'password123',
      role: 'admin',
      profile: {
        college: 'Stanford University',
        designation: 'Lead AI Engineer',
        experience: '5',
        skills: 'React, Node.js, Python, MongoDB, System Design',
        targetRole: 'Senior System Architect',
        preferredProgLang: 'Python',
        preferredInterviewLang: 'English',
        goals: 'Lead AI Mock Interview Platform 2026'
      }
    });

    const candidateUser = new User({
      full_name: 'Candidate User',
      email: 'candidate@gmail.com',
      password: 'password123',
      role: 'user',
      profile: {
        college: 'IIT Madras',
        designation: 'Software Developer',
        experience: '2',
        skills: 'JavaScript, React, Node.js',
        targetRole: 'Full Stack Engineer',
        preferredProgLang: 'JavaScript',
        preferredInterviewLang: 'English',
        goals: 'Land FAANG Software Engineer Role'
      }
    });

    await adminUser.save();
    await candidateUser.save();
    console.log('✅ Seeded Users: praveen@interviewx.com (admin), candidate@gmail.com (user)');

    // Seed Coding Problems
    const problems = [
      {
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        dsa_topic: 'Arrays & Hashing',
        company_tags: ['Google', 'Amazon', 'Meta'],
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        sample_input: 'nums = [2,7,11,15], target = 9',
        sample_output: '[0,1]',
        acceptance_rate: 82.4
      },
      {
        title: 'LRU Cache Design',
        slug: 'lru-cache-design',
        difficulty: 'Hard',
        dsa_topic: 'System Design & Data Structures',
        company_tags: ['Microsoft', 'Uber', 'Amazon'],
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        sample_input: 'capacity = 2',
        sample_output: 'null',
        acceptance_rate: 45.1
      }
    ];

    await CodingProblem.insertMany(problems);
    console.log('✅ Seeded DSA Coding Problems into MongoDB Atlas');

    console.log('🎉 MongoDB Atlas Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();
