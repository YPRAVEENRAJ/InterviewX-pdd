const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data_store.json');

const initialSampleData = {
  users: [
    {
      id: 'usr-admin-001',
      full_name: 'Praveen (Platform Admin)',
      email: 'praveen@interviewx.com',
      password: 'password123', // In real auth, checked via bcrypt or plaintext comparison
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      is_email_verified: true,
      profile: {
        college: 'Stanford University',
        designation: 'Lead AI System Architect',
        experience: '5',
        skills: 'React, Node.js, Python, MongoDB, System Design',
        targetRole: 'Platform Administrator',
        preferredProgLang: 'Python',
        preferredInterviewLang: 'English',
        goals: 'Manage InterviewX AI Infrastructure 2026'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-cand-002',
      full_name: 'Candidate User',
      email: 'candidate@gmail.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      is_email_verified: true,
      profile: {
        college: 'IIT Madras',
        designation: 'Software Developer',
        experience: '2.5',
        skills: 'JavaScript, React, Node.js, PostgreSQL',
        targetRole: 'Full Stack Software Engineer',
        preferredProgLang: 'JavaScript',
        preferredInterviewLang: 'English',
        goals: 'Pass Tier-1 Technical Interviews'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-cand-003',
      full_name: 'Sarah Jenkins',
      email: 'sarah.dev@gmail.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      is_email_verified: true,
      profile: {
        college: 'MIT',
        designation: 'Frontend Engineer',
        experience: '3',
        skills: 'TypeScript, React, Next.js, TailwindCSS',
        targetRole: 'Senior Frontend Developer',
        preferredProgLang: 'TypeScript',
        preferredInterviewLang: 'English',
        goals: 'Target Senior Frontend roles at FAANG'
      },
      createdAt: new Date().toISOString()
    }
  ],
  interviews: [
    {
      id: 'int-88291-ai',
      user_email: 'candidate@gmail.com',
      job_role: 'Full Stack Engineer',
      company: 'Google',
      difficulty: 'Hard',
      interview_type: 'Technical & System Design',
      overall_score: 88,
      status: 'Completed',
      questions: [
        {
          question_number: 1,
          question_text: 'How would you design a distributed rate limiter for a REST API handling 100k requests/sec?',
          user_answer: 'I would use Redis with a Token Bucket or Sliding Window Log algorithm, using distributed locks and atomic Lua scripts.',
          ai_feedback: { clarity: 90, correctness: 94, confidence: 88, ai_remark: 'Excellent architectural understanding of distributed caching.' }
        }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  resumes: [
    {
      id: 'res-9910-ai',
      user_email: 'candidate@gmail.com',
      ats_score: 89,
      resume_score: 92,
      matched_keywords: ['React.js', 'Node.js', 'PostgreSQL', 'Docker', 'System Design'],
      missing_keywords: ['Kubernetes', 'Redis Caching', 'Kafka'],
      improvement_tips: [
        'Add quantitative impact metrics (e.g. Improved query performance by 42%)',
        'Place technical skills block at top of first page'
      ],
      createdAt: new Date().toISOString()
    }
  ]
};

// Initialize DB file if not present
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialSampleData, null, 2));
}

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return initialSampleData;
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };
