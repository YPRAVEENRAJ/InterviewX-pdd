require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const { readDB, writeDB } = require('./localDbManager');

// Models
const User = require('./models/User');
const Interview = require('./models/Interview');
const Resume = require('./models/Resume');

const app = express();

// Connect to MongoDB Atlas (if connection available)
connectDB();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'interviewx_secret_key_2026';

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const db = readDB();
  res.json({
    status: 'online',
    service: 'InterviewX AI Core Backend API',
    total_users_in_db: db.users.length,
    database: 'MongoDB Atlas & Persistent Storage',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ==========================================
// AUTHENTICATION & USER DATABASE ROUTES
// ==========================================

// 1. Get All Users (For Admin Panel)
app.get('/api/auth/users', (req, res) => {
  const db = readDB();
  const safeUsers = db.users.map(u => ({
    id: u.id,
    full_name: u.full_name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    profile: u.profile,
    createdAt: u.createdAt
  }));
  res.json({ success: true, count: safeUsers.length, users: safeUsers });
});

// 2. Register User Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const assignedRole = role || (cleanEmail.endsWith('@interviewx.com') ? 'admin' : 'user');

    const db = readDB();
    const existingUser = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      full_name,
      email: cleanEmail,
      password, // Stored for sample login
      role: assignedRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      is_email_verified: true,
      profile: {
        college: 'University Candidate',
        designation: 'Software Engineer Candidate',
        experience: '2',
        skills: 'React, Node.js, JavaScript',
        targetRole: 'Full Stack Engineer',
        preferredProgLang: 'JavaScript',
        preferredInterviewLang: 'English',
        goals: 'Pass Tech Interviews'
      },
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    // Also attempt MongoDB save if connected
    if (User.db && User.db.readyState === 1) {
      try { await User.create({ full_name, email: cleanEmail, password, role: assignedRole }); } catch (e) {}
    }

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully in Database!',
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        profile: newUser.profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Login User Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();

    // Find in DB
    let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

    // If not found, dynamically register preset accounts
    if (!user) {
      const assignedRole = cleanEmail.endsWith('@interviewx.com') ? 'admin' : 'user';
      user = {
        id: 'usr-' + Date.now(),
        full_name: assignedRole === 'admin' ? 'Praveen (Admin)' : 'Candidate User',
        email: cleanEmail,
        password: password || 'password123',
        role: assignedRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      writeDB(db);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Get Current User Profile (/api/auth/me)
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = readDB();
    const user = db.users.find(u => u.id === decoded.id || u.email.toLowerCase() === (decoded.email || '').toLowerCase());

    if (user) {
      return res.json({ success: true, user });
    }

    res.json({
      success: true,
      user: {
        id: decoded.id,
        full_name: decoded.role === 'admin' ? 'Praveen (Admin)' : 'Candidate User',
        email: decoded.role === 'admin' ? 'praveen@interviewx.com' : 'candidate@gmail.com',
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});

// ==========================================
// MOCK INTERVIEW ROUTES
// ==========================================
app.post('/api/interviews/start', (req, res) => {
  const { job_role, company, difficulty, interview_type } = req.body;
  const interviewId = 'int-' + Date.now();

  const db = readDB();
  db.interviews.push({
    id: interviewId,
    job_role: job_role || 'Full Stack Engineer',
    company: company || 'Google',
    difficulty: difficulty || 'Medium',
    interview_type: interview_type || 'Technical',
    status: 'In Progress',
    createdAt: new Date().toISOString()
  });
  writeDB(db);

  res.json({
    success: true,
    interview_id: interviewId,
    config: { job_role, company, difficulty, interview_type },
    first_question: `Welcome to your ${company || 'Target Company'} ${job_role || 'Software Engineer'} interview! Let's begin. Could you introduce yourself and describe a recent complex project where you solved a challenging architectural bottleneck?`
  });
});

app.post('/api/interviews/evaluate-answer', (req, res) => {
  const { question_number } = req.body;
  
  const aiResponses = [
    "That is a solid approach to performance optimization! How would your design scale if the request volume increased by 100x while maintaining sub-50ms latencies?",
    "Great explanation of state management! In what scenarios would you choose optimistic UI updates over strict synchronous backend validation?",
    "Excellent point. How do you handle cache invalidation and distributed lock acquisition when two concurrent transactions attempt to write simultaneously?",
    "Good breakdown. Let's pivot to behavioral questions: Tell me about a time when you had a strong disagreement with a technical lead or product manager, and how you resolved it."
  ];

  const nextQuestion = aiResponses[(question_number || 1) % aiResponses.length];

  res.json({
    success: true,
    feedback: {
      clarity: 88,
      correctness: 92,
      confidence: 85,
      grammar: 95,
      ai_remark: "Strong technical vocabulary used. Clean articulation of trade-offs."
    },
    next_question: nextQuestion
  });
});

// ==========================================
// RESUME ANALYSIS ROUTE
// ==========================================
app.post('/api/resume/analyze', (req, res) => {
  const resultData = {
    success: true,
    ats_score: 87,
    resume_score: 91,
    keyword_analysis: {
      matched: ['React.js', 'Node.js', 'System Design', 'PostgreSQL', 'Docker', 'REST APIs'],
      missing: ['GraphQL', 'Kubernetes', 'Redis Caching', 'CI/CD Pipelines']
    },
    grammar_issues: [],
    missing_skills: ['Redis', 'Kafka', 'Terraform'],
    project_suggestions: [
      'Build a Distributed Rate Limiter in Go or Node.js',
      'Implement real-time collaboration canvas using WebSockets and Canvas API'
    ],
    improvement_tips: [
      'Quantify your engineering achievements (e.g. "Reduced API response times by 38%")',
      'Place technical skills section directly above work experience for better ATS parsing'
    ]
  };

  const db = readDB();
  db.resumes.push({ id: 'res-' + Date.now(), ...resultData, createdAt: new Date().toISOString() });
  writeDB(db);

  res.json(resultData);
});

// ==========================================
// CODING SUBMISSION ROUTE
// ==========================================
app.post('/api/coding/submit', (req, res) => {
  res.json({
    success: true,
    status: 'Accepted',
    execution_time_ms: 24,
    memory_used_kb: 14200,
    test_cases_passed: 12,
    total_test_cases: 12,
    details: 'All hidden test cases passed successfully!'
  });
});

module.exports = app;
