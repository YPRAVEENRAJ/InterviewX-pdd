-- ==========================================================
-- InterviewX PostgreSQL Schema Design
-- Database tables for AI Mock Interview & Career Analysis Platform
-- ==========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    college_company VARCHAR(200),
    designation VARCHAR(150),
    years_of_experience NUMERIC(3, 1) DEFAULT 0,
    skills TEXT[], -- Array of strings e.g. ARRAY['React', 'Node.js', 'Python']
    target_job_role VARCHAR(150) DEFAULT 'Software Development Engineer',
    preferred_programming_language VARCHAR(50) DEFAULT 'Python',
    preferred_interview_language VARCHAR(50) DEFAULT 'English',
    career_goals TEXT,
    interview_score INT DEFAULT 780,
    resume_score INT DEFAULT 85,
    coding_rating INT DEFAULT 1650,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_role VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    experience_level VARCHAR(50) DEFAULT 'Mid-Level',
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    interview_type VARCHAR(50) CHECK (interview_type IN ('HR', 'Technical', 'Coding', 'Behavioral', 'System Design', 'Mixed')),
    programming_language VARCHAR(50),
    interview_language VARCHAR(50) DEFAULT 'English',
    question_count INT DEFAULT 5,
    time_limit_minutes INT DEFAULT 30,
    mode VARCHAR(20) CHECK (mode IN ('Voice', 'Text')),
    status VARCHAR(20) DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. INTERVIEW QUESTIONS & ANSWERS TABLE
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    user_answer TEXT,
    audio_url VARCHAR(500),
    ai_evaluation TEXT,
    clarity_score INT CHECK (clarity_score BETWEEN 0 AND 100),
    correctness_score INT CHECK (correctness_score BETWEEN 0 AND 100),
    confidence_score INT CHECK (confidence_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INTERVIEW REPORTS TABLE
CREATE TABLE IF NOT EXISTS interview_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID UNIQUE REFERENCES interviews(id) ON DELETE CASCADE,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    technical_score INT CHECK (technical_score BETWEEN 0 AND 100),
    communication_score INT CHECK (communication_score BETWEEN 0 AND 100),
    coding_score INT CHECK (coding_score BETWEEN 0 AND 100),
    confidence_level VARCHAR(50),
    strengths TEXT[],
    weaknesses TEXT[],
    areas_for_improvement TEXT[],
    ai_suggestions TEXT,
    company_readiness_pct INT CHECK (company_readiness_pct BETWEEN 0 AND 100),
    hiring_probability VARCHAR(50),
    report_pdf_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RESUME ANALYSES TABLE
CREATE TABLE IF NOT EXISTS resume_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resume_file_url VARCHAR(500),
    target_job_description TEXT,
    ats_score INT CHECK (ats_score BETWEEN 0 AND 100),
    resume_score INT CHECK (resume_score BETWEEN 0 AND 100),
    keyword_analysis JSONB, -- Stores matched & missing keywords
    grammar_issues TEXT[],
    missing_skills TEXT[],
    project_suggestions TEXT[],
    improvement_tips TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CODING PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS coding_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    dsa_topic VARCHAR(100) NOT NULL,
    company_tags TEXT[],
    description TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    sample_input TEXT,
    sample_output TEXT,
    solution_code JSONB, -- { "python": "...", "java": "...", "javascript": "..." }
    test_cases JSONB NOT NULL, -- Array of { input, expected }
    acceptance_rate NUMERIC(5, 2) DEFAULT 65.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CODING SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS coding_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID REFERENCES coding_problems(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error')),
    execution_time_ms INT,
    memory_used_kb INT,
    test_cases_passed INT,
    total_test_cases INT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Interview Reminders', 'Daily Goals', 'Resume Analysis', 'Coding Challenges', 'Job Alerts')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ACHIEVEMENTS & BADGES
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    badge_icon VARCHAR(100),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. ADMIN SYSTEM SETTINGS & PROMPTS
CREATE TABLE IF NOT EXISTS admin_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_interviews_user ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_problem ON coding_submissions(user_id, problem_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
