-- ==========================================================
-- InterviewX PostgreSQL Seed Data
-- Demo values for testing users, coding questions, DSA topics
-- ==========================================================

-- Seed Demo Users
INSERT INTO users (id, full_name, email, password_hash, role, is_email_verified)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alex Morgan', 'alex@interviewx.ai', '$2a$10$wN7K7w4e5Lp2O/xZ9XJ1.eH7sW7Q7u7sW7Q7u7sW7Q7u7sW7Q7u7', 'user', true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'System Administrator', 'admin@interviewx.ai', '$2a$10$wN7K7w4e5Lp2O/xZ9XJ1.eH7sW7Q7u7sW7Q7u7sW7Q7u7sW7Q7u7', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Seed Profiles
INSERT INTO profiles (user_id, college_company, designation, years_of_experience, skills, target_job_role, preferred_programming_language, preferred_interview_language, career_goals)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Stanford University', 'Senior SDE Candidate', 3.5, ARRAY['Python', 'React', 'Node.js', 'System Design', 'PostgreSQL'], 'Full Stack Engineer', 'Python', 'English', 'Aiming to crack Tier-1 Tech companies like Google and Meta in Q3 2026.')
ON CONFLICT (user_id) DO NOTHING;

-- Seed Sample Coding Problems
INSERT INTO coding_problems (id, title, slug, difficulty, dsa_topic, company_tags, description, input_format, output_format, constraints, sample_input, sample_output, test_cases)
VALUES 
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31',
  'Two Sum',
  'two-sum',
  'Easy',
  'Arrays',
  ARRAY['Google', 'Amazon', 'Meta'],
  'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  'Line 1: Array of integers separated by space. Line 2: Target integer.',
  'Space-separated indices in ascending order.',
  '2 <= nums.length <= 10^4',
  '2 7 11 15\n9',
  '0 1',
  '[{"input": "2 7 11 15\n9", "expected": "0 1"}, {"input": "3 2 4\n6", "expected": "1 2"}]'::jsonb
),
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32',
  'LRU Cache Implementation',
  'lru-cache',
  'Hard',
  'Linked Lists',
  ARRAY['Microsoft', 'Apple', 'Uber'],
  'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
  'Operations and key-value pairs.',
  'Result array of cache operations.',
  'Capacity <= 1000',
  '["LRUCache", "put", "put", "get"]\n[[2], [1, 1], [2, 2], [1]]',
  '[null, null, null, 1]',
  '[{"input": "LRUCache", "expected": "Passed"}]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Admin Settings
INSERT INTO admin_settings (key, value)
VALUES 
('ai_interview_prompt', '{"system_prompt": "You are InterviewX AI, an elite technical recruiter conducting a high-stakes interview. Be professional, direct, and ask relevant follow-up questions."}'::jsonb),
('platform_metrics', '{"active_users": 14250, "interviews_conducted": 89200, "average_resume_score": 79.4}'::jsonb)
ON CONFLICT (key) DO NOTHING;
