import React, { useState } from 'react';
import { 
  FileText, 
  Code, 
  Play, 
  Sparkles, 
  TrendingUp, 
  CheckSquare, 
  ChevronRight,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

export default function DashboardPage({ user, userStats = {}, onNavigate }) {
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, title: 'Complete 1 AI Technical Interview (Google)', completed: false },
    { id: 2, title: 'Solve 2 Coding Problems in Coding Arena', completed: false },
    { id: 3, title: 'Scan & Fix Resume ATS Keywords', completed: false },
    { id: 4, title: 'Review System Design Learning Notes', completed: false }
  ]);

  const toggleGoal = (id) => {
    setDailyGoals(dailyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const completedGoalsCount = dailyGoals.filter(g => g.completed).length;

  const solvedCount = userStats.solvedCount || 0;
  const atsScore = userStats.atsScore;
  const atsFileName = userStats.atsFileName || 'No resume uploaded yet';
  const recentInterviews = userStats.recentInterviews || [];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div class="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div class="space-y-2 z-10">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <ShieldCheck class="w-3.5 h-3.5" />
            <span>Candidate Account: {user?.name || 'Praveen'}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Praveen'} 👋
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your real-time interview preparation, test ATS resume compliance, and solve coding challenges.
          </p>
        </div>

        <button
          onClick={() => onNavigate('interview-setup')}
          class="z-10 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow flex items-center space-x-2 transition-all transform hover:scale-105 shrink-0"
        >
          <Play class="w-4 h-4 fill-white" />
          <span>Launch AI Technical Interview</span>
        </button>
      </div>

      {/* Real-Time Metrics Row */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: AI Technical Interviews Completed */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews Completed</span>
            <div class="text-3xl font-extrabold text-white">{recentInterviews.length} <span class="text-xs text-emerald-400 font-medium">Completed</span></div>
            <p class="text-[11px] text-slate-400">{recentInterviews.length > 0 ? `Latest: ${recentInterviews[0].role}` : 'No interviews taken yet'}</p>
          </div>
          <ScoreGauge score={recentInterviews.length > 0 ? 88 : 0} label="Rating" size={76} strokeWidth={8} color="#6366f1" />
        </div>

        {/* Metric 2: ATS Resume Compliance */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">ATS Resume Match</span>
            <div class="text-3xl font-extrabold text-white">
              {atsScore !== null ? `${atsScore}%` : '0%'} 
              <span class="text-xs text-indigo-400 font-medium ml-1">
                {atsScore !== null ? 'Scanned' : 'Not Scanned'}
              </span>
            </div>
            <p class="text-[11px] text-slate-400 truncate max-w-[160px]">{atsFileName}</p>
          </div>
          <ScoreGauge score={atsScore || 0} label="ATS Match" size={76} strokeWidth={8} color="#10b981" />
        </div>

        {/* Metric 3: Coding Practice Progress (REAL SOLVED COUNT) */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div class="space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Coding Arena</span>
            <div class="text-3xl font-extrabold text-white">{solvedCount} <span class="text-xs text-amber-400 font-medium">Solved</span></div>
            <p class="text-[11px] text-slate-400">{solvedCount > 0 ? `${solvedCount} challenge(s) completed` : '0 challenges solved yet'}</p>
          </div>
          <ScoreGauge score={solvedCount > 0 ? Math.min(solvedCount * 25, 100) : 0} label="Progress" size={76} strokeWidth={8} color="#f59e0b" />
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigate('interview-setup')}
          class="glass-card p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer space-y-2 transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-indigo-400 uppercase">AI Interview Room</span>
            <ArrowUpRight class="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p class="text-sm font-bold text-white">Start Voice & Video Technical Interview</p>
          <p class="text-xs text-slate-400">5-Question AI technical assessment with real-time mic input</p>
        </div>

        <div 
          onClick={() => onNavigate('resume-analyzer')}
          class="glass-card p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer space-y-2 transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-400 uppercase">ATS Scanner</span>
            <ArrowUpRight class="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p class="text-sm font-bold text-white">Scan Resume & Calculate JD Match</p>
          <p class="text-xs text-slate-400">Upload PDF/DOCX under 10 MB or paste text directly</p>
        </div>

        <div 
          onClick={() => onNavigate('coding-practice')}
          class="glass-card p-5 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 cursor-pointer space-y-2 transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-400 uppercase">Coding Practice</span>
            <ArrowUpRight class="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <p class="text-sm font-bold text-white">Solve Data Structures & Algorithms</p>
          <p class="text-xs text-slate-400">Write practice code from scratch with syntax checking</p>
        </div>
      </div>

      {/* Main Grid: Daily Practice Checklist & Recent Activity */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Interviews Activity */}
        <div class="lg:col-span-2 space-y-6">
          <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-white">Recent AI Technical Interviews</h3>
              <button onClick={() => onNavigate('interview-setup')} class="text-xs font-semibold text-indigo-400 hover:underline">Start New Interview</button>
            </div>

            {recentInterviews.length > 0 ? (
              <div class="space-y-3">
                {recentInterviews.map((item, i) => (
                  <div key={i} class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs">
                        {item.company.slice(0, 2)}
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-white">{item.role} ({item.company})</h4>
                        <p class="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                          <Clock class="w-3 h-3 text-slate-500" />
                          <span>{item.date}</span>
                          <span>•</span>
                          <span class="text-indigo-400 font-semibold">{item.type}</span>
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        Score: {item.score}%
                      </span>
                      <button 
                        onClick={() => onNavigate('interview-report')} 
                        class="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <ChevronRight class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="p-8 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-3">
                <p class="text-xs text-slate-400">No AI Technical Interviews completed yet in this session.</p>
                <button
                  onClick={() => onNavigate('interview-setup')}
                  class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow inline-flex items-center space-x-2 transition-all"
                >
                  <Play class="w-3.5 h-3.5 fill-white" />
                  <span>Start Your First Interview Session</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Daily Goals Checklist */}
        <div class="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white flex items-center space-x-2">
              <CheckSquare class="w-4 h-4 text-emerald-400" />
              <span>Daily Practice Checklist</span>
            </h3>
            <span class="text-[11px] text-slate-400 font-bold">{completedGoalsCount} / {dailyGoals.length} Done</span>
          </div>

          <div class="space-y-2.5">
            {dailyGoals.map(goal => (
              <div 
                key={goal.id} 
                onClick={() => toggleGoal(goal.id)}
                class={`p-3 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                  goal.completed 
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60 line-through text-slate-400' 
                    : 'bg-slate-800/40 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={goal.completed} 
                  onChange={() => {}} 
                  class="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span class="text-xs font-semibold flex-1">{goal.title}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
