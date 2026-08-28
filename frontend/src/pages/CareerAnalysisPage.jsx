import React, { useState } from 'react';
import { 
  TrendingUp, 
  Map, 
  DollarSign, 
  BookOpen,
  Brain,
  ArrowRight,
  Briefcase,
  Award,
  Code2,
  Bot,
  X,
  Clock,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

export default function CareerAnalysisPage({ onNavigate }) {
  const [selectedRole, setSelectedRole] = useState('Full Stack Engineer');
  const [experienceLevel, setExperienceLevel] = useState('3-5 Years (Mid-Level)');
  
  // Currently Active Study Module Modal
  const [activeStudyModule, setActiveStudyModule] = useState(null);
  const [lockAlertMessage, setLockAlertMessage] = useState(null);

  // Dynamic Learning Roadmaps Dictionary for each Role
  const roadmapsByRole = {
    'Full Stack Engineer': [
      {
        id: 1,
        title: 'Step 1: Advanced Data Structures & Dynamic Programming',
        progress: 75,
        status: 'In Progress',
        summary: 'Master 2D DP, Graph Traversal, and LRU Cache memory design.',
        notes: 'Focus on time complexity trade-offs (O(N) space vs O(1) in-place pointers). Practice Two-Pointers and Sliding Window techniques.'
      },
      {
        id: 2,
        title: 'Step 2: Microservices & Scalable System Design',
        progress: 0,
        status: 'Locked',
        summary: 'Distributed Caching (Redis), Rate Limiters, Message Queues (Kafka).',
        notes: 'Learn distributed lock acquisition (Redlock algorithm) and Write-Through vs Write-Back cache policies.'
      },
      {
        id: 3,
        title: 'Step 3: High-Throughput Database Query Optimization',
        progress: 0,
        status: 'Locked',
        summary: 'Indexing strategies, EXPLAIN ANALYZE query plans, PostgreSQL Sharding.',
        notes: 'Study composite B-Tree indexes, partial indexes, and partitioning large tables to eliminate full table scans.'
      },
      {
        id: 4,
        title: 'Step 4: AI Mock Interview Mastery (Google / Meta)',
        progress: 0,
        status: 'Locked',
        summary: 'Complete 10 Mock Technical & Behavioral Sessions with AI Recruiter.',
        notes: 'Practice articulating trade-offs out loud using STAR method for behavioral prompts.'
      }
    ],
    'Backend Engineer': [
      {
        id: 1,
        title: 'Step 1: High-Performance Database Systems & SQL Optimization',
        progress: 50,
        status: 'In Progress',
        summary: 'PostgreSQL sharding, Composite Indexing, ACID transaction levels.',
        notes: 'Study isolation levels (Read Committed vs Serializable) and avoid deadlock scenarios under high concurrency.'
      },
      {
        id: 2,
        title: 'Step 2: Event-Driven Systems & Kafka Message Streams',
        progress: 0,
        status: 'Locked',
        summary: 'Asynchronous event streaming, Pub/Sub architecture, Kafka Partitioning.',
        notes: 'Understand consumer group rebalancing, offset commits, and dead-letter queues (DLQ).'
      },
      {
        id: 3,
        title: 'Step 3: Distributed Rate Limiters & Caching Strategies',
        progress: 0,
        status: 'Locked',
        summary: 'Token Bucket vs Leaky Bucket algorithms, Redis cluster setup.',
        notes: 'Implement sliding window log rate limiters and cache invalidation patterns.'
      },
      {
        id: 4,
        title: 'Step 4: Backend AI Mock Technical & Architectural Interviews',
        progress: 0,
        status: 'Locked',
        summary: 'Conduct backend system architecture mock interviews.',
        notes: 'Prepare for deep dives into API latency bottlenecks and server memory management.'
      }
    ],
    'Frontend Developer': [
      {
        id: 1,
        title: 'Step 1: Advanced React Internals & Virtual DOM Optimization',
        progress: 50,
        status: 'In Progress',
        summary: 'Reconciliation, Concurrent React (useTransition, useDeferredValue).',
        notes: 'Optimize component re-renders using React.memo, useMemo, and custom state selectors.'
      },
      {
        id: 2,
        title: 'Step 2: Micro-Frontends & Design System Tokens',
        progress: 0,
        status: 'Locked',
        summary: 'Module Federation, Web Accessibility (ARIA), Design System tokens.',
        notes: 'Master accessible keyboard navigation, screen reader support, and atomic CSS architecture.'
      },
      {
        id: 3,
        title: 'Step 3: Web Performance Metrics (Core Web Vitals)',
        progress: 0,
        status: 'Locked',
        summary: 'Optimizing LCP, CLS, INP, and bundle code-splitting.',
        notes: 'Analyze Chrome DevTools Performance tab, image compression, and lazy-loading routes.'
      },
      {
        id: 4,
        title: 'Step 4: Frontend System Design AI Interviews',
        progress: 0,
        status: 'Locked',
        summary: 'Design infinite scroll feeds, real-time rich text editors, and video players.',
        notes: 'Structure frontend state normalization and client-side offline caching strategies.'
      }
    ]
  };

  // State for Editable Roadmaps
  const [currentRoadmaps, setCurrentRoadmaps] = useState(roadmapsByRole);

  const activeRoadmap = currentRoadmaps[selectedRole] || currentRoadmaps['Full Stack Engineer'];

  // Dynamic Salary Predictor Model
  const getSalaryProjection = () => {
    if (experienceLevel.includes('Entry')) return '$95,000 - $125,000 / year';
    if (experienceLevel.includes('3-5')) return '$155,000 - $185,000 / year';
    return '$210,000 - $260,000 / year';
  };

  // Dynamic Skill Gap Data
  const getSkillGapData = () => {
    if (selectedRole.includes('Backend')) {
      return [
        { skill: 'Distributed Microservices & Systems', level: 74, status: 'Intermediate' },
        { skill: 'Database Query Tuning & PostgreSQL', level: 88, status: 'Proficient' },
        { skill: 'Data Structures & Algorithms', level: 82, status: 'Strong' },
        { skill: 'CI/CD Pipelines & Docker Containerization', level: 70, status: 'Needs Focus' }
      ];
    }
    if (selectedRole.includes('Frontend')) {
      return [
        { skill: 'React & Next.js Performance Tuning', level: 92, status: 'Exceptional' },
        { skill: 'State Management & WebSockets', level: 84, status: 'Proficient' },
        { skill: 'Data Structures & Algorithms', level: 78, status: 'Good' },
        { skill: 'Web Accessibility & Micro-Frontend', level: 65, status: 'Needs Focus' }
      ];
    }
    return [
      { skill: 'Data Structures & Algorithms', level: 85, status: 'Strong' },
      { skill: 'System Design & Scalability', level: 72, status: 'Needs Focus' },
      { skill: 'Database Query Optimization', level: 84, status: 'Proficient' },
      { skill: 'Communication & Behavioral Alignment', level: 90, status: 'Exceptional' }
    ];
  };

  // Sequential Step Access Checker: Step N is unlocked ONLY IF Step N-1 is 100% completed
  const isStepUnlocked = (stepIndex, roadmapList) => {
    if (stepIndex === 0) return true; // Step 1 is always unlocked
    return roadmapList[stepIndex - 1].progress >= 100;
  };

  // Handle Step Click
  const handleStepClick = (step, idx) => {
    setLockAlertMessage(null);

    if (!isStepUnlocked(idx, activeRoadmap)) {
      const prevStepNum = idx;
      setLockAlertMessage(`🔒 Orderwise Requirement: Please complete Step ${prevStepNum} (100%) to unlock Step ${step.id}!`);
      return;
    }

    setActiveStudyModule(step);
  };

  // Increment Study Progress for Active Step and unlock next step automatically when 100% is reached
  const handleIncreaseStudyProgress = (stepId) => {
    setCurrentRoadmaps(prev => {
      const roleList = prev[selectedRole] || prev['Full Stack Engineer'];
      const updatedList = roleList.map(step => {
        if (step.id === stepId) {
          const nextProgress = Math.min(step.progress + 25, 100);
          const nextStatus = nextProgress === 100 ? 'Completed' : 'In Progress';
          const updatedStep = { ...step, progress: nextProgress, status: nextStatus };
          setActiveStudyModule(updatedStep);
          return updatedStep;
        }
        return step;
      });

      return { ...prev, [selectedRole]: updatedList };
    });
  };

  const skillGaps = getSkillGapData();
  const predictedSalary = getSalaryProjection();

  return (
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
          <Brain class="w-6 h-6" />
        </div>
        <h1 class="text-3xl font-extrabold text-white">AI Career Analysis & Sequential Learning Roadmap</h1>
        <p class="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Tailored sequential learning path. Complete each step (100%) to unlock the next advanced module.
        </p>
      </div>

      {/* Sequential Lock Warning Banner */}
      {lockAlertMessage && (
        <div class="glass-card p-4 rounded-2xl border border-amber-500/40 bg-amber-950/20 text-amber-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div class="flex items-center space-x-2">
            <AlertCircle class="w-4 h-4 text-amber-400 shrink-0" />
            <span>{lockAlertMessage}</span>
          </div>
          <button onClick={() => setLockAlertMessage(null)} class="text-slate-400 hover:text-white">
            <X class="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Target Role & Experience Configuration Bar */}
      <div class="glass-card p-6 rounded-3xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Briefcase class="w-4 h-4 text-indigo-400" />
            <span>Select Target Career Role</span>
          </label>
          <select
            value={selectedRole}
            onChange={e => { setSelectedRole(e.target.value); setLockAlertMessage(null); }}
            class="glass-input w-full text-xs font-semibold"
          >
            <option value="Full Stack Engineer" class="bg-slate-900">Full Stack Engineer</option>
            <option value="Backend Engineer" class="bg-slate-900">Backend Engineer</option>
            <option value="Frontend Developer" class="bg-slate-900">Frontend Developer</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Award class="w-4 h-4 text-emerald-400" />
            <span>Select Target Experience Level</span>
          </label>
          <select
            value={experienceLevel}
            onChange={e => setExperienceLevel(e.target.value)}
            class="glass-input w-full text-xs font-semibold"
          >
            <option value="Entry-Level (0-2 Years)" class="bg-slate-900">Entry-Level (0-2 Years)</option>
            <option value="3-5 Years (Mid-Level)" class="bg-slate-900">3-5 Years (Mid-Level)</option>
            <option value="Senior SDE (5+ Years)" class="bg-slate-900">Senior SDE (5+ Years)</option>
          </select>
        </div>
      </div>

      {/* Salary Projection & Compensation Model */}
      <div class="glass-card p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div class="space-y-2 md:col-span-2">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <DollarSign class="w-4 h-4" />
            <span>AI Salary Projection Model</span>
          </div>
          <h2 class="text-2xl font-extrabold text-white">Target Compensation Range ({selectedRole})</h2>
          <p class="text-xs text-slate-300">
            Projected market value for <span class="text-indigo-400 font-bold">{selectedRole}</span> candidates at <span class="text-emerald-400 font-bold">{experienceLevel}</span>.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Salary Estimate</span>
          <div class="text-2xl font-extrabold text-emerald-400">{predictedSalary}</div>
          <span class="text-[10px] text-slate-500 font-semibold">Tier-1 Tech Equivalent</span>
        </div>
      </div>

      {/* Grid: Skill Gap Analysis & Sequential Interactive Roadmap */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Skill Gap Analysis (Left Col) */}
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 class="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp class="w-4 h-4 text-indigo-400" />
            <span>Skill Gap Analysis ({selectedRole})</span>
          </h3>

          <div class="space-y-4">
            {skillGaps.map((item, idx) => (
              <div key={idx} class="space-y-1.5">
                <div class="flex items-center justify-between text-xs font-semibold">
                  <span class="text-slate-200">{item.skill}</span>
                  <span class="text-indigo-400 font-bold">{item.level}%</span>
                </div>
                <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div style={{ width: `${item.level}%` }} class="h-full bg-indigo-500 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span class="text-[10px] font-bold text-pink-400 uppercase tracking-widest">AI Priority Focus</span>
            <p class="text-xs text-slate-300 leading-relaxed font-medium">
              "Complete Step 1 to 100% to automatically unlock Step 2 in your sequential roadmap."
            </p>
          </div>
        </div>

        {/* Sequential Learning Roadmap Steps (Right 2 Cols) */}
        <div class="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white flex items-center space-x-2">
                <Map class="w-4 h-4 text-emerald-400" />
                <span>Sequential Order Roadmap ({selectedRole})</span>
              </h3>
              <p class="text-xs text-slate-400">Steps unlock in order as you reach 100% completion</p>
            </div>
            <span class="text-[10px] font-extrabold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Sequential Order Mode
            </span>
          </div>

          <div class="space-y-4">
            {activeRoadmap.map((step, idx) => {
              const unlocked = isStepUnlocked(idx, activeRoadmap);
              const isCompleted = step.progress >= 100;

              return (
                <div 
                  key={step.id} 
                  onClick={() => handleStepClick(step, idx)}
                  class={`p-5 rounded-2xl border transition-all flex items-start space-x-4 group ${
                    unlocked 
                      ? 'cursor-pointer hover:border-indigo-500/60 bg-slate-950/60 border-slate-800' 
                      : 'cursor-not-allowed opacity-50 bg-slate-950/20 border-slate-900'
                  } ${isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : ''}`}
                >
                  <div class={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : unlocked 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {unlocked ? step.id : <Lock class="w-4 h-4" />}
                  </div>

                  <div class="flex-1 space-y-2">
                    <div class="flex items-center justify-between">
                      <h4 class={`text-sm font-bold ${unlocked ? 'text-white group-hover:text-indigo-300' : 'text-slate-500'} transition-colors`}>
                        {step.title}
                      </h4>
                      
                      <span class={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        isCompleted 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : unlocked
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {unlocked ? (isCompleted ? '✓ Completed (100%)' : `In Progress (${step.progress}%)`) : '🔒 Locked'}
                      </span>
                    </div>

                    <p class="text-xs text-slate-400 leading-relaxed">{step.summary}</p>

                    {/* Progress Bar for Step */}
                    {unlocked && (
                      <div class="space-y-1 pt-1">
                        <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            style={{ width: `${step.progress}%` }} 
                            class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500" 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {unlocked ? (
                    <ArrowRight class="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  ) : (
                    <Lock class="w-4 h-4 text-slate-600 shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* INTERACTIVE STUDY WORKSPACE MODAL */}
      {activeStudyModule && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col space-y-4 p-6">
            
            {/* Modal Header */}
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                  {activeStudyModule.id}
                </div>
                <div>
                  <h3 class="text-base font-bold text-white">{activeStudyModule.title}</h3>
                  <span class="text-xs text-indigo-400 font-semibold">{selectedRole} • Module {activeStudyModule.id}</span>
                </div>
              </div>

              <button 
                onClick={() => setActiveStudyModule(null)}
                class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            {/* Study Progress Indicator */}
            <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-300">Learning Progress Time Tracker</span>
                <span class="text-emerald-400">{activeStudyModule.progress}% Completed</span>
              </div>
              <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  style={{ width: `${activeStudyModule.progress}%` }} 
                  class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500" 
                />
              </div>
            </div>

            {/* Study Notes & Guidelines */}
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <BookOpen class="w-4 h-4 text-indigo-400" />
                <span>Interactive Study Notes & Key Concepts</span>
              </h4>
              <p class="text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed font-medium">
                {activeStudyModule.notes}
              </p>
            </div>

            {/* Modal Actions */}
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleIncreaseStudyProgress(activeStudyModule.id)}
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-glow transition-all"
              >
                <Clock class="w-4 h-4" />
                <span>Study 30 Mins (+25% Progress)</span>
              </button>

              <div class="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => { setActiveStudyModule(null); if (onNavigate) onNavigate('coding-practice'); }}
                  class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <Code2 class="w-4 h-4" />
                  <span>Practice Coding</span>
                </button>

                <button
                  onClick={() => { setActiveStudyModule(null); if (onNavigate) onNavigate('interview-setup'); }}
                  class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-glow"
                >
                  <Bot class="w-4 h-4" />
                  <span>AI Practice Interview</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
